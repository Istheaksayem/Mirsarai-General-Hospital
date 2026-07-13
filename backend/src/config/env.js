import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables
dotenv.config();

// Define environment variable schema
const envSchema = z.object({
  PORT: z.string().default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MONGODB_URI: z.string().min(1, 'MongoDB URI is required'),
  JWT_SECRET: z.string().min(32, 'JWT Secret must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  CLIENT_URL: z.string().url().default('http://localhost:3000'),
  RATE_LIMIT_WINDOW_MS: z.string().default('900000'),
  RATE_LIMIT_MAX_REQUESTS: z.string().default('100'),

  // SMTP (Email)
  SMTP_HOST: z.string().min(1, 'SMTP host is required'),
  SMTP_PORT: z.string().default('587'),
  SMTP_USER: z.string().min(1, 'SMTP user is required'),
  SMTP_PASS: z.string().min(1, 'SMTP password is required'),
  FROM_EMAIL: z.string().email('Invalid from email'),
  FROM_EMAIL_NAME: z.string().default('General Hospital'),
});

// Validate environment variables
const validateEnv = () => {
  try {
    const parsed = envSchema.parse(process.env);
    return parsed;
  } catch (error) {
    console.error('❌ Environment variable validation failed:');
    console.error(error.errors);
    process.exit(1);
  }
};

// Export validated environment variables
const env = validateEnv();

export default {
  port: parseInt(env.PORT, 10),
  nodeEnv: env.NODE_ENV,
  mongodb: {
    uri: env.MONGODB_URI,
  },
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN,
  },
  clientUrl: env.CLIENT_URL,
  rateLimit: {
    windowMs: parseInt(env.RATE_LIMIT_WINDOW_MS, 10),
    maxRequests: parseInt(env.RATE_LIMIT_MAX_REQUESTS, 10),
  },
  smtp: {
    host: env.SMTP_HOST,
    port: parseInt(env.SMTP_PORT, 10),
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
    fromEmail: env.FROM_EMAIL,
    fromName: env.FROM_EMAIL_NAME,
  },
};
