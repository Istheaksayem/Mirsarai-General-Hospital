import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

import User from '../models/user.model.js';
import DoctorProfile from '../models/doctorProfile.model.js';
import Doctor from '../models/doctor.model.js';

async function backfillDoctorRef() {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('MONGODB_URI not set. Please check your .env file.');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const doctorUsers = await User.find({ role: 'doctor' }).lean();
    console.log(`Found ${doctorUsers.length} doctor users`);

    let updated = 0;
    let skipped = 0;
    let errors = 0;

    for (const user of doctorUsers) {
      if (user.doctorRef) {
        skipped++;
        continue;
      }

      const profile = await DoctorProfile.findOne({ userId: user._id }).lean();
      if (!profile || !profile.slug) {
        skipped++;
        continue;
      }

      const doctorDoc = await Doctor.findOne({ slug: profile.slug }).select('_id').lean();
      if (!doctorDoc) {
        console.warn(`No Doctor document found for slug "${profile.slug}" (user: ${user.email})`);
        skipped++;
        continue;
      }

      await User.findByIdAndUpdate(user._id, { doctorRef: doctorDoc._id });
      updated++;
    }

    console.log(`\nDone. Updated: ${updated}, Skipped: ${skipped}, Errors: ${errors}`);
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

backfillDoctorRef();
