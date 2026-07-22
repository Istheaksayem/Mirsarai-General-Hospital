import { env } from "@/config/env";
import { ApiError } from "./api";

const BACKEND_API = env.apiUrl;

function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (typeof window !== "undefined") {
    try {
      const raw = sessionStorage.getItem(env.authStorageKey);
      if (raw) {
        const user = JSON.parse(raw);
        if (user.token) headers["Authorization"] = `Bearer ${user.token}`;
      }
    } catch {}
  }
  return headers;
}

function getAuthHeadersOnly(): Record<string, string> {
  const headers: Record<string, string> = {};
  if (typeof window !== "undefined") {
    try {
      const raw = sessionStorage.getItem(env.authStorageKey);
      if (raw) {
        const user = JSON.parse(raw);
        if (user.token) headers["Authorization"] = `Bearer ${user.token}`;
      }
    } catch {}
  }
  return headers;
}

export interface ReportBatchItem {
  _id: string;
  patientId: string;
  patientName: string;
  mobileNumber: string;
  branchCode?: string;
  testDate: string;
  reportDate: string;
  remarks?: string;
  createdBy?: { _id: string; fullName: string; email: string };
  fileCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReportFileItem {
  _id: string;
  reportBatch: string;
  fileName: string;
  originalFileName?: string;
  fileSize: number;
  isCombined: boolean;
  createdAt: string;
}

export interface ReportBatchDetail {
  _id: string;
  patientId: string;
  patientName: string;
  mobileNumber: string;
  branchCode?: string;
  testDate: string;
  reportDate: string;
  remarks?: string;
  createdBy?: { _id: string; fullName: string; email: string };
  files: ReportFileItem[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedReportBatches {
  data: ReportBatchItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const getReportBatches = async (params?: Record<string, string>): Promise<PaginatedReportBatches> => {
  const q = params ? "?" + new URLSearchParams(params).toString() : "";
  const res = await fetch(`${BACKEND_API}/admin/report-batches${q}`, {
    cache: "no-store",
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const text = await res.text();
    let msg = "Failed to fetch report batches";
    try { const p = JSON.parse(text); msg = p.message || msg; } catch {}
    throw new ApiError(res.status, msg);
  }
  const json = await res.json();
  return { data: json.data || [], total: json.meta?.total || 0, page: json.meta?.page || 1, limit: json.meta?.limit || 10, totalPages: json.meta?.totalPages || 0 };
};

export const getReportBatchById = async (id: string): Promise<{ data: ReportBatchDetail }> => {
  const res = await fetch(`${BACKEND_API}/admin/report-batches/${id}`, {
    cache: "no-store",
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const text = await res.text();
    let msg = "Failed to fetch report batch";
    try { const p = JSON.parse(text); msg = p.message || msg; } catch {}
    throw new ApiError(res.status, msg);
  }
  return res.json();
};

export const createReportBatch = async (formData: FormData): Promise<{ data: ReportBatchDetail }> => {
  const res = await fetch(`${BACKEND_API}/admin/report-batches`, {
    method: "POST",
    headers: getAuthHeadersOnly(),
    body: formData,
  });
  if (!res.ok) {
    const text = await res.text();
    let msg = "Failed to create report batch";
    try { const p = JSON.parse(text); msg = p.message || msg; } catch {}
    throw new ApiError(res.status, msg);
  }
  return res.json();
};

export const updateReportBatch = async (id: string, data: Record<string, unknown>): Promise<{ data: ReportBatchDetail }> => {
  const res = await fetch(`${BACKEND_API}/admin/report-batches/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const text = await res.text();
    let msg = "Failed to update report batch";
    try { const p = JSON.parse(text); msg = p.message || msg; } catch {}
    throw new ApiError(res.status, msg);
  }
  return res.json();
};

export const deleteReportBatch = async (id: string): Promise<void> => {
  const res = await fetch(`${BACKEND_API}/admin/report-batches/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const text = await res.text();
    let msg = "Failed to delete report batch";
    try { const p = JSON.parse(text); msg = p.message || msg; } catch {}
    throw new ApiError(res.status, msg);
  }
};

export const addReportFiles = async (batchId: string, formData: FormData): Promise<{ data: ReportFileItem[] }> => {
  const res = await fetch(`${BACKEND_API}/admin/report-batches/${batchId}/files`, {
    method: "POST",
    headers: getAuthHeadersOnly(),
    body: formData,
  });
  if (!res.ok) {
    const text = await res.text();
    let msg = "Failed to add files";
    try { const p = JSON.parse(text); msg = p.message || msg; } catch {}
    throw new ApiError(res.status, msg);
  }
  return res.json();
};

export const deleteReportFile = async (fileId: string): Promise<void> => {
  const res = await fetch(`${BACKEND_API}/admin/report-batches/file/${fileId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const text = await res.text();
    let msg = "Failed to delete file";
    try { const p = JSON.parse(text); msg = p.message || msg; } catch {}
    throw new ApiError(res.status, msg);
  }
};
