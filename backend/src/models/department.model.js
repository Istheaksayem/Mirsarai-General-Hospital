import mongoose from 'mongoose';

const bilingualSchema = new mongoose.Schema(
  { en: { type: String, required: true }, bn: { type: String, default: '' } },
  { _id: false }
);

const serviceSchema = new mongoose.Schema(
  { en: { type: String, required: true }, bn: { type: String, default: '' } },
  { _id: false }
);

const departmentSchema = new mongoose.Schema(
  {
    name:             { type: bilingualSchema, required: true },
    slug:             { type: String, required: true, unique: true, lowercase: true, trim: true },
    icon:             { type: String, default: 'FaHospital' },
    image:            { type: String, default: '' },
    shortDescription: { type: bilingualSchema, required: true },
    description:      { type: bilingualSchema, required: true },
    services:         { type: [serviceSchema], default: [] },
    headDoctor:       { type: bilingualSchema },
    availableDoctors: { type: Number, default: 0 },
    available:        { type: Boolean, default: true },
    displayOrder:     { type: Number, default: 0 },
    isVisible:        { type: Boolean, default: true },
    seo: {
      metaTitle:       { type: bilingualSchema },
      metaDescription: { type: bilingualSchema },
      keywords:        { type: [String], default: [] },
    },
    createdBy: { type: String, default: null },
    updatedBy: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

departmentSchema.index({ slug: 1 });
departmentSchema.index({ isVisible: 1, displayOrder: 1 });

const Department = mongoose.model('Department', departmentSchema);
export default Department;
