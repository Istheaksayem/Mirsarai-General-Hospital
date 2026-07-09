"use client";
import { useState } from "react";
import { Upload, FileText, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const recentUploads = [
  { id: "REP-001", patient: "Aminul Islam", test: "Complete Blood Count (CBC)", date: "2026-07-06", status: "completed" },
  { id: "REP-002", patient: "Rashid Ahmed", test: "Knee X-Ray", date: "2026-07-07", status: "completed" },
  { id: "REP-006", patient: "Ruhul Amin", test: "Abdominal Ultrasound", date: "2026-07-07", status: "completed" },
];

export default function UploadReportsPage() {
  const [dragging, setDragging] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader title="Upload Reports" description="Upload lab test results and diagnostic reports" icon={Upload} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload form */}
        <div className="space-y-5">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 space-y-5">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">Upload New Report</h2>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={() => setDragging(false)}
              className={`rounded-xl border-2 border-dashed transition-colors p-8 text-center cursor-pointer
                ${dragging ? "border-[#76BC21] bg-[#76BC21]/5" : "border-gray-200 dark:border-gray-700 hover:border-[#1E2B7A]/40 hover:bg-gray-50 dark:hover:bg-gray-800/50"}`}
            >
              <Upload className="h-8 w-8 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Drag & drop files here</p>
              <p className="text-xs text-gray-400 mt-1">Supports PDF, JPG, PNG (max 10MB)</p>
              <Button variant="outline" size="sm" className="mt-4">Browse Files</Button>
            </div>
            <div className="space-y-4">
              <Input label="Patient ID" placeholder="e.g. P-1001" />
              <Input label="Test Name" placeholder="e.g. Complete Blood Count" />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Report Type</label>
                <select className="h-10 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]/40">
                  <option value="">Select type...</option>
                  <option value="blood">Blood Test</option>
                  <option value="imaging">Imaging</option>
                  <option value="pathology">Pathology</option>
                  <option value="microbiology">Microbiology</option>
                </select>
              </div>
              <Input label="Requesting Doctor" placeholder="Dr. Name" />
            </div>
            <Button className="w-full"><Upload className="h-4 w-4 mr-2" />Upload Report</Button>
          </div>
        </div>
        {/* Recent uploads */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">Recent Uploads</h2>
          <div className="space-y-2">
            {recentUploads.map((r) => (
              <div key={r.id} className="flex items-center gap-3 rounded-xl border border-gray-100 dark:border-gray-800 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">{r.patient}</p>
                  <p className="text-xs text-gray-400">{r.test} · {r.date}</p>
                </div>
                <button className="text-xs text-[#1E2B7A] dark:text-blue-400 hover:underline shrink-0">View</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
