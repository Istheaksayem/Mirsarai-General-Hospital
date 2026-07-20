"use client";

import { useState, useRef } from "react";
import { X, Upload, FileText, Search, UserCheck, AlertCircle, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useLookupPatient, useCreatePrescription } from "@/lib/hooks/usePrescriptions";
import { cn } from "@/lib/utils";

interface Props {
  onClose: () => void;
}

export function CreatePrescriptionModal({ onClose }: Props) {
  const createPrescription = useCreatePrescription();
  const lookupPatient = useLookupPatient();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<"lookup" | "form">("lookup");
  const [patientQuery, setPatientQuery] = useState("");
  const [patientQueryError, setPatientQueryError] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<{ _id: string; patientId: string; fullName: string; mobile: string } | null>(null);

  const [contentType, setContentType] = useState<"file" | "text">("file");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [textContent, setTextContent] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");

  const canSubmit = selectedPatient && (contentType === "file" ? !!selectedFile : textContent.trim().length > 0);

  async function handleLookup() {
    const q = patientQuery.trim();
    if (!q) { setPatientQueryError("Enter a Patient ID or mobile number"); return; }
    setPatientQueryError("");
    try {
      const result = await lookupPatient.mutateAsync(q);
      setSelectedPatient(result);
      setStep("form");
    } catch {
      setPatientQueryError("No patient found with that ID or mobile number");
    }
  }

  async function handleSubmit() {
    if (!canSubmit || !selectedPatient) return;
    const fd = new FormData();
    fd.append("patientId", selectedPatient._id);
    if (selectedFile) fd.append("file", selectedFile);
    if (textContent) fd.append("textContent", textContent);
    if (diagnosis) fd.append("diagnosis", diagnosis);
    if (notes) fd.append("notes", notes);
    if (followUpDate) fd.append("followUpDate", followUpDate);
    try {
      await createPrescription.mutateAsync(fd);
      onClose();
    } catch {}
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-6 py-4 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#1E2B7A] to-[#2d3fa8]">
              <ClipboardList className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 dark:text-gray-100">New Prescription</h2>
              <p className="text-xs text-gray-400">{step === "lookup" ? "Find the patient" : "Add prescription details"}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* ── Step dots ── */}
          <div className="flex items-center gap-2">
            <div className={cn("flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold", step === "lookup" ? "bg-[#1E2B7A] text-white" : "bg-[#1E2B7A]/10 text-[#1E2B7A]")}>1</div>
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
            <div className={cn("flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold", step === "form" ? "bg-[#1E2B7A] text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-400")}>2</div>
          </div>

          {step === "lookup" ? (
            <div className="space-y-5">
              <p className="text-sm text-gray-600 dark:text-gray-400">Enter the Patient ID or mobile number to find the patient.</p>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    value={patientQuery}
                    onChange={(e) => { setPatientQuery(e.target.value); setPatientQueryError(""); }}
                    onKeyDown={(e) => e.key === "Enter" && handleLookup()}
                    placeholder="e.g. MGH-2026-000001 or 017XXXXXXXX"
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 pl-10 pr-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:border-[#1E2B7A] focus:ring-2 focus:ring-[#1E2B7A]/20 focus:outline-none transition-all"
                  />
                </div>
                <Button size="sm" onClick={handleLookup} loading={lookupPatient.isPending}>
                  <Search className="h-4 w-4 mr-1.5" />Find
                </Button>
              </div>
              {patientQueryError && (
                <div className="flex items-center gap-2 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/40 px-4 py-3">
                  <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                  <p className="text-sm text-red-600 dark:text-red-400">{patientQueryError}</p>
                </div>
              )}
            </div>
          ) : selectedPatient ? (
            <div className="space-y-5">
              {/* Patient info pill */}
              <div className="flex items-center gap-3 rounded-xl bg-[#1E2B7A]/5 dark:bg-[#1E2B7A]/10 border border-[#1E2B7A]/10 dark:border-[#1E2B7A]/20 px-4 py-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1E2B7A]/10">
                  <UserCheck className="h-5 w-5 text-[#1E2B7A]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{selectedPatient.fullName}</p>
                  <p className="text-xs text-gray-400">{selectedPatient.patientId} · {selectedPatient.mobile}</p>
                </div>
                <button onClick={() => { setStep("lookup"); setSelectedPatient(null); }} className="text-xs text-[#1E2B7A] dark:text-blue-400 hover:underline shrink-0">Change</button>
              </div>

              {/* Content type selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Prescription Content</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setContentType("file")}
                    className={cn(
                      "flex-1 flex items-center gap-2.5 rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all",
                      contentType === "file"
                        ? "border-[#1E2B7A] bg-[#1E2B7A]/5 text-[#1E2B7A]"
                        : "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300"
                    )}
                  >
                    <Upload className="h-4 w-4" />
                    Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => setContentType("text")}
                    className={cn(
                      "flex-1 flex items-center gap-2.5 rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all",
                      contentType === "text"
                        ? "border-[#1E2B7A] bg-[#1E2B7A]/5 text-[#1E2B7A]"
                        : "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300"
                    )}
                  >
                    <FileText className="h-4 w-4" />
                    Type Prescription
                  </button>
                </div>
              </div>

              {/* File upload */}
              {contentType === "file" && (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center cursor-pointer hover:border-[#1E2B7A]/40 hover:bg-[#1E2B7A]/[0.02] transition-all"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    className="hidden"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  />
                  {selectedFile ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-2 text-sm font-medium text-[#1E2B7A]">
                        <FileText className="h-5 w-5" />
                        {selectedFile.name}
                      </div>
                      <p className="text-xs text-gray-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      <button onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }} className="text-xs text-red-500 hover:underline">Remove</button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex justify-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                          <Upload className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Click to upload</p>
                      <p className="text-xs text-gray-400">PDF, JPG, PNG, DOC, DOCX (max 10 MB)</p>
                    </div>
                  )}
                </div>
              )}

              {/* Text content */}
              {contentType === "text" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Prescription Text</label>
                  <textarea
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    placeholder={`Enter prescription details here...\n\nExample:\n1. Tab. Paracetamol 500mg - 1+1+1\n2. Cap. Omeprazole 20mg - 1+0+1\n3. Syrup. Algin 10ml - 1+0+1`}
                    rows={8}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:border-[#1E2B7A] focus:ring-2 focus:ring-[#1E2B7A]/20 focus:outline-none transition-all resize-none font-mono"
                  />
                </div>
              )}

              {/* Optional fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Diagnosis</label>
                  <input
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    placeholder="e.g. Upper respiratory infection"
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:border-[#1E2B7A] focus:ring-2 focus:ring-[#1E2B7A]/20 focus:outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Follow-up Date</label>
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:border-[#1E2B7A] focus:ring-2 focus:ring-[#1E2B7A]/20 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional notes or instructions..."
                  rows={3}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:border-[#1E2B7A] focus:ring-2 focus:ring-[#1E2B7A]/20 focus:outline-none transition-all resize-none"
                />
              </div>
            </div>
          ) : null}
        </div>

        <div className="sticky bottom-0 flex items-center justify-between border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-6 py-4 rounded-b-3xl">
          <button
            onClick={() => { if (step === "form") { setStep("lookup"); } else { onClose(); } }}
            className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {step === "form" ? "Back" : "Cancel"}
          </button>
          {step === "form" && (
            <Button size="sm" onClick={handleSubmit} disabled={!canSubmit} loading={createPrescription.isPending}>
              <ClipboardList className="h-4 w-4 mr-1.5" />Create Prescription
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
