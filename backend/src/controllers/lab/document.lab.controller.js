import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync.js';
import { sendSuccess, sendPaginated } from '../../utils/ApiResponse.js';
import * as DocumentLabService from '../../services/lab/document.lab.service.js';

export const uploadDocument = catchAsync(async (req, res) => {
  const document = await DocumentLabService.uploadDocument(req.body, req.file, req.user);
  sendSuccess(res, StatusCodes.CREATED, document, 'Document uploaded successfully');
});

export const getDocuments = catchAsync(async (req, res) => {
  const result = await DocumentLabService.getDocuments(req.query);
  sendPaginated(res, result.documents, result.total, result.page, result.limit, 'Documents fetched successfully');
});

export const updateDocument = catchAsync(async (req, res) => {
  const document = await DocumentLabService.updateDocument(req.params.id, req.body);
  sendSuccess(res, StatusCodes.OK, document, 'Document updated successfully');
});

export const deleteDocument = catchAsync(async (req, res) => {
  const result = await DocumentLabService.deleteDocument(req.params.id, req.user?.id);
  sendSuccess(res, StatusCodes.OK, null, result.message);
});

export const lookupPatient = catchAsync(async (req, res) => {
  const patients = await DocumentLabService.lookupPatient(req.query.q);
  sendSuccess(res, StatusCodes.OK, patients, 'Patients fetched successfully');
});
