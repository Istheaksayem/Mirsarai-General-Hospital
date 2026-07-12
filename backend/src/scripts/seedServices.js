import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { setServers } from 'node:dns/promises';

setServers(['1.1.1.1', '8.8.8.8']);

dotenv.config();

import Service from '../models/service.model.js';
import Department from '../models/department.model.js';
import Doctor from '../models/doctor.model.js';

const mongoURI = process.env.MONGODB_URI;

const seed = async () => {
  try {
    if (!mongoURI) {
      throw new Error('MONGODB_URI env is required for seeding.');
    }
    console.log('Connecting to database...');
    await mongoose.connect(mongoURI);
    console.log('Connected.');

    console.log('Clearing existing services...');
    await Service.deleteMany({});

    const frontendDir = path.join(process.cwd(), '../frontend/public/data');
    const servicesPath = path.join(frontendDir, 'services.json');

    console.log(`Reading services from: ${servicesPath}`);
    const servicesData = JSON.parse(fs.readFileSync(servicesPath, 'utf-8'));

    const departments = await Department.find({});
    const doctors = await Doctor.find({});

    for (const svc of servicesData) {
      const slug = svc.title.en.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      const matchingDept = departments.find(
        (d) => d.name.en.toLowerCase() === svc.title.en.toLowerCase()
      );

      let linkedDoctors = [];
      if (matchingDept) {
        linkedDoctors = doctors
          .filter((d) => d.department?.en?.toLowerCase() === matchingDept.name.en.toLowerCase())
          .map((d) => d._id);
      }

      await Service.create({
        name: svc.title,
        slug,
        description: svc.description || { en: '', bn: '' },
        image: svc.image || '',
        icon: svc.icon || '',
        color: svc.color || '#1E2B7A',
        gradient: svc.gradient || '',
        link: svc.link || '',
        highlights: svc.highlights || [],
        tagline: svc.tagline || '',
        doctors: linkedDoctors,
        displayOrder: svc.id,
        isVisible: true,
        createdBy: 'seed',
      });
      console.log(`- Seeded Service: ${svc.title.en}`);
    }

    console.log('Services seeding completed successfully!');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    console.log('Closing database connection...');
    await mongoose.connection.close();
    console.log('Done.');
  }
};

seed();
