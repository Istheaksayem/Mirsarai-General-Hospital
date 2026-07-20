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

const contactPageSchema = new mongoose.Schema(
  {
    hero: {
      title: { type: localizedStringSchema, required: true },
      subtitle: { type: localizedStringSchema, required: true },
      description: { type: localizedStringSchema, required: true },
      image: { type: String, required: true }
    },
    contactInfo: {
      title: { type: localizedStringSchema, required: true },
      addressCard: {
        label: { type: localizedStringSchema, required: true },
        name: { type: localizedStringSchema, required: true },
        location: { type: localizedStringSchema, required: true }
      },
      hotlineCard: {
        label: { type: localizedStringSchema, required: true },
        number: { type: String, required: true },
        numberLabel: { type: localizedStringSchema, required: true }
      },
      emailCard: {
        label: { type: localizedStringSchema, required: true },
        address: { type: String, required: true }
      }
    },
    form: {
      title: { type: localizedStringSchema, required: true },
      description: { type: localizedStringSchema, required: true },
      buttonText: { type: localizedStringSchema, required: true },
      fields: {
        name: {
          label: { type: localizedStringSchema, required: true },
          placeholder: { type: localizedStringSchema, required: true }
        },
        phone: {
          label: { type: localizedStringSchema, required: true },
          placeholder: { type: localizedStringSchema, required: true }
        },
        email: {
          label: { type: localizedStringSchema, required: true },
          placeholder: { type: localizedStringSchema, required: true }
        },
        message: {
          label: { type: localizedStringSchema, required: true },
          placeholder: { type: localizedStringSchema, required: true }
        }
      }
    },
    sections: {
      hero: { type: sectionConfigSchema, default: () => ({ isVisible: true, order: 1 }) },
      contactInfo: { type: sectionConfigSchema, default: () => ({ isVisible: true, order: 2 }) },
      form: { type: sectionConfigSchema, default: () => ({ isVisible: true, order: 3 }) }
    },
    seo: {
      type: seoSchema,
      default: () => ({
        metaTitle: { en: 'Contact Us | Mirsarai General Hospital', bn: 'যোগাযোগ | মীরসরাই জেনারেল হাসপাতাল' },
        metaDescription: { en: 'Get in touch with Mirsarai General Hospital. Find our address, phone numbers, email, and send us a message.', bn: 'মীরসরাই জেনারেল হাসপাতালের সাথে যোগাযোগ করুন। আমাদের ঠিকানা, ফোন নম্বর, ইমেইল খুঁজুন এবং আমাদের একটি বার্তা পাঠান।' },
        keywords: { en: 'contact, hospital, mirsarai, phone, email, address', bn: 'যোগাযোগ, হাসপাতাল, মীরসরাই, ফোন, ইমেইল, ঠিকানা' },
        ogImage: '/hospital-banner.jpg'
      })
    },
    createdBy: { type: String },
    updatedBy: { type: String }
  },
  {
    timestamps: true,
    collection: 'contact_pages'
  }
);

const ContactPage = mongoose.model('ContactPage', contactPageSchema);

export default ContactPage;
