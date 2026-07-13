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
  accent: { type: String, default: '#f59e0b' },
  items: { type: [localizedStringSchema], default: [] }
}, { _id: false });

const statSchema = new mongoose.Schema({
  value: { type: String, required: true },
  label: { type: localizedStringSchema, required: true }
}, { _id: false });

const guidelineSchema = new mongoose.Schema({
  en: { type: String, default: '' },
  bn: { type: String, default: '' }
}, { _id: false });

const vaccinationEntrySchema = new mongoose.Schema({
  age: { type: localizedStringSchema, required: true },
  vaccines: { type: [String], default: [] }
}, { _id: false });

const seoSchema = new mongoose.Schema({
  metaTitle: { type: localizedStringSchema, default: () => ({ en: '', bn: '' }) },
  metaDescription: { type: localizedStringSchema, default: () => ({ en: '', bn: '' }) }
}, { _id: false });

const nicuBabyCareSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      default: 'nicu',
      unique: true
    },
    slug: {
      type: String,
      default: 'nicu',
      unique: true,
      lowercase: true
    },
    status: {
      type: String,
      enum: ['published', 'draft'],
      default: 'published'
    },
    title: { type: localizedStringSchema, required: true },
    subtitle: { type: localizedStringSchema, default: () => ({ en: '', bn: '' }) },
    heroDescription: { type: localizedStringSchema, default: () => ({ en: '', bn: '' }) },
    backgroundImage: { type: String, default: '' },
    description: { type: localizedStringSchema, required: true },
    features: { type: [featureSchema], default: [] },
    services: { type: [serviceCategorySchema], default: [] },
    equipment: { type: [localizedStringSchema], default: [] },
    guidelines: { type: [guidelineSchema], default: [] },
    workingHours: {
      type: new mongoose.Schema({
        weekdays: { type: String, default: '' },
        emergency: { type: localizedStringSchema, default: () => ({ en: '', bn: '' }) }
      }, { _id: false }),
      default: () => ({})
    },
    vaccinationSchedule: { type: [vaccinationEntrySchema], default: [] },
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
    collection: 'nicu_baby_care'
  }
);

const NicuBabyCare = mongoose.model('NicuBabyCare', nicuBabyCareSchema);
export default NicuBabyCare;
