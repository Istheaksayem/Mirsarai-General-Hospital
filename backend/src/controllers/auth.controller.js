import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import env from '../config/env.js';
import { StatusCodes } from 'http-status-codes';
import { registerSchema, loginSchema } from '../validators/auth.validator.js';

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
 * @desc    Register a new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
export const registerUser = async (req, res) => {
  try {
    // Validate request body
    const validatedData = registerSchema.parse(req.body);

    // Check if user already exists
    const userExists = await User.findOne({ email: validatedData.email });
    
    if (userExists) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Create user
    const user = await User.create({
      fullName: validatedData.fullName,
      email: validatedData.email,
      phone: validatedData.phone,
      password: validatedData.password,
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user,
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

    console.error('Registration Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Server Error during registration',
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
