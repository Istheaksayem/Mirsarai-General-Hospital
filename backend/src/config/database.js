import mongoose from 'mongoose';
import env from './env.js';

/**
 * Connect to MongoDB database
 * @returns {Promise<void>}
 */
const connectDatabase = async () => {
  try {
    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    await mongoose.connect(env.mongodb.uri, options);

    console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
    console.log(`📊 Database: ${mongoose.connection.name}`);

    // Fix: drop old non-sparse unique index on googleId if present.
    // The sparse unique index defined in the User model schema will be
    // auto-created by Mongoose on first write.
    try {
      const userCollection = mongoose.connection.collection('users');
      const indexes = await userCollection.indexes();
      const oldIndex = indexes.find(i => i.name === 'googleId_1');
      if (oldIndex && !oldIndex.sparse) {
        console.log('🔧 Dropping old non-sparse googleId_1 index...');
        await userCollection.dropIndex('googleId_1');
        console.log('✅ Old googleId index dropped successfully');
      }
    } catch (indexErr) {
      console.warn('⚠️  Index note:', indexErr.message);
    }

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

export default connectDatabase;
