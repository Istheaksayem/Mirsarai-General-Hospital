import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  className?: string;
}

const variants: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default:
    "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  success:
    "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
  warning:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  danger:
    "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
  info:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
};

export function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
