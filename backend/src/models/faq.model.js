import mongoose from 'mongoose';

const localizedStringSchema = new mongoose.Schema({
  en: { type: String, required: true },
  bn: { type: String, required: true }
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

const categorySchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: localizedStringSchema, required: true },
  icon: { type: String, required: true }
}, { _id: false });

const faqItemSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  category: { type: String, required: true },
  question: { type: localizedStringSchema, required: true },
  answer: { type: localizedStringSchema, required: true }
}, { _id: false });

const contactInfoSchema = new mongoose.Schema({
  title: { type: localizedStringSchema, required: true },
  description: { type: localizedStringSchema, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true }
}, { _id: false });

const faqSchema = new mongoose.Schema(
  {
    hero: {
      title: { type: localizedStringSchema, required: true },
      subtitle: { type: localizedStringSchema, required: true },
      description: { type: localizedStringSchema, required: true },
      image: { type: String, required: true }
    },
    categories: { type: [categorySchema], default: [] },
    faqs: { type: [faqItemSchema], default: [] },
    contactInfo: { type: contactInfoSchema, required: true },
    sections: {
      hero: { type: sectionConfigSchema, default: () => ({ isVisible: true, order: 1 }) },
      faqs: { type: sectionConfigSchema, default: () => ({ isVisible: true, order: 2 }) },
      contact: { type: sectionConfigSchema, default: () => ({ isVisible: true, order: 3 }) }
    },
    seo: {
      type: seoSchema,
      default: () => ({
        metaTitle: { en: 'FAQ | Mirsarai General Hospital', bn: 'প্রায়শই জিজ্ঞাসিত প্রশ্ন | মীরসরাই জেনারেল হাসপাতাল' },
        metaDescription: { en: 'Find answers to commonly asked questions about our services, facilities, and procedures.', bn: 'আমাদের সেবা, সুবিধা এবং পদ্ধতি সম্পর্কে সাধারণ প্রশ্নের উত্তর খুঁজুন।' },
        keywords: { en: 'faq, frequently asked questions, hospital, mirsarai', bn: 'প্রায়শই জিজ্ঞাসিত প্রশ্ন, হাসপাতাল, মীরসরাই' },
        ogImage: '/hospital-banner.jpg'
      })
    },
    createdBy: { type: String },
    updatedBy: { type: String }
  },
  {
    timestamps: true,
    collection: 'faqs'
  }
);

const FAQ = mongoose.model('FAQ', faqSchema);

export default FAQ;
