import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { setServers } from 'node:dns';

dotenv.config();
setServers(['8.8.8.8', '1.1.1.1']);

import OurTeam from '../models/team.model.js';

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
      bio:         { en: 'With over 20 years of experience, Dr. Al-Mamun leads our medical team with dedication and expertise. He is known for his patient-centric approach and has successfully treated thousands of patients across the region.', bn: '২০ বছরেরও বেশি অভিজ্ঞতা নিয়ে, ডা. আল-মামুন নিষ্ঠা ও দক্ষতার সাথে আমাদের চিকিৎসা দলকে নেতৃত্ব দেন। তিনি তার রোগী-কেন্দ্রিক দৃষ্টিভঙ্গির জন্য পরিচিত এবং এলাকা জুড়ে হাজার হাজার রোগীর সফল চিকিৎসা করেছেন।' },
      image: '',
      email: 'dr.mamun@mirsaraihospital.com',
      phone: '+880 1700-000001',
      order: 1,
      slug: 'dr-abdullah-al-mamun',
      qualifications: [
        { title: { en: 'MBBS', bn: 'এমবিবিএস' }, institution: { en: 'Dhaka Medical College', bn: 'ঢাকা মেডিকেল কলেজ' }, year: '1998' },
        { title: { en: 'FCPS (Internal Medicine)', bn: 'এফসিপিএস (অভ্যন্তরীণ চিকিৎসা)' }, institution: { en: 'Bangladesh College of Physicians & Surgeons', bn: 'বাংলাদেশ কলেজ অব ফিজিশিয়ানস অ্যান্ড সার্জনস' }, year: '2004' },
        { title: { en: 'MD (Internal Medicine)', bn: 'এমডি (অভ্যন্তরীণ চিকিৎসা)' }, institution: { en: 'BSM Medical University', bn: 'বিএসএম মেডিকেল বিশ্ববিদ্যালয়' }, year: '2008' },
      ],
      experience: [
        { title: { en: 'Chief Medical Officer', bn: 'প্রধান চিকিৎসা কর্মকর্তা' }, institution: { en: 'Mirsarai General Hospital', bn: 'মীরসরাই জেনারেল হাসপাতাল' }, period: '2015 - Present', description: { en: 'Leading the overall medical operations, supervising department heads, and ensuring quality healthcare delivery.', bn: 'সামগ্রিক চিকিৎসা কার্যক্রম পরিচালনা, বিভাগীয় প্রধানদের তত্ত্বাবধান এবং মানসম্পন্ন স্বাস্থ্যসেবা নিশ্চিত করা।' } },
        { title: { en: 'Senior Consultant', bn: 'সিনিয়র পরামর্শক' }, institution: { en: 'Chittagong Medical College Hospital', bn: 'চট্টগ্রাম মেডিকেল কলেজ হাসপাতাল' }, period: '2008 - 2015', description: { en: 'Specialized in internal medicine and supervised resident doctors.', bn: 'অভ্যন্তরীণ চিকিৎসায় বিশেষজ্ঞ এবং আবাসিক ডাক্তারদের তত্ত্বাবধান।' } },
        { title: { en: 'Assistant Registrar', bn: 'সহকারী রেজিস্ট্রার' }, institution: { en: 'Dhaka Medical College Hospital', bn: 'ঢাকা মেডিকেল কলেজ হাসপাতাল' }, period: '2004 - 2008', description: { en: 'Rotated through various departments and gained comprehensive clinical experience.', bn: 'বিভিন্ন বিভাগে ঘূর্ণায়মান হয়ে ব্যাপক ক্লিনিকাল অভিজ্ঞতা অর্জন।' } },
      ],
      specialties: [
        { en: 'Internal Medicine', bn: 'অভ্যন্তরীণ চিকিৎসা' },
        { en: 'Diabetes Management', bn: 'ডায়াবেটিস ব্যবস্থাপনা' },
        { en: 'Hypertension', bn: 'উচ্চ রক্তচাপ' },
        { en: 'Preventive Healthcare', bn: 'প্রতিরোধমূলক স্বাস্থ্যসেবা' },
      ],
      socialLinks: [
        { platform: 'linkedin', url: 'https://linkedin.com/in/dr-mamun' },
        { platform: 'website', url: 'https://drmamun.com' },
      ],
    },
    {
      name:        { en: 'Dr. Fatema Begum', bn: 'ডা. ফাতেমা বেগম' },
      designation: { en: 'Senior Pediatrician', bn: 'সিনিয়র শিশুরোগ বিশেষজ্ঞ' },
      department:  { en: 'Pediatrics', bn: 'শিশুরোগ বিভাগ' },
      bio:         { en: 'Dr. Fatema Begum is a compassionate pediatrician with over 15 years of experience in child healthcare. She specializes in neonatal care and has been instrumental in setting up our state-of-the-art NICU.', bn: 'ডা. ফাতেমা বেগম ১৫ বছরেরও বেশি অভিজ্ঞতা সম্পন্ন একজন সহানুভূতিশীল শিশুরোগ বিশেষজ্ঞ। তিনি নবজাতক সেবায় বিশেষজ্ঞ এবং আমাদের অত্যাধুনিক এনআইসিইউ স্থাপনে গুরুত্বপূর্ণ ভূমিকা রেখেছেন।' },
      image: '',
      email: 'dr.fatema@mirsaraihospital.com',
      phone: '+880 1700-000002',
      order: 2,
      slug: 'dr-fatema-begum',
      qualifications: [
        { title: { en: 'MBBS', bn: 'এমবিবিএস' }, institution: { en: 'Sir Salimullah Medical College', bn: 'স্যার সলিমুল্লাহ মেডিকেল কলেজ' }, year: '2000' },
        { title: { en: 'DCH (Diploma in Child Health)', bn: 'ডিসিএইচ (শিশু স্বাস্থ্যে ডিপ্লোমা)' }, institution: { en: 'Bangladesh College of Physicians & Surgeons', bn: 'বাংলাদেশ কলেজ অব ফিজিশিয়ানস অ্যান্ড সার্জনস' }, year: '2005' },
        { title: { en: 'FCPS (Pediatrics)', bn: 'এফসিপিএস (শিশুরোগ)' }, institution: { en: 'Bangladesh College of Physicians & Surgeons', bn: 'বাংলাদেশ কলেজ অব ফিজিশিয়ানস অ্যান্ড সার্জনস' }, year: '2009' },
      ],
      experience: [
        { title: { en: 'Senior Pediatrician', bn: 'সিনিয়র শিশুরোগ বিশেষজ্ঞ' }, institution: { en: 'Mirsarai General Hospital', bn: 'মীরসরাই জেনারেল হাসপাতাল' }, period: '2016 - Present', description: { en: 'Leading the pediatric department and NICU, managing complex pediatric cases.', bn: 'শিশুরোগ বিভাগ এবং এনআইসিইউ পরিচালনা, জটিল শিশুরোগ ব্যবস্থাপনা।' } },
        { title: { en: 'Pediatric Consultant', bn: 'শিশুরোগ পরামর্শক' }, institution: { en: 'Chittagong Shishu Hospital', bn: 'চট্টগ্রাম শিশু হাসপাতাল' }, period: '2009 - 2016', description: { en: 'Provided specialized pediatric care and trained junior doctors.', bn: 'বিশেষায়িত শিশুরোগ সেবা প্রদান এবং জুনিয়র ডাক্তারদের প্রশিক্ষণ।' } },
      ],
      specialties: [
        { en: 'Neonatology', bn: 'নবজাতক চিকিৎসা' },
        { en: 'Pediatric Critical Care', bn: 'শিশু নিবিড় পরিচর্যা' },
        { en: 'Child Nutrition', bn: 'শিশু পুষ্টি' },
        { en: 'Developmental Pediatrics', bn: 'বিকাশমূলক শিশুরোগ' },
      ],
      socialLinks: [
        { platform: 'facebook', url: 'https://facebook.com/drfatema' },
      ],
    },
    {
      name:        { en: 'Dr. Kabir Hossain', bn: 'ডা. কবির হোসেন' },
      designation: { en: 'Senior Cardiologist', bn: 'সিনিয়র কার্ডিওলজিস্ট' },
      department:  { en: 'Cardiology', bn: 'কার্ডিওলজি বিভাগ' },
      bio:         { en: 'Dr. Kabir Hossain is a renowned cardiologist with specialized training in interventional cardiology. He has performed over 2,000 successful angiographies and angioplasties, bringing advanced cardiac care to our community.', bn: 'ডা. কবির হোসেন ইন্টারভেনশনাল কার্ডিওলজিতে বিশেষায়িত প্রশিক্ষণপ্রাপ্ত একজন খ্যাতনামা কার্ডিওলজিস্ট। তিনি ২,০০০-এরও বেশি সফল অ্যাঞ্জিওগ্রাফি এবং অ্যাঞ্জিওপ্লাস্টি করেছেন, আমাদের সম্প্রদায়ে উন্নত হৃদরোগ সেবা নিয়ে এসেছেন।' },
      image: '',
      email: 'dr.kabir@mirsaraihospital.com',
      phone: '+880 1700-000004',
      order: 3,
      slug: 'dr-kabir-hossain',
      qualifications: [
        { title: { en: 'MBBS', bn: 'এমবিবিএস' }, institution: { en: 'Dhaka Medical College', bn: 'ঢাকা মেডিকেল কলেজ' }, year: '2001' },
        { title: { en: 'MD (Cardiology)', bn: 'এমডি (কার্ডিওলজি)' }, institution: { en: 'BSM Medical University', bn: 'বিএসএম মেডিকেল বিশ্ববিদ্যালয়' }, year: '2007' },
        { title: { en: 'Fellowship in Interventional Cardiology', bn: 'ইন্টারভেনশনাল কার্ডিওলজিতে ফেলোশিপ' }, institution: { en: 'National Heart Foundation', bn: 'ন্যাশনাল হার্ট ফাউন্ডেশন' }, year: '2010' },
      ],
      experience: [
        { title: { en: 'Senior Cardiologist', bn: 'সিনিয়র কার্ডিওলজিস্ট' }, institution: { en: 'Mirsarai General Hospital', bn: 'মীরসরাই জেনারেল হাসপাতাল' }, period: '2018 - Present', description: { en: 'Leading the cardiology department, performing angiographies and managing cardiac patients.', bn: 'কার্ডিওলজি বিভাগের নেতৃত্ব, অ্যাঞ্জিওগ্রাফি সম্পাদন এবং হৃদরোগী ব্যবস্থাপনা।' } },
        { title: { en: 'Interventional Cardiologist', bn: 'ইন্টারভেনশনাল কার্ডিওলজিস্ট' }, institution: { en: 'National Heart Foundation Hospital', bn: 'ন্যাশনাল হার্ট ফাউন্ডেশন হাসপাতাল' }, period: '2010 - 2018', description: { en: 'Performed angioplasty, stenting, and other interventional procedures.', bn: 'অ্যাঞ্জিওপ্লাস্টি, স্টেন্টিং এবং অন্যান্য ইন্টারভেনশনাল পদ্ধতি সম্পাদন।' } },
      ],
      specialties: [
        { en: 'Interventional Cardiology', bn: 'ইন্টারভেনশনাল কার্ডিওলজি' },
        { en: 'Echocardiography', bn: 'ইকোকার্ডিওগ্রাফি' },
        { en: 'Heart Failure Management', bn: 'হৃদযন্ত্রের ব্যর্থতা ব্যবস্থাপনা' },
        { en: 'Preventive Cardiology', bn: 'প্রতিরোধমূলক কার্ডিওলজি' },
      ],
      socialLinks: [
        { platform: 'linkedin', url: 'https://linkedin.com/in/dr-kabir' },
        { platform: 'website', url: 'https://drkabircardio.com' },
      ],
    },
    {
      name:        { en: 'Dr. Sayma Akter', bn: 'ডা. সায়মা আক্তার' },
      designation: { en: 'Gynecologist & Obstetrician', bn: 'গাইনোকোলজিস্ট ও অবস্টেট্রিশিয়ান' },
      department:  { en: 'Gynecology & Obstetrics', bn: 'গাইনোকোলজি ও অবস্টেট্রিক্স' },
      bio:         { en: 'Dr. Sayma Akter is a dedicated gynecologist committed to women\'s health. She has safely delivered thousands of babies and provides comprehensive care from adolescence through menopause.', bn: 'ডা. সায়মা আক্তার একজন নিবেদিতপ্রাণ স্ত্রীরোগ বিশেষজ্ঞ যিনি নারী স্বাস্থ্যের জন্য প্রতিশ্রুতিবদ্ধ। তিনি নিরাপদে হাজার হাজার শিশুর জন্ম দিয়েছেন এবং কৈশোর থেকে মেনোপজ পর্যন্ত ব্যাপক সেবা প্রদান করেন।' },
      image: '',
      email: 'dr.sayma@mirsaraihospital.com',
      phone: '+880 1700-000005',
      order: 4,
      slug: 'dr-sayma-akter',
      qualifications: [
        { title: { en: 'MBBS', bn: 'এমবিবিএস' }, institution: { en: 'Chittagong Medical College', bn: 'চট্টগ্রাম মেডিকেল কলেজ' }, year: '2002' },
        { title: { en: 'FCPS (OBGYN)', bn: 'এফসিপিএস (অবস-গাইনী)' }, institution: { en: 'Bangladesh College of Physicians & Surgeons', bn: 'বাংলাদেশ কলেজ অব ফিজিশিয়ানস অ্যান্ড সার্জনস' }, year: '2008' },
        { title: { en: 'MS (OBGYN)', bn: 'এমএস (অবস-গাইনী)' }, institution: { en: 'BSM Medical University', bn: 'বিএসএম মেডিকেল বিশ্ববিদ্যালয়' }, year: '2012' },
      ],
      experience: [
        { title: { en: 'Consultant Gynecologist', bn: 'পরামর্শক স্ত্রীরোগ বিশেষজ্ঞ' }, institution: { en: 'Mirsarai General Hospital', bn: 'মীরসরাই জেনারেল হাসপাতাল' }, period: '2017 - Present', description: { en: 'Managing high-risk pregnancies, performing surgeries, and leading women\'s health initiatives.', bn: 'উচ্চ-ঝুঁকিপূর্ণ গর্ভধারণ ব্যবস্থাপনা, অস্ত্রোপচার এবং নারী স্বাস্থ্য উদ্যোগের নেতৃত্ব।' } },
        { title: { en: 'Junior Consultant', bn: 'জুনিয়র পরামর্শক' }, institution: { en: 'Chittagong Medical College Hospital', bn: 'চট্টগ্রাম মেডিকেল কলেজ হাসপাতাল' }, period: '2008 - 2017', description: { en: 'Provided obstetric and gynecological care, conducted deliveries and surgeries.', bn: 'প্রসূতি ও স্ত্রীরোগ সেবা প্রদান, প্রসব ও অস্ত্রোপচার পরিচালনা।' } },
      ],
      specialties: [
        { en: 'High-Risk Pregnancy', bn: 'উচ্চ-ঝুঁকিপূর্ণ গর্ভধারণ' },
        { en: 'Laparoscopic Surgery', bn: 'ল্যাপারোস্কোপিক সার্জারি' },
        { en: 'Infertility Treatment', bn: 'বন্ধ্যাত্ব চিকিৎসা' },
        { en: 'Adolescent Gynecology', bn: 'কিশোরী স্ত্রীরোগ' },
      ],
      socialLinks: [
        { platform: 'facebook', url: 'https://facebook.com/drsayma' },
      ],
    },
    {
      name:        { en: 'Dr. Shahidul Islam', bn: 'ডা. শহীদুল ইসলাম' },
      designation: { en: 'Orthopedic Surgeon', bn: 'অর্থোপেডিক সার্জন' },
      department:  { en: 'Orthopedics', bn: 'অর্থোপেডিক্স বিভাগ' },
      bio:         { en: 'Dr. Shahidul Islam is an experienced orthopedic surgeon specializing in joint replacement and trauma surgery. He has helped countless patients regain mobility and return to an active lifestyle.', bn: 'ডা. শহীদুল ইসলাম একজন অভিজ্ঞ অর্থোপেডিক সার্জন যিনি জয়েন্ট রিপ্লেসমেন্ট এবং ট্রমা সার্জারিতে বিশেষজ্ঞ। তিনি অগণিত রোগীকে গতিশীলতা ফিরে পেতে এবং সক্রিয় জীবনযাত্রায় ফিরতে সাহায্য করেছেন।' },
      image: '',
      email: 'dr.shahidul@mirsaraihospital.com',
      phone: '+880 1700-000006',
      order: 5,
      slug: 'dr-shahidul-islam',
      qualifications: [
        { title: { en: 'MBBS', bn: 'এমবিবিএস' }, institution: { en: 'Rajshahi Medical College', bn: 'রাজশাহী মেডিকেল কলেজ' }, year: '2003' },
        { title: { en: 'MS (Orthopedics)', bn: 'এমএস (অর্থোপেডিক্স)' }, institution: { en: 'BSM Medical University', bn: 'বিএসএম মেডিকেল বিশ্ববিদ্যালয়' }, year: '2009' },
        { title: { en: 'Fellowship in Joint Replacement', bn: 'জয়েন্ট রিপ্লেসমেন্টে ফেলোশিপ' }, institution: { en: 'AIIMS New Delhi', bn: 'এমস নয়াদিল্লি' }, year: '2013' },
      ],
      experience: [
        { title: { en: 'Consultant Orthopedic Surgeon', bn: 'পরামর্শক অর্থোপেডিক সার্জন' }, institution: { en: 'Mirsarai General Hospital', bn: 'মীরসরাই জেনারেল হাসপাতাল' }, period: '2019 - Present', description: { en: 'Performing joint replacements, trauma surgeries, and managing the orthopedic department.', bn: 'জয়েন্ট রিপ্লেসমেন্ট, ট্রমা সার্জারি এবং অর্থোপেডিক বিভাগ পরিচালনা।' } },
        { title: { en: 'Assistant Professor', bn: 'সহকারী অধ্যাপক' }, institution: { en: 'Chittagong Medical College', bn: 'চট্টগ্রাম মেডিকেল কলেজ' }, period: '2009 - 2019', description: { en: 'Taught medical students and performed orthopedic surgeries at the teaching hospital.', bn: 'মেডিকেল শিক্ষার্থীদের পাঠদান এবং শিক্ষা হাসপাতালে অর্থোপেডিক সার্জারি সম্পাদন।' } },
      ],
      specialties: [
        { en: 'Joint Replacement Surgery', bn: 'জয়েন্ট রিপ্লেসমেন্ট সার্জারি' },
        { en: 'Trauma & Fracture Surgery', bn: 'ট্রমা ও ফ্র্যাকচার সার্জারি' },
        { en: 'Arthroscopy', bn: 'আর্থোস্কোপি' },
        { en: 'Sports Medicine', bn: 'ক্রীড়া চিকিৎসা' },
      ],
      socialLinks: [
        { platform: 'linkedin', url: 'https://linkedin.com/in/dr-shahidul' },
      ],
    },
    {
      name:        { en: 'Nurse Rahela Khatun', bn: 'নার্স রাহেলা খাতুন' },
      designation: { en: 'Head Nurse', bn: 'প্রধান নার্স' },
      department:  { en: 'Nursing Department', bn: 'নার্সিং বিভাগ' },
      bio:         { en: 'Rahela Khatun leads our nursing staff with compassion and professionalism. With over 18 years of nursing experience, she ensures every patient receives the highest standard of care and comfort.', bn: 'রাহেলা খাতুন সহানুভূতি ও পেশাদারিত্বের সাথে আমাদের নার্সিং কর্মীদের নেতৃত্ব দেন। ১৮ বছরেরও বেশি নার্সিং অভিজ্ঞতা নিয়ে, তিনি নিশ্চিত করেন যে প্রতিটি রোগী সর্বোচ্চ মানের যত্ন ও আরাম পান।' },
      image: '',
      email: 'rahela@mirsaraihospital.com',
      phone: '+880 1700-000003',
      order: 6,
      slug: 'nurse-rahela-khatun',
      qualifications: [
        { title: { en: 'Diploma in Nursing', bn: 'নার্সিং ডিপ্লোমা' }, institution: { en: 'Dhaka Nursing College', bn: 'ঢাকা নার্সিং কলেজ' }, year: '2002' },
        { title: { en: 'BSc in Nursing', bn: 'বিএসসি ইন নার্সিং' }, institution: { en: 'Bangladesh Open University', bn: 'বাংলাদেশ উন্মুক্ত বিশ্ববিদ্যালয়' }, year: '2008' },
        { title: { en: 'MSc in Nursing Administration', bn: 'এমএসসি ইন নার্সিং অ্যাডমিনিস্ট্রেশন' }, institution: { en: 'BSM Medical University', bn: 'বিএসএম মেডিকেল বিশ্ববিদ্যালয়' }, year: '2014' },
      ],
      experience: [
        { title: { en: 'Head Nurse', bn: 'প্রধান নার্স' }, institution: { en: 'Mirsarai General Hospital', bn: 'মীরসরাই জেনারেল হাসপাতাল' }, period: '2016 - Present', description: { en: 'Managing nursing staff, coordinating patient care, and maintaining quality standards.', bn: 'নার্সিং কর্মীদের ব্যবস্থাপনা, রোগীর সেবা সমন্বয় এবং মানের মান বজায় রাখা।' } },
        { title: { en: 'Senior Staff Nurse', bn: 'সিনিয়র স্টাফ নার্স' }, institution: { en: 'Chittagong Medical College Hospital', bn: 'চট্টগ্রাম মেডিকেল কলেজ হাসপাতাল' }, period: '2006 - 2016', description: { en: 'Provided critical care in ICU and CCU, supervised junior nurses.', bn: 'আইসিইউ এবং সিসিইউতে গুরুতর সেবা প্রদান, জুনিয়র নার্সদের তত্ত্বাবধান।' } },
        { title: { en: 'Staff Nurse', bn: 'স্টাফ নার্স' }, institution: { en: 'Upazila Health Complex', bn: 'উপজেলা স্বাস্থ্য কমপ্লেক্স' }, period: '2002 - 2006', description: { en: 'Provided primary healthcare services in a rural setting.', bn: 'গ্রামীণ পরিবেশে প্রাথমিক স্বাস্থ্যসেবা প্রদান।' } },
      ],
      specialties: [
        { en: 'Critical Care Nursing', bn: 'গুরুতর পরিচর্যা নার্সিং' },
        { en: 'Nursing Administration', bn: 'নার্সিং প্রশাসন' },
        { en: 'Patient Safety', bn: 'রোগী নিরাপত্তা' },
      ],
      socialLinks: [],
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

const seedOurTeam = async () => {
  const existing = await OurTeam.findOne();
  if (existing) {
    Object.assign(existing, data);
    await existing.save();
    console.log('✅ Our Team data updated successfully!');
    return;
  }
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
