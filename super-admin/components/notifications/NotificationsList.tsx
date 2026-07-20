"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Bell, Calendar, FileText, AlertCircle, Info, Megaphone,
  CheckCheck, Trash2, RefreshCw, ArrowLeft,
} from "lucide-react";
import {
  getStaffNotifications, markNotificationRead, markAllNotificationsRead,
  deleteNotification, type StaffNotification,
} from "@/lib/services/api";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DataTable, Column } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import toast from "react-hot-toast";

// ── Config ────────────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<string, { icon: React.ComponentType<{ className?: string }>; label: string }> = {
  appointment_reminder: { icon: Calendar, label: "Appointment" },
  report_ready:         { icon: FileText,   label: "Report" },
  announcement:         { icon: Megaphone,  label: "Announcement" },
  status_update:        { icon: Info,       label: "Update" },
  general:              { icon: Bell,       label: "General" },
};

const PRIORITY_VARIANT: Record<string, "danger" | "warning" | "info" | "default"> = {
  urgent: "danger",
  high:   "warning",
  medium: "info",
  low:    "default",
};

function getTypeIcon(type: string) {
  return TYPE_CONFIG[type]?.icon || Bell;
}

function getTypeLabel(type: string) {
  return TYPE_CONFIG[type]?.label || "General";
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface NotificationsListProps {
  /** Whether the current user can create announcements (super-admin) */
  canAnnounce?: boolean;
  /** Callback to open the announcement creation UI */
  onOpenAnnouncement?: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function NotificationsList({ canAnnounce = false, onOpenAnnouncement }: NotificationsListProps) {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [unreadOnly, setUnreadOnly] = useState(false);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["staff-notifications", page, unreadOnly],
    queryFn: () => getStaffNotifications({
      page: String(page),
      limit: "20",
      ...(unreadOnly ? { unreadOnly: "true" } : {}),
    }),
    staleTime: 1000 * 30,
  });

  const notifications = data?.data ?? [];
  const total = data?.meta?.total ?? 0;
  const totalPages = data?.meta?.totalPages ?? Math.ceil(total / 20);

  // Mark as read mutation
  const markReadMutation = useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["staff-notifications"] }),
  });

  // Mark all as read mutation
  const markAllMutation = useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["staff-notifications"] });
      toast.success("All notifications marked as read");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNotification(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["staff-notifications"] });
      toast.success("Notification deleted");
    },
  });

  const handleMarkRead = useCallback((id: string) => {
    markReadMutation.mutate(id);
  }, [markReadMutation]);

  const columns: Column<Record<string, unknown>>[] = useMemo(() => [
    {
      key: "type",
      header: "",
      className: "w-10",
      cell: (r) => {
        const n = r as unknown as StaffNotification;
        const Icon = getTypeIcon(n.type);
        return (
          <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
            n.type === "report_ready" ? "bg-green-100 dark:bg-green-900/30 text-green-600" :
            n.type === "appointment_reminder" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600" :
            n.type === "announcement" ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600" :
            n.type === "status_update" ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600" :
            "bg-gray-100 dark:bg-gray-800 text-gray-500"
          }`}>
            <Icon className="h-4 w-4" />
          </div>
        );
      },
    },
    {
      key: "content",
      header: "Notification",
      cell: (r) => {
        const n = r as unknown as StaffNotification;
        return (
          <div className={`min-w-0 ${!n.isRead ? "font-semibold" : ""}`}>
            <p className="text-sm text-gray-900 dark:text-gray-100 truncate">{n.title}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{n.message}</p>
          </div>
        );
      },
    },
    {
      key: "priority",
      header: "",
      className: "w-16",
      cell: (r) => {
        const n = r as unknown as StaffNotification;
        return <Badge variant={PRIORITY_VARIANT[n.priority] ?? "default"} className="capitalize">{n.priority}</Badge>;
      },
    },
    {
      key: "createdAt",
      header: "",
      className: "w-20 text-right",
      cell: (r) => {
        const n = r as unknown as StaffNotification;
        return <span className="text-xs text-gray-400 whitespace-nowrap">{timeAgo(n.createdAt)}</span>;
      },
    },
    {
      key: "__actions__",
      header: "",
      className: "w-16 text-right",
      cell: (r) => {
        const n = r as unknown as StaffNotification;
        const busy = markReadMutation.isPending || deleteMutation.isPending;
        return (
          <div className="flex items-center gap-1 justify-end">
            {!n.isRead && (
              <button
                onClick={() => handleMarkRead(n._id)}
                disabled={busy}
                title="Mark as read"
                className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-green-600 transition-colors"
              >
                <CheckCheck className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              onClick={() => deleteMutation.mutate(n._id)}
              disabled={busy}
              title="Delete"
              className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      },
    },
  ], [markReadMutation, deleteMutation, handleMarkRead]);

  const rows = notifications as unknown as Record<string, unknown>[];

  return (
    <div className="space-y-4">
      {/* Filters bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setUnreadOnly(false); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              !unreadOnly
                ? "bg-[#1E2B7A] text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            All ({total})
          </button>
          <button
            onClick={() => { setUnreadOnly(true); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              unreadOnly
                ? "bg-[#1E2B7A] text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            Unread
          </button>
        </div>
        <div className="flex items-center gap-2">
          {canAnnounce && onOpenAnnouncement && (
            <Button size="sm" onClick={onOpenAnnouncement}>
              <Megaphone className="h-4 w-4 mr-1" />Send Announcement
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-1" />Refresh
          </Button>
          {notifications.some((n) => !n.isRead) && (
            <Button size="sm" variant="outline" onClick={() => markAllMutation.mutate()}>
              <CheckCheck className="h-4 w-4 mr-1" />Mark All Read
            </Button>
          )}
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <AlertCircle className="h-10 w-10 text-red-400 mb-3" />
          <p className="text-sm text-gray-500">Failed to load notifications</p>
          <button onClick={() => refetch()} className="mt-3 text-sm text-[#1E2B7A] hover:underline">Retry</button>
        </div>
      ) : notifications.length === 0 ? (
        <EmptyState
          title={unreadOnly ? "No unread notifications" : "No notifications yet"}
          description={unreadOnly ? "You've read everything!" : "Notifications will appear here when triggered."}
          compact
        />
      ) : (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800 overflow-hidden">
          {rows.map((row) => {
            const n = row as unknown as StaffNotification;
            return (
              <div
                key={n._id}
                className={`flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/40 ${
                  !n.isRead ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
                }`}
              >
                {/* Icon */}
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  n.type === "report_ready" ? "bg-green-100 dark:bg-green-900/30 text-green-600" :
                  n.type === "appointment_reminder" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600" :
                  n.type === "announcement" ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600" :
                  n.type === "status_update" ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600" :
                  "bg-gray-100 dark:bg-gray-800 text-gray-500"
                }`}>
                  {React.createElement(getTypeIcon(n.type), { className: "h-4 w-4" })}
                </div>
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm truncate ${!n.isRead ? "font-semibold text-gray-900 dark:text-gray-100" : "text-gray-700 dark:text-gray-300"}`}>
                      {n.title}
                    </p>
                    <Badge variant={PRIORITY_VARIANT[n.priority] ?? "default"} className="shrink-0 capitalize text-[10px] px-1.5 py-0">
                      {n.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{n.message}</p>
                </div>
                {/* Time */}
                <span className="text-xs text-gray-400 whitespace-nowrap shrink-0">{timeAgo(n.createdAt)}</span>
                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  {!n.isRead && (
                    <button
                      onClick={() => handleMarkRead(n._id)}
                      title="Mark as read"
                      className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-green-600 transition-colors"
                    >
                      <CheckCheck className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteMutation.mutate(n._id)}
                    title="Delete"
                    className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">Page {page} of {totalPages}</p>
          <div className="flex gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
