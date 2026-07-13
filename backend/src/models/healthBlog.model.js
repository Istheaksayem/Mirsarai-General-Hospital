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
  name: { type: localizedStringSchema, required: true }
}, { _id: false });

const postSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  category: { type: String, required: true },
  title: { type: localizedStringSchema, required: true },
  excerpt: { type: localizedStringSchema, required: true },
  author: { type: localizedStringSchema, required: true },
  date: { type: String, required: true },
  readTime: { type: localizedStringSchema, required: true },
  image: { type: String, required: true }
}, { _id: false });

const tagSchema = new mongoose.Schema({
  en: { type: String, required: true },
  bn: { type: String, required: true }
}, { _id: false });

const healthBlogSchema = new mongoose.Schema(
  {
    hero: {
      title: { type: localizedStringSchema, required: true },
      subtitle: { type: localizedStringSchema, required: true },
      description: { type: localizedStringSchema, required: true },
      image: { type: String, required: true }
    },
    categories: { type: [categorySchema], default: [] },
    posts: { type: [postSchema], default: [] },
    tags: { type: [tagSchema], default: [] },
    sections: {
      hero: { type: sectionConfigSchema, default: () => ({ isVisible: true, order: 1 }) },
      posts: { type: sectionConfigSchema, default: () => ({ isVisible: true, order: 2 }) },
      tags: { type: sectionConfigSchema, default: () => ({ isVisible: true, order: 3 }) }
    },
    seo: {
      type: seoSchema,
      default: () => ({
        metaTitle: { en: 'Health Blog | Mirsarai General Hospital', bn: 'স্বাস্থ্য ব্লগ | মীরসরাই জেনারেল হাসপাতাল' },
        metaDescription: { en: 'Stay informed with health articles and medical tips from our experts.', bn: 'আমাদের বিশেষজ্ঞদের কাছ থেকে স্বাস্থ্য নিবন্ধ এবং চিকিৎসা টিপস সহ অবগত থাকুন।' },
        keywords: { en: 'health blog, medical tips, wellness, mirsarai hospital', bn: 'স্বাস্থ্য ব্লগ, চিকিৎসা টিপস, সুস্থতা, মীরসরাই হাসপাতাল' },
        ogImage: '/about-us.jpg'
      })
    },
    createdBy: { type: String },
    updatedBy: { type: String }
  },
  {
    timestamps: true,
    collection: 'health_blogs'
  }
);

const HealthBlog = mongoose.model('HealthBlog', healthBlogSchema);

export default HealthBlog;
