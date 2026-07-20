import { StatusCodes } from 'http-status-codes';
import Patient from '../../models/patient.model.js';
import ApiError from '../../utils/ApiError.js';
import generatePatientId from '../../utils/generatePatientId.js';
import sendEmail from '../../utils/sendEmail.js';
import env from '../../config/env.js';

export const getPatients = async (query = {}) => {
  const { page = 1, limit = 10, search, status, sortBy = 'createdAt', sortOrder = 'desc' } = query;

  const filter = {};
  if (status) filter.status = status;

  if (search) {
    filter.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { patientId: { $regex: search, $options: 'i' } },
      { mobile: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
  const limitNum = parseInt(limit, 10);

  const sortObj = {};
  sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;

  const [patients, total] = await Promise.all([
    Patient.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum)
      .populate('createdBy', 'fullName')
      .lean(),
    Patient.countDocuments(filter),
  ]);

  return { patients, total, page: parseInt(page, 10), limit: limitNum };
};

export const getPatientById = async (id) => {
  const patient = await Patient.findById(id).populate('createdBy', 'fullName').lean();
  if (!patient) throw new ApiError(StatusCodes.NOT_FOUND, 'Patient not found');
  return patient;
};

export const getPatientByPatientId = async (patientId) => {
  const patient = await Patient.findOne({ patientId }).populate('createdBy', 'fullName').lean();
  if (!patient) throw new ApiError(StatusCodes.NOT_FOUND, 'Patient not found');
  return patient;
};

export const getPatientByMobile = async (mobile) => {
  const patient = await Patient.findOne({ mobile }).populate('createdBy', 'fullName').lean();
  return patient;
};

export const createPatient = async (data, adminId) => {
  const existing = await Patient.findOne({ mobile: data.mobile });
  if (existing) throw new ApiError(StatusCodes.CONFLICT, 'A patient with this mobile number already exists');

  const patientId = await generatePatientId();

  const patientData = { ...data, patientId };
  if (adminId) patientData.createdBy = adminId;

  if (data.dateOfBirth && !data.age) {
    const today = new Date();
    const birth = new Date(data.dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    patientData.age = age;
  }

  const patient = await Patient.create(patientData);

  if (data.email) {
    try {
      await sendEmail({
        email: data.email,
        subject: 'Welcome to Mirsarai General Hospital Patient Portal',
        message: `Dear ${data.fullName},

You have been added as a patient at Mirsarai General Hospital.

You can now access all your information — prescriptions, lab reports, and more — through your patient dashboard.

Visit: ${env.clientUrl}/login-patient?email=${encodeURIComponent(data.email)}

On that page, enter your email and request a one-time password (OTP) to log in.

Thank you,
Mirsarai General Hospital`,
      });
    } catch (err) {
      console.log('Welcome email sending failed:', err.message);
    }
  }

  return patient.toObject();
};

export const updatePatient = async (id, data) => {
  const patient = await Patient.findById(id);
  if (!patient) throw new ApiError(StatusCodes.NOT_FOUND, 'Patient not found');

  if (data.dateOfBirth && !data.age) {
    const today = new Date();
    const birth = new Date(data.dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    data.age = age;
  }

  const updated = await Patient.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true })
    .populate('createdBy', 'fullName')
    .lean();
  return updated;
};

export const deletePatient = async (id) => {
  const patient = await Patient.findByIdAndDelete(id);
  if (!patient) throw new ApiError(StatusCodes.NOT_FOUND, 'Patient not found');
  return { message: 'Patient deleted successfully' };
};
