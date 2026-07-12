import { StatusCodes } from 'http-status-codes';
import { sendSuccess, sendPaginated } from '../utils/ApiResponse.js';
import catchAsync from '../utils/catchAsync.js';
import * as serviceService from '../services/service.service.js';

export const getPublicServices = catchAsync(async (req, res) => {
  const services = await serviceService.getPublicServices();
  sendSuccess(res, StatusCodes.OK, services, 'Services fetched successfully');
});

export const getAdminServices = catchAsync(async (req, res) => {
  const result = await serviceService.getAdminServices(req.query);
  sendPaginated(
    res,
    result.services,
    result.total,
    result.page,
    result.limit,
    'Services fetched successfully'
  );
});

export const getServiceById = catchAsync(async (req, res) => {
  const service = await serviceService.getServiceById(req.params.id);
  sendSuccess(res, StatusCodes.OK, service, 'Service fetched successfully');
});

export const createService = catchAsync(async (req, res) => {
  const service = await serviceService.createService(req.body, req.user?.id);
  sendSuccess(res, StatusCodes.CREATED, service, 'Service created successfully');
});

export const updateService = catchAsync(async (req, res) => {
  const service = await serviceService.updateService(req.params.id, req.body, req.user?.id);
  sendSuccess(res, StatusCodes.OK, service, 'Service updated successfully');
});

export const deleteService = catchAsync(async (req, res) => {
  await serviceService.deleteService(req.params.id);
  sendSuccess(res, StatusCodes.OK, null, 'Service deleted successfully');
});

export const reorderServices = catchAsync(async (req, res) => {
  await serviceService.reorderServices(req.body);
  sendSuccess(res, StatusCodes.OK, null, 'Services reordered successfully');
});
