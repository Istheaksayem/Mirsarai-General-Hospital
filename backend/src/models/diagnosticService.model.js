import mongoose from 'mongoose';

const localizedStringSchema = new mongoose.Schema({
  en: { type: String, required: true },
  bn: { type: String, default: '' }
}, { _id: false });

const featureSchema = new mongoose.Schema({
  title: { type: localizedStringSchema, required: true },
  description: { type: localizedStringSchema, required: true },
  icon: { type: String, default: '' }
}, { _id: false });

const serviceCategorySchema = new mongoose.Schema({
  category: { type: localizedStringSchema, required: true },
  icon: { type: String, default: '' },
  accent: { type: String, default: '#1E2B7A' },
  tests: { type: [localizedStringSchema], default: [] }
}, { _id: false });

const workingHoursSchema = new mongoose.Schema({
  weekdays: { type: String, default: '' },
  weekends: { type: String, default: '' },
  emergency: { type: localizedStringSchema, default: () => ({ en: '', bn: '' }) }
}, { _id: false });

const statSchema = new mongoose.Schema({
  value: { type: String, required: true },
  label: { type: localizedStringSchema, required: true }
}, { _id: false });

const seoSchema = new mongoose.Schema({
  metaTitle: { type: localizedStringSchema, default: () => ({ en: '', bn: '' }) },
  metaDescription: { type: localizedStringSchema, default: () => ({ en: '', bn: '' }) }
}, { _id: false });

const diagnosticServiceSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      default: 'diagnostic-services',
      unique: true
    },
    slug: {
      type: String,
      default: 'diagnostic-services',
      unique: true,
      lowercase: true
    },
    status: {
      type: String,
      enum: ['published', 'draft'],
      default: 'published'
    },
    title: { type: localizedStringSchema, required: true },
    subtitle: { type: localizedStringSchema, required: true },
    heroDescription: { type: localizedStringSchema, required: true },
    backgroundImage: { type: String, default: '' },
    description: { type: localizedStringSchema, required: true },
    features: { type: [featureSchema], default: [] },
    services: { type: [serviceCategorySchema], default: [] },
    workingHours: { type: workingHoursSchema, default: () => ({}) },
    statistics: { type: [statSchema], default: [] },
    seo: {
      type: seoSchema,
      default: () => ({
        metaTitle: { en: '', bn: '' },
        metaDescription: { en: '', bn: '' }
      })
    },
    createdBy: { type: String },
    updatedBy: { type: String }
  },
  {
    timestamps: true,
    collection: 'diagnostic_services'
  }
);

const DiagnosticService = mongoose.model('DiagnosticService', diagnosticServiceSchema);
export default DiagnosticService;
