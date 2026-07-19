import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import Appointment from '../models/appointment.model.js';
import Patient from '../models/patient.model.js';
import Doctor from '../models/doctor.model.js';
import DoctorProfile from '../models/doctorProfile.model.js';
import ApiError from '../utils/ApiError.js';
import generatePatientId from '../utils/generatePatientId.js';
import generateAppointmentId from '../utils/generateAppointmentId.js';
import sendEmail from '../utils/sendEmail.js';
import env from '../config/env.js';
import { APPOINTMENT_SOURCE } from '../constants/index.js';

/**
 * Find existing patient by phone number, or create a new one.
 * This prevents duplicate patient records.
 */
export const findOrCreatePatient = async ({ patientPhone, patientName, patientEmail, patientAge, patientGender }) => {
  let patient = await Patient.findOne({ mobile: patientPhone }).lean();

  if (!patient) {
    const patientId = await generatePatientId();
    const patientData = {
      patientId,
      fullName: patientName,
      mobile: patientPhone,
    };
    if (patientEmail) patientData.email = patientEmail;
    if (patientAge !== undefined && patientAge !== null) patientData.age = patientAge;
    if (patientGender) patientData.gender = patientGender;

    patient = await Patient.create(patientData);
    patient = patient.toObject();

    // Send welcome email for new patients
    if (patientEmail) {
      try {
        await sendEmail({
          email: patientEmail,
          subject: 'Welcome to Mirsarai General Hospital Patient Portal',
          message: `Dear ${patientName},

You have been registered at Mirsarai General Hospital.

Your Patient ID: ${patientId}

You can access your information — prescriptions, lab reports, and more — through your patient dashboard.

Visit: ${env.clientUrl || 'http://localhost:3000'}/login-patient?email=${encodeURIComponent(patientEmail)}

Thank you,
Mirsarai General Hospital`,
        });
      } catch (err) {
        console.log('Welcome email sending failed:', err.message);
      }
    }
  }

  return patient;
};

/**
 * Create an appointment with centralized ID generation and patient lookup.
 * Always generates appointmentId on the backend — never trusts client IDs.
 */
export const createAppointment = async (data, source = APPOINTMENT_SOURCE.ONLINE) => {
  const doctor = await Doctor.findById(data.doctor);
  if (!doctor) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Doctor not found');
  }

  // Find existing patient by phone or create new one
  const patient = await findOrCreatePatient({
    patientPhone: data.patientPhone,
    patientName: data.patientName,
    patientEmail: data.patientEmail,
    patientAge: data.patientAge,
    patientGender: data.patientGender,
  });

  // Generate appointment ID (never trust client-provided IDs)
  const appointmentId = await generateAppointmentId();

  const appointmentData = {
    appointmentId,
    patientId: patient._id,
    patientName: patient.fullName,
    patientPhone: patient.mobile,
    patientEmail: patient.email,
    patientAge: patient.age,
    patientGender: patient.gender,
    doctor: data.doctor,
    department: data.department || doctor.department?.en,
    service: data.service,
    date: data.date,
    time: data.time,
    type: data.type || 'new',
    status: data.status || 'pending',
    appointmentSource: source,
    reason: data.reason,
    notes: data.notes,
    createdBy: data.createdBy || source,
  };

  const appointment = await Appointment.create(appointmentData);
  const populated = await Appointment.findById(appointment._id)
    .populate('doctor', 'name designation image department')
    .lean();

  return {
    appointment: populated,
    patient: {
      _id: patient._id,
      patientId: patient.patientId,
      fullName: patient.fullName,
      mobile: patient.mobile,
      email: patient.email,
    },
  };
};

/**
 * Get appointments with filters.
 * Supports doctor RBAC: if doctorId is provided, only that doctor's appointments are returned.
 */
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
    source,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = filters;

  const query = {};

  if (doctorId) query.doctor = doctorId;
  if (department) query.department = { $regex: department, $options: 'i' };
  if (status) query.status = status;
  if (source) query.appointmentSource = source;
  if (dateFrom || dateTo) {
    query.date = {};
    if (dateFrom) query.date.$gte = new Date(dateFrom);
    if (dateTo) query.date.$lte = new Date(dateTo);
  }
  if (search) {
    query.$or = [
      { patientName: { $regex: search, $options: 'i' } },
      { patientPhone: { $regex: search, $options: 'i' } },
      { appointmentId: { $regex: search, $options: 'i' } },
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
      .limit(limitNum)
      .lean(),
    Appointment.countDocuments(query),
  ]);

  return {
    data: appointments,
    total,
    page: parseInt(page, 10),
    limit: limitNum,
  };
};

/**
 * Get today's appointments filtered by doctor (for doctor dashboard).
 * Resolves the doctor reference from the authenticated user's profile.
 */
export const getDoctorTodaysAppointments = async (doctorRef, userId) => {
  let resolvedRef = doctorRef;

  if (!resolvedRef && userId) {
    const profile = await DoctorProfile.findOne({ userId }).select('slug').lean();
    if (profile?.slug) {
      const doctorDoc = await Doctor.findOne({ slug: profile.slug }).select('_id').lean();
      resolvedRef = doctorDoc?._id;
    }
  }

  if (!resolvedRef) return [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const appointments = await Appointment.find({
    doctor: resolvedRef,
    date: { $gte: today, $lt: tomorrow },
  })
    .populate('doctor', 'name designation image department')
    .sort({ time: 1 })
    .lean();

  return appointments;
};

/**
 * Get all appointments for a specific doctor (by authenticated user).
 */
export const getDoctorAppointments = async (doctorRef, userId, filters = {}) => {
  let resolvedRef = doctorRef;

  if (!resolvedRef && userId) {
    const profile = await DoctorProfile.findOne({ userId }).select('slug').lean();
    if (profile?.slug) {
      const doctorDoc = await Doctor.findOne({ slug: profile.slug }).select('_id').lean();
      resolvedRef = doctorDoc?._id;
    }
  }

  if (!resolvedRef) return { data: [], total: 0, page: 1, limit: 10 };

  return getAppointments({ ...filters, doctorId: resolvedRef.toString() });
};

export const getAppointmentById = async (id) => {
  const appointment = await Appointment.findById(id)
    .populate('doctor', 'name designation image department')
    .lean();
  if (!appointment) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Appointment not found');
  }
  return appointment;
};

export const getAppointmentByAppointmentId = async (appointmentId) => {
  const appointment = await Appointment.findOne({ appointmentId })
    .populate('doctor', 'name designation image department')
    .lean();
  if (!appointment) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Appointment not found');
  }
  return appointment;
};

export const updateAppointment = async (id, data) => {
  const appointment = await Appointment.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  })
    .populate('doctor', 'name designation image department')
    .lean();

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
  )
    .populate('doctor', 'name designation image department')
    .lean();

  if (!appointment) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Appointment not found');
  }
  return appointment;
};
