"use client";

import { Users, Stethoscope, CalendarDays, Building2, TrendingUp, CreditCard, FileText, Activity } from "lucide-react";
import { StatsCard } from "@/components/ui/StatsCard";
import { StatsCardSkeleton } from "@/components/ui/Skeleton";
import { ActivityFeed } from "@/components/ui/ActivityFeed";
import { Button } from "@/components/ui/Button";
import { useDashboard } from "@/lib/hooks/useDashboard";
import { useActivities } from "@/lib/hooks/useActivities";
import Link from "next/link";

export default function SuperAdminDashboard() {
  const { data: stats, isLoading } = useDashboard("super-admin");
  const { data: activities, isLoading: activitiesLoading } = useActivities();

  const s = stats as Record<string, number> | undefined;

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Welcome back. Here's what's happening at the hospital today.</p>
      </div>

      {/* Primary stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <StatsCardSkeleton key={i} />)
        ) : (
          <>
            <StatsCard title="Total Patients" value={s?.totalPatients ?? 0} icon={Users} color="blue" trend={{ value: 12, label: "vs last month" }} index={0} />
            <StatsCard title="Total Doctors" value={s?.totalDoctors ?? 0} icon={Stethoscope} color="green" trend={{ value: 5, label: "vs last month" }} index={1} />
            <StatsCard title="Appointments Today" value={s?.appointmentsToday ?? 0} icon={CalendarDays} color="purple" subtitle={`${s?.pendingAppointments ?? 0} pending`} index={2} />
            <StatsCard title="Departments" value={s?.totalDepartments ?? 0} icon={Building2} color="cyan" index={3} />
          </>
        )}
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <StatsCardSkeleton key={i} />)
        ) : (
          <>
            <StatsCard title="Revenue (MTD)" value={`৳${((s?.revenueThisMonth ?? 0) / 1000).toFixed(1)}K`} icon={TrendingUp} color="green" trend={{ value: 8, label: "vs last month" }} index={4} />
            <StatsCard title="Outstanding Bills" value={s?.unpaidInvoices ?? 0} icon={CreditCard} color="red" index={5} />
            <StatsCard title="Lab Reports Pending" value={s?.labReportsPending ?? 0} icon={FileText} color="amber" index={6} />
            <StatsCard title="Active Staff" value={s?.activeStaff ?? 0} icon={Activity} color="blue" index={7} />
          </>
        )}
      </div>

      {/* Bottom: Activity + Quick Actions */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Recent Activity */}
        <div className="lg:col-span-2 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 dark:text-gray-50">Recent Activity</h2>
            <Link href="/super-admin/reports">
              <Button variant="ghost" size="sm">View all</Button>
            </Link>
          </div>
          {activitiesLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-12 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />
              ))}
            </div>
          ) : (
            <ActivityFeed activities={activities ?? []} limit={8} />
          )}
        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5">
          <h2 className="mb-4 font-semibold text-gray-900 dark:text-gray-50">Quick Actions</h2>
          <div className="space-y-2">
            {[
              { label: "Register Patient", href: "/super-admin/patients", icon: Users },
              { label: "Add Doctor", href: "/super-admin/doctors", icon: Stethoscope },
              { label: "New Appointment", href: "/super-admin/appointments", icon: CalendarDays },
              { label: "View Reports", href: "/super-admin/reports", icon: FileText },
              { label: "Billing Overview", href: "/super-admin/billing", icon: CreditCard },
            ].map((item) => (
              <Link key={item.href} href={item.href}>
                <button className="flex w-full items-center gap-3 rounded-xl border border-gray-200 dark:border-gray-700 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-[#1E2B7A]/30 transition-all text-left">
                  <item.icon className="h-4 w-4 text-[#1E2B7A] dark:text-blue-400 shrink-0" />
                  {item.label}
                </button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
