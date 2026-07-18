"use client";
import { use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Pencil, User, FlaskConical, Calendar, Stethoscope, FileText, Building2 } from "lucide-react";
import { useReports } from "@/lib/hooks/useReports";
import { Badge } from "@/components/ui/Badge";
import { type Report } from "@/lib/services/api";

const statusVariant: Record<Report["status"], "warning" | "info" | "success"> = {
  pending: "warning", "in-progress": "info", completed: "success",
};

export default function ViewReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data = [], isLoading } = useReports();
  const report = data.find(r => r._id === decodeURIComponent(id));

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="animate-spin h-8 w-8 rounded-full border-4 border-[#1E2B7A] border-t-transparent" /></div>;
  if (!report) return <div className="p-16 text-center text-gray-400">Report not found</div>;

  const fields = [
    { icon: User, label: "Patient Name", value: report.patientName },
    { icon: User, label: "Patient ID", value: report.patientId },
    { icon: FlaskConical, label: "Test Name", value: report.testName },
    { icon: FileText, label: "Report Type", value: report.reportType },
    { icon: Building2, label: "Department", value: report.department },
    { icon: Stethoscope, label: "Requested By", value: report.requestedBy },
    { icon: Calendar, label: "Request Date", value: report.requestDate },
    { icon: Calendar, label: "Completed Date", value: report.completedDate || "—" },
    { icon: FileText, label: "Notes", value: report.notes || "—" },
  ];

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/super-admin/reports")} className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ArrowLeft className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </button>
          <div><h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Report Details</h1><p className="text-sm text-gray-500 mt-0.5">View lab report information</p></div>
        </div>
        <button onClick={() => router.push(`/super-admin/reports/${encodeURIComponent(report._id)}/edit`)} className="flex items-center gap-2 px-4 py-2 bg-[#1E2B7A] hover:bg-[#76BC21] text-white rounded-xl text-sm font-semibold transition-all">
          <Pencil className="h-3.5 w-3.5" /> Edit
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono text-xs text-gray-400 mb-1">{report._id}</p>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{report.testName}</h2>
            <p className="text-sm text-[#1E2B7A] dark:text-blue-400 font-semibold mt-0.5">{report.patientName} · {report.department}</p>
          </div>
          <Badge variant={statusVariant[report.status]}>{report.status}</Badge>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-5">Report Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1E2B7A]/10 dark:bg-[#1E2B7A]/20">
                <Icon className="h-4 w-4 text-[#1E2B7A] dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">{label}</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-0.5">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {report.results && Object.keys(report.results).length > 0 && (
          <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-800">
            <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Test Results</h4>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(report.results).map(([k, v]) => (
                <div key={k} className="flex items-center justify-between p-3 rounded-xl bg-[#76BC21]/5 border border-[#76BC21]/20">
                  <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">{k}</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{String(v)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
