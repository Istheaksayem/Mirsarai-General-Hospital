import mongoose from 'mongoose';

const labReportSchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      required: true,
      trim: true,
    },
    testName: {
      type: String,
      required: true,
      trim: true,
    },
    reportType: {
      type: String,
      enum: ['blood', 'imaging', 'pathology', 'microbiology'],
      required: true,
    },
    requestingDoctor: {
      type: String,
      required: true,
      trim: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'completed',
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export const LabReport = mongoose.model('LabReport', labReportSchema);
