"use client";
import { Users, CalendarDays, UserCheck, CreditCard, Clock, Bell } from "lucide-react";
import { StatsCard } from "@/components/ui/StatsCard";
import { StatsCardSkeleton } from "@/components/ui/Skeleton";
import { ActivityFeed } from "@/components/ui/ActivityFeed";
import { Button } from "@/components/ui/Button";
import { useDashboard } from "@/lib/hooks/useDashboard";
import { useActivities } from "@/lib/hooks/useActivities";
import Link from "next/link";

export default function ReceptionDashboard() {
  const { data: stats, isLoading } = useDashboard("reception-admin");
  const { data: activities, isLoading: aLoading } = useActivities();
  const s = stats as Record<string, number> | undefined;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Reception Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Front desk overview and daily operations.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? Array.from({ length: 6 }).map((_, i) => <StatsCardSkeleton key={i} />) : (
          <>
            <StatsCard title="Today's Appointments" value={s?.totalAppointments ?? 0} icon={CalendarDays} color="blue" trend={{ value: 8, label: "vs yesterday" }} index={0} />
            <StatsCard title="Patients Checked In" value={s?.checkedIn ?? 0} icon={UserCheck} color="green" trend={{ value: 15, label: "vs yesterday" }} index={1} />
            <StatsCard title="Pending Check-In" value={s?.pendingCheckIn ?? 0} icon={Clock} color="amber" subtitle="Awaiting registration" index={2} />
            <StatsCard title="New Patients Today" value={s?.newPatientsToday ?? 0} icon={Users} color="purple" index={3} />
            <StatsCard title="Bills Generated" value={s?.billsGenerated ?? 0} icon={CreditCard} color="cyan" index={4} />
            <StatsCard title="Unread Notifications" value={s?.unreadNotifications ?? 0} icon={Bell} color="red" index={5} />
          </>
        )}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 dark:text-gray-50">Recent Activity</h2>
          </div>
          {aLoading ? <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-12 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />)}</div>
            : <ActivityFeed activities={(activities ?? []).filter(a => ["appointment", "check-in", "payment"].includes(a.resourceType))} limit={6} />}
        </div>
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5">
          <h2 className="mb-4 font-semibold text-gray-900 dark:text-gray-50">Quick Actions</h2>
          <div className="space-y-2">
            {[
              { label: "Register Patient", href: "/reception-admin/patients", icon: Users },
              { label: "New Appointment", href: "/reception-admin/appointments", icon: CalendarDays },
              { label: "Patient Check-In", href: "/reception-admin/check-in", icon: UserCheck },
              { label: "View Queue", href: "/reception-admin/queue", icon: Clock },
              { label: "Create Invoice", href: "/reception-admin/billing", icon: CreditCard },
            ].map((item) => (
              <Link key={item.href} href={item.href}>
                <button className="flex w-full items-center gap-3 rounded-xl border border-gray-200 dark:border-gray-700 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-[#76BC21]/30 transition-all text-left">
                  <item.icon className="h-4 w-4 text-[#76BC21] shrink-0" />{item.label}
                </button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
