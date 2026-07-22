"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileText, X } from "lucide-react";
import { FormPage, FormField, FormInput, FormSection } from "@/components/ui/FormPage";
import { useCreateReportBatch } from "@/lib/hooks/useReportBatches";
import toast from "react-hot-toast";

export default function CreateReportBatchPage() {
  const router = useRouter();
  const createMutation = useCreateReportBatch();

  const [patientId, setPatientId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [testDate, setTestDate] = useState("");
  const [reportDate, setReportDate] = useState("");
  const [remarks, setRemarks] = useState("");
  const [isCombined, setIsCombined] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ACCEPTED_MIME = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!patientId.trim()) errs.patientId = "Patient ID is required";
    if (!patientName.trim()) errs.patientName = "Patient name is required";
    if (!mobileNumber.trim()) errs.mobileNumber = "Mobile number is required";
    if (!testDate) errs.testDate = "Test date is required";
    if (!reportDate) errs.reportDate = "Report date is required";
    if (files.length === 0) errs.files = "At least one file is required";

    for (const file of files) {
      if (!ACCEPTED_MIME.includes(file.type)) {
        const name = file.name || "";
        const ext = name.split(".").pop()?.toLowerCase();
        const allowedExt = ["pdf", "jpg", "jpeg", "png", "doc", "docx"];
        if (!allowedExt.includes(ext || "")) {
          errs.files = `File "${file.name}" has an unsupported format. Allowed: PDF, JPG, PNG, DOC, DOCX`;
          break;
        }
      }
      if (file.size > 15 * 1024 * 1024) {
        errs.files = "File size must not exceed 15MB";
        break;
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const formData = new FormData();
    formData.append("patientId", patientId.trim());
    formData.append("patientName", patientName.trim());
    formData.append("mobileNumber", mobileNumber.trim());
    formData.append("testDate", testDate);
    formData.append("reportDate", reportDate);
    formData.append("remarks", remarks);
    formData.append("isCombined", String(isCombined));

    for (const file of files) {
      formData.append("files", file);
    }

    createMutation.mutate(formData, {
      onSuccess: () => {
        toast.success("Report batch created successfully");
        router.push("/super-admin/report-management");
      },
      onError: (err: Error) => {
        toast.error(err.message || "Failed to create report batch");
      },
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <FormPage
      title="Upload New Report"
      description="Create a new report batch with patient information and PDF files"
      backHref="/super-admin/report-management"
      onSubmit={handleSubmit}
      isSubmitting={createMutation.isPending}
      submitLabel="Upload Report"
    >
      <FormSection title="Patient Information">
        <FormField label="Patient Name" required error={errors.patientName}>
          <FormInput
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="Enter patient name"
          />
        </FormField>

        <FormField label="Patient ID" required error={errors.patientId}>
          <FormInput
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            placeholder="Enter patient ID"
          />
        </FormField>

        <FormField label="Mobile Number" required error={errors.mobileNumber}>
          <FormInput
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            placeholder="Enter mobile number"
          />
        </FormField>


      </FormSection>

      <FormSection title="Dates">
        <FormField label="Test Date" required error={errors.testDate}>
          <FormInput
            type="date"
            value={testDate}
            onChange={(e) => setTestDate(e.target.value)}
          />
        </FormField>

        <FormField label="Report Date" required error={errors.reportDate}>
          <FormInput
            type="date"
            value={reportDate}
            onChange={(e) => setReportDate(e.target.value)}
          />
        </FormField>
      </FormSection>

      <FormSection title="Additional">
        <FormField label="Remarks">
          <FormInput
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Optional remarks"
          />
        </FormField>

        <FormField label="Report Type">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isCombined}
              onChange={(e) => setIsCombined(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-[#1E2B7A] focus:ring-[#1E2B7A]"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              This is a combined PDF report
            </span>
          </label>
          <p className="text-xs text-gray-400 mt-1">
            Check this if uploading one combined PDF instead of individual reports
          </p>
        </FormField>
      </FormSection>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5">
            Upload Report Files <span className="text-red-500">*</span>
          </label>
          {errors.files && <p className="text-xs text-red-500 mb-2">{errors.files}</p>}

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-[#1E2B7A] dark:hover:border-[#76BC21] transition-colors"
          >
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Click to browse or drag files here
            </p>
            <p className="text-xs text-gray-400 mt-1">Supported: PDF, JPG, PNG, DOC, DOCX · max 15MB per file</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,application/pdf,image/jpeg,image/png,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <FileText className="h-5 w-5 text-[#1E2B7A] dark:text-[#76BC21] shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {(file.size / 1024).toFixed(0)} KB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors shrink-0"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </FormPage>
  );
}
