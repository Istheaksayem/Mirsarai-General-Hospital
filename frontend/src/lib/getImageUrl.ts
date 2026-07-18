const BACKEND_URL =
  (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1').replace('/api/v1', '');

export function getImageUrl(path: string | null | undefined): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('/uploads/') || path.startsWith('/genaral_Hospital_logo')) return `${BACKEND_URL}${path}`;
  return path;
}

function isObj(o: unknown): o is Record<string, unknown> {
  return o !== null && typeof o === 'object' && !Array.isArray(o);
}

export function normalizeImages<T>(data: T): T {
  if (typeof data === 'string') return getImageUrl(data) as unknown as T;
  if (Array.isArray(data)) return data.map(normalizeImages) as unknown as T;
  if (isObj(data)) {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      result[key] = normalizeImages(value);
    }
    return result as T;
  }
  return data;
}
