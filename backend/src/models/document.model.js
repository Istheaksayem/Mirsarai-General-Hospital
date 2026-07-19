import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: [true, 'Patient reference is required'],
    },
    documentType: {
      type: String,
      enum: ['prescription', 'diagnostic_report', 'admission_form', 'discharge_summary', 'certificate', 'bill_receipt', 'other'],
      required: [true, 'Document type is required'],
    },
    title: {
      type: String,
      required: [true, 'Document title is required'],
      trim: true,
    },
    department: {
      type: String,
      trim: true,
    },
    fileUrl: {
      type: String,
      required: [true, 'File URL is required'],
    },
    uploadedBy: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      role: { type: String },
    },
    testName: { type: String, trim: true },
    reportType: { type: String, enum: ['blood', 'imaging', 'pathology', 'microbiology'] },
    requestingDoctor: { type: String, trim: true },
    requestingDoctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
    notes: {
      type: String,
      trim: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

documentSchema.index({ patientId: 1, createdAt: -1 });
documentSchema.index({ documentType: 1 });
documentSchema.index({ status: 1, documentType: 1 });

const Document = mongoose.model('Document', documentSchema);
export default Document;
