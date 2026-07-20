import { StatusCodes } from 'http-status-codes';
import Appointment from '../models/appointment.model.js';
import Doctor from '../models/doctor.model.js';
import DoctorProfile from '../models/doctorProfile.model.js';
import User from '../models/user.model.js';
import ApiError from '../utils/ApiError.js';
import generateAppointmentId from '../utils/generateAppointmentId.js';
import sendEmail from '../utils/sendEmail.js';
import env from '../config/env.js';
import { createNotification } from './notification.service.js';
import { notifyNewAppointment, notifyAppointmentConfirmed } from './appointment-notification.service.js';
import { APPOINTMENT_SOURCE } from '../constants/index.js';
import { isTransitionAllowed } from '../constants/statusTransitions.js';
import { findOrCreatePatient, linkPatientToAppointment } from './patient/shared-patient.service.js';
import { validateBookingSlot } from './doctorSchedule.service.js';

/**
 * When an appointment is confirmed: find or create the patient,
 * link the appointment, and send confirmation notification.
 */
const handleAppointmentConfirmed = async (appointment, confirmingUser = null) => {
  const patient = await findOrCreatePatient({
    phone: appointment.patientPhone,
    name: appointment.patientName,
    email: appointment.patientEmail,
    age: appointment.patientAge,
    gender: appointment.patientGender,
  });

  if (patient) {
    await linkPatientToAppointment(appointment._id, patient);
  }

  let confirmedByName;
  if (confirmingUser?.id) {
    const userDoc = await User.findById(confirmingUser.id).select('fullName').lean();
    confirmedByName = userDoc?.fullName;
  }

  try {
    await createNotification({
      patientId: patient._id,
      type: 'status_update',
      title: 'Appointment Confirmed',
      message: `Your appointment has been confirmed successfully. — ${appointment.patientName} with ${appointment.doctor?.name?.en || 'doctor'} on ${new Date(appointment.date).toLocaleDateString()}`,
    });

    await notifyAppointmentConfirmed(appointment, confirmedByName);
  } catch (err) {
    console.log('Confirmation notification failed:', err.message);
  }

  if (appointment.patientEmail) {
    try {
      const portalLink = `${env.clientUrl || 'http://localhost:3000'}/login-patient?email=${encodeURIComponent(appointment.patientEmail)}`;
      const portalMessage = patient?.hasSetPassword
        ? `Log in to your dashboard to view details:\n${portalLink}`
        : `If you haven't already, set up your password and access your dashboard:\n${portalLink}`;

      await sendEmail({
        email: appointment.patientEmail,
        subject: 'Appointment Confirmed — Mirsarai General Hospital',
        message: `Dear ${appointment.patientName},

Your appointment has been confirmed successfully.

Doctor: ${appointment.doctor?.name?.en || 'Assigned doctor'}
Date: ${new Date(appointment.date).toLocaleDateString()}
Time: ${appointment.time}

${portalMessage}

Thank you,
Mirsarai General Hospital`,
      });
    } catch (err) {
      console.log('Confirmation email sending failed:', err.message);
    }
  }

  return patient;
};

/**
 * When an appointment is rejected: send notification (no patient record created).
 */
const handleAppointmentRejected = async (appointment) => {
  if (appointment.patientId) {
    try {
      await createNotification({
        patientId: appointment.patientId,
        type: 'status_update',
        title: 'Appointment Rejected',
        message: `Unfortunately, your appointment request has been rejected. — ${appointment.patientName} on ${new Date(appointment.date).toLocaleDateString()}`,
      });
    } catch (err) {
      console.log('Rejection notification failed:', err.message);
    }
  }

  if (appointment.patientEmail) {
    try {
      await sendEmail({
        email: appointment.patientEmail,
        subject: 'Appointment Request Update — Mirsarai General Hospital',
        message: `Dear ${appointment.patientName},

Unfortunately, your appointment request has been rejected.

Doctor: ${appointment.doctor?.name?.en || 'Assigned doctor'}
Date: ${new Date(appointment.date).toLocaleDateString()}
Time: ${appointment.time}

If you have any questions, please contact the hospital.

Thank you,
Mirsarai General Hospital`,
      });
    } catch (err) {
      console.log('Rejection email sending failed:', err.message);
    }
  }
};

/**
 * Create an appointment with centralized ID generation.
 * Does NOT create a Patient record at booking time — that happens when status changes to "confirmed".
 */
export const createAppointment = async (data, source = APPOINTMENT_SOURCE.ONLINE) => {
  const doctor = await Doctor.findById(data.doctor);
  if (!doctor) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Doctor not found');
  }

  if (data.date && data.time) {
    try {
      const userDoc = await User.findOne({ doctorRef: doctor._id }).select('_id').lean();
      if (userDoc) {
        const dateStr = typeof data.date === 'string' ? data.date : new Date(data.date).toISOString().split('T')[0];
        await validateBookingSlot(userDoc._id, dateStr, data.time);
      }
    } catch (err) {
      if (err.statusCode) throw err;
      console.log('Slot validation skipped:', err.message);
    }
  }

  const appointmentId = await generateAppointmentId();

  const appointmentData = {
    appointmentId,
    patientId: null,
    patientName: data.patientName,
    patientPhone: data.patientPhone,
    patientEmail: data.patientEmail,
    patientAge: data.patientAge,
    patientGender: data.patientGender,
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
  let populated = await Appointment.findById(appointment._id)
    .populate('doctor', 'name designation image department')
    .lean();

  let patient = null;

  try {
    await notifyNewAppointment(populated);
  } catch (err) {
    console.log('Staff notification failed:', err.message);
  }

  if (populated.patientEmail) {
    try {
      patient = await findOrCreatePatient({
        phone: populated.patientPhone,
        name: populated.patientName,
        email: populated.patientEmail,
        age: populated.patientAge,
        gender: populated.patientGender,
        skipWelcomeEmail: true,
      });
      if (patient) {
        await linkPatientToAppointment(populated._id, patient);
        populated = await Appointment.findById(populated._id)
          .populate('doctor', 'name designation image department')
          .lean();
      }

      try {
        const portalLink = `${env.clientUrl || 'http://localhost:3000'}/login-patient?email=${encodeURIComponent(populated.patientEmail)}`;
        await sendEmail({
          email: populated.patientEmail,
          subject: 'Appointment Booked — Mirsarai General Hospital',
          message: `Dear ${populated.patientName},

Your appointment has been booked successfully.

Appointment ID: ${populated.appointmentId}
Patient ID: ${patient.patientId}
Doctor: ${populated.doctor?.name?.en || 'Assigned doctor'}
Date: ${new Date(populated.date).toLocaleDateString()}
Time: ${populated.time}

You can access your patient portal to view prescriptions, lab reports, and more.

Set up your password and access your dashboard:
${portalLink}

Thank you,
Mirsarai General Hospital`,
        });
      } catch (emailErr) {
        console.log('Booking email sending failed:', emailErr.message);
      }
    } catch (err) {
      console.log('Patient setup at booking failed:', err.message);
    }
  }

  if (populated.status === 'confirmed') {
    patient = await handleAppointmentConfirmed(populated);
    populated = await Appointment.findById(appointment._id)
      .populate('doctor', 'name designation image department')
      .lean();
  }

  return {
    appointment: populated,
    patient: patient ? { _id: patient._id, patientId: patient.patientId, fullName: patient.fullName, mobile: patient.mobile, email: patient.email } : null,
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
    status: { $ne: 'completed' },
  })
    .populate('doctor', 'name designation image department')
    .sort({ time: 1 })
    .lean();

  return appointments;
};

export const getDoctorCompletedAppointments = async (doctorRef, userId, filters = {}) => {
  let resolvedRef = doctorRef;

  if (!resolvedRef && userId) {
    const profile = await DoctorProfile.findOne({ userId }).select('slug').lean();
    if (profile?.slug) {
      const doctorDoc = await Doctor.findOne({ slug: profile.slug }).select('_id').lean();
      resolvedRef = doctorDoc?._id;
    }
  }

  if (!resolvedRef) return { data: [], total: 0, page: 1, limit: 10 };

  return getAppointments({ ...filters, doctorId: resolvedRef.toString(), status: 'completed' });
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

export const updateAppointmentStatus = async (id, status, role = 'super-admin', user = null) => {
  const existing = await Appointment.findById(id)
    .populate('doctor', 'name designation image department')
    .lean();
  if (!existing) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Appointment not found');
  }

  if (!isTransitionAllowed(role, status)) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      `Role '${role}' is not allowed to set status to '${status}'`
    );
  }

  const appointment = await Appointment.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  )
    .populate('doctor', 'name designation image department')
    .lean();

  if (status === 'confirmed') {
    await handleAppointmentConfirmed(appointment, user);
    const refreshed = await Appointment.findById(id)
      .populate('doctor', 'name designation image department')
      .lean();
    return refreshed;
  }

  if (status === 'rejected') {
    await handleAppointmentRejected(existing);
  }

  return appointment;
};
