import mongoose from 'mongoose';
import { setServers } from 'node:dns/promises';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import AboutUs from '../models/aboutUs.model.js';
import MissionVision from '../models/missionVision.model.js';
import Gallery from '../models/gallery.model.js';
import Career from '../models/career.model.js';

// Set custom DNS servers for reliable resolution (Cloudflare + Google)
setServers(['1.1.1.1', '8.8.8.8']);

// Resolve directory paths in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env variables
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://mirsaraiDB:doXgpGjpy6BJCBE4@cluster0.ssnb3vx.mongodb.net/?appName=Cluster0';

async function seedData() {
  try {
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected successfully!');

    // Relative paths to frontend public JSON data files
    const aboutDataPath = path.resolve(__dirname, '../../../frontend/public/data/aboutData.json');
    const galleryJsonPath = path.resolve(__dirname, '../../../frontend/public/data/gallery.json');
    const careerJsonPath = path.resolve(__dirname, '../../../frontend/public/data/career.json');

    // 1. Migrate About Us
    if (fs.existsSync(aboutDataPath)) {
      const fullAboutData = JSON.parse(fs.readFileSync(aboutDataPath, 'utf-8'));
      
      // About Us (from fullAboutData.about)
      const existingAboutUs = await AboutUs.findOne();
      if (!existingAboutUs && fullAboutData.about) {
        // Ensure section config and SEO fields are default values
        await AboutUs.create(fullAboutData.about);
        console.log('📝 About Us data seeded successfully!');
      } else {
        console.log('⚠️ About Us data already exists in MongoDB, skipping seed.');
      }

      // Mission & Vision (from fullAboutData.missionVision)
      const existingMV = await MissionVision.findOne();
      if (!existingMV && fullAboutData.missionVision) {
        await MissionVision.create(fullAboutData.missionVision);
        console.log('📝 Mission & Vision data seeded successfully!');
      } else {
        console.log('⚠️ Mission & Vision data already exists in MongoDB, skipping seed.');
      }
    } else {
      console.error(`❌ Could not find aboutData.json at ${aboutDataPath}`);
    }

    // 2. Migrate Gallery
    if (fs.existsSync(galleryJsonPath)) {
      const galleryData = JSON.parse(fs.readFileSync(galleryJsonPath, 'utf-8'));
      const existingGallery = await Gallery.findOne();
      if (!existingGallery) {
        await Gallery.create(galleryData);
        console.log('📝 Gallery data seeded successfully!');
      } else {
        console.log('⚠️ Gallery data already exists in MongoDB, skipping seed.');
      }
    } else {
      console.error(`❌ Could not find gallery.json at ${galleryJsonPath}`);
    }

    // 3. Migrate Career with new schema structure
    const defaultCareer = {
      title: {
        en: "Join Our Team",
        bn: "আমাদের দলে যোগ দিন"
      },
      description: {
        en: "Build Your Career in Healthcare Excellence at Mirsarai General Hospital. We are always looking for passionate professionals to join us.",
        bn: "মীরসরাই জেনারেল হাসপাতালে স্বাস্থ্যসেবা উৎকর্ষে আপনার ক্যারিয়ার গড়ে তুলুন। আমরা সর্বদা আমাদের সাথে যোগ দেওয়ার জন্য উৎসাহী পেশাদারদের খুঁজছি।"
      },
      image: "/about-us.jpg",
      jobListings: [
        {
          id: 1,
          title: { en: "Senior Consultant - Cardiology", bn: "সিনিয়র পরামর্শদাতা - হৃদরোগ বিভাগ" },
          department: { en: "Cardiology", bn: "হৃদরোগ বিভাগ" },
          location: { en: "Mirsarai, Chittagong", bn: "মীরসরাই, চট্টগ্রাম" },
          jobType: { en: "Full Time", bn: "পূর্ণকালীন" },
          description: { en: "We are looking for an experienced cardiologist to join our team.", bn: "আমরা আমাদের দলে যোগদানের জন্য একজন অভিজ্ঞ হৃদরোগ বিশেষজ্ঞ খুঁজছি।" },
          requirements: { en: "MBBS, MD/FCPS in Cardiology with 5+ years of clinical experience.", bn: "কার্ডিওলজিতে এমবিবিএস, এমডি/এফসিপিএস এবং ৫+ বছরের ক্লিনিকাল অভিজ্ঞতা।" },
          applyLink: "mailto:careers@mirsaraihospital.com",
          bannerImage: "/about-us.jpg",
          isActive: true
        },
        {
          id: 2,
          title: { en: "Staff Nurse - ICU", bn: "স্টাফ নার্স - আইসিইউ" },
          department: { en: "Intensive Care Unit", bn: "নিবিড় পরিচর্যা ইউনিট" },
          location: { en: "Mirsarai, Chittagong", bn: "মীরসরাই, চট্টগ্রাম" },
          jobType: { en: "Full Time", bn: "পূর্ণকালীন" },
          description: { en: "Experienced ICU nurse needed to provide exceptional care for critical patients.", bn: "গুরুতর রোগীদের ব্যতিক্রমী যত্ন প্রদানের জন্য অভিজ্ঞ আইসিইউ নার্স প্রয়োজন।" },
          requirements: { en: "B.Sc or Diploma in Nursing with 2+ years of critical care experience.", bn: "নার্সিংয়ে বিএসসি বা ডিপ্লোমা এবং ক্রিটিকাল কেয়ার ইউনিটে ২+ বছরের অভিজ্ঞতা।" },
          applyLink: "mailto:careers@mirsaraihospital.com",
          bannerImage: "/about-us.jpg",
          isActive: true
        }
      ],
      sections: {
        hero: { isVisible: true, order: 1 },
        jobListings: { isVisible: true, order: 2 }
      },
      seo: {
        metaTitle: { en: "Join Our Team | Mirsarai General Hospital", bn: "আমাদের দলে যোগ দিন | মীরসরাই জেনারেল হাসপাতাল" },
        metaDescription: { en: "Build your career in healthcare excellence at Mirsarai General Hospital.", bn: "মীরসরাই জেনারেল হাসপাতালে স্বাস্থ্যসেবা উৎকর্ষে আপনার ক্যারিয়ার গড়ে তুলুন।" },
        keywords: { en: "career, jobs, recruitment, healthcare jobs, mirsarai", bn: "ক্যারিয়ার, চাকরি, নিয়োগ, স্বাস্থ্যসেবা চাকরি, মীরসরাই" },
        ogImage: "/about-us.jpg"
      },
      createdBy: "seed-script"
    };

    console.log('🧹 Clearing existing Career data to reset schema...');
    await Career.deleteMany({});
    await Career.create(defaultCareer);
    console.log('📝 Career data seeded successfully with the new schema!');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed.');
    process.exit(0);
  }
}

seedData();
