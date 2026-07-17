import mongoose from 'mongoose';

const localizedStringSchema = new mongoose.Schema({
  en: { type: String, required: true },
  bn: { type: String, required: true }
}, { _id: false });

const benefitSchema = new mongoose.Schema({
  icon: { type: String, required: true },
  title: { type: localizedStringSchema, required: true },
  description: { type: localizedStringSchema, required: true }
}, { _id: false });

const positionSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  title: { type: localizedStringSchema, required: true },
  department: { type: localizedStringSchema, required: true },
  type: { type: localizedStringSchema, required: true },
  experience: { type: localizedStringSchema, required: true },
  description: { type: localizedStringSchema, required: true }
}, { _id: false });

const stepSchema = new mongoose.Schema({
  step: { type: Number, required: true },
  title: { type: localizedStringSchema, required: true },
  description: { type: localizedStringSchema, required: true }
}, { _id: false });

const seoSchema = new mongoose.Schema({
  metaTitle: { type: localizedStringSchema, required: true },
  metaDescription: { type: localizedStringSchema, required: true },
  keywords: { type: localizedStringSchema, required: true },
  ogImage: { type: String, default: '' }
}, { _id: false });

const sectionConfigSchema = new mongoose.Schema({
  isVisible: { type: Boolean, default: true },
  order: { type: Number, required: true }
}, { _id: false });

const careerSchema = new mongoose.Schema(
  {
    hero: {
      title: { type: localizedStringSchema, required: true },
      subtitle: { type: localizedStringSchema, required: true },
      description: { type: localizedStringSchema, required: true },
      image: { type: String, required: true }
    },
    whyJoinUs: {
      title: { type: localizedStringSchema, required: true },
      benefits: { type: [benefitSchema], default: [] }
    },
    openPositions: { type: [positionSchema], default: [] },
    applicationProcess: {
      title: { type: localizedStringSchema, required: true },
      steps: { type: [stepSchema], default: [] }
    },
    contact: {
      title: { type: localizedStringSchema, required: true },
      description: { type: localizedStringSchema, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true }
    },
    sections: {
      hero: { type: sectionConfigSchema, default: () => ({ isVisible: true, order: 1 }) },
      whyJoinUs: { type: sectionConfigSchema, default: () => ({ isVisible: true, order: 2 }) },
      openPositions: { type: sectionConfigSchema, default: () => ({ isVisible: true, order: 3 }) },
      applicationProcess: { type: sectionConfigSchema, default: () => ({ isVisible: true, order: 4 }) },
      contact: { type: sectionConfigSchema, default: () => ({ isVisible: true, order: 5 }) }
    },
    seo: {
      type: seoSchema,
      default: () => ({
        metaTitle: { en: "Join Our Team | Mirsarai General Hospital", bn: "আমাদের দলে যোগ দিন | মীরসরাই জেনারেল হাসপাতাল" },
        metaDescription: { en: "Build your career in healthcare excellence at Mirsarai General Hospital.", bn: "মীরসরাই জেনারেল হাসপাতালে স্বাস্থ্যসেবা উৎকর্ষে আপনার ক্যারিয়ার গড়ে তুলুন।" },
        keywords: { en: "career, jobs, recruitment, healthcare jobs, mirsarai", bn: "ক্যারিয়ার, চাকরি, নিয়োগ, স্বাস্থ্যসেবা চাকরি, মীরসরাই" },
        ogImage: "/about-us.jpg"
      })
    },
    createdBy: { type: String },
    updatedBy: { type: String }
  },
  {
    timestamps: true,
    collection: 'careers'
  }
);

const Career = mongoose.model('Career', careerSchema);

export default Career;
