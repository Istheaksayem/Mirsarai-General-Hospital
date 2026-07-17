import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { setServers } from 'node:dns';

dotenv.config();
setServers(['8.8.8.8', '1.1.1.1']);

import OurTeam from '../models/team.model.js';

const seedOurTeam = async () => {
  const existing = await OurTeam.findOne();
  if (existing) {
    console.log('✅ Our Team data already exists. Skipping seed.');
    return;
  }

  const data = {
    hero: {
      title:       { en: 'Meet Our Team', bn: 'আমাদের টিমের সাথে পরিচিত হন' },
      subtitle:    { en: 'Dedicated Healthcare Professionals', bn: 'নিবেদিতপ্রাণ স্বাস্থ্যসেবা পেশাদার' },
      description: { en: 'Our team of experienced doctors, nurses, and specialists work tirelessly to provide the best care for every patient.', bn: 'আমাদের অভিজ্ঞ ডাক্তার, নার্স এবং বিশেষজ্ঞদের টিম প্রতিটি রোগীর জন্য সর্বোত্তম সেবা প্রদানে নিরলসভাবে কাজ করে।' },
      image: '/about-us.jpg',
    },
    sectionTitle:       { en: 'Our Expert Team Members', bn: 'আমাদের বিশেষজ্ঞ টিম সদস্যরা' },
    sectionDescription: { en: 'Meet the dedicated professionals who make Mirsarai General Hospital a trusted healthcare institution.', bn: 'সেই নিবেদিতপ্রাণ পেশাদারদের সাথে পরিচিত হন যারা মীরসরাই জেনারেল হাসপাতালকে একটি বিশ্বস্ত স্বাস্থ্যসেবা প্রতিষ্ঠান হিসেবে গড়ে তুলেছেন।' },
    members: [
      {
        name:        { en: 'Dr. Abdullah Al-Mamun', bn: 'ডা. আবদুল্লাহ আল-মামুন' },
        designation: { en: 'Chief Medical Officer', bn: 'প্রধান চিকিৎসা কর্মকর্তা' },
        department:  { en: 'Internal Medicine', bn: 'অভ্যন্তরীণ চিকিৎসা' },
        bio:         { en: 'With over 20 years of experience, Dr. Al-Mamun leads our medical team with dedication and expertise.', bn: '২০ বছরেরও বেশি অভিজ্ঞতা নিয়ে, ডা. আল-মামুন নিষ্ঠা ও দক্ষতার সাথে আমাদের চিকিৎসা দলকে নেতৃত্ব দেন।' },
        image: '',
        email: 'dr.mamun@hospital.com',
        phone: '+880 1700-000001',
        order: 1,
      },
      {
        name:        { en: 'Dr. Fatema Begum', bn: 'ডা. ফাতেমা বেগম' },
        designation: { en: 'Senior Pediatrician', bn: 'সিনিয়র শিশুরোগ বিশেষজ্ঞ' },
        department:  { en: 'Pediatrics', bn: 'শিশুরোগ বিভাগ' },
        bio:         { en: 'Dr. Fatema specializes in child healthcare and NICU, ensuring the best outcomes for our youngest patients.', bn: 'ডা. ফাতেমা শিশু স্বাস্থ্যসেবা এবং এনআইসিইউতে বিশেষজ্ঞ, আমাদের সবচেয়ে কম বয়সী রোগীদের জন্য সর্বোত্তম ফলাফল নিশ্চিত করেন।' },
        image: '',
        email: 'dr.fatema@hospital.com',
        phone: '+880 1700-000002',
        order: 2,
      },
      {
        name:        { en: 'Nurse Rahela Khatun', bn: 'নার্স রাহেলা খাতুন' },
        designation: { en: 'Head Nurse', bn: 'প্রধান নার্স' },
        department:  { en: 'Nursing Department', bn: 'নার্সিং বিভাগ' },
        bio:         { en: 'Rahela leads our nursing staff with compassion and professionalism, ensuring every patient feels cared for.', bn: 'রাহেলা সহানুভূতি ও পেশাদারিত্বের সাথে আমাদের নার্সিং কর্মীদের নেতৃত্ব দেন, প্রতিটি রোগী যেন যত্নশীল অনুভব করেন তা নিশ্চিত করেন।' },
        image: '',
        email: 'rahela@hospital.com',
        phone: '+880 1700-000003',
        order: 3,
      },
    ],
    sections: {
      hero:    { isVisible: true, order: 1 },
      members: { isVisible: true, order: 2 },
      cta:     { isVisible: true, order: 3 },
    },
    seo: {
      metaTitle:       { en: 'Our Team | Mirsarai General Hospital', bn: 'আমাদের টিম | মীরসরাই জেনারেল হাসপাতাল' },
      metaDescription: { en: 'Meet the dedicated team of doctors, nurses, and staff at Mirsarai General Hospital.', bn: 'মীরসরাই জেনারেল হাসপাতালের নিবেদিত ডাক্তার, নার্স এবং কর্মীদের সাথে পরিচিত হন।' },
      keywords:        { en: 'team, doctors, staff, nurses, hospital, mirsarai', bn: 'টিম, ডাক্তার, কর্মী, নার্স, হাসপাতাল, মীরসরাই' },
      ogImage: '/about-us.jpg',
    },
    createdBy: 'seed-script',
  };

  await OurTeam.create(data);
  console.log('🌱 Our Team data seeded successfully!');
};

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to MongoDB');
    await seedOurTeam();
  } catch (err) {
    console.error('❌ Seed failed:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
};

run();
