"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { ROLE_ROUTES } from "@/types/auth";

function formatSegment(segment: string): string {
  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

export function Breadcrumb() {
  const { user } = useAuth();
  const homeHref = user?.role ? ROLE_ROUTES[user.role] : "/";
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  const crumbs = segments.map((seg, idx) => ({
    label: formatSegment(seg),
    href: "/" + segments.slice(0, idx + 1).join("/"),
    isLast: idx === segments.length - 1,
  }));

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1">
      <Link
        href={homeHref}
        className="hidden sm:flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        aria-label="Home"
      >
        <Home className="h-3.5 w-3.5" />
      </Link>

      {crumbs.map((crumb) => {
        const isLast = crumb.isLast;
        return (
          <div
            key={crumb.href}
            className={`flex items-center gap-1 ${isLast ? '' : 'hidden sm:flex'}`}
          >
            <ChevronRight className="h-3.5 w-3.5 text-gray-300 dark:text-gray-600 hidden sm:block" />
            {isLast ? (
              <span
                className="rounded-lg px-2 py-1 text-xs font-semibold text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800"
                aria-current="page"
              >
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className={cn(
                  "rounded-lg px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400",
                  "hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                )}
              >
                {crumb.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
