"use client";

import { useState, useMemo } from "react";
import { FileText, Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { SearchFilter } from "@/components/ui/SearchFilter";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { createActionColumn } from "@/components/ui/ActionButtons";
import { useReportBatches, useDeleteReportBatch } from "@/lib/hooks/useReportBatches";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ReportManagementPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const params: Record<string, string> = { page: String(page), limit: "10" };
  if (search) params.search = search;

  const { data, isLoading } = useReportBatches(params);
  const deleteMutation = useDeleteReportBatch();

  const batches = data?.data || [];
  const total = data?.total || 0;

  const handleDelete = (row: Record<string, unknown>) => {
    deleteMutation.mutate(row._id as string, {
      onSuccess: () => toast.success("Report batch deleted"),
      onError: () => toast.error("Failed to delete report batch"),
    });
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const columns: Column<Record<string, unknown>>[] = useMemo(() => [
    {
      key: "patientName",
      header: "Patient Name",
      cell: (r) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-gray-100">{r.patientName as string}</p>
          <p className="text-xs text-gray-400">{r.mobileNumber as string}</p>
        </div>
      ),
    },
    {
      key: "patientId",
      header: "Patient ID",
      cell: (r) => (
        <span className="font-mono text-xs font-bold text-[#1E2B7A] dark:text-blue-400">
          {r.patientId as string}
        </span>
      ),
    },
    {
      key: "testDate",
      header: "Test Date",
      cell: (r) => <span className="text-sm">{formatDate(r.testDate as string)}</span>,
    },
    {
      key: "reportDate",
      header: "Report Date",
      cell: (r) => <span className="text-sm">{formatDate(r.reportDate as string)}</span>,
    },
    {
      key: "fileCount",
      header: "Files",
      cell: (r) => (
        <Badge variant="info">
          {(r.fileCount as number) || 0} file{(r.fileCount as number) !== 1 ? "s" : ""}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      header: "Created",
      cell: (r) => (
        <span className="text-xs text-gray-500">{formatDate(r.createdAt as string)}</span>
      ),
    },
    createActionColumn({
      basePath: "/super-admin/report-management",
      idKey: "_id",
      onDelete: handleDelete,
    }),
  ], [handleDelete]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Report Management"
        description={`${total} total report batches`}
        icon={FileText}
      >
        <Link href="/super-admin/report-management/create">
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1.5" />
            Upload New Report
          </Button>
        </Link>
      </PageHeader>

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchFilter
          value={search}
          onChange={setSearch}
          placeholder="Search by patient name or mobile..."
          className="flex-1"
        />
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
        <DataTable
          data={batches as unknown as Record<string, unknown>[]}
          columns={columns}
          isLoading={isLoading}
          pageSize={10}
          emptyTitle="No report batches found"
          emptyDescription="Upload your first report to get started."
        />
      </div>
    </div>
  );
}
