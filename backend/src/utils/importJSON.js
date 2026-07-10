import mongoose from 'mongoose';
import { setServers } from 'node:dns/promises';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import Homepage from '../models/homepage.model.js';
import Hero from '../models/hero.model.js';

// Set custom DNS servers for reliable resolution (Cloudflare + Google)
setServers(['1.1.1.1', '8.8.8.8']);

// Resolve directory paths in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env variables
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://mirsaraiDB:doXgpGjpy6BJCBE4@cluster0.ssnb3vx.mongodb.net/?appName=Cluster0';

async function importData() {
  try {
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected successfully!');

    // Relative paths to frontend public JSON data files
    const homepageJsonPath = path.resolve(__dirname, '../../../frontend/public/data/homepage.json');
    const heroJsonPath = path.resolve(__dirname, '../../../frontend/public/data/hero.json');

    // 1. Migrate Homepage
    if (fs.existsSync(homepageJsonPath)) {
      const homepageData = JSON.parse(fs.readFileSync(homepageJsonPath, 'utf-8'));
      
      // Check if document already exists
      const existing = await Homepage.findOne();
      if (!existing) {
        await Homepage.create(homepageData);
        console.log('📝 Homepage data imported successfully!');
      } else {
        console.log('⚠️ Homepage data already exists in MongoDB, skipping import.');
      }
    } else {
      console.error(`❌ Could not find homepage.json at ${homepageJsonPath}`);
    }

    // 2. Migrate Hero
    if (fs.existsSync(heroJsonPath)) {
      const heroData = JSON.parse(fs.readFileSync(heroJsonPath, 'utf-8'));
      
      // Check if document already exists
      const existing = await Hero.findOne();
      if (!existing) {
        await Hero.create(heroData);
        console.log('📝 Hero data imported successfully!');
      } else {
        console.log('⚠️ Hero data already exists in MongoDB, skipping import.');
      }
    } else {
      console.error(`❌ Could not find hero.json at ${heroJsonPath}`);
    }

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed.');
    process.exit(0);
  }
}

importData();
