"use client";
import { useState, useRef, useEffect } from "react";
import { Upload, FileText, CheckCircle2, AlertCircle, X, Loader2, Search } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { lookupPatient, uploadDocument, getDocuments } from "@/lib/services/api";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface RecentDoc {
  _id: string;
  title: string;
  patientId: { patientId: string; fullName: string } | string;
  documentType: string;
  createdAt: string;
}

export default function UploadReportsPage() {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verifiedPatient, setVerifiedPatient] = useState<{ _id: string; patientId: string; fullName: string } | null>(null);
  const [patientLookupQuery, setPatientLookupQuery] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: recentUploads = [] } = useQuery({
    queryKey: ["recent-documents"],
    queryFn: async () => {
      const res = await getDocuments({ limit: "10" });
      return (res.data as RecentDoc[]) ?? [];
    },
  });

  const [formData, setFormData] = useState({
    patientId: "",
    title: "",
    documentType: "",
    department: "",
    notes: "",
  });

  const handleLookup = async () => {
    if (!patientLookupQuery.trim()) return;
    try {
      const patients = await lookupPatient(patientLookupQuery.trim());
      if (patients.length === 0) {
        toast.error("No patient found with that ID or phone");
        return;
      }
      const p = patients[0];
      if (!p) {
        toast.error("Invalid patient data returned");
        return;
      }
      setVerifiedPatient(p);
      setFormData((prev) => ({ ...prev, patientId: p._id }));
      toast.success(`Patient found: ${p.fullName} (${p.patientId})`);
    } catch {
      toast.error("Patient lookup failed");
    }
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setDragging(false); };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) validateAndSetFile(e.dataTransfer.files[0]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) validateAndSetFile(e.target.files[0]);
  };

  const validateAndSetFile = (selectedFile: File) => {
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(selectedFile.type)) { setError("Invalid file type. Only PDF, JPG, and PNG are allowed."); setFile(null); return; }
    if (selectedFile.size > 10 * 1024 * 1024) { setError("File is too large. Maximum size is 10MB."); setFile(null); return; }
    setError(null); setFile(selectedFile);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!file) { setError("Please select a file to upload."); return; }
    if (!verifiedPatient) { setError("Please look up and verify a patient first."); return; }
    if (!formData.title || !formData.documentType) { setError("Please fill all required fields."); return; }

    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append('patientId', verifiedPatient._id);
      data.append('title', formData.title);
      data.append('documentType', formData.documentType);
      if (formData.department) data.append('department', formData.department);
      if (formData.notes) data.append('notes', formData.notes);
      data.append('file', file);

      await uploadDocument(data);
      toast.success("Document uploaded successfully!");
      setFormData({ patientId: "", title: "", documentType: "", department: "", notes: "" });
      setFile(null);
      setVerifiedPatient(null);
      setPatientLookupQuery("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeFile = () => { setFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; };

  return (
    <div className="space-y-6">
      <PageHeader title="Upload Reports" description="Upload lab test results and diagnostic reports" icon={Upload} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-5">
          <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 space-y-5 shadow-sm">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">Upload New Document</h2>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-sm">
                <AlertCircle className="h-4 w-4 shrink-0" /> <span>{error}</span>
              </div>
            )}

            {/* Patient Lookup */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Verify Patient *</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Search by Patient ID or mobile..."
                  value={patientLookupQuery}
                  onChange={(e) => setPatientLookupQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleLookup())}
                />
                <Button type="button" variant="outline" onClick={handleLookup}><Search className="h-4 w-4" /></Button>
              </div>
              {verifiedPatient && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-sm">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  {verifiedPatient.fullName} ({verifiedPatient.patientId})
                </div>
              )}
            </div>

            {!file ? (
              <div
                onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`rounded-xl border-2 border-dashed transition-colors p-8 text-center cursor-pointer ${dragging ? "border-[#76BC21] bg-[#76BC21]/5" : "border-gray-200 dark:border-gray-700 hover:border-[#1E2B7A]/40 hover:bg-gray-50 dark:hover:bg-gray-800/50"}`}
              >
                <Upload className="h-8 w-8 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Drag & drop files here</p>
                <p className="text-xs text-gray-400 mt-1">Supports PDF, JPG, PNG (max 10MB)</p>
                <Button type="button" variant="outline" size="sm" className="mt-4 pointer-events-none">Browse Files</Button>
                <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} />
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
                <button type="button" onClick={removeFile} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}

            <div className="space-y-4">
              <Input name="title" value={formData.title} onChange={handleChange} label="Document Title" placeholder="e.g. Complete Blood Count Report" required />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Document Type *</label>
                <select name="documentType" value={formData.documentType} onChange={handleChange} required
                  className="h-10 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]/40"
                >
                  <option value="">Select type...</option>
                  <option value="diagnostic_report">Diagnostic Report</option>
                  <option value="prescription">Prescription</option>
                  <option value="admission_form">Admission Form</option>
                  <option value="discharge_summary">Discharge Summary</option>
                  <option value="certificate">Certificate</option>
                  <option value="bill_receipt">Bill Receipt</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <Input name="department" value={formData.department} onChange={handleChange} label="Department" placeholder="e.g. Pathology" />
              <Input name="notes" value={formData.notes} onChange={handleChange} label="Notes (optional)" placeholder="Additional notes..." />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting || !verifiedPatient}>
              {isSubmitting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Uploading...</> : <><Upload className="h-4 w-4 mr-2" /> Upload Document</>}
            </Button>
          </form>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 space-y-4 shadow-sm h-fit">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">Recent Uploads</h2>
          {recentUploads.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">No recent uploads found.</div>
          ) : (
            <div className="space-y-2">
              {recentUploads.map((r: RecentDoc) => {
                const pid = typeof r.patientId === 'object' ? r.patientId : { patientId: String(r.patientId), fullName: '' };
                return (
                  <div key={r._id} className="flex items-center gap-3 rounded-xl border border-gray-100 dark:border-gray-800 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                      <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">{r.title}</p>
                      <p className="text-xs text-gray-400 truncate">{(pid as { patientId: string }).patientId} · {new Date(r.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border border-green-200 dark:border-green-800 shrink-0">
                      {r.documentType}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
