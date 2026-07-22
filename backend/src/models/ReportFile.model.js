import mongoose from 'mongoose';

const reportFileSchema = new mongoose.Schema(
  {
    reportBatch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ReportBatch',
      required: [true, 'Report batch reference is required'],
    },
    fileName: {
      type: String,
      required: [true, 'File display name is required'],
      trim: true,
    },
    originalFileName: {
      type: String,
      trim: true,
    },
    storedPath: {
      type: String,
      required: [true, 'Storage path is required'],
    },
    fileSize: {
      type: Number,
    },
    mimeType: {
      type: String,
      default: 'application/pdf',
    },
    isCombined: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

reportFileSchema.index({ reportBatch: 1, isDeleted: 1 });
reportFileSchema.index({ reportBatch: 1, fileName: 1 });

const ReportFile = mongoose.model('ReportFile', reportFileSchema);
export default ReportFile;
