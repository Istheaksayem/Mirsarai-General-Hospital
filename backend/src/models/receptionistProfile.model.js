import mongoose from 'mongoose';

const receptionistProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    receptionistCode: {
      type: String,
      unique: true,
      required: true,
    },
    department:     { type: String, default: '' },
    designation:    { type: String, default: '' },
    branch:         { type: String, default: '' },
    employmentType: { type: String, enum: ['permanent', 'visiting', 'contract', 'resident', ''], default: '' },
    profilePhoto: { type: String, default: '' },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      default: 'other',
    },
    dateOfBirth: { type: Date },
    address:     { type: String, default: '' },
    emergencyContact: { type: String, default: '' },
    isDeleted:   { type: Boolean, default: false },
    deletedAt:   { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('ReceptionistProfile', receptionistProfileSchema);
