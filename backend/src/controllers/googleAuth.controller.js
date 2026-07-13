import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import env from '../config/env.js';
import { StatusCodes } from 'http-status-codes';

/**
 * @desc    Handle Google OAuth sign-in/sign-up
 * @route   POST /api/v1/auth/google
 * @access  Public
 */
export const googleAuth = async (req, res) => {
  try {
    const { email, fullName, googleId, picture } = req.body;

    if (!email || !googleId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Email and Google ID are required',
      });
    }

    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      // User exists - update Google ID if not present
      if (!user.googleId) {
        user.googleId = googleId;
        user.isEmailVerified = true; // Google emails are verified
        user.isVerified = true;
        if (picture && !user.profilePicture) {
          user.profilePicture = picture;
        }
        await user.save();
      }
    } else {
      // Create new user
      user = await User.create({
        fullName,
        email,
        googleId,
        profilePicture: picture,
        isEmailVerified: true, // Google emails are pre-verified
        isVerified: true,
        role: 'patient', // Default role
        isActive: true,
        phone: '', // Will be required to complete profile later
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

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      env.jwt.secret,
      { expiresIn: env.jwt.expiresIn }
    );

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Google authentication successful',
      data: {
        user: user.toJSON(),
        token,
      },
    });
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Server error during Google authentication',
    });
  }
};
