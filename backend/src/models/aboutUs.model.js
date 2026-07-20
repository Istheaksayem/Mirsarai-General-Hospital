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

const featureItemSchema = new mongoose.Schema({
  title: { type: localizedStringSchema, required: true },
  description: { type: localizedStringSchema, required: true },
  color: { type: String, default: 'from-blue-500 via-primary to-blue-900' }
}, { _id: false });

const featuresSectionSchema = new mongoose.Schema({
  badge: { type: localizedStringSchema, default: { en: 'Why Choose Us', bn: 'কেন আমাদের বেছে নেবেন' } },
  heading: { type: localizedStringSchema, default: { en: 'Excellence in Every Aspect', bn: 'প্রতিটি দিক থেকে উৎকর্ষ' } },
  description: {
    type: localizedStringSchema,
    default: {
      en: 'We combine expertise, compassion, and modern technology to deliver exceptional healthcare.',
      bn: 'আমরা ব্যতিক্রমী স্বাস্থ্যসেবা প্রদানের জন্য দক্ষতা, সহানুভূতি এবং আধুনিক প্রযুক্তির সমন্বয় করি।'
    }
  },
  items: { type: [featureItemSchema], default: [] }
}, { _id: false });

const aboutUsSchema = new mongoose.Schema(
  {
    title: { type: localizedStringSchema, required: true },
    subtitle: { type: localizedStringSchema, required: true },
    storyHeading: {
      type: localizedStringSchema,
      default: { en: 'Dedicated to Better Healthcare for All', bn: 'নিবেদিত উন্নত স্বাস্থ্যসেবায় সকলের জন্য' }
    },
    description: { type: localizedStringSchema, required: true },
    content: { type: [localizedStringSchema], default: [] },
    statistics: { type: [statSchema], default: [] },
    image: { type: String, required: true },
    features: { type: [localizedStringSchema], default: [] },
    featuresSection: { type: featuresSectionSchema, default: () => ({
      badge: { en: 'Why Choose Us', bn: 'কেন আমাদের বেছে নেবেন' },
      heading: { en: 'Excellence in Every Aspect', bn: 'প্রতিটি দিক থেকে উৎকর্ষ' },
      description: {
        en: 'We combine expertise, compassion, and modern technology to deliver exceptional healthcare.',
        bn: 'আমরা ব্যতিক্রমী স্বাস্থ্যসেবা প্রদানের জন্য দক্ষতা, সহানুভূতি এবং আধুনিক প্রযুক্তির সমন্বয় করি।'
      },
      items: [
        {
          title: { en: 'Expert Medical Team', bn: 'বিশেষজ্ঞ চিকিৎসা দল' },
          description: { en: 'Board-certified doctors and healthcare professionals dedicated to your well-being.', bn: 'আপনার সুস্বাস্থ্যের জন্য নিবেদিত বোর্ড-সার্টিফাইড ডাক্তার এবং স্বাস্থ্যসেবা পেশাদার।' },
          color: 'from-blue-500 via-primary to-blue-900'
        },
        {
          title: { en: 'Patient Safety First', bn: 'রোগীর নিরাপত্তা সর্বপ্রথম' },
          description: { en: 'Highest standards of safety protocols and hygiene in all our facilities.', bn: 'আমাদের সকল সুবিধায় সর্বোচ্চ মানের সুরক্ষা প্রোটোকল এবং স্বাস্থ্যবিধি।' },
          color: 'from-secondary via-green-600 to-green-700'
        },
        {
          title: { en: 'Compassionate Care', bn: 'সহানুভূতিশীল সেবা' },
          description: { en: 'Every patient receives empathy, respect, and personalized attention.', bn: 'প্রতিটি রোগী সহানুভূতি, সম্মান এবং ব্যক্তিগত মনোযোগ পায়।' },
          color: 'from-red-500 via-pink-600 to-pink-700'
        }
      ]
    }) },
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
