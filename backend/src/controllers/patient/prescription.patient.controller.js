import path from 'path';
import fs from 'fs';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync.js';
import { sendSuccess, sendPaginated } from '../../utils/ApiResponse.js';
import * as PrescriptionService from '../../services/prescription.service.js';
import ApiError from '../../utils/ApiError.js';

export const getMyPrescriptions = catchAsync(async (req, res) => {
  const patientId = req.patient.id;
  const result = await PrescriptionService.getPatientPrescriptions(patientId, req.query);
  sendPaginated(res, result.data, result.total, result.page, result.limit, 'Prescriptions fetched successfully');
});

export const getPrescriptionById = catchAsync(async (req, res) => {
  const patientId = req.patient.id;
  const prescription = await PrescriptionService.getPrescriptionById(req.params.id);

  if (prescription.patientId.toString() !== patientId.toString()) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'You can only access your own prescriptions');
  }

  sendSuccess(res, StatusCodes.OK, prescription, 'Prescription fetched successfully');
});

export const downloadPrescriptionFile = catchAsync(async (req, res) => {
  const patientId = req.patient.id;
  const prescription = await PrescriptionService.getPrescriptionById(req.params.id);

  if (prescription.patientId.toString() !== patientId.toString()) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'You can only access your own prescriptions');
  }

  if (!prescription.fileUrl) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'This prescription has no file to download');
  }

  const filePath = path.join(process.cwd(), 'public', prescription.fileUrl);
  if (!fs.existsSync(filePath)) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Prescription file not found on server');
  }

  const ext = path.extname(prescription.fileUrl).toLowerCase();
  const mimeMap = {
    '.pdf': 'application/pdf',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  };
  const mime = mimeMap[ext] || 'application/octet-stream';

  const filename = `prescription-${prescription.patientInfo?.patientId || prescription._id}${ext}`;
  res.setHeader('Content-Type', mime);
  res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
  fs.createReadStream(filePath).pipe(res);
});
