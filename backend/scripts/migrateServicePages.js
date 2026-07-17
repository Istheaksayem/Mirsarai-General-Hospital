/**
 * Migration: Service Pages
 *
 * Idempotent — safe to run multiple times.
 * Writes directly to the new `diagnostic_services` and `nicu_baby_care` collections.
 *
 * Usage:  npm run migrate:service-pages
 *         node scripts/migrateServicePages.js
 */

import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { setServers } from 'node:dns';
import dotenv from 'dotenv';
import env from '../src/config/env.js';

dotenv.config();

setServers(['8.8.8.8', '1.1.1.1']);

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

const toSlug = (type) => type;

const DATA_DIR = path.resolve(__dirname, '../../frontend/public/data');

function readDiagnostic() {
  const raw = JSON.parse(
    fs.readFileSync(path.join(DATA_DIR, 'diagnosticService.json'), 'utf-8')
  );
  const d = raw.diagnostic;

  return {
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
    workingHours: d.workingHours
      ? {
          weekdays: d.workingHours.weekdays || '',
          weekends: d.workingHours.weekends || '',
          emergency: bil(d.workingHours.emergency)
        }
      : {},
    statistics: (d.statistics || []).map((s) => ({
      value: s.value || '',
      label: bil(s.label)
    })),
    seo: {
      metaTitle: bil({ en: 'Diagnostic Services | Mirsarai General Hospital', bn: 'ডায়াগনস্টিক সেবা | মীরসরাই জেনারেল হাসপাতাল' }),
      metaDescription: bil({ en: 'State-of-the-art diagnostic center equipped with modern technology for accurate and timely results.', bn: 'আধুনিক প্রযুক্তিতে সজ্জিত অত্যাধুনিক ডায়াগনস্টিক সেন্টার যা নির্ভুল ও সময়োপযোগী ফলাফল প্রদান করে।' })
    }
  };
}

function readNICU() {
  const raw = JSON.parse(
    fs.readFileSync(path.join(DATA_DIR, 'nicuService.json'), 'utf-8')
  );
  const d = raw.nicu;

  const babyCareRaw = JSON.parse(
    fs.readFileSync(path.join(DATA_DIR, 'babyCare.json'), 'utf-8')
  );
  const baby = babyCareRaw.babyCare;

  return {
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
      value: s.value || '',
      label: bil(s.label)
    })),
    seo: {
      metaTitle: bil({ en: 'NICU & Baby Care | Mirsarai General Hospital', bn: 'এনআইসিইউ ও শিশু সেবা | মীরসরাই জেনারেল হাসপাতাল' }),
      metaDescription: bil({ en: 'Specialized neonatal intensive care unit providing expert medical care for newborns.', bn: 'নবজাতকদের জন্য বিশেষায়িত চিকিৎসা সেবা প্রদানকারী নিওনাটাল ইনটেনসিভ কেয়ার ইউনিট।' })
    }
  };
}

async function migrate() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(env.mongodb.uri);
  console.log('Connected to MongoDB');

  const { default: DiagnosticService } = await import('../src/models/diagnosticService.model.js');
  const { default: NicuBabyCare } = await import('../src/models/nicuBabyCare.model.js');

  const documents = [
    { model: DiagnosticService, data: readDiagnostic() },
    { model: NicuBabyCare, data: readNICU() },
  ];

  let created = 0;
  let updated = 0;

  for (const { model, data } of documents) {
    const existing = await model.findOne({ type: data.type });

    if (existing) {
      await model.findOneAndUpdate(
        { type: data.type },
        { $set: { ...data, updatedAt: new Date() } },
        { new: true }
      );
      console.log(`  Updated: ${data.type}`);
      updated++;
    } else {
      await model.create(data);
      console.log(`  Created: ${data.type}`);
      created++;
    }
  }

  console.log(`\nMigration complete — ${created} created, ${updated} updated`);
  await mongoose.disconnect();
  process.exit(0);
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
