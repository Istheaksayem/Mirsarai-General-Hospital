import { StatusCodes } from 'http-status-codes';
import Patient from '../../models/patient.model.js';
import Appointment from '../../models/appointment.model.js';
import ApiError from '../../utils/ApiError.js';
import generatePatientId from '../../utils/generatePatientId.js';
import sendEmail from '../../utils/sendEmail.js';
import env from '../../config/env.js';
import { createNotification } from '../notification.service.js';
import { createAuditLog } from '../auditLog.service.js';

export const registerPatient = async (data, userId) => {
  const existing = await Patient.findOne({ mobile: data.mobile });
  if (existing) throw new ApiError(StatusCodes.CONFLICT, 'A patient with this mobile number already exists');

  const patientId = await generatePatientId();
  const patientData = { ...data, patientId, createdBy: userId };

  if (data.dateOfBirth && !data.age) {
    const today = new Date();
    const birth = new Date(data.dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    patientData.age = age;
  }

  const patient = await Patient.create(patientData);

  if (data.email) {
    try {
      await sendEmail({
        email: data.email,
        subject: 'Welcome to Mirsarai General Hospital Patient Portal',
        message: `Dear ${data.fullName},

You have been added as a patient at Mirsarai General Hospital.

You can now access all your information — prescriptions, lab reports, and more — through your patient dashboard.

Visit: ${env.clientUrl}/login-patient?email=${encodeURIComponent(data.email)}

On that page, enter your email and request a one-time password (OTP) to log in.

Thank you,
Mirsarai General Hospital`,
      });
    } catch (err) {
      console.log('Welcome email sending failed:', err.message);
    }
  }

  await createAuditLog({
    actorId: userId,
    actorRole: 'reception',
    action: 'create',
    targetEntity: 'Patient',
    targetId: patient._id.toString(),
    details: { patientId: patient.patientId, source: 'reception-registration' },
  });

  return patient.toObject();
};

export const searchPatients = async (query) => {
  if (!query || query.length < 2) return [];
  const filter = {
    $or: [
      { fullName: { $regex: query, $options: 'i' } },
      { patientId: { $regex: query, $options: 'i' } },
      { mobile: { $regex: query, $options: 'i' } },
    ],
  };
  return Patient.find(filter).limit(20).sort({ createdAt: -1 }).lean();
};

export const getReceptionAppointments = async (query = {}) => {
  const { page = 1, limit = 20, status } = query;
  const filter = {};
  if (status) filter.status = status;

  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
  const limitNum = parseInt(limit, 10);

  const [appointments, total] = await Promise.all([
    Appointment.find(filter)
      .populate('doctor', 'name designation image department')
      .sort({ date: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Appointment.countDocuments(filter),
  ]);

  return { appointments, total, page: parseInt(page, 10), limit: limitNum };
};

export const updateAppointmentStatus = async (id, status, userId) => {
  const appointment = await Appointment.findById(id).populate('doctor', 'name designation image department').lean();
  if (!appointment) throw new ApiError(StatusCodes.NOT_FOUND, 'Appointment not found');

  const updated = await Appointment.findByIdAndUpdate(id, { status }, { new: true, runValidators: true })
    .populate('doctor', 'name designation image department')
    .lean();

  const patient = appointment.patientId
    ? await Patient.findById(appointment.patientId).lean()
    : await Patient.findOne({ mobile: appointment.patientPhone });
  if (patient) {
    const statusMessages = {
      confirmed: 'Your appointment has been confirmed.',
      cancelled: 'Your appointment has been cancelled.',
      completed: 'Your appointment has been marked as completed.',
    };
    const message = statusMessages[status];
    if (message) {
      await createNotification({
        patientId: patient._id,
        type: 'status_update',
        title: `Appointment ${status}`,
        message: `${message} — ${appointment.patientName} with ${updated.doctor?.name || 'doctor'} on ${new Date(appointment.date).toLocaleDateString()}`,
      });
    }
  }

  await createAuditLog({
    actorId: userId,
    actorRole: 'reception',
    action: 'update',
    targetEntity: 'Appointment',
    targetId: id,
    details: { status, previousStatus: appointment.status },
  });

  return updated;
};
