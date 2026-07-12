import { StatusCodes } from 'http-status-codes';
import { sendSuccess } from '../utils/ApiResponse.js';
import catchAsync from '../utils/catchAsync.js';
import * as authService from '../services/auth.service.js';
import env from '../config/env.js';

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.loginUser(email, password);

  res.cookie('accessToken', result.token, {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  sendSuccess(res, StatusCodes.OK, result, 'Login successful');
});

export const register = catchAsync(async (req, res) => {
  const user = await authService.registerUser(req.body);
  sendSuccess(res, StatusCodes.CREATED, user, 'User registered successfully');
});

export const getMe = catchAsync(async (req, res) => {
  const user = await authService.getUserById(req.user.id);
  sendSuccess(res, StatusCodes.OK, user, 'User profile fetched');
});
