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

const qualificationSchema = new mongoose.Schema({
  title: { type: localizedStringSchema, required: true },
  institution: { type: localizedStringSchema, required: true },
  year: { type: String, default: '' }
}, { _id: false });

const experienceSchema = new mongoose.Schema({
  title: { type: localizedStringSchema, required: true },
  institution: { type: localizedStringSchema, required: true },
  period: { type: String, default: '' },
  description: { type: localizedStringSchema, default: () => ({ en: '', bn: '' }) }
}, { _id: false });

const socialLinkSchema = new mongoose.Schema({
  platform: { type: String, required: true },
  url: { type: String, required: true }
}, { _id: false });

const teamMemberSchema = new mongoose.Schema({
  name: { type: localizedStringSchema, required: true },
  designation: { type: localizedStringSchema, required: true },
  department: { type: localizedStringSchema, required: true },
  bio: { type: localizedStringSchema, required: true },
  image: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  order: { type: Number, default: 0 },
  slug: { type: String, default: '' },
  qualifications: { type: [qualificationSchema], default: [] },
  experience: { type: [experienceSchema], default: [] },
  specialties: { type: [localizedStringSchema], default: [] },
  socialLinks: { type: [socialLinkSchema], default: [] }
}, { _id: false });

const ourTeamSchema = new mongoose.Schema(
  {
    hero: {
      title: { type: localizedStringSchema, required: true },
      subtitle: { type: localizedStringSchema, required: true },
      description: { type: localizedStringSchema, required: true },
      image: { type: String, default: '' }
    },
    sectionTitle: { type: localizedStringSchema, required: true },
    sectionDescription: { type: localizedStringSchema, required: true },
    members: { type: [teamMemberSchema], default: [] },
    sections: {
      hero: { type: sectionConfigSchema, default: () => ({ isVisible: true, order: 1 }) },
      members: { type: sectionConfigSchema, default: () => ({ isVisible: true, order: 2 }) },
      cta: { type: sectionConfigSchema, default: () => ({ isVisible: true, order: 3 }) }
    },
    seo: {
      type: seoSchema,
      default: () => ({
        metaTitle: { en: 'Our Team | Mirsarai General Hospital', bn: 'আমাদের টিম | মীরসরাই জেনারেল হাসপাতাল' },
        metaDescription: { en: 'Meet the dedicated team of doctors, nurses, and staff at Mirsarai General Hospital.', bn: 'মীরসরাই জেনারেল হাসপাতালের নিবেদিত ডাক্তার, নার্স এবং কর্মীদের সাথে পরিচিত হন।' },
        keywords: { en: 'team, doctors, staff, nurses, hospital, mirsarai', bn: 'টিম, ডাক্তার, কর্মী, নার্স, হাসপাতাল, মীরসরাই' },
        ogImage: '/about-us.jpg'
      })
    },
    createdBy: { type: String },
    updatedBy: { type: String }
  },
  {
    timestamps: true,
    collection: 'our_teams'
  }
);

const OurTeam = mongoose.model('OurTeam', ourTeamSchema);

export default OurTeam;
