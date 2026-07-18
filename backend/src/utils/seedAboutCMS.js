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

const MONGODB_URI = process.env.MONGODB_URI

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

    // 3. Migrate Career
    if (fs.existsSync(careerJsonPath)) {
      const careerData = JSON.parse(fs.readFileSync(careerJsonPath, 'utf-8'));
      const existingCareer = await Career.findOne();
      if (!existingCareer) {
        await Career.create(careerData);
        console.log('📝 Career data seeded successfully!');
      } else {
        console.log('⚠️ Career data already exists in MongoDB, skipping seed.');
      }
    } else {
      console.error(`❌ Could not find career.json at ${careerJsonPath}`);
    }

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed.');
    process.exit(0);
  }
}

seedData();
