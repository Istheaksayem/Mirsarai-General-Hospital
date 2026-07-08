"use client";

import { useState } from "react";
import { Stethoscope, UserPlus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { SearchFilter, SelectFilter } from "@/components/ui/SearchFilter";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useDoctors } from "@/lib/hooks/useDoctors";
import { type Doctor } from "@/lib/services/api";

const columns: Column<Record<string, unknown>>[] = [
  {
    key: "name", header: "Doctor",
    cell: (r) => (
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 shrink-0 rounded-full bg-gradient-to-br from-[#1E2B7A] to-[#76BC21] flex items-center justify-center">
          <span className="text-xs font-bold text-white">{(r.name as string).split(" ").pop()?.charAt(0)}</span>
        </div>
        <div>
          <p className="font-medium text-gray-900 dark:text-gray-100">{r.name as string}</p>
          <p className="text-xs text-gray-400">{r.specialization as string}</p>
        </div>
      </div>
    ),
  },
  { key: "department", header: "Department" },
  { key: "qualification", header: "Qualification" },
  { key: "experience", header: "Exp.", cell: (r) => `${r.experience as number}y` },
  { key: "consultationFee", header: "Fee", cell: (r) => `৳${(r.consultationFee as number).toLocaleString()}` },
  { key: "patientsCount", header: "Patients" },
  {
    key: "status", header: "Status",
    cell: (r) => {
      const v = r.status === "active" ? "success" : r.status === "on-leave" ? "warning" : "danger";
      return <Badge variant={v as "success" | "warning" | "danger"}>{r.status as string}</Badge>;
    },
  },
];

export default function DoctorsPage() {
  const { data = [], isLoading } = useDoctors();
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("");

  const departments = [...new Set(data.map((d) => d.department))];
  const filtered = data.filter((d) => {
    const ms = !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.specialization.toLowerCase().includes(search.toLowerCase());
    const md = !deptFilter || d.department === deptFilter;
    return ms && md;
  }) as unknown as Record<string, unknown>[];

  return (
    <div className="space-y-6">
      <PageHeader title="Doctor Management" description={`${data.length} doctors on staff`} icon={Stethoscope}>
        <Button size="sm"><UserPlus className="h-4 w-4 mr-1.5" />Add Doctor</Button>
      </PageHeader>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total", value: data.length, color: "text-[#1E2B7A] dark:text-blue-400" },
          { label: "Active", value: data.filter(d => d.status === "active").length, color: "text-green-600 dark:text-green-400" },
          { label: "On Leave", value: data.filter(d => d.status === "on-leave").length, color: "text-amber-600 dark:text-amber-400" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchFilter value={search} onChange={setSearch} placeholder="Search doctor or specialization..." className="flex-1" />
        <SelectFilter
          value={deptFilter} onChange={setDeptFilter}
          options={departments.map((d) => ({ label: d, value: d }))}
          placeholder="All Departments"
        />
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
        <DataTable data={filtered} columns={columns} isLoading={isLoading} pageSize={8} emptyTitle="No doctors found" />
      </div>
    </div>
  );
}
