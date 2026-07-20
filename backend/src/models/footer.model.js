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

const socialLinkSchema = new mongoose.Schema({
  platform: { type: String, required: true },
  icon: { type: String, required: true },
  url: { type: String, required: true },
  hoverColor: { type: String, required: true }
}, { _id: false });

const footerSchema = new mongoose.Schema(
  {
    brand: {
      logo: { type: String, default: '/genaral_Hospital_logo.jpeg' },
      description: { type: localizedStringSchema, required: true },
      socialLinks: [socialLinkSchema]
    },
    exploreLinks: {
      title: { type: localizedStringSchema, required: true },
      links: [{
        label: { type: localizedStringSchema, required: true },
        href: { type: String, required: true }
      }]
    },
    departments: {
      title: { type: localizedStringSchema, required: true },
      items: [{
        name: { type: localizedStringSchema, required: true },
        href: { type: String, default: '/departments' }
      }]
    },
    contactInfo: {
      title: { type: localizedStringSchema, required: true },
      address: {
        icon: { type: String, default: 'FaMapMarkerAlt' },
        hospitalName: { type: localizedStringSchema, required: true },
        location: { type: localizedStringSchema, required: true }
      },
      phone: {
        icon: { type: String, default: 'FaPhoneAlt' },
        number: { type: String, required: true }
      },
      email: {
        icon: { type: String, default: 'FaEnvelope' },
        address: { type: String, required: true }
      }
    },
    emergencyCard: {
      icon: { type: String, default: 'FaHeartbeat' },
      label: { type: localizedStringSchema, required: true },
      phoneNumber: { type: String, required: true },
      gradient: { type: String, default: 'from-[#76BC21] to-green-600' },
      badgeGradient: { type: String, default: 'from-white/10 to-white/5' },
      blobColor: { type: String, default: 'bg-[#76BC21]/20' },
      iconGradient: { type: String, default: 'from-[#76BC21] to-green-600' }
    },
    bottomBar: {
      hospitalName: { type: localizedStringSchema, required: true },
      rightsText: { type: localizedStringSchema, required: true },
      privacyPolicy: {
        label: { type: localizedStringSchema, required: true },
        href: { type: String, default: '/privacy' }
      },
      termsOfService: {
        label: { type: localizedStringSchema, required: true },
        href: { type: String, default: '/terms' }
      }
    },
    sections: {
      brand: { type: sectionConfigSchema, default: () => ({ isVisible: true, order: 1 }) },
      exploreLinks: { type: sectionConfigSchema, default: () => ({ isVisible: true, order: 2 }) },
      departments: { type: sectionConfigSchema, default: () => ({ isVisible: true, order: 3 }) },
      contactInfo: { type: sectionConfigSchema, default: () => ({ isVisible: true, order: 4 }) },
      emergencyCard: { type: sectionConfigSchema, default: () => ({ isVisible: true, order: 5 }) },
      bottomBar: { type: sectionConfigSchema, default: () => ({ isVisible: true, order: 6 }) }
    },
    seo: {
      type: seoSchema,
      default: () => ({
        metaTitle: { en: 'Mirsarai General Hospital', bn: 'মীরসরাই জেনারেল হাসপাতাল' },
        metaDescription: { en: 'Mirsarai General Hospital - Footer', bn: 'মীরসরাই জেনারেল হাসপাতাল - ফুটার' },
        keywords: { en: 'footer, hospital, mirsarai', bn: 'ফুটার, হাসপাতাল, মীরসরাই' },
        ogImage: '/genaral_Hospital_logo.jpeg'
      })
    },
    createdBy: { type: String },
    updatedBy: { type: String }
  },
  {
    timestamps: true,
    collection: 'footer'
  }
);

const Footer = mongoose.model('Footer', footerSchema);

export default Footer;
