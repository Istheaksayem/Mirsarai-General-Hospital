import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import catchAsync from '../../utils/catchAsync.js';
import { sendSuccess, sendPaginated } from '../../utils/ApiResponse.js';
import * as PatientService from '../../services/admin/patient.admin.service.js';
import { createAuditLog } from '../../services/auditLog.service.js';

const resolvePatientId = async (id) => {
  const byId = await PatientService.getPatientById(id).catch(() => null);
  if (byId) return byId;
  return PatientService.getPatientByPatientId(id);
};

export const getPatients = catchAsync(async (req, res) => {
  const result = await PatientService.getPatients(req.query);
  sendPaginated(res, result.patients, result.total, result.page, result.limit, 'Patients fetched successfully');
});

export const getPatientById = catchAsync(async (req, res) => {
  const patient = await resolvePatientId(req.params.id);
  sendSuccess(res, StatusCodes.OK, patient, 'Patient fetched successfully');
});

export const createPatient = catchAsync(async (req, res) => {
  const patient = await PatientService.createPatient(req.body, req.user?.id);
  await createAuditLog({
    actorId: req.user?.id,
    actorRole: req.user?.role,
    action: 'create',
    targetEntity: 'Patient',
    targetId: patient._id.toString(),
    details: { patientId: patient.patientId },
  });
  sendSuccess(res, StatusCodes.CREATED, patient, 'Patient created successfully');
});

export const updatePatient = catchAsync(async (req, res) => {
  const existing = await resolvePatientId(req.params.id);
  const patient = await PatientService.updatePatient(existing._id.toString(), req.body);
  await createAuditLog({
    actorId: req.user?.id,
    actorRole: req.user?.role,
    action: 'update',
    targetEntity: 'Patient',
    targetId: patient._id.toString(),
    details: { patientId: patient.patientId },
  });
  sendSuccess(res, StatusCodes.OK, patient, 'Patient updated successfully');
});

export const deletePatient = catchAsync(async (req, res) => {
  const existing = await resolvePatientId(req.params.id);
  await PatientService.deletePatient(existing._id.toString());
  await createAuditLog({
    actorId: req.user?.id,
    actorRole: req.user?.role,
    action: 'delete',
    targetEntity: 'Patient',
    targetId: existing._id.toString(),
  });
  sendSuccess(res, StatusCodes.OK, null, 'Patient deleted successfully');
});
