"use client";
import { Bell } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { NotificationsList } from "@/components/notifications/NotificationsList";

export default function ReceptionNotificationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Notifications" description="View and manage your notifications" icon={Bell} />
      <NotificationsList />
    </div>
  );
}
