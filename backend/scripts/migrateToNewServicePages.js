/**
 * Migration: Split shared ServicePage model into independent modules
 *
 * Reads existing data from the old `service_pages` collection
 * and upserts into the new `diagnostic_services` and `nicu_baby_care` collections.
 *
 * The old collection is NOT deleted — rollback-safe.
 *
 * Usage:  node scripts/migrateToNewServicePages.js
 */

import mongoose from 'mongoose';
import { setServers } from 'node:dns';
import dotenv from 'dotenv';
import env from '../src/config/env.js';

dotenv.config();

setServers(['8.8.8.8', '1.1.1.1']);

// ── Helpers ──────────────────────────────────────────────────────────────────

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

// ── Migration ────────────────────────────────────────────────────────────────

async function migrate() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(env.mongodb.uri);
  console.log('Connected to MongoDB');

  const db = mongoose.connection.db;

  const oldCollection = db.collection('service_pages');

  // 1. Migrate Diagnostic Services
  const oldDiagnostic = await oldCollection.findOne({ type: 'diagnostic-services' });
  if (oldDiagnostic) {
    const diagnosticDoc = {
      type: 'diagnostic-services',
      slug: 'diagnostic-services',
      status: oldDiagnostic.status || 'published',
      title: bil(oldDiagnostic.title),
      subtitle: bil(oldDiagnostic.subtitle),
      heroDescription: bil(oldDiagnostic.heroDescription),
      backgroundImage: oldDiagnostic.backgroundImage || '',
      description: bil(oldDiagnostic.description),
      features: (oldDiagnostic.features || []).map((f) => ({
        title: bil(f.title),
        description: bil(f.description),
        icon: f.icon || ''
      })),
      services: (oldDiagnostic.services || []).map((s) => ({
        category: bil(s.category),
        icon: s.icon || '',
        accent: s.accent || '#1E2B7A',
        tests: asBilingualArray(s.tests)
      })),
      workingHours: oldDiagnostic.workingHours
        ? {
            weekdays: oldDiagnostic.workingHours.weekdays || '',
            weekends: oldDiagnostic.workingHours.weekends || '',
            emergency: bil(oldDiagnostic.workingHours.emergency)
          }
        : {},
      statistics: (oldDiagnostic.statistics || []).map((s) => ({
        value: s.value || '',
        label: bil(s.label)
      })),
      seo: {
        metaTitle: bil(oldDiagnostic.seo?.metaTitle),
        metaDescription: bil(oldDiagnostic.seo?.metaDescription)
      },
      createdAt: oldDiagnostic.createdAt || new Date(),
      updatedAt: new Date()
    };

    await db.collection('diagnostic_services').updateOne(
      { type: 'diagnostic-services' },
      { $set: diagnosticDoc },
      { upsert: true }
    );
    console.log('  Migrated: diagnostic-services');
  } else {
    console.log('  SKIP: diagnostic-services — not found in old collection');
  }

  // 2. Migrate NICU & Baby Care (merge nicu + baby-care into one document)
  const oldNicu = await oldCollection.findOne({ type: 'nicu' });
  const oldBabyCare = await oldCollection.findOne({ type: 'baby-care' });

  if (oldNicu) {
    const nicuDoc = {
      type: 'nicu',
      slug: 'nicu',
      status: oldNicu.status || 'published',
      title: bil(oldNicu.title),
      subtitle: bil(oldNicu.subtitle),
      heroDescription: bil(oldNicu.heroDescription),
      backgroundImage: oldNicu.backgroundImage || '',
      description: bil(oldNicu.description),
      features: (oldNicu.features || []).map((f) => ({
        title: bil(f.title),
        description: bil(f.description),
        icon: f.icon || ''
      })),
      services: (oldNicu.services || []).map((s) => ({
        category: bil(s.category),
        icon: s.icon || '',
        accent: s.accent || '#f59e0b',
        items: asBilingualArray(s.items)
      })),
      equipment: asBilingualArray(oldNicu.equipment),
      guidelines: (oldNicu.guidelines || []).map((g) => {
        if (typeof g === 'string') return { en: g, bn: '' };
        return { en: g.en || '', bn: g.bn || '' };
      }),
      // Merge vaccinationSchedule + workingHours from baby-care document
      vaccinationSchedule: oldBabyCare
        ? (oldBabyCare.vaccinationSchedule || []).map((v) => ({
            age: bil(v.age),
            vaccines: Array.isArray(v.vaccines) ? v.vaccines.filter(Boolean) : []
          }))
        : [],
      workingHours: oldBabyCare?.workingHours
        ? {
            weekdays: oldBabyCare.workingHours.weekdays || '',
            emergency: bil(oldBabyCare.workingHours.emergency)
          }
        : {},
      statistics: (oldNicu.statistics || []).map((s) => ({
        value: s.value || '',
        label: bil(s.label)
      })),
      seo: {
        metaTitle: bil(oldNicu.seo?.metaTitle),
        metaDescription: bil(oldNicu.seo?.metaDescription)
      },
      createdAt: oldNicu.createdAt || new Date(),
      updatedAt: new Date()
    };

    await db.collection('nicu_baby_care').updateOne(
      { type: 'nicu' },
      { $set: nicuDoc },
      { upsert: true }
    );
    console.log('  Migrated: nicu (with merged baby-care content)');
  } else {
    console.log('  SKIP: nicu — not found in old collection');
  }

  console.log('\nMigration complete. Old `service_pages` collection preserved for rollback.');
  await mongoose.disconnect();
  process.exit(0);
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
