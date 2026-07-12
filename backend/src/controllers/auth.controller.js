import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import env from '../config/env.js';
import { StatusCodes } from 'http-status-codes';
import { registerSchema, loginSchema } from '../validators/auth.validator.js';
import sendEmail from '../utils/sendEmail.js';

/**
 * Generate JWT Token
 * @param {string} id - User ID
 * @returns {string} - JWT Token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, env.jwt.secret, {
    expiresIn: env.jwt.expiresIn,
  });
};

/**
 * @desc    Register a new user (Step 1: generate and send OTP)
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
export const registerUser = async (req, res) => {
  try {
    // Validate request body
    const validatedData = registerSchema.parse(req.body);

    // Check if user already exists
    let user = await User.findOne({ email: validatedData.email });
    
    if (user && user.isVerified) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    if (user) {
      // User exists but unverified, update their OTP
      user.otp = otp;
      user.otpExpires = otpExpires;
      user.fullName = validatedData.fullName;
      user.phone = validatedData.phone;
      user.password = validatedData.password;
      await user.save();
    } else {
      // Create unverified user
      user = await User.create({
        fullName: validatedData.fullName,
        email: validatedData.email,
        phone: validatedData.phone,
        password: validatedData.password,
        isVerified: false,
        otp,
        otpExpires,
      });
    }

    // Send OTP via email
    try {
      await sendEmail({
        email: user.email,
        subject: 'Your Registration OTP',
        message: `Your OTP for registration is: ${otp}\nIt is valid for 10 minutes.`,
      });
    } catch (emailError) {
      console.error('Email Sending Error:', emailError);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Failed to send OTP email',
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
 * @desc    Verify OTP for registration
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

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.isVerified) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'User is already verified',
      });
    }

    if (user.otp !== otp) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid OTP',
      });
    }

    if (user.otpExpires < new Date()) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'OTP has expired',
      });
    }

    // Mark user as verified and clear OTP
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Generate token
    const token = generateToken(user._id);

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
        message: 'Invalid credentials',
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.',
      });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'Please verify your email via OTP before logging in.',
      });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(validatedData.password);
    
    if (!isMatch) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate token
    const token = generateToken(user._id);

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
