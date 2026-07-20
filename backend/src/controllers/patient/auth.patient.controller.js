import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync.js';
import { sendSuccess } from '../../utils/ApiResponse.js';
import * as AuthPatientService from '../../services/patient/auth.patient.service.js';

export const checkStatus = catchAsync(async (req, res) => {
  const result = await AuthPatientService.checkPatientStatus(req.query.email);
  sendSuccess(res, StatusCodes.OK, result);
});

export const setPassword = catchAsync(async (req, res) => {
  const result = await AuthPatientService.setPassword(req.body.email, req.body.password);
  sendSuccess(res, StatusCodes.OK, result, 'Password set successfully');
});

export const loginWithPassword = catchAsync(async (req, res) => {
  const result = await AuthPatientService.loginWithPassword(req.body.email, req.body.password);
  sendSuccess(res, StatusCodes.OK, result, 'Login successful');
});

export const sendOtp = catchAsync(async (req, res) => {
  const result = await AuthPatientService.sendOtp(req.body.email);
  sendSuccess(res, StatusCodes.OK, result, 'OTP sent successfully');
});

export const verifyOtp = catchAsync(async (req, res) => {
  const result = await AuthPatientService.verifyOtpAndLogin(req.body.email, req.body.otp);
  sendSuccess(res, StatusCodes.OK, result, 'OTP verified successfully');
});

export const registerPatient = catchAsync(async (req, res) => {
  const result = await AuthPatientService.registerPatient(req.body);
  sendSuccess(res, StatusCodes.CREATED, result, 'Patient registered successfully');
});

export const getProfile = catchAsync(async (req, res) => {
  const patient = await AuthPatientService.getProfile(req.patient.id);
  sendSuccess(res, StatusCodes.OK, patient, 'Profile fetched successfully');
});

export const updateProfile = catchAsync(async (req, res) => {
  const patient = await AuthPatientService.updateProfile(req.patient.id, req.body);
  sendSuccess(res, StatusCodes.OK, patient, 'Profile updated successfully');
});
