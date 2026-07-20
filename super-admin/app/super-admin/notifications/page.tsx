"use client";
import { useState } from "react";
import { Bell, Megaphone, X, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { NotificationsList } from "@/components/notifications/NotificationsList";
import { createAnnouncement, ApiError, formatApiError } from "@/lib/services/api";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

function AnnouncementModal({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<{ sentTo: number } | null>(null);

  async function handleSubmit() {
    if (!title.trim() || !message.trim()) {
      toast.error("Title and message are required");
      return;
    }
    setSubmitting(true);
    try {
      const res = await createAnnouncement({ title, message });
      setResult(res);
      setSubmitted(true);
      qc.invalidateQueries({ queryKey: ["staff-notifications"] });
    } catch (err: unknown) {
      const msg = err instanceof ApiError ? formatApiError(err) : "Failed to send announcement";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <div className="relative bg-white dark:bg-gray-900 rounded-3xl p-12 flex flex-col items-center gap-4 shadow-2xl">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
            <CheckCircle2 className="h-10 w-10 text-purple-600" />
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">Announcement Sent!</p>
            <p className="text-sm text-gray-500 mt-1">Delivered to {result?.sentTo ?? 0} patients.</p>
          </div>
          <Button size="sm" onClick={onClose}>Done</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600">
              <Megaphone className="h-5 w-5 text-white" />
            </div>
            <h2 className="font-bold text-gray-900 dark:text-gray-100 text-lg">Send Announcement</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Hospital Holiday Notice"
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:border-[#1E2B7A] focus:ring-2 focus:ring-[#1E2B7A]/20 focus:outline-none transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your announcement message..."
              rows={5}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:border-[#1E2B7A] focus:ring-2 focus:ring-[#1E2B7A]/20 focus:outline-none transition-all resize-none"
            />
          </div>
          <p className="text-xs text-gray-400">This announcement will be sent to all registered patients.</p>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Cancel</button>
          <Button size="sm" onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Sending..." : "Send Announcement"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function SuperAdminNotificationsPage() {
  const [showAnnouncement, setShowAnnouncement] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader title="Notifications" description="View, manage, and send broadcast announcements" icon={Bell}>
        <Button size="sm" onClick={() => setShowAnnouncement(true)}>
          <Megaphone className="h-4 w-4 mr-1.5" />Send Announcement
        </Button>
      </PageHeader>
      <NotificationsList canAnnounce />
      {showAnnouncement && <AnnouncementModal onClose={() => setShowAnnouncement(false)} />}
    </div>
  );
}
