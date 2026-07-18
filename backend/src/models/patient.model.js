import mongoose from 'mongoose';
import { GENDER, BLOOD_GROUPS } from '../constants/index.js';

const patientSchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: [true, 'Patient name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
    },
    mobile: {
      type: String,
      required: [true, 'Mobile number is required'],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    dateOfBirth: {
      type: Date,
    },
    age: {
      type: Number,
      min: 0,
      max: 150,
    },
    gender: {
      type: String,
      enum: Object.values(GENDER),
    },
    bloodGroup: {
      type: String,
      enum: BLOOD_GROUPS,
    },
    address: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'admitted'],
      default: 'active',
    },
    diagnosis: {
      type: String,
      trim: true,
    },
    department: {
      type: String,
      trim: true,
    },
    emergencyContact: {
      type: String,
      trim: true,
    },
    allergies: {
      type: String,
      trim: true,
    },
    medicalConditions: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    otp: {
      type: String,
    },
    otpExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

patientSchema.index({ patientId: 1 });
patientSchema.index({ mobile: 1 });
patientSchema.index({ email: 1 });
patientSchema.index({ fullName: 'text', patientId: 'text' });

const Patient = mongoose.model('Patient', patientSchema);
export default Patient;
