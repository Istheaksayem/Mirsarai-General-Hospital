/**
 * Migration Script: Backfill appointmentId and appointmentSource for existing appointments
 *
 * This script is ONE-TIME and IDEMPOTENT. It:
 * 1. Finds appointments without appointmentId → generates unique IDs
 * 2. Finds appointments without appointmentSource → sets appropriate defaults
 * 3. Processes in batches to handle large datasets
 * 4. Logs a summary of results
 *
 * Usage:
 *   node scripts/migrateAppointments.js
 *
 * Safe to run multiple times — will skip already-migrated records.
 *
 * Run BEFORE production deployment to ensure backward compatibility
 * with the new Appointment schema.
 */

import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const BATCH_SIZE = 100;
const MONGO_URI = process.env.MONGODB_URI || process.env.DATABASE_URL;

if (!MONGO_URI) {
  console.error('ERROR: MONGODB_URI is not set. Check your .env file.');
  process.exit(1);
}

// Minimal schema references to avoid importing full app
const counterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  seq:  { type: Number, default: 0 },
});
const Counter = mongoose.model('Counter', counterSchema);

const appointmentSchema = new mongoose.Schema(
  {
    appointmentId: { type: String, unique: true, sparse: true, trim: true },
    appointmentSource: { type: String },
    createdBy: { type: String },
    createdAt: { type: Date },
  },
  { strict: false }
);

const Appointment = mongoose.model('Appointment', appointmentSchema);

async function generateAppointmentId() {
  const counter = await Counter.findOneAndUpdate(
    { name: 'appointmentId' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  const seq = String(counter.seq).padStart(6, '0');
  return `MGH-APP-${seq}`;
}

function inferSource(appointment) {
  const createdBy = (appointment.createdBy || '').toLowerCase();
  if (!createdBy || createdBy === 'online' || createdBy === 'public') {
    return 'online';
  }
  if (createdBy === 'patient-portal') {
    return 'patient-portal';
  }
  if (createdBy === 'receptionist' || createdBy === 'reception') {
    return 'receptionist';
  }
  // Admin-created appointments default to super-admin
  return 'super-admin';
}

async function runMigration() {
  console.log('='.repeat(60));
  console.log('Appointment Migration Script');
  console.log('='.repeat(60));
  console.log(`Batch size: ${BATCH_SIZE}`);
  console.log('');

  try {
    await mongoose.connect(MONGO_URI);
    console.log(`Connected to MongoDB: ${MONGO_URI.substring(0, 30)}...`);
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  }

  let totalScanned = 0;
  let idUpdated = 0;
  let sourceUpdated = 0;
  let skipped = 0;
  let failed = 0;

  // ── Step 1: Backfill appointmentId ───────────────────────────────────────
  console.log('');
  console.log('── Step 1: Backfilling appointmentId ──────────────────────────');

  let hasMore = true;
  let lastId = null;

  while (hasMore) {
    const query = { appointmentId: { $exists: false } };
    if (lastId) query._id = { $gt: lastId };

    const batch = await Appointment.find(query)
      .sort({ _id: 1 })
      .limit(BATCH_SIZE)
      .lean();

    if (batch.length === 0) {
      hasMore = false;
      break;
    }

    totalScanned += batch.length;

    for (const appt of batch) {
      try {
        const newId = await generateAppointmentId();
        await Appointment.updateOne(
          { _id: appt._id },
          { $set: { appointmentId: newId } }
        );
        idUpdated++;
      } catch (err) {
        // If duplicate key (shouldn't happen with $exists:false filter), skip
        if (err.code === 11000) {
          skipped++;
        } else {
          console.error(`  Failed for appointment ${appt._id}:`, err.message);
          failed++;
        }
      }
    }

    lastId = batch[batch.length - 1]._id;
    console.log(`  Processed ${idUpdated} IDs so far...`);
  }

  // ── Step 2: Backfill appointmentSource ───────────────────────────────────
  console.log('');
  console.log('── Step 2: Backfilling appointmentSource ──────────────────────');

  hasMore = true;
  lastId = null;
  let sourceBatchCount = 0;

  while (hasMore) {
    const query = { appointmentSource: { $exists: false } };
    if (lastId) query._id = { $gt: lastId };

    const batch = await Appointment.find(query)
      .sort({ _id: 1 })
      .limit(BATCH_SIZE)
      .lean();

    if (batch.length === 0) {
      hasMore = false;
      break;
    }

    for (const appt of batch) {
      try {
        const source = inferSource(appt);
        await Appointment.updateOne(
          { _id: appt._id },
          { $set: { appointmentSource: source } }
        );
        sourceUpdated++;
      } catch (err) {
        console.error(`  Failed for appointment ${appt._id}:`, err.message);
        failed++;
      }
    }

    sourceBatchCount += batch.length;
    lastId = batch[batch.length - 1]._id;
    console.log(`  Processed ${sourceUpdated} sources so far...`);
  }

  // ── Summary ──────────────────────────────────────────────────────────────
  console.log('');
  console.log('='.repeat(60));
  console.log('MIGRATION COMPLETE');
  console.log('='.repeat(60));
  console.log(`  Total scanned:    ${totalScanned}`);
  console.log(`  IDs assigned:     ${idUpdated}`);
  console.log(`  Sources set:      ${sourceUpdated}`);
  console.log(`  Skipped:          ${skipped}`);
  console.log(`  Failed:           ${failed}`);
  console.log('');

  await mongoose.disconnect();
  console.log('Disconnected from MongoDB.');
  process.exit(0);
}

runMigration();
