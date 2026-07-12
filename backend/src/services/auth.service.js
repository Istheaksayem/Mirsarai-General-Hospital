import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import User from '../models/user.model.js';
import env from '../config/env.js';
import ApiError from '../utils/ApiError.js';

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid email or password');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid email or password');
  }

  if (user.status !== 'active') {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Account is inactive. Contact administrator.');
  }

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
      doctorRef: user.doctorRef || null,
    },
    env.jwt.secret,
    { expiresIn: env.jwt.expiresIn || '7d' }
  );

  const userObj = user.toJSON();
  return { user: userObj, token };
};

export const registerUser = async (data) => {
  const existing = await User.findOne({ email: data.email });
  if (existing) {
    throw new ApiError(StatusCodes.CONFLICT, 'User with this email already exists');
  }

  const user = await User.create(data);
  return user.toJSON();
};

export const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  }
  return user.toJSON();
};
