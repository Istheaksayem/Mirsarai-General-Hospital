import { formatDistanceToNow } from "@/lib/date-utils";
import { type Activity } from "@/lib/services/api";
import { cn } from "@/lib/utils";
import {
  CalendarDays, FileText, CreditCard, FlaskConical, Settings,
  User, CheckCircle2, XCircle, Upload, Globe,
} from "lucide-react";

const ACTION_ICONS: Record<string, React.ElementType> = {
  appointment: CalendarDays,
  patient: User,
  payment: CreditCard,
  "lab-report": FlaskConical,
  doctor: User,
  department: Settings,
  cms: Globe,
  prescription: FileText,
  "test-order": FlaskConical,
  "check-in": CheckCircle2,
  default: FileText,
};

const ACTION_COLORS: Record<string, string> = {
  created: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  updated: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  completed: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  processed: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
  uploaded: "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400",
  cancelled: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  viewed: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  default: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
};

interface ActivityFeedProps {
  activities: Activity[];
  limit?: number;
  className?: string;
}

export function ActivityFeed({ activities, limit = 8, className }: ActivityFeedProps) {
  const items = activities.slice(0, limit);
  return (
    <div className={cn("space-y-1", className)}>
      {items.map((a) => {
        const IconComp = ACTION_ICONS[a.resourceType] ?? ACTION_ICONS.default;
        const colorClass = ACTION_COLORS[a.action] ?? ACTION_COLORS.default;
        return (
          <div
            key={a.id}
            className="flex items-start gap-3 rounded-xl px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          >
            <div className={cn("mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg", colorClass)}>
              <IconComp className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-snug">
                {a.description}
              </p>
              <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                {a.userName} · {formatDistanceToNow(a.timestamp)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
