import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync.js';
import { sendSuccess } from '../../utils/ApiResponse.js';
import Patient from '../../models/patient.model.js';
import Appointment from '../../models/appointment.model.js';
import Document from '../../models/document.model.js';

export const getTimeline = catchAsync(async (req, res) => {
  const patient = await Patient.findById(req.patient.id).lean();
  if (!patient) {
    return sendSuccess(res, StatusCodes.OK, [], 'Timeline fetched successfully');
  }

  const [appointments, documents] = await Promise.all([
    Appointment.find({ patientId: req.patient.id })
      .populate('doctor', 'name designation')
      .lean(),
    Document.find({ patientId: req.patient.id, isDeleted: false }).lean(),
  ]);

  const timeline = [
    ...appointments.map((a) => ({
      type: 'appointment',
      _id: a._id,
      title: `Appointment with ${a.doctor?.name || 'Doctor'}`,
      description: a.reason || '',
      date: a.date,
      status: a.status,
      metadata: { doctor: a.doctor?.name, department: a.department, time: a.time },
    })),
    ...documents.map((d) => ({
      type: 'document',
      _id: d._id,
      title: d.title,
      description: `${d.documentType} — ${d.department || 'General'}`,
      date: d.date || d.createdAt,
      status: null,
      metadata: { documentType: d.documentType, fileUrl: d.fileUrl },
    })),
  ];

  timeline.sort((a, b) => new Date(b.date) - new Date(a.date));

  sendSuccess(res, StatusCodes.OK, timeline, 'Timeline fetched successfully');
});
