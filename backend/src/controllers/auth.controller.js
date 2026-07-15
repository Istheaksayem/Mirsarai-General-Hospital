import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import PendingRegistration from '../models/pendingRegistration.model.js';
import env from '../config/env.js';
import { StatusCodes } from 'http-status-codes';
import { registerSchema, loginSchema, staffRegisterSchema } from '../validators/auth.validator.js';
import * as AuthService from '../services/auth.service.js';
import sendEmail from '../utils/sendEmail.js';

/**
 * Generate JWT Token
 * @param {object} user - User document
 * @returns {string} - JWT Token
 */
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    env.jwt.secret,
    { expiresIn: env.jwt.expiresIn }
  );
};

/**
 * @desc    Register a new user (Step 1: save to PendingRegistration, send OTP)
 *          NOTE: No User document is created at this step.
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
export const registerUser = async (req, res) => {
  try {
    // Validate request body
    const validatedData = registerSchema.parse(req.body);

    // Check if a verified user already exists with this email
    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'An account with this email already exists. Please login.',
      });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Upsert into PendingRegistration (no User created yet)
    await PendingRegistration.findOneAndUpdate(
      { email: validatedData.email },
      {
        fullName: validatedData.fullName,
        email: validatedData.email,
        phone: validatedData.phone,
        password: validatedData.password,
        otp,
        otpExpires,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: false }
    );

    // Send OTP via email
    try {
      await sendEmail({
        email: validatedData.email,
        subject: 'Your Registration OTP',
        message: `Your OTP for registration is: ${otp}\nIt is valid for 10 minutes.`,
      });
    } catch (emailError) {
      console.error('Email Sending Error:', emailError);
      // Clean up the pending record if email fails
      await PendingRegistration.deleteOne({ email: validatedData.email });
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Failed to send OTP email. Please try again.',
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'OTP sent to your email. Please verify to complete registration.',
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Validation Error',
        errors: error.errors,
      });
    }

    console.error('Registration Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Server Error during registration',
    });
  }
};

/**
 * @desc    Verify OTP — on success, create the actual User in DB
 * @route   POST /api/v1/auth/verify-otp
 * @access  Public
 */
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Email and OTP are required',
      });
    }

    // Look in PendingRegistration, NOT in User
    const pending = await PendingRegistration.findOne({ email });

    if (!pending) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'No pending registration found. Please register again.',
      });
    }

    if (pending.otp !== otp) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid OTP',
      });
    }

    if (pending.otpExpires < new Date()) {
      await PendingRegistration.deleteOne({ email });
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'OTP has expired. Please register again.',
      });
    }

    // OTP is valid — NOW create the actual User in the database
    const user = await User.create({
      fullName: pending.fullName,
      email: pending.email,
      phone: pending.phone,
      password: pending.password, // already hashed by PendingRegistration pre-save hook
      isVerified: true,
    });

    // Remove the pending registration record
    await PendingRegistration.deleteOne({ email });

    // Generate token
    const token = generateToken(user);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Email verified successfully. Registration complete.',
      data: {
        user: user.toJSON(),
        token,
      },
    });
  } catch (error) {
    console.error('OTP Verification Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Server Error during OTP verification',
    });
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
export const loginUser = async (req, res) => {
  try {
    // Validate request body
    const validatedData = loginSchema.parse(req.body);

    // Check for user (explicitly select password to verify)
    const user = await User.findOne({ email: validatedData.email }).select('+password');

    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        errorCode: 'EMAIL_NOT_FOUND',
        message: 'No account found with this email address.',
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        errorCode: 'ACCOUNT_DEACTIVATED',
        message: 'Your account has been deactivated. Please contact support.',
      });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        errorCode: 'EMAIL_NOT_VERIFIED',
        message: 'Please verify your email via OTP before logging in.',
      });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(validatedData.password);

    if (!isMatch) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        errorCode: 'WRONG_PASSWORD',
        message: 'Incorrect password. Please try again.',
      });
    }

    // Staff-specific checks (doctor, reception, lab)
    const STAFF_ROLES = ['doctor', 'reception', 'lab'];
    if (STAFF_ROLES.includes(user.role)) {
      if (user.approvalStatus === 'pending') {
        return res.status(StatusCodes.FORBIDDEN).json({
          success: false,
          errorCode: 'STAFF_PENDING_APPROVAL',
          message: 'Your registration is waiting for Super Admin approval.',
        });
      }
      if (user.approvalStatus === 'rejected') {
        return res.status(StatusCodes.FORBIDDEN).json({
          success: false,
          errorCode: 'STAFF_REJECTED',
          message: 'Your registration request has been rejected.',
        });
      }
      if (user.accountStatus === 'suspended') {
        return res.status(StatusCodes.FORBIDDEN).json({
          success: false,
          errorCode: 'ACCOUNT_SUSPENDED',
          message: 'Your account has been suspended. Contact administrator.',
        });
      }
    }

    // Generate token
    const token = generateToken(user);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.toJSON(), // will remove password
        token,
      },
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Validation Error',
        errors: error.errors,
      });
    }

    console.error('Login Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Server Error during login',
    });
  }
};

/**
 * @desc    Register a new staff member (Doctor, Receptionist, Lab Admin) — no OTP required
 * @route   POST /api/v1/auth/register-staff
 * @access  Public
 */
export const registerStaff = async (req, res) => {
  try {
    const validatedData = staffRegisterSchema.parse(req.body);

    const user = await AuthService.registerStaff(validatedData);

    const roleLabels = { doctor: 'Doctor', reception: 'Receptionist', lab: 'Lab Admin' };
    const roleLabel = roleLabels[validatedData.role] || 'Staff';

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: `${roleLabel} registration submitted. Waiting for Super Admin approval.`,
      data: { user },
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Validation Error',
        errors: error.errors,
      });
    }

    if (error.statusCode === StatusCodes.CONFLICT) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: error.message,
      });
    }

    console.error('Staff Registration Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Server Error during staff registration',
    });
  }
};

/**
 * @desc    Get current logged in user
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
export const getMe = async (req, res) => {
  try {
    // User is already attached to req by the auth middleware
    const user = await User.findById(req.user.id);

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    console.error('Get Me Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Server error',
    });
  }
};
