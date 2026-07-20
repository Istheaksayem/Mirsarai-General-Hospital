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

const featureCardSchema = new mongoose.Schema({
  icon: { type: String, required: true },
  title: { type: localizedStringSchema, required: true },
  description: { type: localizedStringSchema, required: true }
}, { _id: false });

const appointmentPageSchema = new mongoose.Schema(
  {
    hero: {
      title: { type: localizedStringSchema, required: true },
      subtitle: { type: localizedStringSchema, required: true },
      description: { type: localizedStringSchema, required: true },
      image: { type: String, required: true }
    },
    features: { type: [featureCardSchema], default: [] },
    whyChooseUs: {
      title: { type: localizedStringSchema, required: true },
      items: { type: [localizedStringSchema], default: [] }
    },
    emergencyBanner: {
      title: { type: localizedStringSchema, required: true },
      description: { type: localizedStringSchema, required: true },
      buttonText: { type: localizedStringSchema, required: true },
      phone: { type: String, required: true }
    },
    contactCard: {
      title: { type: localizedStringSchema, required: true },
      description: { type: localizedStringSchema, required: true },
      phone: { type: String, required: true }
    },
    formSection: {
      title: { type: localizedStringSchema, required: true },
      description: { type: localizedStringSchema, required: true }
    },
    disclaimer: { type: localizedStringSchema, required: true },
    sections: {
      hero: { type: sectionConfigSchema, default: () => ({ isVisible: true, order: 1 }) },
      features: { type: sectionConfigSchema, default: () => ({ isVisible: true, order: 2 }) },
      sidebar: { type: sectionConfigSchema, default: () => ({ isVisible: true, order: 3 }) },
      form: { type: sectionConfigSchema, default: () => ({ isVisible: true, order: 4 }) }
    },
    seo: {
      type: seoSchema,
      default: () => ({
        metaTitle: { en: 'Book an Appointment | Mirsarai General Hospital', bn: 'অ্যাপয়েন্টমেন্ট বুক করুন | মীরসরাই জেনারেল হাসপাতাল' },
        metaDescription: { en: 'Schedule an appointment with our specialist doctors at Mirsarai General Hospital. Fast, easy, and secure online booking.', bn: 'মীরসরাই জেনারেল হাসপাতালে আমাদের বিশেষজ্ঞ ডাক্তারদের সাথে অ্যাপয়েন্টমেন্ট বুক করুন। দ্রুত, সহজ এবং নিরাপদ অনলাইন বুকিং।' },
        keywords: { en: 'appointment, book appointment, doctor appointment, mirsarai hospital', bn: 'অ্যাপয়েন্টমেন্ট, অ্যাপয়েন্টমেন্ট বুক, ডাক্তার অ্যাপয়েন্টমেন্ট, মীরসরাই হাসপাতাল' },
        ogImage: '/hospital-banner.jpg'
      })
    },
    createdBy: { type: String },
    updatedBy: { type: String }
  },
  {
    timestamps: true,
    collection: 'appointment_pages'
  }
);

const AppointmentPage = mongoose.model('AppointmentPage', appointmentPageSchema);

export default AppointmentPage;
