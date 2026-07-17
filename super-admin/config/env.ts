export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || '',
  backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || '',

  enableMockAuth: process.env.NEXT_PUBLIC_ENABLE_MOCK_AUTH === 'true',
  authStorageKey: process.env.NEXT_PUBLIC_AUTH_STORAGE_KEY || 'mgh_admin_user',

  appName: process.env.NEXT_PUBLIC_APP_NAME || 'Mirsarai General Hospital',
  appShortName: process.env.NEXT_PUBLIC_APP_SHORT_NAME || 'MGH Admin',
  appDescription: process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'Mirsarai General Hospital — Admin Management Panel',

  defaultSlideImage: process.env.NEXT_PUBLIC_DEFAULT_SLIDE_IMAGE || '',
  avatarFallbackUrl: process.env.NEXT_PUBLIC_AVATAR_FALLBACK_URL || 'https://ui-avatars.com/api/',
  hospitalEmail: process.env.NEXT_PUBLIC_HOSPITAL_EMAIL || 'info@mgh.com',
  hospitalPhone: process.env.NEXT_PUBLIC_HOSPITAL_PHONE || '+880-1234-567891',
  hospitalAddress: process.env.NEXT_PUBLIC_HOSPITAL_ADDRESS || 'Mirsarai, Chittagong, Bangladesh',

  appVersion: process.env.NEXT_PUBLIC_APP_VERSION || 'v2.0.0',
  sessionTimeout: process.env.NEXT_PUBLIC_SESSION_TIMEOUT || '60',

  mockBase: process.env.NEXT_PUBLIC_MOCK_BASE || '/mock-data',
};
