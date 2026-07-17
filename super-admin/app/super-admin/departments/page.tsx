"use client";

import { useState, useCallback } from "react";
import { Building2, Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { SearchFilter } from "@/components/ui/SearchFilter";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ActionButtons } from "@/components/ui/ActionButtons";
import { useCmsDepartments, useDeleteCmsDepartment } from "@/lib/hooks/useCmsDepartments";
import type { CmsDepartment } from "@/lib/services/api";
import Link from "next/link";

export default function DepartmentsPage() {
  const { data: res, isLoading } = useCmsDepartments();
  const deleteMutation = useDeleteCmsDepartment();
  const [search, setSearch] = useState("");

  const data = (res?.data || []) as CmsDepartment[];

  const handleDelete = useCallback(
    (id: string) => {
      if (window.confirm("Delete this department? This cannot be undone.")) {
        deleteMutation.mutate(id);
      }
    },
    [deleteMutation]
  );

  const filtered = data.filter(
    (d) =>
      !search ||
      (d.name?.en || "").toLowerCase().includes(search.toLowerCase()) ||
      (d.slug || "").toLowerCase().includes(search.toLowerCase()) ||
      (d.headDoctor?.en || "").toLowerCase().includes(search.toLowerCase())
  );

  const visibleCount = data.filter((d) => d.isVisible).length;
  const hiddenCount = data.filter((d) => !d.isVisible).length;

  const columns: Column<Record<string, unknown>>[] = [
    {
      key: "name",
      header: "Department",
      cell: (r) => {
        const d = r as unknown as CmsDepartment;
        return (
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {d.name?.en || d.name?.bn || "Untitled"}
            </p>
            {d.name?.bn && (
              <p className="text-xs text-gray-400">{d.name.bn}</p>
            )}
          </div>
        );
      },
    },
    {
      key: "slug",
      header: "Slug",
      cell: (r) => (
        <span className="text-xs text-gray-500 font-mono">
          {(r as unknown as CmsDepartment).slug}
        </span>
      ),
    },
    {
      key: "headDoctor",
      header: "Head of Dept.",
      cell: (r) => {
        const hd = (r as unknown as CmsDepartment).headDoctor;
        return <span className="text-sm">{hd?.en || "—"}</span>;
      },
    },
    {
      key: "availableDoctors",
      header: "Doctors",
      className: "text-center",
    },
    {
      key: "displayOrder",
      header: "Order",
      className: "text-center",
    },
    {
      key: "isVisible",
      header: "Visible",
      cell: (r) => {
        const v = (r as unknown as CmsDepartment).isVisible;
        return (
          <Badge variant={v ? "success" : "warning"}>
            {v ? "Visible" : "Hidden"}
          </Badge>
        );
      },
    },
    {
      key: "available",
      header: "Available",
      cell: (r) => {
        const a = (r as unknown as CmsDepartment).available;
        return (
          <Badge variant={a ? "success" : "warning"}>
            {a ? "Available" : "Unavailable"}
          </Badge>
        );
      },
    },
    {
      key: "__actions__",
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      cell: (r) => {
        const id = (r as unknown as CmsDepartment)._id;
        return (
          <ActionButtons
            row={r}
            viewHref={`/super-admin/departments/${id}/edit`}
            editHref={`/super-admin/departments/${id}/edit`}
            onDelete={() => handleDelete(id)}
          />
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Department Management"
        description={`${data.length} departments`}
        icon={Building2}
      >
        <Link href="/super-admin/departments/new/edit">
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1.5" />
            Add Department
          </Button>
        </Link>
      </PageHeader>

      <div className="grid grid-cols-3 gap-3">
        {[
          {
            label: "Total Departments",
            value: data.length,
            color: "text-[#1E2B7A] dark:text-blue-400",
          },
          {
            label: "Visible",
            value: visibleCount,
            color: "text-emerald-600 dark:text-emerald-400",
          },
          {
            label: "Hidden",
            value: hiddenCount,
            color: "text-gray-500 dark:text-gray-400",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 text-center"
          >
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <SearchFilter
        value={search}
        onChange={setSearch}
        placeholder="Search by name, slug or head of dept..."
        className="max-w-sm"
      />

      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
        <DataTable
          data={filtered as unknown as Record<string, unknown>[]}
          columns={columns}
          isLoading={isLoading}
          pageSize={8}
          emptyTitle="No departments found"
        />
      </div>
    </div>
  );
}
