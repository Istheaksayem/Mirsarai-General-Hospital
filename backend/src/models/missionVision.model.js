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

const whyItMattersItemSchema = new mongoose.Schema({
  title: { type: localizedStringSchema, required: true },
  description: { type: localizedStringSchema, required: true },
  color: { type: String, default: 'from-red-500 to-pink-600' }
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
    commitmentHeading: { type: localizedStringSchema, default: { en: 'Our Commitment to You', bn: 'আপনার প্রতি আমাদের অঙ্গীকার' } },
    commitmentDescription: { type: localizedStringSchema, default: { en: 'Every patient who walks through our doors deserves the very best care — and that is what we promise.', bn: 'আমাদের দ্বারে আসা প্রতিটি রোগী সর্বোত্তম সেবা পাওয়ার যোগ্য — এবং আমরা ঠিক এই প্রতিশ্রুতিই দিই।' } },
    whyItMattersHeading: { type: localizedStringSchema, default: { en: 'Why This Matters', bn: 'এটি কেন গুরুত্বপূর্ণ' } },
    whyItMattersDescription: { type: localizedStringSchema, default: { en: 'Our mission and vision aren\'t just words — they\'re the foundation of every action we take.', bn: 'আমাদের লক্ষ্য এবং দর্শন কেবল শব্দ নয় — এগুলো আমাদের প্রতিটি পদক্ষেপের ভিত্তি।' } },
    whyItMattersItems: { type: [whyItMattersItemSchema], default: () => [
      { title: { en: 'Patient-Centered Care', bn: 'রোগী-কেন্দ্রিক সেবা' }, description: { en: 'Your health, comfort, and satisfaction are at the heart of everything we do.', bn: 'আপনার স্বাস্থ্য, আরাম এবং সন্তুষ্টি আমাদের প্রতিটি কাজের কেন্দ্রবিন্দুতে রয়েছে।' }, color: 'from-red-500 to-pink-600' },
      { title: { en: 'Continuous Innovation', bn: 'ক্রমাগত উদ্ভাবন' }, description: { en: 'We constantly evolve with the latest medical technology and treatment methods.', bn: 'আমরা প্রতিনিয়ত সর্বাধুনিক চিকিৎসা প্রযুক্তি এবং চিকিৎসা পদ্ধতির সাথে নিজেদের উন্নত করছি।' }, color: 'from-purple-500 to-purple-700' },
      { title: { en: 'Trust & Integrity', bn: 'বিশ্বাস ও সততা' }, description: { en: 'We maintain the highest ethical standards in all our medical practices.', bn: 'আমরা আমাদের সমস্ত চিকিৎসা অনুশীলনে সর্বোচ্চ নৈতিক মান বজায় রাখি।' }, color: 'from-blue-600 to-primary' }
    ] },
    ctaHeading: { type: localizedStringSchema, default: { en: 'Experience Our Care Today', bn: 'আজই আমাদের সেবার অভিজ্ঞতা নিন' } },
    ctaDescription: { type: localizedStringSchema, default: { en: 'Our mission is your health. Come and experience compassionate, world-class healthcare.', bn: 'আমাদের লক্ষ্য আপনার স্বাস্থ্য। আসুন এবং সহানুভূতিশীল, বিশ্বমানের স্বাস্থ্যসেবার অভিজ্ঞতা নিন।' } },
    ctaPrimaryButtonText: { type: localizedStringSchema, default: { en: 'Book an Appointment', bn: 'অ্যাপয়েন্টমেন্ট বুক করুন' } },
    ctaSecondaryButtonText: { type: localizedStringSchema, default: { en: '← Back to About Us', bn: '← আমাদের সম্পর্কে ফিরে যান' } },
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
