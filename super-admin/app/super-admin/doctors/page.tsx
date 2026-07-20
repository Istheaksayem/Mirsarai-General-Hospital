"use client";

import { useState, useCallback } from "react";
import { Stethoscope, UserPlus, Star } from "lucide-react";
import toast from "react-hot-toast";
import { PageHeader } from "@/components/ui/PageHeader";
import { SearchFilter, SelectFilter } from "@/components/ui/SearchFilter";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ActionButtons } from "@/components/ui/ActionButtons";
import { useCmsDoctors, useDeleteCmsDoctor } from "@/lib/hooks/useCmsDoctors";
import type { CmsDoctor } from "@/lib/services/api";
import Link from "next/link";

export default function DoctorsPage() {
  const { data: res, isLoading } = useCmsDoctors();
  const deleteMutation = useDeleteCmsDoctor();
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("");

  const data = (res?.data || []) as CmsDoctor[];

  const handleDelete = useCallback(
    (id: string) => {
      if (window.confirm("Delete this doctor? This cannot be undone.")) {
        deleteMutation.mutate(id, {
          onSuccess: () => toast.success("Doctor deleted successfully"),
          onError: (err: Error) => toast.error(err?.message || "Failed to delete doctor"),
        });
      }
    },
    [deleteMutation]
  );

  const departments = [...new Set(data.map((d) => d.department?.en).filter(Boolean))] as string[];

  const filtered = data.filter((d) => {
    const ms =
      !search ||
      (d.name?.en || "").toLowerCase().includes(search.toLowerCase()) ||
      (d.specialization?.en || "").toLowerCase().includes(search.toLowerCase()) ||
      (d.department?.en || "").toLowerCase().includes(search.toLowerCase());
    const md = !deptFilter || d.department?.en === deptFilter;
    return ms && md;
  });

  const activeCount = data.filter((d) => d.status === "active").length;
  const onLeaveCount = data.filter((d) => d.status === "on-leave").length;

  const columns: Column<Record<string, unknown>>[] = [
    {
      key: "name",
      header: "Doctor",
      cell: (r) => {
        const d = r as unknown as CmsDoctor;
        return (
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 shrink-0 rounded-full bg-gradient-to-br from-[#1E2B7A] to-[#76BC21] flex items-center justify-center text-xs font-bold text-white">
              {(d.name?.en || "?").charAt(0)}
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {d.name?.en || "Untitled"}
                {d.featured && <Star className="h-3 w-3 inline ml-1 text-amber-400 fill-amber-400" />}
              </p>
              <p className="text-xs text-gray-400">{d.designation?.en || ""}</p>
            </div>
          </div>
        );
      },
    },
    {
      key: "specialization",
      header: "Specialization",
      cell: (r) => <span className="text-sm">{(r as unknown as CmsDoctor).specialization?.en || "—"}</span>,
    },
    {
      key: "department",
      header: "Department",
      cell: (r) => <span className="text-sm">{(r as unknown as CmsDoctor).department?.en || "—"}</span>,
    },
    {
      key: "qualification",
      header: "Qualification",
    },
    {
      key: "experience",
      header: "Exp.",
      cell: (r) => `${(r as unknown as CmsDoctor).experience?.years || 0}y`,
    },
    {
      key: "consultationFee",
      header: "Fee",
      cell: (r) => `৳${((r as unknown as CmsDoctor).consultationFee || 0).toLocaleString()}`,
    },
    {
      key: "status",
      header: "Status",
      cell: (r) => {
        const s = (r as unknown as CmsDoctor).status;
        const variant = s === "active" ? "success" : s === "on-leave" ? "warning" : "danger";
        return <Badge variant={variant as "success" | "warning" | "danger"}>{s}</Badge>;
      },
    },
    {
      key: "isVisible",
      header: "Visible",
      cell: (r) => {
        const v = (r as unknown as CmsDoctor).isVisible;
        return <Badge variant={v ? "success" : "warning"}>{v ? "Yes" : "No"}</Badge>;
      },
    },
    {
      key: "__actions__",
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      cell: (r) => {
        const id = (r as unknown as CmsDoctor)._id;
        return (
          <ActionButtons
            row={r}
            viewHref={`/super-admin/doctors/${id}`}
            editHref={`/super-admin/doctors/${id}/edit`}
            onDelete={() => handleDelete(id)}
          />
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Doctor Management" description={`${data.length} doctors`} icon={Stethoscope}>
        <Link href="/super-admin/doctors/new/edit">
          <Button size="sm">
            <UserPlus className="h-4 w-4 mr-1.5" />
            Add Doctor
          </Button>
        </Link>
      </PageHeader>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total", value: data.length, color: "text-[#1E2B7A] dark:text-blue-400" },
          { label: "Active", value: activeCount, color: "text-green-600 dark:text-green-400" },
          { label: "On Leave", value: onLeaveCount, color: "text-amber-600 dark:text-amber-400" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchFilter
          value={search}
          onChange={setSearch}
          placeholder="Search doctor, specialization or department..."
          className="flex-1"
        />
        <SelectFilter
          value={deptFilter}
          onChange={setDeptFilter}
          options={departments.map((d) => ({ label: d, value: d }))}
          placeholder="All Departments"
        />
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
        <DataTable
          data={filtered as unknown as Record<string, unknown>[]}
          columns={columns}
          isLoading={isLoading}
          pageSize={8}
          emptyTitle="No doctors found"
        />
      </div>
    </div>
  );
}
