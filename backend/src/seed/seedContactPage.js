import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { setServers } from 'node:dns';

dotenv.config();
setServers(['8.8.8.8', '1.1.1.1']);

import ContactPage from '../models/contactPage.model.js';

const seedContactPage = async () => {
  const existing = await ContactPage.findOne();
  if (existing) {
    console.log('✅ Contact page data already exists. Skipping seed.');
    return;
  }

  const data = {
    hero: {
      title:       { en: 'Get In Touch', bn: 'যোগাযোগ করুন' },
      subtitle:    { en: 'CONTACT US', bn: 'যোগাযোগ' },
      description: { en: 'We are here to provide you with the best medical care. Reach out to us for any inquiries, appointments, or emergency assistance.', bn: 'আমরা আপনাকে সর্বোত্তম চিকিৎসা সেবা প্রদান করতে এখানে আছি। যেকোনো প্রশ্ন, অ্যাপয়েন্টমেন্ট বা জরুরি সহায়তার জন্য আমাদের সাথে যোগাযোগ করুন।' },
      image: '/about-us.jpg',
    },
    contactInfo: {
      title: { en: 'Contact Information', bn: 'যোগাযোগের তথ্য' },
      addressCard: {
        label:    { en: 'Our Address', bn: 'আমাদের ঠিকানা' },
        name:     { en: 'Mirsarai General Hospital Baby Care & Diagnostic Center', bn: 'মীরসরাই জেনারেল হাসপাতাল বেবি কেয়ার এন্ড ডায়াগনস্টিক সেন্টার' },
        location: { en: 'Opposite the Police Station, Mirsarai Pourosodor, Chittagong.', bn: 'পুলিশ স্টেশনের বিপরীতে, মীরসরাই পৌরসদর, চট্টগ্রাম।' },
      },
      hotlineCard: {
        label:       { en: '24/7 Hotline', bn: '২৪/৭ হটলাইন' },
        number:      '01969-997799',
        numberLabel: { en: '(English)', bn: '(ইংরেজি)' },
      },
      emailCard: {
        label:   { en: 'Email Address', bn: 'ইমেইল ঠিকানা' },
        address: 'mirsaraigeneralhospital@gmail.com',
      },
    },
    form: {
      title:       { en: 'Send us a Message', bn: 'আমাদের একটি বার্তা পাঠান' },
      description: { en: 'We\'d love to hear from you. Fill out the form below and we\'ll get back to you as soon as possible.', bn: 'আমরা আপনার কাছ থেকে শুনতে চাই। নিচের ফর্মটি পূরণ করুন এবং আমরা যত তাড়াতাড়ি সম্ভব আপনার সাথে যোগাযোগ করব।' },
      buttonText:  { en: 'Send Message', bn: 'বার্তা পাঠান' },
      fields: {
        name: {
          label:       { en: 'Full Name', bn: 'পুরো নাম' },
          placeholder: { en: 'John Doe', bn: 'জন ডো' },
        },
        phone: {
          label:       { en: 'Phone Number', bn: 'ফোন নম্বর' },
          placeholder: { en: '01xxxxxxxxx', bn: '০১xxxxxxxxx' },
        },
        email: {
          label:       { en: 'Email Address (Optional)', bn: 'ইমেইল ঠিকানা (ঐচ্ছিক)' },
          placeholder: { en: 'john@example.com', bn: 'জন@উদাহরণ.কম' },
        },
        message: {
          label:       { en: 'Your Message', bn: 'আপনার বার্তা' },
          placeholder: { en: 'How can we help you?', bn: 'আমরা কিভাবে আপনাকে সাহায্য করতে পারি?' },
        },
      },
    },
    sections: {
      hero:        { isVisible: true, order: 1 },
      contactInfo: { isVisible: true, order: 2 },
      form:        { isVisible: true, order: 3 },
    },
    seo: {
      metaTitle:       { en: 'Contact Us | Mirsarai General Hospital', bn: 'যোগাযোগ | মীরসরাই জেনারেল হাসপাতাল' },
      metaDescription: { en: 'Get in touch with Mirsarai General Hospital. Find our address, phone numbers, email, and send us a message.', bn: 'মীরসরাই জেনারেল হাসপাতালের সাথে যোগাযোগ করুন। আমাদের ঠিকানা, ফোন নম্বর, ইমেইল খুঁজুন এবং আমাদের একটি বার্তা পাঠান।' },
      keywords:        { en: 'contact, hospital, mirsarai, phone, email, address', bn: 'যোগাযোগ, হাসপাতাল, মীরসরাই, ফোন, ইমেইল, ঠিকানা' },
      ogImage: '/hospital-banner.jpg',
    },
    createdBy: 'seed-script',
  };

  await ContactPage.create(data);
  console.log('🌱 Contact page data seeded successfully!');
};

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to MongoDB');
    await seedContactPage();
  } catch (err) {
    console.error('❌ Seed failed:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
};

run();
