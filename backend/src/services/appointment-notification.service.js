import User from '../models/user.model.js';
import { createStaffNotification } from './notification.service.js';

function formatDate(date) {
  try {
    return new Date(date).toLocaleDateString('en-BD', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  } catch {
    return '';
  }
}

function getDoctorName(appointment) {
  if (appointment.doctor?.name?.en) return appointment.doctor.name.en;
  if (appointment.doctor?.name?.bn) return appointment.doctor.name.bn;
  if (appointment.doctorName) return appointment.doctorName;
  return 'Doctor';
}

function getDepartment(appointment) {
  if (appointment.department?.en) return appointment.department.en;
  if (appointment.department?.bn) return appointment.department.bn;
  if (typeof appointment.department === 'string') return appointment.department;
  return '';
}

export async function notifyNewAppointment(appointment) {
  const doctorName = getDoctorName(appointment);
  const department = getDepartment(appointment);
  const dateStr = formatDate(appointment.date);
  const timeStr = appointment.time || '';
  const patientName = appointment.patientName || 'A patient';

  const depPart = department ? ` (${department})` : '';

  // 1. Notify the assigned doctor
  const doctorUser = await User.findOne({ doctorRef: appointment.doctor?._id || appointment.doctor, role: 'doctor', isActive: true }).lean();
  if (doctorUser) {
    await createStaffNotification({
      userId: doctorUser._id,
      type: 'appointment_reminder',
      title: 'New Appointment Request',
      message: `${patientName} booked an appointment with you${depPart} on ${dateStr} at ${timeStr}.`,
      priority: 'high',
      link: `/${doctorUser.role}/appointments`,
    });
  }

  // 2. Notify all active receptionists
  const receptionists = await User.find({ role: 'reception', isActive: true }).lean();
  for (const receptionist of receptionists) {
    await createStaffNotification({
      userId: receptionist._id,
      type: 'appointment_reminder',
      title: 'New Appointment Booking',
      message: `${patientName} booked with Dr. ${doctorName}${depPart} on ${dateStr} at ${timeStr}.`,
      priority: 'high',
      link: '/reception-admin/appointments',
    });
  }

  // 3. Notify all active super admins
  const superAdmins = await User.find({ role: 'super-admin', isActive: true }).lean();
  for (const admin of superAdmins) {
    await createStaffNotification({
      userId: admin._id,
      type: 'appointment_reminder',
      title: 'New Appointment Booking',
      message: `${patientName} booked with Dr. ${doctorName}${depPart} on ${dateStr} at ${timeStr}.`,
      priority: 'high',
      link: '/super-admin/appointments',
    });
  }
}

export async function notifyAppointmentConfirmed(appointment, confirmedByName) {
  const doctorName = getDoctorName(appointment);
  const dateStr = formatDate(appointment.date);
  const timeStr = appointment.time || '';
  const patientName = appointment.patientName || 'A patient';
  const byPart = confirmedByName ? ` (confirmed by ${confirmedByName})` : '';

  const doctorRef = appointment.doctor?._id || appointment.doctor;
  const doctorUser = doctorRef ? await User.findOne({ doctorRef, role: 'doctor', isActive: true }).lean() : null;

  const baseMessage = `Appointment with ${patientName} — Dr. ${doctorName} on ${dateStr} at ${timeStr} has been confirmed${byPart}.`;

  // 1. Notify the assigned doctor
  if (doctorUser) {
    await createStaffNotification({
      userId: doctorUser._id,
      type: 'status_update',
      title: 'Appointment Confirmed',
      message: baseMessage,
      priority: 'medium',
      link: `/${doctorUser.role}/appointments`,
    });
  }

  // 2. Notify all active receptionists
  const receptionists = await User.find({ role: 'reception', isActive: true }).lean();
  for (const receptionist of receptionists) {
    await createStaffNotification({
      userId: receptionist._id,
      type: 'status_update',
      title: 'Appointment Confirmed',
      message: baseMessage,
      priority: 'medium',
      link: '/reception-admin/appointments',
    });
  }

  // 3. Notify all active super admins
  const superAdmins = await User.find({ role: 'super-admin', isActive: true }).lean();
  for (const admin of superAdmins) {
    await createStaffNotification({
      userId: admin._id,
      type: 'status_update',
      title: 'Appointment Confirmed',
      message: baseMessage,
      priority: 'medium',
      link: '/super-admin/appointments',
    });
  }
}
