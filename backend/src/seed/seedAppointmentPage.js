import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { setServers } from 'node:dns';

dotenv.config();
setServers(['8.8.8.8', '1.1.1.1']);

import AppointmentPage from '../models/appointmentPage.model.js';

const seedAppointmentPage = async () => {
  const existing = await AppointmentPage.findOne();
  if (existing) {
    console.log('✅ Appointment page data already exists. Skipping seed.');
    return;
  }

  const data = {
    hero: {
      title:       { en: 'Book Appointment', bn: 'অ্যাপয়েন্টমেন্ট বুক করুন' },
      subtitle:    { en: 'APPOINTMENT', bn: 'অ্যাপয়েন্টমেন্ট' },
      description: { en: 'Schedule your visit with our specialist doctors.', bn: 'আমাদের বিশেষজ্ঞ ডাক্তারদের সাথে আপনার সফর নির্ধারণ করুন।' },
      image: '/appointment-hero.jpg',
    },
    features: [
      { icon: 'FaHospital',   title: { en: 'Expert Specialists', bn: 'বিশেষজ্ঞ চিকিৎসক' },       description: { en: 'Board-certified doctors across all departments.', bn: 'সব বিভাগে বোর্ড-সার্টিফাইড ডাক্তার।' } },
      { icon: 'MdVerified',   title: { en: 'Instant Confirmation', bn: 'তাৎক্ষণিক নিশ্চিতকরণ' }, description: { en: 'Get immediate appointment confirmation.', bn: 'তাৎক্ষণিক অ্যাপয়েন্টমেন্ট নিশ্চিতকরণ পান।' } },
      { icon: 'FaShieldAlt',  title: { en: 'Secure & Private', bn: 'নিরাপদ ও ব্যক্তিগত' },       description: { en: 'Your health data is 100% confidential.', bn: 'আপনার স্বাস্থ্য তথ্য ১০০% গোপনীয়।' } },
      { icon: 'FaHeadset',    title: { en: '24/7 Support', bn: '২৪/৭ সহায়তা' },                   description: { en: 'Our team is always here to help you.', bn: 'আমাদের টিম সবসময় আপনাকে সাহায্য করতে এখানে রয়েছে।' } },
    ],
    whyChooseUs: {
      title: { en: 'Why Choose Us?', bn: 'কেন আমাদের বেছে নেবেন?' },
      items: [
        { en: 'Over 50 specialist doctors', bn: '৫০ এর বেশি বিশেষজ্ঞ ডাক্তার' },
        { en: 'Modern diagnostic equipment', bn: 'আধুনিক ডায়াগনস্টিক সরঞ্জাম' },
        { en: 'Comfortable private rooms', bn: 'আরামদায়ক ব্যক্তিগত কক্ষ' },
        { en: 'Insurance & cash payment', bn: 'বীমা ও নগদ অর্থ প্রদান' },
        { en: 'Emergency care 24/7', bn: 'জরুরি সেবা ২৪/৭' },
        { en: 'Free follow-up consultation', bn: 'বিনামূল্যে ফলো-আপ পরামর্শ' },
      ],
    },
    emergencyBanner: {
      title:       { en: '🚨 Emergency?', bn: '🚨 জরুরি?' },
      description: { en: 'Do not use this form. Call us directly.', bn: 'এই ফর্ম ব্যবহার করবেন না। সরাসরি কল করুন।' },
      buttonText:  { en: 'Call Emergency: +01969997799', bn: 'জরুরি কল: +০১৯৬৯৯৯৭৭৯৯' },
      phone: '+01969997799',
    },
    contactCard: {
      title:       { en: 'Need Help?', bn: 'সাহায্য প্রয়োজন?' },
      description: { en: 'Our team is available Mon–Sat, 8AM–8PM', bn: 'আমাদের টিম সোম–শনি, সকাল ৮টা–রাত ৮টা পর্যন্ত উপলব্ধ' },
      phone: '+01969997799',
    },
    formSection: {
      title:       { en: 'Fill in Your Details', bn: 'আপনার তথ্য পূরণ করুন' },
      description: { en: 'Complete the form below to book your appointment.', bn: 'আপনার অ্যাপয়েন্টমেন্ট বুক করতে নিচের ফর্মটি পূরণ করুন।' },
    },
    disclaimer: {
      en: 'All appointments are subject to doctor availability. Mirsarai General Hospital · Mirsarai, Chattogram, Bangladesh',
      bn: 'সকল অ্যাপয়েন্টমেন্ট ডাক্তারের প্রাপ্যতা সাপেক্ষে। মীরসরাই জেনারেল হাসপাতাল · মীরসরাই, চট্টগ্রাম, বাংলাদেশ',
    },
    sections: {
      hero:     { isVisible: true, order: 1 },
      features: { isVisible: true, order: 2 },
      sidebar:  { isVisible: true, order: 3 },
      form:     { isVisible: true, order: 4 },
    },
    seo: {
      metaTitle:       { en: 'Book an Appointment | Mirsarai General Hospital', bn: 'অ্যাপয়েন্টমেন্ট বুক করুন | মীরসরাই জেনারেল হাসপাতাল' },
      metaDescription: { en: 'Schedule an appointment with our specialist doctors at Mirsarai General Hospital. Fast, easy, and secure online booking.', bn: 'মীরসরাই জেনারেল হাসপাতালে আমাদের বিশেষজ্ঞ ডাক্তারদের সাথে অ্যাপয়েন্টমেন্ট বুক করুন। দ্রুত, সহজ এবং নিরাপদ অনলাইন বুকিং।' },
      keywords:        { en: 'appointment, book appointment, doctor appointment, mirsarai hospital', bn: 'অ্যাপয়েন্টমেন্ট, অ্যাপয়েন্টমেন্ট বুক, ডাক্তার অ্যাপয়েন্টমেন্ট, মীরসরাই হাসপাতাল' },
      ogImage: '/hospital-banner.jpg',
    },
    createdBy: 'seed-script',
  };

  await AppointmentPage.create(data);
  console.log('🌱 Appointment page data seeded successfully!');
};

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to MongoDB');
    await seedAppointmentPage();
  } catch (err) {
    console.error('❌ Seed failed:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
};

run();
