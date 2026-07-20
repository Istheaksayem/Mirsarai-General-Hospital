import cron from 'node-cron';
import Appointment from '../models/appointment.model.js';
import Notification from '../models/notification.model.js';
import { createNotification } from './notification.service.js';

/**
 * Send appointment reminders at 8 AM daily for all confirmed appointments today.
 */
export async function sendAppointmentReminders() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const appointments = await Appointment.find({
    date: { $gte: today, $lt: tomorrow },
    status: 'confirmed',
  }).populate('patientId', '_id').lean();

  let sent = 0;

  for (const apt of appointments) {
    if (!apt.patientId) continue;

    const existing = await Notification.findOne({
      patientId: apt.patientId._id || apt.patientId,
      type: 'appointment_reminder',
      createdAt: { $gte: today },
    });

    if (existing) continue;

    const doctorName = apt.doctor?.name?.en || apt.doctor?.name?.bn || 'doctor';
    const timeStr = apt.time || '';

    await createNotification({
      patientId: apt.patientId._id || apt.patientId,
      type: 'appointment_reminder',
      title: 'Appointment Reminder',
      message: `You have an appointment today at ${timeStr} with ${doctorName}.`,
      priority: 'high',
      link: '/appointments',
    });
    sent++;
  }

  if (sent > 0) {
    console.log(`[Cron] Sent ${sent} appointment reminders`);
  }
}

/**
 * Start the daily cron jobs.
 * Runs at 8:00 AM server time every day.
 */
export function startReminderCron() {
  cron.schedule('0 8 * * *', () => {
    console.log('[Cron] Running appointment reminder job...');
    sendAppointmentReminders().catch((err) => {
      console.error('[Cron] Reminder job failed:', err.message);
    });
  });
}
