import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { setServers } from 'node:dns';
import dotenv from 'dotenv';

dotenv.config();

setServers(['8.8.8.8', '1.1.1.1']);

import DiagnosticService from '../models/diagnosticService.model.js';
import NicuBabyCare from '../models/nicuBabyCare.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const bil = (val) => {
  if (!val) return { en: '', bn: '' };
  if (typeof val === 'object' && val.en !== undefined) return val;
  if (typeof val === 'string') return { en: val, bn: '' };
  return { en: '', bn: '' };
};

const asBilingualArray = (arr) =>
  Array.isArray(arr) ? arr.filter(Boolean).map((item) => {
    if (typeof item === 'object' && item.en !== undefined) return item;
    if (typeof item === 'string') return { en: item, bn: '' };
    return { en: '', bn: '' };
  }) : [];

const seedDiagnostic = async () => {
  const raw = JSON.parse(
    fs.readFileSync(
      path.resolve(__dirname, '../../../frontend/public/data/diagnosticService.json'),
      'utf-8'
    )
  );
  const d = raw.diagnostic;
  const data = {
    type: 'diagnostic-services',
    slug: 'diagnostic-services',
    status: 'published',
    title: bil(d.title),
    subtitle: bil(d.subtitle),
    heroDescription: bil(d.heroDescription),
    backgroundImage: d.backgroundImage || '',
    description: bil(d.description),
    features: (d.features || []).map((f) => ({
      title: bil(f.title),
      description: bil(f.description),
      icon: f.icon || ''
    })),
    services: (d.services || []).map((s) => ({
      category: bil(s.category),
      icon: s.icon || '',
      accent: s.accent || '#1E2B7A',
      tests: asBilingualArray(s.tests)
    })),
    workingHours: d.workingHours || {},
    statistics: (d.statistics || []).map((s) => ({
      value: s.value,
      label: bil(s.label)
    })),
    seo: {
      metaTitle: bil({ en: 'Diagnostic Services | Mirsarai General Hospital', bn: 'ডায়াগনস্টিক সেবা | মীরসরাই জেনারেল হাসপাতাল' }),
      metaDescription: bil({ en: 'State-of-the-art diagnostic center equipped with modern technology for accurate and timely results.', bn: 'আধুনিক প্রযুক্তিতে সজ্জিত অত্যাধুনিক ডায়াগনস্টিক সেন্টার যা নির্ভুল ও সময়োপযোগী ফলাফল প্রদান করে।' })
    }
  };

  await DiagnosticService.findOneAndUpdate(
    { type: data.type },
    { $set: data },
    { upsert: true, new: true }
  );
  console.log(`Seeded: ${data.type}`);
};

const seedNICU = async () => {
  const raw = JSON.parse(
    fs.readFileSync(
      path.resolve(__dirname, '../../../frontend/public/data/nicuService.json'),
      'utf-8'
    )
  );
  const d = raw.nicu;

  const babyCareRaw = JSON.parse(
    fs.readFileSync(
      path.resolve(__dirname, '../../../frontend/public/data/babyCare.json'),
      'utf-8'
    )
  );
  const baby = babyCareRaw.babyCare;

  const data = {
    type: 'nicu',
    slug: 'nicu',
    status: 'published',
    title: bil(d.title),
    subtitle: bil(d.subtitle),
    heroDescription: bil(d.heroDescription),
    backgroundImage: d.backgroundImage || '',
    description: bil(d.description),
    features: (d.features || []).map((f) => ({
      title: bil(f.title),
      description: bil(f.description),
      icon: f.icon || ''
    })),
    services: (d.services || []).map((s) => ({
      category: bil(s.category),
      icon: s.icon || '',
      accent: s.accent || '#f59e0b',
      items: asBilingualArray(s.items)
    })),
    equipment: asBilingualArray(d.equipment),
    guidelines: (d.guidelines || []).map((g) => {
      if (typeof g === 'string') return { en: g, bn: '' };
      return { en: g.en || '', bn: g.bn || '' };
    }),
    vaccinationSchedule: (baby.vaccinationSchedule || []).map((v) => ({
      age: bil(v.age),
      vaccines: Array.isArray(v.vaccines) ? v.vaccines.filter(Boolean) : []
    })),
    workingHours: baby.workingHours
      ? {
          weekdays: baby.workingHours.weekdays || '',
          emergency: bil(baby.workingHours.emergency)
        }
      : {},
    statistics: (d.statistics || []).map((s) => ({
      value: s.value,
      label: bil(s.label)
    })),
    seo: {
      metaTitle: bil({ en: 'NICU & Baby Care | Mirsarai General Hospital', bn: 'এনআইসিইউ ও শিশু সেবা | মীরসরাই জেনারেল হাসপাতাল' }),
      metaDescription: bil({ en: 'Specialized neonatal intensive care unit providing expert medical care for newborns.', bn: 'নবজাতকদের জন্য বিশেষায়িত চিকিৎসা সেবা প্রদানকারী নিওনাটাল ইনটেনসিভ কেয়ার ইউনিট।' })
    }
  };

  await NicuBabyCare.findOneAndUpdate(
    { type: data.type },
    { $set: data },
    { upsert: true, new: true }
  );
  console.log(`Seeded: ${data.type}`);
};

const seed = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mirsarai_hospital';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    await seedDiagnostic();
    await seedNICU();

    console.log('All service pages seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

seed();
