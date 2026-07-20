import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import Patient from '../../models/patient.model.js';
import ApiError from '../../utils/ApiError.js';
import generatePatientId from '../../utils/generatePatientId.js';
import sendEmail from '../../utils/sendEmail.js';
import { createAuditLog } from '../auditLog.service.js';
import env from '../../config/env.js';

const generateToken = (patient) => {
  return jwt.sign(
    { id: patient._id, patientId: patient.patientId, email: patient.email, type: 'patient' },
    env.jwt.secret,
    { expiresIn: env.jwt.expiresIn || '7d' }
  );
};

export const checkPatientStatus = async (email) => {
  if (!email) throw new ApiError(StatusCodes.BAD_REQUEST, 'Email is required');
  const patient = await Patient.findOne({ email: email.toLowerCase() }).select('email hasSetPassword isActive').lean();
  if (!patient) return { exists: false };
  return { exists: true, hasSetPassword: patient.hasSetPassword, isActive: patient.isActive };
};

export const setPassword = async (email, password) => {
  if (!email || !password) throw new ApiError(StatusCodes.BAD_REQUEST, 'Email and password are required');
  if (password.length < 6) throw new ApiError(StatusCodes.BAD_REQUEST, 'Password must be at least 6 characters long');

  const patient = await Patient.findOne({ email: email.toLowerCase() }).select('+password');
  if (!patient) throw new ApiError(StatusCodes.NOT_FOUND, 'No account found with this email');
  if (patient.hasSetPassword) throw new ApiError(StatusCodes.BAD_REQUEST, 'Password already set. Please login instead.');

  patient.password = password;
  patient.hasSetPassword = true;

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  patient.otp = otp;
  patient.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
  await patient.save();

  try {
    await sendEmail({
      email: patient.email,
      subject: 'Verify your Patient Portal Account',
      message: `Your OTP for Mirsarai General Hospital Patient Portal is: ${otp}\n\nThis OTP is valid for 10 minutes.\n\nPlease use this OTP to complete your account setup.`,
    });
  } catch (err) {
    console.log('Email sending failed (dev mode):', err.message);
    console.log('OTP for', patient.email, ':', otp);
  }

  return { message: 'Password set successfully. OTP sent to your email.' };
};

export const loginWithPassword = async (email, password) => {
  if (!email || !password) throw new ApiError(StatusCodes.BAD_REQUEST, 'Email and password are required');

  const patient = await Patient.findOne({ email: email.toLowerCase() }).select('+password');
  if (!patient) throw new ApiError(StatusCodes.NOT_FOUND, 'No account found with this email');
  if (!patient.isActive) throw new ApiError(StatusCodes.FORBIDDEN, 'Your account has been deactivated. Please contact support.');
  if (!patient.hasSetPassword) throw new ApiError(StatusCodes.BAD_REQUEST, 'Please set your password first');

  const isMatch = await patient.comparePassword(password);
  if (!isMatch) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid password');

  patient.otp = undefined;
  patient.otpExpires = undefined;
  await patient.save();

  await createAuditLog({
    actorId: patient._id,
    actorRole: 'patient',
    action: 'login',
    targetEntity: 'Patient',
    targetId: patient._id.toString(),
  });

  const token = generateToken(patient);
  return { token, patient: patient.toObject() };
};

export const sendOtp = async (email) => {
  if (!email) throw new ApiError(StatusCodes.BAD_REQUEST, 'Email is required');

  const normalizedEmail = email.toLowerCase();
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

  const patient = await Patient.findOne({ email: normalizedEmail });
  if (!patient) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'No account found with this email. Please contact the hospital to register.');
  }

  patient.otp = otp;
  patient.otpExpires = otpExpires;
  await patient.save();

  try {
    await sendEmail({
      email: normalizedEmail,
      subject: 'Your Patient Portal OTP',
      message: `Your OTP for Mirsarai General Hospital Patient Portal is: ${otp}\n\nThis OTP is valid for 10 minutes.\n\nIf you did not request this, please ignore this email.`,
    });
  } catch (err) {
    console.log('Email sending failed (dev mode):', err.message);
    console.log('OTP for', normalizedEmail, ':', otp);
  }

  return { message: 'OTP sent to your email' };
};

export const verifyOtpAndLogin = async (email, otp) => {
  if (!email || !otp) throw new ApiError(StatusCodes.BAD_REQUEST, 'Email and OTP are required');

  const patient = await Patient.findOne({ email: email.toLowerCase() });
  if (!patient) throw new ApiError(StatusCodes.NOT_FOUND, 'No account found with this email');
  if (!patient.isActive) throw new ApiError(StatusCodes.FORBIDDEN, 'Your account has been deactivated. Please contact support.');
  if (!patient.otp || !patient.otpExpires) throw new ApiError(StatusCodes.BAD_REQUEST, 'No OTP was requested');
  if (patient.otp !== otp) throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid OTP');
  if (new Date() > patient.otpExpires) throw new ApiError(StatusCodes.BAD_REQUEST, 'OTP has expired');

  patient.otp = undefined;
  patient.otpExpires = undefined;
  await patient.save();

  await createAuditLog({
    actorId: patient._id,
    actorRole: 'patient',
    action: 'verify_otp',
    targetEntity: 'Patient',
    targetId: patient._id.toString(),
  });

  const token = generateToken(patient);
  return { token, patient: patient.toObject() };
};

export const registerPatient = async (data) => {
  const existing = await Patient.findOne({ email: data.email });
  if (existing) throw new ApiError(StatusCodes.CONFLICT, 'A patient with this email already exists');

  const patientId = await generatePatientId();
  const patientData = { ...data, patientId };

  if (data.dateOfBirth && !data.age) {
    const today = new Date();
    const birth = new Date(data.dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    patientData.age = age;
  }

  const patient = await Patient.create(patientData);

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  patient.otp = otp;
  patient.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
  await patient.save();

  try {
    await sendEmail({
      email: data.email,
      subject: 'Verify your Patient Portal Account',
      message: `Welcome to Mirsarai General Hospital Patient Portal!\n\nYour Patient ID is: ${patientId}\nYour OTP is: ${otp}\n\nPlease use this OTP to verify your account. It expires in 10 minutes.`,
    });
  } catch (err) {
    console.log('Email sending failed (dev mode):', err.message);
    console.log('OTP for', data.email, ':', otp);
  }

  return { message: 'Patient registered. OTP sent to your email for verification.', patientId };
};

export const getProfile = async (patientId) => {
  const patient = await Patient.findById(patientId).lean();
  if (!patient) throw new ApiError(StatusCodes.NOT_FOUND, 'Patient not found');
  return patient;
};

export const updateProfile = async (patientId, data) => {
  const patient = await Patient.findByIdAndUpdate(patientId, { $set: data }, { new: true, runValidators: true }).lean();
  if (!patient) throw new ApiError(StatusCodes.NOT_FOUND, 'Patient not found');
  return patient;
};
