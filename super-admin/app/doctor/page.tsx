"use client";
import { CalendarDays, Users, ClipboardList, FileText, Activity } from "lucide-react";
import { StatsCard } from "@/components/ui/StatsCard";
import { StatsCardSkeleton } from "@/components/ui/Skeleton";
import { Badge } from "@/components/ui/Badge";
import { useDashboard } from "@/lib/hooks/useDashboard";
import { useAppointments } from "@/lib/hooks/useAppointments";
import Link from "next/link";

export default function DoctorDashboard() {
  const { data: stats, isLoading } = useDashboard("doctor");
  const { data: appointments = [] } = useAppointments();
  const s = stats as Record<string, number> | undefined;

  const todayApts = appointments.filter(a => a.date === "2026-07-08").slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Doctor Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Your clinical overview for today.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? Array.from({ length: 4 }).map((_, i) => <StatsCardSkeleton key={i} />) : (
          <>
            <StatsCard title="Today's Appointments" value={s?.todayAppointments ?? 0} icon={CalendarDays} color="blue" index={0} />
            <StatsCard title="My Patients" value={s?.myPatients ?? 0} icon={Users} color="green" index={1} />
            <StatsCard title="Prescriptions Issued" value={s?.prescriptionsIssued ?? 0} icon={ClipboardList} color="purple" trend={{ value: 5, label: "vs last week" }} index={2} />
            <StatsCard title="Pending Reports" value={s?.pendingReports ?? 0} icon={FileText} color="amber" index={3} />
          </>
        )}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 dark:text-gray-50">Today's Appointments</h2>
            <Link href="/doctor/appointments"><span className="text-sm text-[#1E2B7A] dark:text-blue-400 hover:underline cursor-pointer">View all</span></Link>
          </div>
          <div className="space-y-2">
            {todayApts.length === 0 ? (
              <p className="text-sm text-center text-gray-400 py-8">No appointments today</p>
            ) : todayApts.map((apt) => (
              <div key={apt.id} className="flex items-center gap-3 rounded-xl border border-gray-100 dark:border-gray-800 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1E2B7A]/10 dark:bg-[#1E2B7A]/20">
                  <span className="text-xs font-semibold text-[#1E2B7A] dark:text-blue-400">{apt.patientName.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">{apt.patientName}</p>
                  <p className="text-xs text-gray-400">{apt.reason} · {apt.type}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{apt.time}</p>
                  <Badge variant={apt.status === "confirmed" ? "success" : "warning"} className="mt-0.5">{apt.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5">
          <h2 className="mb-4 font-semibold text-gray-900 dark:text-gray-50">Quick Actions</h2>
          <div className="space-y-2">
            {[
              { label: "My Appointments", href: "/doctor/appointments", icon: CalendarDays },
              { label: "Patient History", href: "/doctor/patients", icon: Users },
              { label: "Prescriptions", href: "/doctor/prescriptions", icon: ClipboardList },
              { label: "Medical Reports", href: "/doctor/reports", icon: FileText },
              { label: "My Schedule", href: "/doctor/schedule", icon: Activity },
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
