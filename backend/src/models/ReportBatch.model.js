import mongoose from 'mongoose';

const reportBatchSchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      required: [true, 'Patient ID is required'],
      trim: true,
    },
    patientName: {
      type: String,
      required: [true, 'Patient name is required'],
      trim: true,
    },
    mobileNumber: {
      type: String,
      required: [true, 'Mobile number is required'],
      trim: true,
    },
    branchCode: {
      type: String,
      default: '',
      trim: true,
    },
    testDate: {
      type: Date,
      required: [true, 'Test date is required'],
    },
    reportDate: {
      type: Date,
      required: [true, 'Report date is required'],
    },
    remarks: {
      type: String,
      default: '',
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator is required'],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

reportBatchSchema.index({ patientId: 1, mobileNumber: 1 });
reportBatchSchema.index({ mobileNumber: 1 });
reportBatchSchema.index({ isDeleted: 1, createdAt: -1 });
reportBatchSchema.index({ createdBy: 1 });

const ReportBatch = mongoose.model('ReportBatch', reportBatchSchema);
export default ReportBatch;
