import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync.js';
import { sendSuccess } from '../../utils/ApiResponse.js';
import * as StaffService from '../../services/admin/staff.admin.service.js';

export const getAllStaff = catchAsync(async (req, res) => {
  const staff = await StaffService.getAllStaff(req.query);
  sendSuccess(res, StatusCodes.OK, staff, 'Staff fetched successfully');
});

export const getStaffById = catchAsync(async (req, res) => {
  const staff = await StaffService.getStaffById(req.params.id);
  sendSuccess(res, StatusCodes.OK, staff, 'Staff member fetched successfully');
});

export const updateStaff = catchAsync(async (req, res) => {
  const staff = await StaffService.updateStaff(req.params.id, req.body, req.user?.id);
  sendSuccess(res, StatusCodes.OK, staff, 'Staff updated successfully');
});

export const deleteStaff = catchAsync(async (req, res) => {
  await StaffService.deleteStaff(req.params.id, req.user?.id);
  sendSuccess(res, StatusCodes.OK, null, 'Staff permanently deleted');
});

export const createStaff = catchAsync(async (req, res) => {
  const staff = await StaffService.createStaff(req.body, req.user?.id);
  sendSuccess(res, StatusCodes.CREATED, staff, 'Staff created successfully');
});

export const activateStaff = catchAsync(async (req, res) => {
  const user = await StaffService.activateStaff(req.params.id, req.user?.id);
  sendSuccess(res, StatusCodes.OK, user, 'Staff activated successfully');
});

export const deactivateStaff = catchAsync(async (req, res) => {
  const user = await StaffService.deactivateStaff(req.params.id, req.user?.id);
  sendSuccess(res, StatusCodes.OK, user, 'Staff deactivated successfully');
});
