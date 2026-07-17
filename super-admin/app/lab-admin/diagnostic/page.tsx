"use client";
import { useState } from "react";
import { FlaskConical, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { SearchFilter, SelectFilter } from "@/components/ui/SearchFilter";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { StatsCard } from "@/components/ui/StatsCard";
import { StatsCardSkeleton } from "@/components/ui/Skeleton";
import { createActionColumn } from "@/components/ui/ActionButtons";
import { useQuery } from "@tanstack/react-query";
import { getDocuments } from "@/lib/services/api";

interface DocRow {
  _id: string;
  title: string;
  patientId: { patientId: string; fullName: string } | string;
  documentType: string;
  department?: string;
  date: string;
  createdAt: string;
}

const typeDisplay: Record<string, string> = {
  diagnostic_report: "Diagnostic",
  prescription: "Prescription",
  admission_form: "Admission",
  discharge_summary: "Discharge",
  certificate: "Certificate",
  bill_receipt: "Bill",
  other: "Other",
};

const statusVariant: Record<string, "warning" | "info" | "success"> = {
  pending: "warning",
  "in-progress": "info",
  completed: "success",
};

const typeVariant: Record<string, "default" | "info" | "success" | "warning"> = {
  diagnostic_report: "info",
  prescription: "warning",
  admission_form: "default",
  discharge_summary: "success",
};

const columns: Column<Record<string, unknown>>[] = [
  {
    key: "_id", header: "Record ID",
    cell: (r) => <span className="font-mono text-xs text-gray-400">{String(r._id).slice(-6)}</span>,
  },
  {
    key: "patientId", header: "Patient",
    cell: (r) => {
      const pid = r.patientId as Record<string, unknown> | string;
      const name = typeof pid === 'object' ? (pid as Record<string, unknown>).fullName as string : "";
      const idStr = typeof pid === 'object' ? (pid as Record<string, unknown>).patientId as string : String(pid);
      return <div><p className="font-medium text-gray-900 dark:text-gray-100">{name || "N/A"}</p><p className="text-xs text-gray-400">{idStr}</p></div>;
    },
  },
  {
    key: "title", header: "Document",
    cell: (r) => (
      <div>
        <p className="font-medium text-gray-900 dark:text-gray-100">{r.title as string}</p>
        <p className="text-xs text-gray-400">{typeDisplay[r.documentType as string] || r.documentType as string}</p>
      </div>
    ),
  },
  {
    key: "department", header: "Department",
    cell: (r) => <span className="text-sm text-gray-600 dark:text-gray-400">{(r.department as string) || "—"}</span>,
  },
  {
    key: "createdAt", header: "Date",
    cell: (r) => <span className="text-sm text-gray-500">{new Date(r.createdAt as string).toLocaleDateString()}</span>,
  },
  {
    key: "documentType", header: "Type",
    cell: (r) => <Badge variant={typeVariant[r.documentType as string] ?? "default"}>{typeDisplay[r.documentType as string] || r.documentType as string}</Badge>,
  },
  createActionColumn(),
];

export default function DiagnosticRecordsPage() {
  const { data: fetched = [], isLoading } = useQuery({
    queryKey: ["lab-documents"],
    queryFn: async () => {
      const res = await getDocuments({ limit: "100" });
      return (res.data as DocRow[]) ?? [];
    },
  });

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const types = [...new Set(fetched.map((r) => r.documentType))];

  const filtered = fetched.filter((r) => {
    const pid = r.patientId as Record<string, unknown> | string;
    const name = typeof pid === 'object' ? (pid as Record<string, unknown>).fullName as string : "";
    const idStr = typeof pid === 'object' ? (pid as Record<string, unknown>).patientId as string : "";
    const matchSearch = !search || name.toLowerCase().includes(search.toLowerCase()) || r.title.toLowerCase().includes(search.toLowerCase()) || idStr.includes(search);
    const matchType = !typeFilter || r.documentType === typeFilter;
    return matchSearch && matchType;
  }) as unknown as Record<string, unknown>[];

  return (
    <div className="space-y-6">
      <PageHeader title="Diagnostic Records" description={`${fetched.length} total documents`} icon={FlaskConical} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <StatsCardSkeleton key={i} />)
        ) : (
          <>
            <StatsCard title="Total Documents" value={fetched.length} icon={Clock} color="amber" index={0} />
            <StatsCard title="Diagnostic Reports" value={fetched.filter(r => r.documentType === 'diagnostic_report').length} icon={AlertCircle} color="blue" index={1} />
            <StatsCard title="Other Documents" value={fetched.filter(r => r.documentType !== 'diagnostic_report').length} icon={CheckCircle2} color="green" index={2} />
          </>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchFilter value={search} onChange={setSearch} placeholder="Search patient name, ID or document..." className="flex-1" />
        <SelectFilter value={typeFilter} onChange={setTypeFilter}
          options={types.map((t) => ({ label: typeDisplay[t] || t, value: t }))}
          placeholder="All Types" />
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
        <DataTable data={filtered} columns={columns} isLoading={isLoading} pageSize={10} emptyTitle="No diagnostic records found" emptyDescription="Try adjusting your search or filter criteria." />
      </div>
    </div>
  );
}
