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

const contactSchema = new mongoose.Schema({
  icon: { type: String, required: true },
  title: { type: localizedStringSchema, required: true },
  number: { type: String, required: true },
  available: { type: localizedStringSchema, required: true }
}, { _id: false });

const stepSchema = new mongoose.Schema({
  en: { type: String, required: true },
  bn: { type: String, required: true }
}, { _id: false });

const firstAidItemSchema = new mongoose.Schema({
  icon: { type: String, required: true },
  title: { type: localizedStringSchema, required: true },
  steps: { type: [stepSchema], default: [] }
}, { _id: false });

const tipSchema = new mongoose.Schema({
  icon: { type: String, required: true },
  title: { type: localizedStringSchema, required: true },
  description: { type: localizedStringSchema, required: true }
}, { _id: false });

const emergencyInfoSchema = new mongoose.Schema(
  {
    hero: {
      title: { type: localizedStringSchema, required: true },
      subtitle: { type: localizedStringSchema, required: true },
      description: { type: localizedStringSchema, required: true },
      image: { type: String, required: true }
    },
    emergencyContacts: {
      title: { type: localizedStringSchema, required: true },
      contacts: { type: [contactSchema], default: [] }
    },
    firstAid: {
      title: { type: localizedStringSchema, required: true },
      items: { type: [firstAidItemSchema], default: [] }
    },
    whenToCallEmergency: {
      title: { type: localizedStringSchema, required: true },
      description: { type: localizedStringSchema, required: true },
      situations: { type: [stepSchema], default: [] }
    },
    emergencyPreparedness: {
      title: { type: localizedStringSchema, required: true },
      tips: { type: [tipSchema], default: [] }
    },
    sections: {
      hero: { type: sectionConfigSchema, default: () => ({ isVisible: true, order: 1 }) },
      contacts: { type: sectionConfigSchema, default: () => ({ isVisible: true, order: 2 }) },
      firstAid: { type: sectionConfigSchema, default: () => ({ isVisible: true, order: 3 }) },
      situations: { type: sectionConfigSchema, default: () => ({ isVisible: true, order: 4 }) },
      preparedness: { type: sectionConfigSchema, default: () => ({ isVisible: true, order: 5 }) }
    },
    seo: {
      type: seoSchema,
      default: () => ({
        metaTitle: { en: 'Emergency Information | Mirsarai General Hospital', bn: 'জরুরি তথ্য | মীরসরাই জেনারেল হাসপাতাল' },
        metaDescription: { en: 'Quick access to emergency contacts, first aid guidance, and critical health information.', bn: 'জরুরি যোগাযোগ, প্রাথমিক চিকিৎসা নির্দেশিকা এবং গুরুত্বপূর্ণ স্বাস্থ্য তথ্যের দ্রুত প্রবেশাধিকার।' },
        keywords: { en: 'emergency, first aid, ambulance, hospital emergency, mirsarai', bn: 'জরুরি, প্রাথমিক চিকিৎসা, অ্যাম্বুলেন্স, হাসপাতাল জরুরি, মীরসরাই' },
        ogImage: '/hospital-banner.jpg'
      })
    },
    createdBy: { type: String },
    updatedBy: { type: String }
  },
  {
    timestamps: true,
    collection: 'emergency_infos'
  }
);

const EmergencyInfo = mongoose.model('EmergencyInfo', emergencyInfoSchema);

export default EmergencyInfo;
