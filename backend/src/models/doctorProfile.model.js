import mongoose from 'mongoose';

const timeSlotSchema = new mongoose.Schema(
  {
    day:       { type: String },
    startTime: { type: String },
    endTime:   { type: String },
  },
  { _id: false }
);

const doctorProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    doctorCode: {
      type: String,
      unique: true,
      required: true,
    },
    department:     { type: String, default: '' },
    designation:    { type: String, default: '' },
    branch:         { type: String, default: '' },
    employmentType: { type: String, enum: ['permanent', 'visiting', 'contract', 'resident', ''], default: '' },
    specialization: { type: String, default: '' },
    qualification:  { type: String, default: '' },
    experience:     { type: Number, default: 0 },
    bmdcNumber:     { type: String, default: '' },
    consultationFee: { type: Number, default: 0 },
    availableDays:  { type: [String], default: [] },
    availableTimeSlots: { type: [timeSlotSchema], default: [] },
    profilePhoto: { type: String, default: '' },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      default: 'other',
    },
    dateOfBirth: { type: Date },
    address:     { type: String, default: '' },
    biography:   { type: String, default: '' },
    isDeleted:   { type: Boolean, default: false },
    deletedAt:   { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('DoctorProfile', doctorProfileSchema);
