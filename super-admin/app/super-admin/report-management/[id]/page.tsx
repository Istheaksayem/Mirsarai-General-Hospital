"use client";

import { use, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Upload, FileText, Download, Trash2 } from "lucide-react";
import { useReportBatch, useUpdateReportBatch, useAddReportFiles, useDeleteReportFile } from "@/lib/hooks/useReportBatches";
import { Button } from "@/components/ui/Button";
import { env } from "@/config/env";
import toast from "react-hot-toast";

export default function ReportBatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data, isLoading } = useReportBatch(id);
  const updateMutation = useUpdateReportBatch();
  const addFilesMutation = useAddReportFiles();
  const deleteFileMutation = useDeleteReportFile();

  const batch = data?.data;

  const [patientId, setPatientId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [testDate, setTestDate] = useState("");
  const [reportDate, setReportDate] = useState("");
  const [remarks, setRemarks] = useState("");
  const [initialized, setInitialized] = useState(false);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!initialized && batch) {
    setPatientId(batch.patientId || "");
    setPatientName(batch.patientName || "");
    setMobileNumber(batch.mobileNumber || "");
    setTestDate(batch.testDate ? new Date(batch.testDate).toISOString().split("T")[0] : "");
    setReportDate(batch.reportDate ? new Date(batch.reportDate).toISOString().split("T")[0] : "");
    setRemarks(batch.remarks || "");
    setInitialized(true);
  }

  const handleUpdate = () => {
    updateMutation.mutate(
      {
        id,
        data: {
          patientId: patientId.trim() || undefined,
          patientName: patientName.trim(),
          mobileNumber: mobileNumber.trim(),
          testDate,
          reportDate,
          remarks,
        },
      },
      {
        onSuccess: () => toast.success("Report batch updated"),
        onError: (err: Error) => toast.error(err.message || "Update failed"),
      }
    );
  };

  const handleAddFiles = () => {
    if (newFiles.length === 0) {
      toast.error("Please select files to upload");
      return;
    }

    const formData = new FormData();
    for (const file of newFiles) {
      formData.append("files", file);
    }

    addFilesMutation.mutate(
      { batchId: id, formData },
      {
        onSuccess: () => {
          toast.success("Files added successfully");
          setNewFiles([]);
        },
        onError: (err: Error) => toast.error(err.message || "Failed to add files"),
      }
    );
  };

  const handleDeleteFile = (fileId: string) => {
    deleteFileMutation.mutate(fileId, {
      onSuccess: () => toast.success("File deleted"),
      onError: (err: Error) => toast.error(err.message || "Failed to delete file"),
    });
  };

  const handleDownloadFile = (fileId: string) => {
    const token = sessionStorage.getItem(env.authStorageKey);
    if (!token) return;
    try {
      const user = JSON.parse(token);
      if (!user.token) return;
      const xhr = new XMLHttpRequest();
      const url = `${env.apiUrl}/report-collection/file/${fileId}?download=true`;
      xhr.open("GET", url, true);
      xhr.setRequestHeader("Authorization", `Bearer ${user.token}`);
      xhr.responseType = "blob";
      xhr.onload = function () {
        if (xhr.status === 200) {
          const disposition = xhr.getResponseHeader("Content-Disposition") || "";
          const match = disposition.match(/filename="?(.+?)"?$/);
          const filename = match ? match[1] : "report";
          const blobUrl = URL.createObjectURL(xhr.response);
          const a = document.createElement("a");
          a.href = blobUrl;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
        }
      };
      xhr.send();
    } catch {}
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1E2B7A] border-t-transparent" />
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Report batch not found</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push("/super-admin/report-management")}>
          Back to List
        </Button>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/super-admin/report-management")}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{batch.patientName}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Patient ID: {batch.patientId}</p>
        </div>
      </div>

      {/* Edit Form */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Patient Name</label>
              <input
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:border-[#1E2B7A] focus:ring-2 focus:ring-[#1E2B7A]/20 focus:outline-none transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Patient ID</label>
              <input
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:border-[#1E2B7A] focus:ring-2 focus:ring-[#1E2B7A]/20 focus:outline-none transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Mobile Number</label>
              <input
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:border-[#1E2B7A] focus:ring-2 focus:ring-[#1E2B7A]/20 focus:outline-none transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Test Date</label>
              <input
                type="date"
                value={testDate}
                onChange={(e) => setTestDate(e.target.value)}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:border-[#1E2B7A] focus:ring-2 focus:ring-[#1E2B7A]/20 focus:outline-none transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Report Date</label>
              <input
                type="date"
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:border-[#1E2B7A] focus:ring-2 focus:ring-[#1E2B7A]/20 focus:outline-none transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Remarks</label>
              <input
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Optional"
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:border-[#1E2B7A] focus:ring-2 focus:ring-[#1E2B7A]/20 focus:outline-none transition-all"
              />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20">
          <Button onClick={handleUpdate} loading={updateMutation.isPending}>
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Files Section */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Report Files</h2>

          {(!batch.files || batch.files.length === 0) ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm">No files uploaded yet.</p>
          ) : (
            <div className="space-y-2">
              {batch.files.map((file: any) => (
                <div
                  key={file._id}
                  className="flex items-center justify-between gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="h-5 w-5 text-[#1E2B7A] dark:text-[#76BC21] shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {file.fileName}
                      </p>
                      <p className="text-xs text-gray-400">
                        {file.fileSize ? `${(file.fileSize / 1024).toFixed(0)} KB` : "—"}
                        {file.isCombined ? " · Combined Report" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleDownloadFile(file._id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                      title="Download"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteFile(file._id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Files */}
        <div className="border-t border-gray-100 dark:border-gray-800 p-6 bg-gray-50/50 dark:bg-gray-800/20">
          <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Add More Files</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,application/pdf,image/jpeg,image/png,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              multiple
              onChange={(e) => setNewFiles(e.target.files ? Array.from(e.target.files) : [])}
              className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-[#1E2B7A] file:text-white file:text-xs file:font-semibold hover:file:bg-[#162060]"
            />
            <Button onClick={handleAddFiles} loading={addFilesMutation.isPending}>
              <Upload className="h-4 w-4" />
              Upload
            </Button>
          </div>
          {newFiles.length > 0 && (
            <p className="text-xs text-gray-400 mt-2">{newFiles.length} file(s) selected</p>
          )}
        </div>
      </div>

      {/* Created By */}
      {batch.createdBy && (
        <p className="text-xs text-gray-400">
          Created by {batch.createdBy.fullName} on {formatDate(batch.createdAt)}
        </p>
      )}
    </div>
  );
}
