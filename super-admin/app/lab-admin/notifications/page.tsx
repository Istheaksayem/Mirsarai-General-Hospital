"use client";
import { Bell } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { NotificationsList } from "@/components/notifications/NotificationsList";

export default function LabNotificationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Notifications" description="Lab report and test result notifications" icon={Bell} />
      <NotificationsList />
    </div>
  );
}
