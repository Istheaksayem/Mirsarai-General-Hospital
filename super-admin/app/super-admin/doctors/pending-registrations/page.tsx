"use client";

import { useState, useCallback } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { UserCheck, CheckCircle, XCircle, X } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  usePendingRegistrations,
  useApproveRegistration,
  useRejectRegistration,
  useAssignAdminInfo,
} from "@/lib/hooks/useCmsDoctors";
import type { PendingRegistration } from "@/lib/services/api";
import type { AdminInfoData } from "@/lib/services/api";
import toast from "react-hot-toast";

interface ApprovalTarget {
  userId: string;
  fullName: string;
}

export default function PendingRegistrationsPage() {
  const { data: res, isLoading } = usePendingRegistrations();
  const approveMutation = useApproveRegistration();
  const rejectMutation = useRejectRegistration();
  const assignAdminInfoMutation = useAssignAdminInfo();

  const registrations = (res?.data || []) as PendingRegistration[];

  const [approvalTarget, setApprovalTarget] = useState<ApprovalTarget | null>(null);
  const [adminInfo, setAdminInfo] = useState<AdminInfoData>({
    department: "",
    designation: "",
    branch: "",
    employmentType: "permanent",
  });
  const [adminInfoError, setAdminInfoError] = useState<string | null>(null);
  const [approving, setApproving] = useState(false);

  const handleApproveClick = useCallback((userId: string, fullName: string) => {
    setApprovalTarget({ userId, fullName });
    setAdminInfo({ department: "", designation: "", branch: "", employmentType: "permanent" });
    setAdminInfoError(null);
  }, []);

  const handleConfirmApprove = useCallback(async () => {
    if (!approvalTarget) return;
    if (!adminInfo.department.trim() || !adminInfo.designation.trim()) {
      setAdminInfoError("Department and Designation are required");
      return;
    }
    setAdminInfoError(null);
    setApproving(true);
    try {
      await assignAdminInfoMutation.mutateAsync({
        userId: approvalTarget.userId,
        data: adminInfo,
      });
      await approveMutation.mutateAsync(approvalTarget.userId);
      setApprovalTarget(null);
      toast.success("Staff approved successfully");
    } catch {
      setAdminInfoError("Failed to approve. Please try again.");
      toast.error("Failed to approve staff");
    } finally {
      setApproving(false);
    }
  }, [approvalTarget, adminInfo, assignAdminInfoMutation, approveMutation]);

  const ROLE_BADGE_COLORS: Record<string, string> = {
    doctor: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    reception: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    lab: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  };

  const ROLE_LABELS: Record<string, string> = {
    doctor: "Doctor",
    reception: "Receptionist",
    lab: "Lab Admin",
  };

  const handleReject = useCallback(
    (userId: string, fullName: string) => {
      if (window.confirm(`Reject registration for "${fullName}"?`)) {
        rejectMutation.mutate(userId, {
          onSuccess: () => toast.success("Registration rejected"),
          onError: (err: Error) => toast.error(err?.message || "Failed to reject registration"),
        });
      }
    },
    [rejectMutation]
  );

  const columns: Column<Record<string, unknown>>[] = [
    {
      key: "fullName",
      header: "Name",
      cell: (r) => {
        const d = r as unknown as PendingRegistration;
        return (
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 shrink-0 rounded-full bg-gradient-to-br from-[#1E2B7A] to-[#76BC21] flex items-center justify-center text-xs font-bold text-white">
              {(d.fullName || "?").charAt(0)}
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {d.fullName || "Untitled"}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      key: "role",
      header: "Role",
      cell: (r) => {
        const d = r as unknown as PendingRegistration;
        const roleKey = d.role || "";
        return (
          <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${ROLE_BADGE_COLORS[roleKey] || "bg-gray-100 text-gray-600"}`}>
            {ROLE_LABELS[roleKey] || roleKey}
          </span>
        );
      },
    },
    {
      key: "email",
      header: "Email",
      cell: (r) => <span className="text-sm">{(r as unknown as PendingRegistration).email || "—"}</span>,
    },
    {
      key: "phone",
      header: "Phone",
      cell: (r) => <span className="text-sm">{(r as unknown as PendingRegistration).phone || "—"}</span>,
    },
    {
      key: "createdAt",
      header: "Registered",
      cell: (r) => {
        const d = (r as unknown as PendingRegistration).createdAt;
        return <span className="text-sm">{d ? new Date(d).toLocaleDateString() : "—"}</span>;
      },
    },
    {
      key: "status",
      header: "Status",
      cell: () => <Badge variant="warning">Pending</Badge>,
    },
    {
      key: "__actions__",
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      cell: (r) => {
        const d = r as unknown as PendingRegistration;
        return (
          <div className="flex items-center justify-end gap-2">
            <Button
              size="sm"
              variant="primary"
              onClick={() => handleApproveClick(d._id, d.fullName)}
              loading={approveMutation.isPending || (approving && approvalTarget?.userId === d._id)}
              className="!bg-green-600 hover:!bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleReject(d._id, d.fullName)}
              loading={rejectMutation.isPending}
              className="!border-red-300 !text-red-600 hover:!bg-red-50"
            >
              <XCircle className="h-4 w-4 mr-1" />
              Reject
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pending Staff Registrations"
        description={`${registrations.length} registration(s) awaiting approval`}
        icon={UserCheck}
      />

      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
        <DataTable
          data={registrations as unknown as Record<string, unknown>[]}
          columns={columns}
          isLoading={isLoading}
          pageSize={10}
          emptyTitle="No pending registrations"
          emptyDescription="All staff registrations have been processed."
        />
      </div>

      <Dialog.Root open={!!approvalTarget} onOpenChange={(open) => { if (!open) setApprovalTarget(null); }}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
          <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <Dialog.Title className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Approve Staff: {approvalTarget?.fullName}
              </Dialog.Title>
              <Dialog.Close className="rounded-lg p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <X className="h-5 w-5" />
              </Dialog.Close>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
              Assign administrative details before approving this staff member.
            </p>

            {adminInfoError && (
              <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 px-3.5 py-2.5 text-sm text-red-600 dark:text-red-400">
                {adminInfoError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                  Department <span className="text-red-500">*</span>
                </label>
                <input
                  value={adminInfo.department}
                  onChange={(e) => setAdminInfo((prev) => ({ ...prev, department: e.target.value }))}
                  placeholder="e.g. Cardiology"
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3.5 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]/40 focus:border-[#1E2B7A] dark:focus:border-[#4a5fd4] transition-all"
                />
              </div>

              <div>
                <label className="mb-1.5 flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                  Designation <span className="text-red-500">*</span>
                </label>
                <input
                  value={adminInfo.designation}
                  onChange={(e) => setAdminInfo((prev) => ({ ...prev, designation: e.target.value }))}
                  placeholder="e.g. Senior Consultant"
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3.5 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]/40 focus:border-[#1E2B7A] dark:focus:border-[#4a5fd4] transition-all"
                />
              </div>

              <div>
                <label className="mb-1.5 flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                  Branch
                </label>
                <input
                  value={adminInfo.branch}
                  onChange={(e) => setAdminInfo((prev) => ({ ...prev, branch: e.target.value }))}
                  placeholder="e.g. Main Campus"
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3.5 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]/40 focus:border-[#1E2B7A] dark:focus:border-[#4a5fd4] transition-all"
                />
              </div>

              <div>
                <label className="mb-1.5 flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                  Employment Type
                </label>
                <select
                  value={adminInfo.employmentType}
                  onChange={(e) => setAdminInfo((prev) => ({ ...prev, employmentType: e.target.value }))}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3.5 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]/40 focus:border-[#1E2B7A] dark:focus:border-[#4a5fd4] transition-all"
                >
                  <option value="permanent">Permanent</option>
                  <option value="visiting">Visiting</option>
                  <option value="contract">Contract</option>
                  <option value="resident">Resident</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <Dialog.Close asChild>
                <Button size="sm" variant="outline">
                  Cancel
                </Button>
              </Dialog.Close>
              <Button
                size="sm"
                variant="primary"
                onClick={handleConfirmApprove}
                loading={approving}
                className="!bg-green-600 hover:!bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Confirm & Approve
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
