"use client";
import { FlaskConical, FileText, Upload, Users, CheckCircle2, Clock } from "lucide-react";
import { StatsCard } from "@/components/ui/StatsCard";
import { StatsCardSkeleton } from "@/components/ui/Skeleton";
import { ActivityFeed } from "@/components/ui/ActivityFeed";
import { useDashboard } from "@/lib/hooks/useDashboard";
import { useActivities } from "@/lib/hooks/useActivities";
import { useReports } from "@/lib/hooks/useReports";
import Link from "next/link";

export default function LabAdminDashboard() {
  const { data: stats, isLoading } = useDashboard("lab-admin");
  const { data: activities, isLoading: aLoading } = useActivities();
  const { data: reports = [] } = useReports();
  const s = stats as Record<string, number> | undefined;

  const pending = reports.filter(r => r.status === "pending").length;
  const inProgress = reports.filter(r => r.status === "in-progress").length;
  const completed = reports.filter(r => r.status === "completed").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Lab Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Laboratory management and test tracking.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? Array.from({ length: 6 }).map((_, i) => <StatsCardSkeleton key={i} />) : (
          <>
            <StatsCard title="Pending Tests" value={pending} icon={Clock} color="amber" subtitle="Awaiting processing" index={0} />
            <StatsCard title="In Progress" value={inProgress} icon={FlaskConical} color="blue" index={1} />
            <StatsCard title="Completed Today" value={completed} icon={CheckCircle2} color="green" trend={{ value: 20, label: "vs yesterday" }} index={2} />
            <StatsCard title="Total Reports" value={reports.length} icon={FileText} color="purple" index={3} />
            <StatsCard title="Patients Today" value={s?.patientsToday ?? 0} icon={Users} color="cyan" index={4} />
            <StatsCard title="Uploads Pending" value={s?.uploadsPending ?? 0} icon={Upload} color="red" index={5} />
          </>
        )}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5">
          <h2 className="mb-4 font-semibold text-gray-900 dark:text-gray-50">Recent Lab Activity</h2>
          {aLoading ? <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-12 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />)}</div>
            : <ActivityFeed activities={(activities ?? []).filter(a => ["lab-report", "test-order"].includes(a.resourceType))} limit={6} />}
        </div>
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5">
          <h2 className="mb-4 font-semibold text-gray-900 dark:text-gray-50">Quick Actions</h2>
          <div className="space-y-2">
            {[
              { label: "Diagnostic Records", href: "/lab-admin/diagnostic", icon: FlaskConical },
              { label: "View Reports", href: "/lab-admin/reports", icon: FileText },
              { label: "Upload Reports", href: "/lab-admin/upload", icon: Upload },
              { label: "Patient Search", href: "/lab-admin/patients", icon: Users },
            ].map((item) => (
              <Link key={item.href} href={item.href}>
                <button className="flex w-full items-center gap-3 rounded-xl border border-gray-200 dark:border-gray-700 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-purple-300/50 transition-all text-left">
                  <item.icon className="h-4 w-4 text-purple-500 shrink-0" />{item.label}
                </button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
