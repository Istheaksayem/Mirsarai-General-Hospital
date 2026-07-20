import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync.js';
import { sendSuccess, sendPaginated } from '../../utils/ApiResponse.js';
import * as PrescriptionService from '../../services/prescription.service.js';
import User from '../../models/user.model.js';
import Patient from '../../models/patient.model.js';

export const lookupPatient = catchAsync(async (req, res) => {
  const { query } = req.body;
  if (!query || typeof query !== 'string' || !query.trim()) {
    return sendSuccess(res, StatusCodes.BAD_REQUEST, null, 'Please provide a Patient ID or mobile number');
  }
  const patient = await PrescriptionService.lookupPatient(query.trim());
  sendSuccess(res, StatusCodes.OK, patient, 'Patient found');
});

export const createPrescription = catchAsync(async (req, res) => {
  const doctorId = req.user.id;
  const doctorUser = await User.findById(doctorId).select('fullName').lean();
  const doctorName = doctorUser?.fullName || 'Doctor';

  let patientId = req.body.patientId;
  let patientInfo = req.body.patientInfo;

  if (!patientId) {
    const query = req.body.patientQuery;
    if (query) {
      const patient = await PrescriptionService.lookupPatient(query.trim());
      patientId = patient._id;
      patientInfo = patient;
    }
  }

  if (!patientId) {
    return sendSuccess(res, StatusCodes.BAD_REQUEST, null, 'Patient ID or identifier is required');
  }

  const patientDoc = await Patient.findById(patientId).lean();
  if (!patientDoc) {
    return sendSuccess(res, StatusCodes.NOT_FOUND, null, 'Patient not found');
  }

  if (!patientInfo) {
    patientInfo = {
      patientId: patientDoc.patientId,
      name: patientDoc.fullName,
      mobile: patientDoc.mobile,
    };
  }

  let fileUrl;
  if (req.file) {
    fileUrl = `/uploads/prescriptions/${req.file.filename}`;
  }

  const prescription = await PrescriptionService.createPrescription({
    patientId,
    doctorId,
    doctorName,
    patientInfo,
    fileUrl,
    textContent: req.body.textContent,
    diagnosis: req.body.diagnosis,
    notes: req.body.notes,
    followUpDate: req.body.followUpDate,
  });

  sendSuccess(res, StatusCodes.CREATED, prescription, 'Prescription created successfully');
});

export const getMyPrescriptions = catchAsync(async (req, res) => {
  const doctorId = req.user.id;
  const result = await PrescriptionService.getDoctorPrescriptions(doctorId, req.query);
  sendPaginated(res, result.data, result.total, result.page, result.limit, 'Prescriptions fetched successfully');
});

export const getPrescriptionById = catchAsync(async (req, res) => {
  const prescription = await PrescriptionService.getPrescriptionById(req.params.id);
  sendSuccess(res, StatusCodes.OK, prescription, 'Prescription fetched successfully');
});

export const deletePrescription = catchAsync(async (req, res) => {
  const doctorId = req.user.id;
  const prescription = await PrescriptionService.deletePrescription(req.params.id, doctorId);
  sendSuccess(res, StatusCodes.OK, prescription, 'Prescription archived successfully');
});
