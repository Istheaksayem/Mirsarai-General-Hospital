"use client";
import { Bell } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { NotificationsList } from "@/components/notifications/NotificationsList";

export default function DoctorNotificationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Notifications" description="Appointment reminders and report updates" icon={Bell} />
      <NotificationsList />
    </div>
  );
}
