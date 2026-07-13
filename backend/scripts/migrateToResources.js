import mongoose from 'mongoose';
import { setServers } from 'node:dns/promises';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

setServers(['1.1.1.1', '8.8.8.8']);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const loadJSON = (relativePath) => {
  const fullPath = path.join(__dirname, '..', '..', relativePath);
  if (!fs.existsSync(fullPath)) {
    console.warn(`  ⚠ File not found: ${fullPath}`);
    return null;
  }
  return JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
};

const run = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mirsarai_hospital';
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // ── Health Blog ─────────────────────────────────────────────────────────
    console.log('── Health Blog ──────────────────────────────────────────────');
    const healthBlogJSON = loadJSON('frontend/public/data/healthBlog.json');
    if (healthBlogJSON) {
      const { default: HealthBlog } = await import('../src/models/healthBlog.model.js');
      const existing = await HealthBlog.findOne();
      if (existing) {
        console.log('  ℹ Health Blog document already exists — updating...');
        existing.set(healthBlogJSON);
        await existing.save();
      } else {
        await HealthBlog.create(healthBlogJSON);
      }
      console.log('  ✅ Health Blog migrated');
    }

    // ── Emergency Information ───────────────────────────────────────────────
    console.log('\n── Emergency Information ────────────────────────────────────');
    const emergencyJSON = loadJSON('frontend/public/data/emergencyInfo.json');
    if (emergencyJSON) {
      const { default: EmergencyInfo } = await import('../src/models/emergencyInfo.model.js');
      const existing = await EmergencyInfo.findOne();
      if (existing) {
        console.log('  ℹ Emergency Info document already exists — updating...');
        existing.set(emergencyJSON);
        await existing.save();
      } else {
        await EmergencyInfo.create(emergencyJSON);
      }
      console.log('  ✅ Emergency Information migrated');
    }

    // ── FAQ ─────────────────────────────────────────────────────────────────
    console.log('\n── FAQ ──────────────────────────────────────────────────────');
    const faqJSON = loadJSON('frontend/public/data/faq.json');
    if (faqJSON) {
      const { default: FAQ } = await import('../src/models/faq.model.js');
      const existing = await FAQ.findOne();
      if (existing) {
        console.log('  ℹ FAQ document already exists — updating...');
        existing.set(faqJSON);
        await existing.save();
      } else {
        await FAQ.create(faqJSON);
      }
      console.log('  ✅ FAQ migrated');
    }

    console.log('\n✅ Migration complete!');
  } catch (err) {
    console.error('\n❌ Migration failed:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

run();
