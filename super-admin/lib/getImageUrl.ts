import { env } from '@/config/env';

const BACKEND_URL = env.backendUrl || env.apiUrl.replace('/api/v1', '') || '';

export function getImageUrl(path: string | null | undefined): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('/uploads/')) return `${BACKEND_URL}${path}`;
  if (path.startsWith('/')) return `${BACKEND_URL}${path}`;
  return path;
}
