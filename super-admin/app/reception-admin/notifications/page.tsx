"use client";
import { Bell } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useNotifications } from "@/lib/hooks/useNotifications";
import { formatDistanceToNow } from "@/lib/date-utils";
import { cn } from "@/lib/utils";

const priorityVariant = { urgent: "danger", high: "warning", medium: "info", low: "default" } as const;
const typeColors: Record<string, string> = {
  appointment: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
  "lab-report": "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
  billing: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
  system: "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400",
  staff: "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400",
  emergency: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
  default: "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400",
};

export default function NotificationsPage() {
  const { data = [], isLoading } = useNotifications();
  const unread = data.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <PageHeader title="Notifications" description={`${unread} unread`} icon={Bell}>
        <Button variant="outline" size="sm">Mark all read</Button>
      </PageHeader>
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800 overflow-hidden">
        {isLoading ? Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-20 animate-pulse bg-gray-100 dark:bg-gray-800 m-2 rounded-xl" />
        )) : data.map((n) => (
          <div key={n.id} className={cn("flex items-start gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors", !n.read && "bg-blue-50/30 dark:bg-blue-900/5")}>
            <div className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold", typeColors[n.type] ?? typeColors.default)}>
              {n.type.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className={cn("font-medium text-gray-900 dark:text-gray-100", !n.read && "font-semibold")}>{n.title}</p>
                {!n.read && <span className="shrink-0 h-2 w-2 rounded-full bg-[#1E2B7A] mt-1.5" />}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{n.description}</p>
              <div className="mt-1.5 flex items-center gap-2">
                <Badge variant={priorityVariant[n.priority as keyof typeof priorityVariant] ?? "default"}>{n.priority}</Badge>
                <span className="text-xs text-gray-400">{formatDistanceToNow(n.timestamp)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
