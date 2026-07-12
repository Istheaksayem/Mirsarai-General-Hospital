import mongoose from 'mongoose';

const bilingualSchema = new mongoose.Schema(
  { en: { type: String, required: true }, bn: { type: String, default: '' } },
  { _id: false }
);

const specializationSchema = new mongoose.Schema(
  {
    name:           { type: bilingualSchema, required: true },
    slug:           { type: String, required: true, unique: true, lowercase: true, trim: true },
    departmentSlug: { type: String, required: true },
    description:    { type: bilingualSchema },
    isVisible:      { type: Boolean, default: true },
    displayOrder:   { type: Number, default: 0 },
    seo: {
      metaTitle:       { type: bilingualSchema },
      metaDescription: { type: bilingualSchema },
    },
    createdBy: { type: String, default: null },
    updatedBy: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

specializationSchema.index({ slug: 1 });
specializationSchema.index({ departmentSlug: 1 });
specializationSchema.index({ isVisible: 1, displayOrder: 1 });

const Specialization = mongoose.model('Specialization', specializationSchema);
export default Specialization;
