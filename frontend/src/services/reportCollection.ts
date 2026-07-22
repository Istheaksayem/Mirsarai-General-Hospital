const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export interface ReportBatch {
  _id: string;
  patientId: string;
  patientName: string;
  mobileNumber: string;
  testDate: string;
  reportDate: string;
  remarks?: string;
  createdAt: string;
}

export interface ReportFile {
  _id: string;
  reportBatch: string;
  fileName: string;
  originalFileName?: string;
  fileSize: number;
  mimeType?: string;
  isCombined: boolean;
  createdAt: string;
}

export interface SearchResult {
  batch: ReportBatch;
  files: ReportFile[];
  token: string;
  expiresAt: string;
  batches?: never;
}

export interface MultiSearchResult {
  batches: (ReportBatch & { files: ReportFile[] })[];
  files: ReportFile[];
  token: string;
  expiresAt: string;
  batch?: never;
}

export async function searchReport(mobileNumber: string, patientId: string): Promise<SearchResult> {
  const body = { mobileNumber, patientId };

  const res = await fetch(`${API_URL}/report-collection/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || 'No report found');
  }

  const data = json.data;

  if (data.batches) {
    return {
      batch: data.batches[0],
      files: data.files,
      token: data.token,
      expiresAt: data.expiresAt,
    };
  }

  return {
    batch: data.batch,
    files: data.files,
    token: data.token,
    expiresAt: data.expiresAt,
  };
}

export function getReportFileUrl(fileId: string, token: string, download = false): string {
  const params = new URLSearchParams({ download: String(download) });
  return `${API_URL}/report-collection/file/${fileId}?${params}`;
}
