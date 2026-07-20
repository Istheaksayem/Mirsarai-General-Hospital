import Doctor from '../models/doctor.model.js';
import Patient from '../models/patient.model.js';
import Appointment from '../models/appointment.model.js';
import Department from '../models/department.model.js';
import Service from '../models/service.model.js';
import Document from '../models/document.model.js';
import User from '../models/user.model.js';
import AuditLog from '../models/auditLog.model.js';

export const getDashboardStats = async () => {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(todayStart);
  todayEnd.setDate(todayEnd.getDate() + 1);

  const [
    totalDoctors,
    totalPatients,
    todayAppointments,
    pendingAppointments,
    totalDepartments,
    totalServices,
    labReportsPending,
    activeStaff,
  ] = await Promise.all([
    Doctor.countDocuments({ status: 'active' }),
    Patient.countDocuments({ isActive: true }),
    Appointment.countDocuments({ date: { $gte: todayStart, $lt: todayEnd } }),
    Appointment.countDocuments({
      date: { $gte: todayStart, $lt: todayEnd },
      status: { $in: ['pending', 'confirmed'] },
    }),
    Department.countDocuments({ isVisible: true }),
    Service.countDocuments({ isVisible: true }),
    Document.countDocuments({ documentType: 'diagnostic_report', status: 'pending' }),
    User.countDocuments({
      role: { $in: ['doctor', 'admin', 'super-admin', 'reception', 'lab'] },
      isActive: true,
    }),
  ]);

  return {
    totalPatients,
    totalDoctors,
    appointmentsToday: todayAppointments,
    pendingAppointments,
    totalDepartments,
    totalServices,
    revenueThisMonth: 0,
    unpaidInvoices: 0,
    labReportsPending,
    activeStaff,
    checkInsToday: todayAppointments - pendingAppointments,
    revenueChart: [],
  };
};

export const getRecentActivities = async (limit = 20) => {
  const logs = await AuditLog.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('actorId', 'fullName email')
    .lean();

  return logs.map((log) => ({
    id: log._id.toString(),
    userId: log.actorId?._id?.toString() || '',
    userName: log.actorId?.fullName || 'System',
    userRole: log.actorRole || 'system',
    action: log.action,
    resourceType: log.targetEntity,
    resourceId: log.targetId || '',
    description: `${log.action} ${log.targetEntity}${log.targetId ? ' #' + log.targetId.slice(-6) : ''}`,
    timestamp: log.createdAt?.toISOString() || new Date().toISOString(),
    ipAddress: '',
    metadata: log.details || {},
  }));
};
