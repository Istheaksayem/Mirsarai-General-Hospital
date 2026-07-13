import mongoose from 'mongoose';

/**
 * Temporary collection to store pending registrations.
 * User is NOT created in the main users collection until OTP is verified.
 * Documents auto-expire after 10 minutes via MongoDB TTL index.
 */
const pendingRegistrationSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    // Store the plain password temporarily — it will be hashed when the real User is created
    password: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    otpExpires: {
      type: Date,
      required: true,
      // MongoDB TTL index: auto-delete document when otpExpires is reached
      index: { expires: 0 },
    },
  },
  {
    timestamps: true,
  }
);

const PendingRegistration = mongoose.model('PendingRegistration', pendingRegistrationSchema);

export default PendingRegistration;
