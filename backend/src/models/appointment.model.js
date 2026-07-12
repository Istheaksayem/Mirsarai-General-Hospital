import mongoose from 'mongoose';
import { APPOINTMENT_STATUS, GENDER } from '../constants/index.js';

const appointmentSchema = new mongoose.Schema(
  {
    patientName: {
      type: String,
      required: [true, 'Patient name is required'],
      trim: true,
    },
    patientPhone: {
      type: String,
      required: [true, 'Patient phone is required'],
    },
    patientEmail: {
      type: String,
      trim: true,
    },
    patientAge: {
      type: Number,
      min: 0,
      max: 150,
    },
    patientGender: {
      type: String,
      enum: Object.values(GENDER),
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: [true, 'Doctor is required'],
    },
    department: {
      type: String,
    },
    service: {
      type: String,
    },
    date: {
      type: Date,
      required: [true, 'Appointment date is required'],
    },
    time: {
      type: String,
      required: [true, 'Appointment time is required'],
    },
    type: {
      type: String,
      enum: ['new', 'follow-up', 'consultation'],
      default: 'new',
    },
    status: {
      type: String,
      enum: Object.values(APPOINTMENT_STATUS),
      default: APPOINTMENT_STATUS.PENDING,
    },
    reason: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

appointmentSchema.index({ doctor: 1, date: -1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ date: -1 });
appointmentSchema.index({ department: 1 });

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;
