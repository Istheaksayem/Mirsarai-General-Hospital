import mongoose from 'mongoose';

const localizedStringSchema = new mongoose.Schema({
  en: { type: String, required: true },
  bn: { type: String, required: true }
}, { _id: false });

const buttonSchema = new mongoose.Schema({
  en: { type: String, required: true },
  bn: { type: String, required: true },
  link: { type: String, required: true }
}, { _id: false });

const statSchema = new mongoose.Schema({
  number: { type: String, required: true },
  label: { type: localizedStringSchema, required: true },
  icon: { type: String, required: true },
  color: { type: String, required: true }
}, { _id: false });

const homepageSchema = new mongoose.Schema(
  {
    emergency: {
      phone: { type: String, required: true },
      badge: { type: localizedStringSchema, required: true },
      heading: { type: localizedStringSchema, required: true },
      subheading: { type: localizedStringSchema, required: true },
      description: { type: localizedStringSchema, required: true },
      quickInfo: { type: [localizedStringSchema], default: [] }
    },
    appointmentCTA: {
      badge: { type: localizedStringSchema, required: true },
      heading: { type: localizedStringSchema, required: true },
      description: { type: localizedStringSchema, required: true },
      primaryBtn: { type: buttonSchema, required: true },
      secondaryBtn: { type: buttonSchema, required: true },
      features: { type: [localizedStringSchema], default: [] }
    },
    statistics: {
      sectionBadge: { type: localizedStringSchema, required: true },
      heading: { type: localizedStringSchema, required: true },
      description: { type: localizedStringSchema, required: true },
      stats: { type: [statSchema], default: [] }
    },
    createdBy: { type: String },
    updatedBy: { type: String }
  },
  {
    timestamps: true,
    collection: 'homepages'
  }
);

const Homepage = mongoose.model('Homepage', homepageSchema);

export default Homepage;
