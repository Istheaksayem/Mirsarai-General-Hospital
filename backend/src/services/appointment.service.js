import { StatusCodes } from 'http-status-codes';
import Appointment from '../models/appointment.model.js';
import Doctor from '../models/doctor.model.js';
import ApiError from '../utils/ApiError.js';

export const createAppointment = async (data) => {
  const doctor = await Doctor.findById(data.doctor);
  if (!doctor) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Doctor not found');
  }

  const appointment = await Appointment.create(data);
  const populated = await Appointment.findById(appointment._id).populate(
    'doctor',
    'name designation image department'
  );
  return populated;
};

export const getAppointments = async (filters = {}) => {
  const {
    page = 1,
    limit = 10,
    doctorId,
    department,
    status,
    dateFrom,
    dateTo,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = filters;

  const query = {};

  if (doctorId) query.doctor = doctorId;
  if (department) query.department = { $regex: department, $options: 'i' };
  if (status) query.status = status;
  if (dateFrom || dateTo) {
    query.date = {};
    if (dateFrom) query.date.$gte = new Date(dateFrom);
    if (dateTo) query.date.$lte = new Date(dateTo);
  }
  if (search) {
    query.$or = [
      { patientName: { $regex: search, $options: 'i' } },
      { patientPhone: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
  const limitNum = parseInt(limit, 10);

  const sortObj = {};
  sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;

  const [appointments, total] = await Promise.all([
    Appointment.find(query)
      .populate('doctor', 'name designation image department')
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum),
    Appointment.countDocuments(query),
  ]);

  return {
    appointments,
    total,
    page: parseInt(page, 10),
    limit: limitNum,
  };
};

export const getAppointmentById = async (id) => {
  const appointment = await Appointment.findById(id).populate(
    'doctor',
    'name designation image department'
  );
  if (!appointment) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Appointment not found');
  }
  return appointment;
};

export const updateAppointment = async (id, data) => {
  const appointment = await Appointment.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).populate('doctor', 'name designation image department');

  if (!appointment) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Appointment not found');
  }
  return appointment;
};

export const deleteAppointment = async (id) => {
  const appointment = await Appointment.findByIdAndDelete(id);
  if (!appointment) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Appointment not found');
  }
  return appointment;
};

export const updateAppointmentStatus = async (id, status) => {
  const appointment = await Appointment.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  ).populate('doctor', 'name designation image department');

  if (!appointment) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Appointment not found');
  }
  return appointment;
};
