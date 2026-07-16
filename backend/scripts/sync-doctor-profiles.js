/**
 * Migration: Sync DoctorProfiles → Doctor collection
 *
 * Idempotent — safe to run multiple times.
 * 1. Generates slugs for DoctorProfiles missing one
 * 2. Creates Doctor docs for DoctorProfiles that have a slug but no matching Doctor doc
 *
 * Usage:  node scripts/sync-doctor-profiles.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/test';

const generateSlug = (name) => {
  return name.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
};

const doctorProfileSchema = new mongoose.Schema({}, { strict: false, collection: 'doctorprofiles' });
const doctorSchema = new mongoose.Schema({}, { strict: false, collection: 'doctors' });
const userSchema = new mongoose.Schema({}, { strict: false, collection: 'users' });

const DoctorProfile = mongoose.model('MigrationDoctorProfile', doctorProfileSchema);
const Doctor = mongoose.model('MigrationDoctor', doctorSchema);
const User = mongoose.model('MigrationUser', userSchema);

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB:', MONGODB_URI);

  const actions = [];

  // Phase 1: DoctorProfiles missing slug
  const noSlugProfiles = await DoctorProfile.find({
    slug: { $in: [null, undefined, ''] }
  }).lean();

  for (const prof of noSlugProfiles) {
    const user = await User.findById(prof.userId).lean();
    const nameEn = prof.name?.en || user?.fullName || 'doctor';
    let baseSlug = generateSlug(nameEn);
    if (!baseSlug) baseSlug = `doctor-${prof.doctorCode || Date.now()}`;

    let slug = baseSlug;
    let count = 0;
    while (true) {
      const docExists = await Doctor.findOne({ slug }).lean();
      const profExists = await DoctorProfile.findOne({ slug, _id: { $ne: prof._id } }).lean();
      if (!docExists && !profExists) break;
      count++;
      slug = `${baseSlug}-${count}`;
    }

    await DoctorProfile.findByIdAndUpdate(prof._id, { $set: { slug } });
    actions.push(`SLUG: ${prof._id} (${nameEn}) → ${slug}`);

    // Now create Doctor doc since we have a slug
    const existingDoc = await Doctor.findOne({ slug }).lean();
    if (!existingDoc) {
      await Doctor.create({
        slug,
        name: { en: nameEn, bn: prof.name?.bn || '' },
        designation: { en: prof.designation || 'Staff', bn: '' },
        specialization: { en: prof.specialization || 'TBD', bn: '' },
        department: { en: prof.department || 'General', bn: '' },
        qualification: prof.qualification || 'TBD',
        phone: prof.phone || user?.phone || '',
        email: prof.email || user?.email || '',
        consultationFee: prof.consultationFee || 0,
        availableDays: prof.availableDays || [],
        image: prof.image || prof.profilePhoto || '',
        about: { en: prof.biography || prof.about?.en || '', bn: '' },
        isVisible: prof.profileVisibility === 'published',
        createdBy: prof.userId,
        updatedBy: prof.userId,
      });
      actions.push(`  → Doctor created for slug ${slug}`);
    }
  }

  // Phase 2: DoctorProfiles with slug but no matching Doctor doc
  const sluggedProfiles = await DoctorProfile.find({
    slug: { $nin: [null, undefined, ''] }
  }).lean();

  for (const prof of sluggedProfiles) {
    const existingDoc = await Doctor.findOne({ slug: prof.slug }).lean();
    if (existingDoc) continue;

    const user = await User.findById(prof.userId).lean();
    const nameEn = prof.name?.en || user?.fullName || 'doctor';

    await Doctor.create({
      slug: prof.slug,
      name: { en: nameEn, bn: prof.name?.bn || '' },
      designation: { en: prof.designation || 'Staff', bn: '' },
      specialization: { en: prof.specialization || 'TBD', bn: '' },
      department: { en: prof.department || 'General', bn: '' },
      qualification: prof.qualification || 'TBD',
      phone: prof.phone || user?.phone || '',
      email: prof.email || user?.email || '',
      consultationFee: prof.consultationFee || 0,
      availableDays: prof.availableDays || [],
      image: prof.image || prof.profilePhoto || '',
      about: { en: prof.biography || prof.about?.en || '', bn: '' },
      isVisible: prof.profileVisibility === 'published',
      createdBy: prof.userId,
      updatedBy: prof.userId,
    });
    actions.push(`MISSING: Doctor created for existing slug ${prof.slug} (${nameEn})`);
  }

  console.log('\n=== Migration Results ===');
  if (actions.length === 0) {
    console.log('No actions needed — all profiles are in sync.');
  } else {
    actions.forEach(a => console.log(a));
  }
  console.log(`Total actions: ${actions.length}`);

  await mongoose.disconnect();
  console.log('\nDone.');
}

main().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
