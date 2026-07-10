"use client";

import { useState } from "react";
import { Building2, Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { SearchFilter } from "@/components/ui/SearchFilter";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useDepartments } from "@/lib/hooks/useDepartments";
import { createActionColumn } from "@/components/ui/ActionButtons";
import Link from "next/link";

const columns: Column<Record<string, unknown>>[] = [
  {
    key: "code", header: "Code",
    cell: (r) => <span className="rounded-lg bg-[#1E2B7A]/10 dark:bg-[#1E2B7A]/20 px-2.5 py-0.5 text-xs font-bold text-[#1E2B7A] dark:text-blue-400">{r.code as string}</span>,
  },
  {
    key: "name", header: "Department",
    cell: (r) => (
      <div>
        <p className="font-medium text-gray-900 dark:text-gray-100">{r.name as string}</p>
        <p className="text-xs text-gray-400">{r.location as string}</p>
      </div>
    ),
  },
  { key: "headOfDepartment", header: "Head of Dept." },
  { key: "staffCount", header: "Staff" },
  { key: "bedsCount", header: "Beds" },
  { key: "activePatients", header: "Active Patients" },
  {
    key: "status", header: "Status",
    cell: (r) => <Badge variant={r.status === "active" ? "success" : "warning"}>{r.status as string}</Badge>,
  },
  createActionColumn({ basePath: "/super-admin/departments" }),
];

export default function DepartmentsPage() {
  const { data = [], isLoading } = useDepartments();
  const [search, setSearch] = useState("");

  const filtered = data.filter((d) =>
    !search || d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.code.toLowerCase().includes(search.toLowerCase()) ||
    d.headOfDepartment.toLowerCase().includes(search.toLowerCase())
  ) as unknown as Record<string, unknown>[];

  const totalBeds = data.reduce((s, d) => s + d.bedsCount, 0);
  const totalStaff = data.reduce((s, d) => s + d.staffCount, 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Department Management" description={`${data.length} departments`} icon={Building2}>
        <Link href="/super-admin/departments/add"><Button size="sm"><Plus className="h-4 w-4 mr-1.5" />Add Department</Button></Link>
      </PageHeader>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Departments", value: data.length, color: "text-[#1E2B7A] dark:text-blue-400" },
          { label: "Total Beds", value: totalBeds, color: "text-green-600 dark:text-green-400" },
          { label: "Total Staff", value: totalStaff, color: "text-purple-600 dark:text-purple-400" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <SearchFilter value={search} onChange={setSearch} placeholder="Search department, code or head..." className="max-w-sm" />

      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
        <DataTable data={filtered} columns={columns} isLoading={isLoading} pageSize={8} emptyTitle="No departments found" />
      </div>
    </div>
  );
}
