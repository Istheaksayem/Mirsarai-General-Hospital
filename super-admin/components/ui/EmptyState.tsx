import { type LucideIcon, SearchX } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  compact?: boolean;
}

export function EmptyState({
  icon: Icon = SearchX,
  title,
  description,
  action,
  className,
  compact = false,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/30 text-center",
        compact ? "p-8" : "p-14",
        className
      )}
    >
      <div className={cn(
        "flex items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800 mb-4",
        compact ? "h-12 w-12" : "h-14 w-14"
      )}>
        <Icon className={cn("text-gray-400 dark:text-gray-500", compact ? "h-5 w-5" : "h-6 w-6")} strokeWidth={1.5} />
      </div>
      <p className={cn("font-semibold text-gray-700 dark:text-gray-300", compact ? "text-sm" : "text-base")}>
        {title}
      </p>
      {description && (
        <p className={cn("mt-1 max-w-sm text-gray-400 dark:text-gray-500", compact ? "text-xs" : "text-sm")}>
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
