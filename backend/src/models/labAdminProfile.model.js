import mongoose from 'mongoose';

const labAdminProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    labAdminCode: {
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
    qualification: { type: String, default: '' },
    experience:    { type: Number, default: 0 },
    isDeleted:   { type: Boolean, default: false },
    deletedAt:   { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('LabAdminProfile', labAdminProfileSchema);
