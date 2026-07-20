import mongoose from 'mongoose';

const weeklySlotSchema = new mongoose.Schema({
  dayOfWeek: { type: Number, enum: [0, 1, 2, 3, 4, 5, 6], required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  breakStart: { type: String },
  breakEnd: { type: String },
  slotDuration: { type: Number, default: 15 },
  maxPatients: { type: Number, default: 1 },
  type: { type: String, enum: ['online', 'offline', 'both'], default: 'offline' },
  isActive: { type: Boolean, default: true },
});

const exceptionSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  type: { type: String, enum: ['holiday', 'vacation', 'blocked', 'custom'], required: true },
  reason: { type: String },
  isFullDay: { type: Boolean, default: true },
  slots: [{
    startTime: { type: String },
    endTime: { type: String },
  }],
});

const doctorScheduleSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  weeklySlots: [weeklySlotSchema],
  exceptions: [exceptionSchema],
  defaultSlotDuration: { type: Number, default: 15 },
}, { timestamps: true });

doctorScheduleSchema.index({ doctorId: 1 });

export default mongoose.model('DoctorSchedule', doctorScheduleSchema);
