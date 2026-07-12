import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { setServers } from 'node:dns/promises';

// Set custom DNS servers for reliable resolution (Cloudflare + Google)
setServers(['1.1.1.1', '8.8.8.8']);

// Load env variables
dotenv.config();

// Import models
import Doctor from '../models/doctor.model.js';
import Department from '../models/department.model.js';
import Specialization from '../models/specialization.model.js';
import DepartmentsPage from '../models/departmentsPage.model.js';
import User from '../models/user.model.js';

// MongoDB URI
const mongoURI = process.env.MONGODB_URI;

// Translation lookup dictionaries
const translations = {
  // Department names
  'Cardiology': 'কার্ডিওলোজি',
  'Neurology': 'নিউরোলজি',
  'Pediatrics': 'শিশুরোগ বিভাগ',
  'Orthopedics': 'অর্থোপেডিক্স',
  'Medicine': 'মেডিসিন',
  'Gynecology': 'স্ত্রীরোগ বিভাগ',
  'Radiology': 'রেডিওলজি',

  // Short descriptions
  'Specialized care for heart and cardiovascular diseases.': 'হৃদরোগ এবং রক্তনালীর রোগের জন্য বিশেষায়িত সেবা।',
  'Expert diagnosis and treatment for brain and nervous system disorders.': 'মস্তিষ্ক এবং স্নায়ুতন্ত্রের ব্যাধিগুলির জন্য বিশেষজ্ঞ নির্ণয় এবং চিকিৎসা।',
  'Complete healthcare services for infants, children, and adolescents.': 'নবজাতক, শিশু এবং কিশোর-কিশোরীদের জন্য সম্পূর্ণ স্বাস্থ্যসেবা।',
  'Advanced treatment for bones, joints, muscles, and spine.': 'হাড়, জয়েন্ট, পেশী এবং মেরুদণ্ডের জন্য উন্নত চিকিৎসা।',

  // Full descriptions
  'Our Cardiology Department provides comprehensive diagnosis, treatment, and preventive care for heart and blood vessel diseases using modern technology and experienced cardiologists.': 'আমাদের কার্ডিওলজি বিভাগ আধুনিক প্রযুক্তি এবং অভিজ্ঞ কার্ডিওলজিস্টদের ব্যবহার করে হৃদরোগ এবং রক্তনালীর রোগের জন্য ব্যাপক রোগ নির্ণয়, চিকিৎসা এবং প্রতিরোধমূলক যত্ন প্রদান করে।',
  'The Neurology Department specializes in diagnosing and treating disorders of the brain, spinal cord, and nervous system with advanced medical care.': 'নিউরোলজি বিভাগ উন্নত চিকিৎসার মাধ্যমে মস্তিষ্ক, মেরুদণ্ড এবং স্নায়ুতন্ত্রের ব্যাধি নির্ণয় ও চিকিৎসায় বিশেষজ্ঞ।',
  'Our Pediatrics Department provides compassionate healthcare for newborns, infants, children, and teenagers, ensuring healthy growth and development.': 'আমাদের শিশুরোগ বিভাগ নবজাতক, শিশু, এবং কিশোর-কিশোরীদের জন্য সহানুভূতিশীল স্বাস্থ্যসেবা প্রদান করে, যা সুস্থ বৃদ্ধি এবং বিকাশ নিশ্চিত করে।',
  'The Orthopedics Department offers diagnosis, treatment, rehabilitation, and surgical care for bone, joint, muscle, and spine conditions.': 'অর্থোপেডিক্স বিভাগ হাড়, জয়েন্ট, পেশী এবং মেরুদণ্ডের অবস্থার জন্য রোগ নির্ণয়, চিকিৎসা, পুনর্বাসন এবং অস্ত্রোপচারের যত্ন প্রদান করে।',

  // Services
  'ECG': 'ইসিজি',
  'Echocardiography': 'ইকোকার্ডিওগ্রাফি',
  'Heart Disease Treatment': 'হৃদরোগের চিকিৎসা',
  'Hypertension Management': 'উচ্চ রক্তচাপ ব্যবস্থাপনা',
  'Cardiac Consultation': 'কার্ডিয়াক পরামর্শ',
  'Preventive Cardiology': 'প্রতিরোধমূলক কার্ডিওলজি',
  'Stroke Management': 'স্ট্রোক ব্যবস্থাপনা',
  'Migraine Treatment': 'মাইগ্রেন চিকিৎসা',
  'Epilepsy Care': 'মৃগীরোগের যত্ন',
  'Nerve Disorder Treatment': 'স্নায়ু ব্যাধির চিকিৎসা',
  'Neurological Consultation': 'নিউরোলজিক্যাল পরামর্শ',
  'Brain Health Assessment': 'মস্তিষ্কের স্বাস্থ্য মূল্যায়ন',
  'Child Consultation': 'শিশু পরামর্শ',
  'Vaccination': 'টিকাদান',
  'Growth Monitoring': 'শারীরিক বৃদ্ধি পর্যবেক্ষণ',
  'Newborn Care': 'নবজাতকের যত্ন',
  'Nutrition Counseling': 'পুষ্টি পরামর্শ',
  'Pediatric Emergency Care': 'শিশু জরুরি যত্ন',
  'Bone Fracture Treatment': 'হাড় ভাঙার চিকিৎসা',
  'Joint Replacement Consultation': 'জয়েন্ট প্রতিস্থাপন পরামর্শ',
  'Sports Injury Care': 'ক্রীড়া আঘাতের যত্ন',
  'Arthritis Management': 'বাত ব্যথা ব্যবস্থাপনা',
  'Spine Care': 'মেরুদণ্ডের যত্ন',
  'Orthopedic Surgery Consultation': 'অর্থোপেডিক সার্জারি পরামর্শ',

  // Head Doctors
  'Dr. Ahmed Rahman': 'ডা. আহমেদ রহমান',
  'Dr. Sarah Akter': 'ডা. সারাহ আক্তার',
  'Dr. Mahmud Hasan': 'ডা. মাহমুদুল হাসান',
  'Dr. Imran Hossain': 'ডা. ইমরান হোসেন',

  // Features
  'Expert Specialists': 'দক্ষ বিশেষজ্ঞ',
  'Our doctors are highly trained specialists with decades of combined experience in their fields.': 'আমাদের ডাক্তাররা তাদের ক্ষেত্রে কয়েক দশকের সম্মিলিত অভিজ্ঞতা সহ উচ্চ প্রশিক্ষিত বিশেষজ্ঞ।',
  '24/7 Availability': '২৪/৭ উপলব্ধতা',
  'Round-the-clock emergency care and consultations. We are always here when you need us most.': 'চব্বিশ ঘণ্টা জরুরি সেবা এবং পরামর্শ। আপনি যখন আমাদের সবচেয়ে বেশি প্রয়োজন মনে করেন আমরা সর্বদা এখানে আছি।',
  'Safe & Hygienic': 'নিরাপদ ও স্বাস্থ্যকর',
  'All departments maintain the highest standards of cleanliness and infection control protocols.': 'সব বিভাগ পরিচ্ছন্নতা এবং সংক্রমণ নিয়ন্ত্রণ প্রোটোকলের সর্বোচ্চ মান বজায় রাখে।',
  'Patient-First Approach': 'রোগী-প্রথম দৃষ্টিভঙ্গি',
  'Every decision we make puts patient comfort, dignity, and wellbeing at the center.': 'আমাদের নেওয়া প্রতিটি সিদ্ধান্ত রোগীর আরাম, মর্যাদা এবং কল্যাণকে কেন্দ্র করে কাজ করে।',

  // Testimonials
  'The cardiology team was exceptional. From the moment I arrived, I felt cared for and in safe hands. The doctors explained everything clearly and the treatment was top-notch.': 'কার্ডিওলোজি দল অসাধারণ ছিল। আমি আসার মুহূর্ত থেকে নিজেকে নিরাপদ হাতে অনুভব করেছি। ডাক্তাররা সবকিছু পরিষ্কারভাবে ব্যাখ্যা করেছিলেন এবং চিকিৎসাটি ছিল চমৎকার।',
  'I had a knee issue for years. The orthopedics department gave me a thorough diagnosis and the treatment worked beautifully. I\'m now walking without pain. Thank you!': 'আমার বহু বছর ধরে হাঁটুতে সমস্যা ছিল। অর্থোপেডিক্স বিভাগ আমাকে একটি পুঙ্খানুপুঙ্খ রোগ নির্ণয় দিয়েছে এবং চিকিৎসাটি চমৎকারভাবে কাজ করেছে। আমি এখন ব্যথা ছাড়াই হাঁটছি। ধন্যবাদ!',
  'My child was treated in the Pediatrics department. The doctors were so kind and gentle with her. The whole experience was stress-free and professional. Highly recommended!': 'আমার সন্তান শিশুরোগ বিভাগে চিকিৎসাধীন ছিল। ডাক্তাররা তার প্রতি খুব দয়ালু এবং ভদ্র ছিলেন। পুরো অভিজ্ঞতা মানসিক চাপমুক্ত এবং পেশাদার ছিল। অত্যন্ত সুপারিশকৃত!',
  'Cardiology Department': 'কার্ডিওলোজি বিভাগ',
  'Orthopedics Department': 'অর্থোপেডিক্স বিভাগ',
  'Pediatrics Department': 'শিশুরোগ বিভাগ'
};

const translate = (text) => translations[text] || text;

const seed = async () => {
  try {
    if (!mongoURI) {
      throw new Error('MONGODB_URI env is required for seeding.');
    }
    console.log('Connecting to database...');
    await mongoose.connect(mongoURI);
    console.log('Connected.');

    // 1. Clear existing collections
    console.log('Clearing existing data...');
    await Promise.all([
      Doctor.deleteMany({}),
      Department.deleteMany({}),
      Specialization.deleteMany({}),
      DepartmentsPage.deleteMany({})
    ]);

    // 2. Read JSON files
    const frontendDir = path.join(process.cwd(), '../frontend/public/data');
    const doctorsJsonPath = path.join(frontendDir, 'doctors.json');
    const deptsJsonPath = path.join(frontendDir, 'departments.json');

    console.log(`Reading doctors from: ${doctorsJsonPath}`);
    const doctorsData = JSON.parse(fs.readFileSync(doctorsJsonPath, 'utf-8'));

    console.log(`Reading departments from: ${deptsJsonPath}`);
    const deptsData = JSON.parse(fs.readFileSync(deptsJsonPath, 'utf-8'));

    // 3. Seed Departments & Specializations
    console.log('Seeding departments...');
    const insertedDepts = [];
    const specializationSet = new Set();
    const insertedSpecializations = [];

    for (const d of deptsData.departments) {
      const deptSlug = d.slug;
      const deptBanglaName = translate(d.name);
      
      const newDept = await Department.create({
        name: { en: d.name, bn: deptBanglaName },
        slug: deptSlug,
        icon: d.icon,
        image: d.image,
        shortDescription: { en: d.shortDescription, bn: translate(d.shortDescription) },
        description: { en: d.description, bn: translate(d.description) },
        services: d.services.map(s => ({ en: s, bn: translate(s) })),
        headDoctor: { en: d.headDoctor, bn: translate(d.headDoctor) },
        availableDoctors: d.availableDoctors,
        available: d.available,
        displayOrder: d.id,
        isVisible: true,
        seo: {
          metaTitle: { en: `${d.name} Department - Mirsarai General Hospital`, bn: `${deptBanglaName} বিভাগ - মীরসরাই জেনারেল হাসপাতাল` },
          metaDescription: { en: d.shortDescription, bn: translate(d.shortDescription) },
          keywords: [d.name.toLowerCase(), 'mirsarai', 'hospital', deptSlug]
        }
      });
      insertedDepts.push(newDept);
      console.log(`- Created Department: ${d.name}`);
    }

    // 4. Seed Doctors
    console.log('Seeding doctors...');
    for (const doc of doctorsData) {
      // Map department to matching slug in departments.json
      let deptSlug = doc.department.en.toLowerCase();
      if (deptSlug === 'medicine') deptSlug = 'general-medicine'; // map "Medicine" to standard General Medicine
      
      // Parse experience years
      const expYears = parseInt(doc.experience.en) || 0;

      // Extract days from chamberTime
      // Saturday - Thursday | 5:00 PM - 9:00 PM
      const daysStr = doc.chamberTime.en.split('|')[0] || '';
      let availableDays = [];
      if (daysStr.includes('Saturday') && daysStr.includes('Thursday')) {
        availableDays = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
      } else if (daysStr.includes('Sunday') && daysStr.includes('Thursday')) {
        availableDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
      } else if (daysStr.includes('Saturday') && daysStr.includes('Wednesday')) {
        availableDays = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday'];
      } else {
        availableDays = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
      }

      // Add to unique specializations set
      const specKey = `${doc.specialization.en}||${deptSlug}`;
      if (!specializationSet.has(specKey)) {
        specializationSet.add(specKey);
        const specNameBn = doc.specialization.bn || translate(doc.specialization.en);
        const specSlug = doc.specialization.en.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        
        const newSpec = await Specialization.create({
          name: { en: doc.specialization.en, bn: specNameBn },
          slug: specSlug,
          departmentSlug: deptSlug,
          description: { en: `${doc.specialization.en} special care services.`, bn: `${specNameBn} বিশেষায়িত চিকিৎসা সেবা।` },
          isVisible: true,
          displayOrder: insertedSpecializations.length,
          seo: {
            metaTitle: { en: `${doc.specialization.en} Specialist`, bn: `${specNameBn} বিশেষজ্ঞ` },
            metaDescription: { en: `Find leading ${doc.specialization.en} services.`, bn: `সেরা ${specNameBn} সেবা খুঁজুন।` }
          }
        });
        insertedSpecializations.push(newSpec);
      }

      // Chamber/Consultation timings
      const timeSlots = availableDays.map(day => ({
        day,
        startTime: doc.chamberTime.en.split('|')[1]?.split('-')[0]?.trim() || '5:00 PM',
        endTime: doc.chamberTime.en.split('|')[1]?.split('-')[1]?.trim() || '9:00 PM',
        type: 'offline'
      }));

      const newDoc = await Doctor.create({
        slug: doc.slug,
        name: doc.name,
        designation: doc.designation,
        specialization: doc.specialization,
        department: doc.department,
        qualification: doc.qualification,
        experience: {
          years: expYears,
          label: doc.experience
        },
        languages: doc.languages,
        about: doc.about,
        services: doc.services,
        consultationFee: doc.consultationFee,
        chamberTime: doc.chamberTime,
        timeSlots,
        availableDays,
        onlineConsultation: false,
        offlineConsultation: true,
        appointmentAvailable: true,
        phone: doc.phone,
        email: doc.email,
        address: { en: 'Mirsarai General Hospital', bn: 'মীরসরাই জেনারেল হাসপাতাল' },
        chamberAddress: { en: 'Mirsarai General Hospital, Chamber 202', bn: 'মীরসরাই জেনারেল হাসপাতাল, চেম্বার ২০২' },
        image: doc.image,
        patientsCount: 120 + doc.id * 15,
        appointmentsToday: 3 + doc.id,
        rating: 5,
        joinDate: '2024-01-01',
        status: doc.available ? 'active' : 'inactive',
        available: doc.available,
        featured: doc.id <= 3,
        displayOrder: doc.id,
        isVisible: true,
        seo: {
          metaTitle: { en: `${doc.name.en} - ${doc.specialization.en}`, bn: `${doc.name.bn} - ${doc.specialization.bn}` },
          metaDescription: doc.about
        }
      });
      console.log(`- Seeded Doctor: ${doc.name.en}`);
    }

    // 5. Seed Departments Page Configuration
    console.log('Seeding departments landing page CMS config...');
    await DepartmentsPage.create({
      title: { en: 'Our Departments', bn: 'আমাদের বিভাগসমূহ' },
      subtitle: { en: 'DEPARTMENTS', bn: 'বিভাগসমূহ' },
      hospitalStats: {
        patientsCount: deptsData.hospitalStats.patientsCount,
        yearsOfService: deptsData.hospitalStats.yearsOfService
      },
      features: deptsData.features.map((f, idx) => ({
        icon: f.icon,
        title: { en: f.title, bn: translate(f.title) },
        description: { en: f.description, bn: translate(f.description) },
        color: f.color,
        bg: f.bg,
        isVisible: true,
        displayOrder: idx
      })),
      testimonials: deptsData.testimonials.map((t, idx) => ({
        name: t.name,
        department: t.department,
        rating: t.rating,
        text: { en: t.text, bn: translate(t.text) },
        avatar: t.avatar,
        color: t.color,
        isVisible: true,
        displayOrder: idx
      })),
      cta: {
        title: { en: 'Need Medical Assistance?', bn: 'চিকিৎসা সহায়তা প্রয়োজন?' },
        description: { en: 'Our specialists are ready to help. Book an appointment today and get the care you deserve.', bn: 'আমাদের বিশেষজ্ঞরা সাহায্য করতে প্রস্তুত। আজই একটি অ্যাপয়েন্টমেন্ট বুক করুন এবং আপনার প্রাপ্য যত্ন পান।' },
        primaryBtn: { label: { en: 'Book Appointment', bn: 'অ্যাপয়েন্টমেন্ট বুক করুন' }, link: '/appointment' },
        secondaryBtn: { label: { en: 'View Our Doctors', bn: 'আমাদের ডাক্তারদের দেখুন' }, link: '/doctors' }
      },
      seo: {
        metaTitle: { en: 'Hospital Departments - Mirsarai General Hospital', bn: 'হাসপাতালের বিভাগসমূহ - মীরসরাই জেনারেল হাসপাতাল' },
        metaDescription: { en: 'Explore the specialized departments and professional medical units of Mirsarai General Hospital.', bn: 'মীরসরাই জেনারেল হাসপাতালের বিশেষায়িত বিভাগ এবং পেশাদার মেডিকেল ইউনিটগুলি অন্বেষণ করুন।' }
      }
    });
    console.log('- Seeded Departments Page layout CMS settings.');

    // 6. Seed Users
    console.log('Seeding users...');
    await User.deleteMany({});

    const allDoctors = await Doctor.find({});
    const firstDoctor = allDoctors[0];

    const mockUsers = [
      {
        email: 'superadmin@mgh.com',
        password: 'admin123',
        name: 'Arif Hossain',
        role: 'super-admin',
        department: 'Administration',
      },
      {
        email: 'reception@mgh.com',
        password: 'admin123',
        name: 'Fatema Khatun',
        role: 'reception-admin',
        department: 'Reception',
      },
      {
        email: 'lab@mgh.com',
        password: 'admin123',
        name: 'Rahim Uddin',
        role: 'lab-admin',
        department: 'Laboratory',
      },
      {
        email: 'doctor@mgh.com',
        password: 'admin123',
        name: 'Dr. Nasrin Begum',
        role: 'doctor',
        doctorRef: firstDoctor?._id || null,
        department: firstDoctor?.department?.en || 'General Medicine',
      },
    ];

    for (const u of mockUsers) {
      await User.create(u);
      console.log(`- Created User: ${u.email} (${u.role})`);
    }

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    console.log('Closing database connection...');
    await mongoose.connection.close();
    console.log('Done.');
  }
};

seed();
