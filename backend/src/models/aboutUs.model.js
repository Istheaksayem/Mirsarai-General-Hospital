import mongoose from 'mongoose';

const localizedStringSchema = new mongoose.Schema({
  en: { type: String, required: true },
  bn: { type: String, required: true }
}, { _id: false });

const statSchema = new mongoose.Schema({
  title: { type: localizedStringSchema, required: true },
  value: { type: String, required: true }
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

const aboutUsSchema = new mongoose.Schema(
  {
    title: { type: localizedStringSchema, required: true },
    subtitle: { type: localizedStringSchema, required: true },
    description: { type: localizedStringSchema, required: true },
    content: { type: [localizedStringSchema], default: [] },
    statistics: { type: [statSchema], default: [] },
    image: { type: String, required: true },
    features: { type: [localizedStringSchema], default: [] },
    sections: {
      hero: { type: sectionConfigSchema, default: () => ({ isVisible: true, order: 1 }) },
      story: { type: sectionConfigSchema, default: () => ({ isVisible: true, order: 2 }) },
      features: { type: sectionConfigSchema, default: () => ({ isVisible: true, order: 3 }) },
      statistics: { type: sectionConfigSchema, default: () => ({ isVisible: true, order: 4 }) },
      cta: { type: sectionConfigSchema, default: () => ({ isVisible: true, order: 5 }) }
    },
    seo: {
      type: seoSchema,
      default: () => ({
        metaTitle: { en: "About Us | Mirsarai General Hospital", bn: "আমাদের সম্পর্কে | মীরসরাই জেনারেল হাসপাতাল" },
        metaDescription: { en: "Learn more about Mirsarai General Hospital and our medical services.", bn: "মীরসরাই জেনারেল হাসপাতাল এবং আমাদের চিকিৎসা সেবা সম্পর্কে বিস্তারিত জানুন।" },
        keywords: { en: "hospital, healthcare, about us, mirsarai", bn: "হাসপাতাল, স্বাস্থ্যসেবা, আমাদের সম্পর্কে, মীরসরাই" },
        ogImage: "/about-us.jpg"
      })
    },
    createdBy: { type: String },
    updatedBy: { type: String }
  },
  {
    timestamps: true,
    collection: 'about_us'
  }
);

const AboutUs = mongoose.model('AboutUs', aboutUsSchema);

export default AboutUs;
