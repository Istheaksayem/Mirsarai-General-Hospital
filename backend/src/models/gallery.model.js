import mongoose from 'mongoose';

const localizedStringSchema = new mongoose.Schema({
  en: { type: String, required: true },
  bn: { type: String, required: true }
}, { _id: false });

const galleryCategorySchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: localizedStringSchema, required: true },
  description: { type: localizedStringSchema, required: true }
}, { _id: false });

const galleryImageSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  category: { type: String, required: true },
  src: { type: String, required: true },
  title: { type: localizedStringSchema, required: true },
  description: { type: localizedStringSchema, required: true }
}, { _id: false });

const statItemSchema = new mongoose.Schema({
  number: { type: String, required: true },
  label: { type: localizedStringSchema, required: true }
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

const gallerySchema = new mongoose.Schema(
  {
    hero: {
      title: { type: localizedStringSchema, required: true },
      subtitle: { type: localizedStringSchema, required: true },
      description: { type: localizedStringSchema, required: true }
    },
    categories: { type: [galleryCategorySchema], default: [] },
    images: { type: [galleryImageSchema], default: [] },
    stats: {
      title: { type: localizedStringSchema, required: true },
      items: { type: [statItemSchema], default: [] }
    },
    sections: {
      hero: { type: sectionConfigSchema, default: () => ({ isVisible: true, order: 1 }) },
      stats: { type: sectionConfigSchema, default: () => ({ isVisible: true, order: 2 }) },
      categories: { type: sectionConfigSchema, default: () => ({ isVisible: true, order: 3 }) },
      images: { type: sectionConfigSchema, default: () => ({ isVisible: true, order: 4 }) }
    },
    seo: {
      type: seoSchema,
      default: () => ({
        metaTitle: { en: "Our Gallery | Mirsarai General Hospital", bn: "আমাদের গ্যালারি | মীরসরাই জেনারেল হাসপাতাল" },
        metaDescription: { en: "View photos of our state-of-the-art facilities and dedicated medical teams.", bn: "আমাদের অত্যাধুনিক সুযোগ-সুবিধা এবং নিবেদিত চিকিৎসা দলের ছবিগুলো দেখুন।" },
        keywords: { en: "gallery, photos, hospital, facility, mirsarai", bn: "গ্যালারি, ছবি, হাসপাতাল, সুবিধা, মীরসরাই" },
        ogImage: "/about-us.jpg"
      })
    },
    createdBy: { type: String },
    updatedBy: { type: String }
  },
  {
    timestamps: true,
    collection: 'galleries'
  }
);

const Gallery = mongoose.model('Gallery', gallerySchema);

export default Gallery;
