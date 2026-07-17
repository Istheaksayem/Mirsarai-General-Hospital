import mongoose from 'mongoose';

const localizedStringSchema = new mongoose.Schema({
  en: { type: String, required: true },
  bn: { type: String, required: true }
}, { _id: false });

const valueSchema = new mongoose.Schema({
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

const missionVisionSchema = new mongoose.Schema(
  {
    title: { type: localizedStringSchema, required: true },
    mission: {
      title: { type: localizedStringSchema, required: true },
      description: { type: localizedStringSchema, required: true }
    },
    vision: {
      title: { type: localizedStringSchema, required: true },
      description: { type: localizedStringSchema, required: true }
    },
    coreValues: { type: [valueSchema], default: [] },
    image: { type: String, required: true },
    sections: {
      hero: { type: sectionConfigSchema, default: () => ({ isVisible: true, order: 1 }) },
      missionVision: { type: sectionConfigSchema, default: () => ({ isVisible: true, order: 2 }) },
      coreValues: { type: sectionConfigSchema, default: () => ({ isVisible: true, order: 3 }) },
      commitment: { type: sectionConfigSchema, default: () => ({ isVisible: true, order: 4 }) },
      whyItMatters: { type: sectionConfigSchema, default: () => ({ isVisible: true, order: 5 }) },
      cta: { type: sectionConfigSchema, default: () => ({ isVisible: true, order: 6 }) }
    },
    seo: {
      type: seoSchema,
      default: () => ({
        metaTitle: { en: "Mission & Vision | Mirsarai General Hospital", bn: "লক্ষ্য ও দর্শন | মীরসরাই জেনারেল হাসপাতাল" },
        metaDescription: { en: "Read about the mission, vision, and core values of Mirsarai General Hospital.", bn: "মীরসরাই জেনারেল হাসপাতালের লক্ষ্য, দর্শন এবং মূল মূল্যবোধ সম্পর্কে জানুন।" },
        keywords: { en: "mission, vision, values, hospital, mirsarai", bn: "লক্ষ্য, দর্শন, মূল্যবোধ, হাসপাতাল, মীরসরাই" },
        ogImage: "/about-us.jpg"
      })
    },
    createdBy: { type: String },
    updatedBy: { type: String }
  },
  {
    timestamps: true,
    collection: 'mission_visions'
  }
);

const MissionVision = mongoose.model('MissionVision', missionVisionSchema);

export default MissionVision;
