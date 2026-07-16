"use client";
import { useState, useRef, useEffect } from "react";
import { Upload, FileText, CheckCircle2, AlertCircle, X, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface RecentUpload {
  _id: string;
  patientId: string;
  testName: string;
  createdAt: string;
  status: string;
}

export default function UploadReportsPage() {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [recentUploads, setRecentUploads] = useState<RecentUpload[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    patientId: "",
    testName: "",
    reportType: "",
    requestingDoctor: "",
  });

  const fetchRecentUploads = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/lab-reports/recent`;
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`, // assuming token is in localStorage
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setRecentUploads(data.data);
        }
      }
    } catch (err) {
      console.error("Failed to fetch recent uploads", err);
    }
  };

  useEffect(() => {
    // Only fetch if we have a token, to avoid unnecessary errors
    if (localStorage.getItem('token')) {
      fetchRecentUploads();
    }
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(selectedFile.type)) {
      setError("Invalid file type. Only PDF, JPG, and PNG are allowed.");
      setFile(null);
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File is too large. Maximum size is 10MB.");
      setFile(null);
      return;
    }
    setError(null);
    setFile(selectedFile);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    if (!formData.patientId || !formData.testName || !formData.reportType || !formData.requestingDoctor) {
      setError("Please fill all the required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append('patientId', formData.patientId);
      data.append('testName', formData.testName);
      data.append('reportType', formData.reportType);
      data.append('requestingDoctor', formData.requestingDoctor);
      data.append('reportFile', file);

      const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/lab-reports/upload`;

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: data,
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || 'Failed to upload report');
      }

      setSuccess("Report uploaded successfully!");
      setFormData({ patientId: "", testName: "", reportType: "", requestingDoctor: "" });
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      fetchRecentUploads();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Upload Reports" description="Upload lab test results and diagnostic reports" icon={Upload} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload form */}
        <div className="space-y-5">
          <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 space-y-5 shadow-sm">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">Upload New Report</h2>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-sm">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}


            {!file ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`rounded-xl border-2 border-dashed transition-colors p-8 text-center cursor-pointer
                  ${dragging ? "border-[#76BC21] bg-[#76BC21]/5" : "border-gray-200 dark:border-gray-700 hover:border-[#1E2B7A]/40 hover:bg-gray-50 dark:hover:bg-gray-800/50"}`}
              >
                <Upload className="h-8 w-8 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Drag & drop files here</p>
                <p className="text-xs text-gray-400 mt-1">Supports PDF, JPG, PNG (max 10MB)</p>
                <Button type="button" variant="outline" size="sm" className="mt-4 pointer-events-none">Browse Files</Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                />
              </div>
            ) : (
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800">
                    <FileText className="h-6 w-6 text-[#1E2B7A]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}

            <div className="space-y-4">
              <Input
                name="patientId"
                value={formData.patientId}
                onChange={handleChange}
                label="Patient ID"
                placeholder="e.g. P-1001"
                required
              />
              <Input
                name="testName"
                value={formData.testName}
                onChange={handleChange}
                label="Test Name"
                placeholder="e.g. Complete Blood Count"
                required
              />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Report Type *</label>
                <select
                  name="reportType"
                  value={formData.reportType}
                  onChange={handleChange}
                  required
                  className="h-10 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]/40"
                >
                  <option value="">Select type...</option>
                  <option value="blood">Blood Test</option>
                  <option value="imaging">Imaging</option>
                  <option value="pathology">Pathology</option>
                  <option value="microbiology">Microbiology</option>
                </select>
              </div>
              <Input
                name="requestingDoctor"
                value={formData.requestingDoctor}
                onChange={handleChange}
                label="Requesting Doctor"
                placeholder="Dr. Name"
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Report
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Recent uploads */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 space-y-4 shadow-sm h-fit">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">Recent Uploads</h2>

          {recentUploads.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">
              No recent uploads found.
            </div>
          ) : (
            <div className="space-y-2">
              {recentUploads.map((r) => (
                <div key={r._id} className="flex items-center gap-3 rounded-xl border border-gray-100 dark:border-gray-800 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">{r.patientId}</p>
                    <p className="text-xs text-gray-400 truncate">{r.testName} · {new Date(r.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border border-green-200 dark:border-green-800 shrink-0">
                    {r.status || 'completed'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {success && (
        <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-top-5 fade-in duration-300">
          <div className="bg-white dark:bg-gray-800 border border-green-200 dark:border-green-800 shadow-lg rounded-xl p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">Success</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{success}</p>
            </div>
            <button
              type="button"
              onClick={() => setSuccess(null)}
              className="ml-4 p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
