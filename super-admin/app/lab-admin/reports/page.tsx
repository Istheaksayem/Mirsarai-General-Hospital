"use client";
import { useState } from "react";
import { BarChart3, FileText, CheckCircle2, Clock, AlertCircle, TrendingUp, Download, Eye } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { SearchFilter, SelectFilter } from "@/components/ui/SearchFilter";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StatsCard } from "@/components/ui/StatsCard";
import { StatsCardSkeleton } from "@/components/ui/Skeleton";
import { useReports, useReportStats, useUpdateReportStatus, useDeleteReport } from "@/lib/hooks/useReports";
import type { UnifiedReport } from "@/lib/services/api";
import { ActionButtons } from "@/components/ui/ActionButtons";
import { env } from "@/config/env";

const statusVariant: Record<string, "warning" | "info" | "success"> = {
  pending: "warning",
  "in-progress": "info",
  completed: "success",
};

export default function LabReportsPage() {
  const { data: rawData = [], isLoading } = useReports();
  const { data: stats } = useReportStats();
  const updateStatus = useUpdateReportStatus();
  const deleteReport = useDeleteReport();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const data = rawData as UnifiedReport[];

  const pending = data.filter((r) => r.status === "pending").length;
  const inProgress = data.filter((r) => r.status === "in-progress").length;
  const completed = data.filter((r) => r.status === "completed").length;
  const completionRate = data.length > 0 ? Math.round((completed / data.length) * 100) : 0;

  const reportTypes = [...new Set(data.map((r) => r.reportType).filter(Boolean))];

  const filtered = data.filter((r) => {
    const matchSearch =
      !search ||
      r.patientName.toLowerCase().includes(search.toLowerCase()) ||
      r.testName.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || r.status === statusFilter;
    const matchType = !typeFilter || r.reportType === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  const handleDelete = async (row: Record<string, unknown>) => {
    try {
      await deleteReport.mutateAsync(row._id as string);
      showNotification("success", "Report deleted successfully");
    } catch (error) {
      showNotification("error", "Failed to delete report");
      console.error(error);
    }
  };

  const columns: Column<Record<string, unknown>>[] = [
    {
      key: "id",
      header: "Report ID",
      cell: (r) => <span className="font-mono text-xs text-gray-400">{String(r.id).slice(-6).toUpperCase()}</span>,
    },
    {
      key: "patientName",
      header: "Patient",
      cell: (r) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-gray-100">{r.patientName as string}</p>
          <p className="text-xs text-gray-400">{r.patientId as string}</p>
        </div>
      ),
    },
    {
      key: "testName",
      header: "Test / Report",
      cell: (r) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-gray-100">{r.testName as string}</p>
          <p className="text-xs text-gray-400 capitalize">{r.reportType as string}</p>
        </div>
      ),
    },
    {
      key: "department",
      header: "Department",
      cell: (r) => <span className="text-sm text-gray-600 dark:text-gray-400">{r.department as string}</span>,
    },
    {
      key: "requestingDoctor",
      header: "Requested By",
      cell: (r) => <span className="text-sm text-gray-700 dark:text-gray-300">{(r.requestingDoctor as string) || "—"}</span>,
    },
    {
      key: "createdAt",
      header: "Request Date",
      cell: (r) => <span className="text-sm text-gray-500">{formatDate(r.createdAt as string)}</span>,
    },
    {
      key: "completedDate",
      header: "Completed",
      cell: (r) => (
        <span className="text-sm text-gray-400">{(r.completedDate as string) ? formatDate(r.completedDate as string) : "—"}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (r) => {
        const s = r.status as string;
        return (
          <select
            value={s}
            onChange={async (e) => {
              const newStatus = e.target.value;
              try {
                await updateStatus.mutateAsync({ id: r._id as string, status: newStatus });
                showNotification("success", `Report marked as ${newStatus}`);
              } catch {
                showNotification("error", "Failed to update report status");
              }
            }}
            className={`text-xs px-2 py-1 rounded-md font-medium border focus:ring-2 focus:ring-offset-1 focus:outline-none ${
              s === 'completed' ? 'bg-green-50 text-green-700 border-green-200 focus:ring-green-500' :
              s === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200 focus:ring-amber-500' :
              'bg-blue-50 text-blue-700 border-blue-200 focus:ring-blue-500'
            }`}
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        );
      },
    },
    {
      key: "__actions__",
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      cell: (row) => {
        const r = row as Record<string, unknown>;
        return (
          <ActionButtons
            row={r}
            onView={() => {
              const rawUrl = r.fileUrl as string;
              if (!rawUrl) { showNotification("error", "No file available"); return; }
              const backendBase = env.backendUrl || env.apiUrl.replace('/api/v1', '') || '';
              const fullUrl = rawUrl.startsWith('http') ? rawUrl : `${backendBase}${rawUrl}`;
              window.open(fullUrl, '_blank');
            }}
            onDelete={() => handleDelete(r)}
            hideEdit
          />
        );
      },
    },
  ];

  const handleExport = () => {
    const csvContent = [
      ["Report ID", "Patient ID", "Patient Name", "Test Name", "Report Type", "Status", "Requested By", "Department", "Request Date", "Completed Date"],
      ...filtered.map(r => [
        r.id, r.patientId, r.patientName, r.testName, r.reportType,
        r.status, r.requestingDoctor, r.department, r.createdAt?.split("T")[0], r.completedDate ? r.completedDate.split("T")[0] : "N/A",
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lab-reports-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    showNotification("success", "Reports exported successfully");
  };

  return (
    <div className="space-y-6">
      {notification && (
        <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-top-5 fade-in duration-300">
          <div className={`rounded-lg px-4 py-3 shadow-lg ${
            notification.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }`}>
            <p className="text-sm font-medium">{notification.message}</p>
          </div>
        </div>
      )}

      <PageHeader
        title="Lab Reports"
        description={`${data.length} total reports · ${completionRate}% completion rate`}
        icon={BarChart3}
      >
        <Button size="sm" variant="outline" onClick={handleExport}>
          <Download className="h-4 w-4 mr-1.5" />Export
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <StatsCardSkeleton key={i} />)
        ) : (
          <>
            <StatsCard title="Total Reports" value={data.length} icon={FileText} color="purple" index={0} />
            <StatsCard title="Pending" value={pending} icon={Clock} color="amber" index={1} />
            <StatsCard title="In Progress" value={inProgress} icon={AlertCircle} color="blue" index={2} />
            <StatsCard title="Completed" value={completed} icon={CheckCircle2} color="green" trend={{ value: completionRate, label: "completion rate" }} index={3} />
          </>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchFilter
          value={search}
          onChange={setSearch}
          placeholder="Search by patient, test or report ID..."
          className="flex-1"
        />
        <SelectFilter
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { label: "Pending", value: "pending" },
            { label: "In Progress", value: "in-progress" },
            { label: "Completed", value: "completed" },
          ]}
          placeholder="All Status"
        />
        <SelectFilter
          value={typeFilter}
          onChange={setTypeFilter}
          options={reportTypes.map((t) => ({ label: capitalizeFirst(t), value: t }))}
          placeholder="All Types"
        />
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
        <DataTable
          data={filtered as unknown as Record<string, unknown>[]}
          columns={columns}
          isLoading={isLoading}
          pageSize={10}
          emptyTitle="No reports found"
          emptyDescription="Try adjusting your search or filter criteria."
        />
      </div>
    </div>
  );
}

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" });
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
