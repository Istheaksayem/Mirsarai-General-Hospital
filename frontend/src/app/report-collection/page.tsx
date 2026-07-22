"use client";

import { useState } from "react";
import { Search, FileText, Eye, Download, Printer, AlertCircle, Loader } from "lucide-react";
import { searchReport, type SearchResult } from "@/services/reportCollection";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export default function ReportCollectionPage() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [patientId, setPatientId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<SearchResult | null>(null);
  const [searchDone, setSearchDone] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setSearchDone(false);

    const trimmedMobile = mobileNumber.trim();

    if (!trimmedMobile) {
      setError("Mobile number is required.");
      return;
    }

    if (!patientId.trim()) {
      setError("Patient ID is required.");
      return;
    }

    setLoading(true);
    try {
      const data = await searchReport(trimmedMobile, patientId.trim());
      setResult(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "No report found";
      setError(message);
    } finally {
      setLoading(false);
      setSearchDone(true);
    }
  };

  const fetchFileBlob = (fileId: string): Promise<{ blob: Blob; filename: string; contentType: string }> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const url = `${API_URL}/report-collection/file/${fileId}`;
      xhr.open("GET", url, true);
      xhr.setRequestHeader("Authorization", `Bearer ${result!.token}`);
      xhr.responseType = "blob";
      xhr.onload = function () {
        if (xhr.status === 200) {
          const disposition = xhr.getResponseHeader("Content-Disposition") || "";
          const contentType = xhr.getResponseHeader("Content-Type") || "application/octet-stream";
          const match = disposition.match(/filename="?(.+?)"?$/);
          const filename = match ? match[1] : "report";
          resolve({ blob: xhr.response, filename, contentType });
        } else {
          reject(new Error(`Server returned ${xhr.status}`));
        }
      };
      xhr.onerror = () => reject(new Error("Network error"));
      xhr.send();
    });
  };

  const handleView = async (fileId: string) => {
    setActionLoading(`view-${fileId}`);
    try {
      const { blob, contentType } = await fetchFileBlob(fileId);
      const blobUrl = URL.createObjectURL(blob);

      if (contentType === "application/pdf" || contentType.startsWith("image/")) {
        window.open(blobUrl, "_blank");
      } else {
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = "report";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
    } catch {
      setError("Failed to open file. Please try downloading instead.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDownload = async (fileId: string) => {
    setActionLoading(`download-${fileId}`);
    try {
      const { blob, filename } = await fetchFileBlob(fileId);
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
    } catch {
      setError("Failed to download file. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const handlePrint = async (fileId: string) => {
    setActionLoading(`print-${fileId}`);
    try {
      const { blob, contentType } = await fetchFileBlob(fileId);

      if (contentType.startsWith("image/") || contentType === "application/pdf") {
        const blobUrl = URL.createObjectURL(blob);
        const printWindow = window.open(blobUrl, "_blank");
        if (printWindow) {
          printWindow.onload = () => {
            setTimeout(() => printWindow.print(), 500);
          };
        }
        setTimeout(() => URL.revokeObjectURL(blobUrl), 120000);
      } else {
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = "report";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
      }
    } catch {
      setError("Failed to open file for printing.");
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-[70vh] bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-[#1E2B7A]/10 dark:bg-[#76BC21]/10 mb-4">
            <FileText className="h-8 w-8 text-[#1E2B7A] dark:text-[#76BC21]" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Online Diagnostic Report Collection
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Enter your mobile number and Patient ID to access your diagnostic reports
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8 mb-8">
          <form onSubmit={handleSearch} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="Enter your mobile number"
                className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]/40 placeholder:text-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Patient ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                placeholder="Enter your Patient ID (e.g. MGH-0001)"
                className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]/40 placeholder:text-gray-400"
              />
            </div>

            {error && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#1E2B7A] hover:bg-[#76BC21] text-white font-bold rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            >
              <Search className="h-5 w-5" />
              {loading ? "Searching..." : "View Report"}
            </button>
          </form>
        </div>

        {searchDone && !loading && !error && result && (
          <div className="space-y-6">
            {/* Patient Info Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
                Patient Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Patient Name</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{result.batch.patientName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Patient ID</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{result.batch.patientId}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Test Date</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{formatDate(result.batch.testDate)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Report Date</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{formatDate(result.batch.reportDate)}</p>
                </div>
              </div>
            </div>

            {/* Files List */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
                Available Reports
              </h2>
              <div className="space-y-3">
                {result.files.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No report files available.</p>
                ) : (
                  result.files.map((file) => {
                    const isLoading = actionLoading === `view-${file._id}` || actionLoading === `download-${file._id}` || actionLoading === `print-${file._id}`;
                    return (
                      <div
                        key={file._id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1E2B7A]/10 dark:bg-[#76BC21]/10">
                            <FileText className="h-5 w-5 text-[#1E2B7A] dark:text-[#76BC21]" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                              {file.fileName}
                            </p>
                            <p className="text-xs text-gray-400">
                              {file.isCombined ? "Combined Report" : "Individual Report"}
                              {file.fileSize ? ` · ${(file.fileSize / 1024).toFixed(0)} KB` : ""}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleView(file._id)}
                            disabled={isLoading}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-xs font-semibold transition-colors disabled:opacity-50"
                          >
                            {actionLoading === `view-${file._id}` ? <Loader className="h-3.5 w-3.5 animate-spin" /> : <Eye className="h-3.5 w-3.5" />}
                            View
                          </button>
                          <button
                            onClick={() => handleDownload(file._id)}
                            disabled={isLoading}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40 text-xs font-semibold transition-colors disabled:opacity-50"
                          >
                            {actionLoading === `download-${file._id}` ? <Loader className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                            Download
                          </button>
                          <button
                            onClick={() => handlePrint(file._id)}
                            disabled={isLoading}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-xs font-semibold transition-colors disabled:opacity-50"
                          >
                            {actionLoading === `print-${file._id}` ? <Loader className="h-3.5 w-3.5 animate-spin" /> : <Printer className="h-3.5 w-3.5" />}
                            Print
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Token Expiry Notice */}
            <p className="text-xs text-center text-gray-400">
              Your access session expires at {new Date(result.expiresAt).toLocaleTimeString()}. Please download your reports before then.
            </p>
          </div>
        )}

        {searchDone && !loading && !result && !error && (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No report found with the provided information.</p>
          </div>
        )}
      </div>
    </div>
  );
}
