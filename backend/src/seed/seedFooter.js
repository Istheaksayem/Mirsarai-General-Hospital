import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { setServers } from 'node:dns';

dotenv.config();
setServers(['8.8.8.8', '1.1.1.1']);

import Footer from '../models/footer.model.js';

const seedFooter = async () => {
  const existing = await Footer.findOne();
  if (existing) {
    console.log('✅ Footer data already exists. Skipping seed.');
    return;
  }

  const data = {
    brand: {
      logo: '/genaral_Hospital_logo.jpeg',
      description: {
        en: 'Committed to providing compassionate care and advanced medical solutions. We combine state-of-the-art technology with human empathy, because your health is our top priority.',
        bn: 'সহানুভূতিশীল সেবা এবং উন্নত চিকিৎসা সমাধান প্রদানে প্রতিশ্রুতিবদ্ধ। আমরা অত্যাধুনিক প্রযুক্তির সাথে মানবিক সহানুভূতি যুক্ত করি, কারণ আপনার স্বাস্থ্যই আমাদের সর্বোচ্চ অগ্রাধিকার।'
      },
      socialLinks: [
        { platform: 'facebook', icon: 'FaFacebookF', url: 'https://www.facebook.com/mirsaraigeneralhospital', hoverColor: 'bg-blue-500' },
        { platform: 'youtube', icon: 'FaYoutube', url: '#', hoverColor: 'bg-red-500' },
        { platform: 'instagram', icon: 'FaInstagram', url: '#', hoverColor: 'bg-pink-500' }
      ]
    },
    exploreLinks: {
      title: { en: 'Explore', bn: 'এক্সপ্লোর' },
      links: [
        { label: { en: 'Home', bn: 'হোম' }, href: '/' },
        { label: { en: 'About Us', bn: 'আমাদের সম্পর্কে' }, href: '/about' },
        { label: { en: 'Services', bn: 'সেবাসমূহ' }, href: '/services/diagnostic' },
        { label: { en: 'Our Doctors', bn: 'আমাদের ডাক্তার' }, href: '/doctors' },
        { label: { en: 'Appointments', bn: 'অ্যাপয়েন্টমেন্ট' }, href: '/appointment' },
        { label: { en: 'Contact Us', bn: 'যোগাযোগ' }, href: '/contact' }
      ]
    },
    departments: {
      title: { en: 'Departments', bn: 'বিভাগসমূহ' },
      items: [
        { name: { en: 'Cardiology', bn: 'কার্ডিওলজি' }, href: '/departments' },
        { name: { en: 'Neurology', bn: 'নিউরোলজি' }, href: '/departments' },
        { name: { en: 'Orthopedics', bn: 'অর্থোপেডিক্স' }, href: '/departments' },
        { name: { en: 'Pediatrics', bn: 'শিশুরোগ' }, href: '/departments' },
        { name: { en: 'General Surgery', bn: 'সাধারণ অস্ত্রোপচার' }, href: '/departments' },
        { name: { en: 'Diagnostic Lab', bn: 'ডায়াগনস্টিক ল্যাব' }, href: '/departments' }
      ]
    },
    contactInfo: {
      title: { en: 'Get In Touch', bn: 'যোগাযোগ করুন' },
      address: {
        icon: 'FaMapMarkerAlt',
        hospitalName: { en: 'Mirsarai General Hospital', bn: 'মীরসরাই জেনারেল হাসপাতাল' },
        location: {
          en: 'Opposite the Police Station, Mirsarai Pouroshava, Chittagong.',
          bn: 'পুলিশ স্টেশনের বিপরীতে, মীরসরাই পৌরসভা, চট্টগ্রাম।'
        }
      },
      phone: {
        icon: 'FaPhoneAlt',
        number: '+8801969-997799'
      },
      email: {
        icon: 'FaEnvelope',
        address: 'mirsaraigeneralhospital@gmail.com'
      }
    },
    emergencyCard: {
      icon: 'FaHeartbeat',
      label: { en: '24/7 Emergency', bn: '২৪/৭ জরুরি সেবা' },
      phoneNumber: '+01969-997799',
      gradient: 'from-[#76BC21] to-green-600',
      badgeGradient: 'from-white/10 to-white/5',
      blobColor: 'bg-[#76BC21]/20',
      iconGradient: 'from-[#76BC21] to-green-600'
    },
    bottomBar: {
      hospitalName: { en: 'Mirsarai General Hospital', bn: 'মীরসরাই জেনারেল হাসপাতাল' },
      rightsText: { en: 'All Rights Reserved.', bn: 'সর্বস্বত্ব সংরক্ষিত।' },
      privacyPolicy: {
        label: { en: 'Privacy Policy', bn: 'গোপনীয়তা নীতি' },
        href: '/privacy'
      },
      termsOfService: {
        label: { en: 'Terms of Service', bn: 'সেবার শর্তাবলী' },
        href: '/terms'
      }
    },
    sections: {
      brand: { isVisible: true, order: 1 },
      exploreLinks: { isVisible: true, order: 2 },
      departments: { isVisible: true, order: 3 },
      contactInfo: { isVisible: true, order: 4 },
      emergencyCard: { isVisible: true, order: 5 },
      bottomBar: { isVisible: true, order: 6 }
    },
    seo: {
      metaTitle: { en: 'Mirsarai General Hospital', bn: 'মীরসরাই জেনারেল হাসপাতাল' },
      metaDescription: { en: 'Mirsarai General Hospital - Footer', bn: 'মীরসরাই জেনারেল হাসপাতাল - ফুটার' },
      keywords: { en: 'footer, hospital, mirsarai', bn: 'ফুটার, হাসপাতাল, মীরসরাই' },
      ogImage: '/genaral_Hospital_logo.jpeg'
    },
    createdBy: 'seed-script'
  };

  await Footer.create(data);
  console.log('🌱 Footer data seeded successfully!');
};

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to MongoDB');
    await seedFooter();
  } catch (err) {
    console.error('❌ Seed failed:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
};

run();
