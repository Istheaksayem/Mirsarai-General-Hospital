import bcrypt from 'bcrypt';
import User from '../models/user.model.js';

const DEFAULT_ADMINS = [
  {
    fullName: 'Saimon H. Shawon',
    email: 'saimonhshawon@gmail.com',
    phone: '00000000000',
    password: 'saimon12',
    role: 'super-admin',
    isActive: true,
    isVerified: true,
    approvalStatus: 'approved',
    accountStatus: 'active',
    profileCompleted: true,
  },
  {
    fullName: 'Mirsarai General Hospital',
    email: 'mghbcdc@gmail.com',
    phone: '00000000000',
    password: 'mirsarai12',
    role: 'super-admin',
    isActive: true,
    isVerified: true,
    approvalStatus: 'approved',
    accountStatus: 'active',
    profileCompleted: true,
  },
];

export async function seedDefaultAdmins() {
  for (const admin of DEFAULT_ADMINS) {
    try {
      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash(admin.password, salt);

      await User.findOneAndUpdate(
        { email: admin.email },
        { $set: admin },
        { upsert: true, new: true, runValidators: true }
      );
      console.log(`Default admin ensured: ${admin.email}`);
    } catch (err) {
      console.error(`Failed to seed admin ${admin.email}:`, err.message);
    }
  }
  console.log('Default super admin accounts ensured.');
}
