"use client";
import { useState } from "react";
import { Users, UserPlus, Download } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { SearchFilter, SelectFilter } from "@/components/ui/SearchFilter";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { usePatients, useDeletePatient } from "@/lib/hooks/usePatients";
import { createActionColumn } from "@/components/ui/ActionButtons";
import type { PatientRow } from "@/lib/hooks/usePatients";
import toast from "react-hot-toast";

const statusVariant: Record<string, "success" | "warning" | "info"> = {
  active: "success", inactive: "warning", admitted: "info",
};

const columns: Column<Record<string, unknown>>[] = [
  {
    key: "id", header: "Patient ID",
    cell: (r) => <span className="font-mono text-xs font-bold text-[#1E2B7A] dark:text-blue-400">{r.id as string}</span>,
  },
  {
    key: "name", header: "Patient",
    cell: (r) => (
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 shrink-0 rounded-full bg-[#1E2B7A]/10 dark:bg-[#1E2B7A]/20 flex items-center justify-center">
          <span className="text-xs font-semibold text-[#1E2B7A] dark:text-blue-400">{(r.name as string).charAt(0)}</span>
        </div>
        <div>
          <p className="font-medium text-gray-900 dark:text-gray-100">{r.name as string}</p>
          <p className="text-xs text-gray-400">{r.gender as string} · {r.bloodGroup as string}</p>
        </div>
      </div>
    ),
  },
  { key: "age", header: "Age", cell: (r) => `${r.age as number} yrs` },
  { key: "phone", header: "Phone" },
  { key: "department", header: "Department" },
  {
    key: "status", header: "Status",
    cell: (r) => <Badge variant={statusVariant[r.status as string] ?? "default"}>{r.status as string}</Badge>,
  },
  {
    key: "lastVisit", header: "Last Visit",
    cell: (r) => <span className="text-sm text-gray-500 dark:text-gray-400">{(r.lastVisit as string) || "—"}</span>,
  },
  createActionColumn({ basePath: "/super-admin/patients" }),
];

export default function PatientsPage() {
  const { data: fetchedData = [], isLoading } = usePatients();
  const deleteMutation = useDeletePatient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const data = [...fetchedData];

  const filtered = data.filter((p) => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()) || p.phone.includes(search);
    const matchStatus = !statusFilter || p.status === statusFilter;
    return matchSearch && matchStatus;
  }) as unknown as Record<string, unknown>[];

  const handleDelete = (row: Record<string, unknown>) => {
    const patient = row as unknown as PatientRow;
    deleteMutation.mutate(patient._id, {
      onSuccess: () => toast.success("Patient deactivated"),
      onError: () => toast.error("Failed to deactivate patient"),
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Patient Management" description={`${data.length} registered patients`} icon={Users}>
        <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-1.5" />Export</Button>
        <Link href="/super-admin/patients/add">
          <Button size="sm"><UserPlus className="h-4 w-4 mr-1.5" />Add Patient</Button>
        </Link>
      </PageHeader>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total", value: data.length, color: "text-[#1E2B7A] dark:text-blue-400" },
          { label: "Active", value: data.filter(p => p.status === "active").length, color: "text-green-600 dark:text-green-400" },
          { label: "Admitted", value: data.filter(p => p.status === "admitted").length, color: "text-blue-600 dark:text-blue-400" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchFilter value={search} onChange={setSearch} placeholder="Search by name, ID or phone..." className="flex-1" />
        <SelectFilter
          value={statusFilter} onChange={setStatusFilter}
          options={[
            { label: "Active", value: "active" },
            { label: "Admitted", value: "admitted" },
            { label: "Inactive", value: "inactive" },
          ]}
          placeholder="All Status"
        />
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
        <DataTable data={filtered} columns={columns} isLoading={isLoading} pageSize={8} emptyTitle="No patients found" />
      </div>
    </div>
  );
}
