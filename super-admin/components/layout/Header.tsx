"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Menu, Moon, Search, Sun, Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/components/notifications/NotificationProvider";
import { getStaffNotifications, type StaffNotification } from "@/lib/services/api";
import { ROLE_LABELS } from "@/types/auth";
import { Breadcrumb } from "@/components/layout/Breadcrumb";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label="Toggle theme"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </button>
  );
}

function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<StaffNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const { unreadCount } = useNotifications();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    setLoading(true);
      getStaffNotifications({ limit: "5" })
      .then((res) => setNotifications(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [open]);

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#76BC21] text-[9px] font-bold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenu.Trigger>

      <AnimatePresence>
        {open && (
          <DropdownMenu.Portal forceMount>
            <DropdownMenu.Content
              asChild
              align="end"
              sideOffset={8}
              className="z-50"
            >
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="w-80 rounded-2xl border border-gray-200/80 dark:border-gray-700/60 bg-white dark:bg-gray-900 shadow-xl shadow-gray-200/60 dark:shadow-gray-950/60 overflow-hidden"
              >
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 px-4 py-3">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Notifications
                  </p>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-[#1E2B7A]/10 px-2 py-0.5 text-xs font-medium text-[#1E2B7A] dark:bg-[#1E2B7A]/30 dark:text-blue-300">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-800 max-h-72 overflow-y-auto">
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="flex flex-col items-center py-8 text-center">
                      <Bell className="h-8 w-8 text-gray-300 dark:text-gray-600 mb-2" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">No notifications yet</p>
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <DropdownMenu.Item
                        key={n._id}
                        className={cn(
                          "flex cursor-pointer gap-3 px-4 py-3 text-left outline-none transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/60",
                          !n.isRead && "bg-[#1E2B7A]/[0.03] dark:bg-[#1E2B7A]/10"
                        )}
                      >
                        <div
                          className={cn(
                            "mt-0.5 h-2 w-2 shrink-0 rounded-full",
                            n.isRead
                              ? "bg-gray-200 dark:bg-gray-700"
                              : "bg-[#76BC21]"
                          )}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                            {n.title}
                          </p>
                          <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                            {n.message}
                          </p>
                        </div>
                        <span className="shrink-0 text-[11px] text-gray-400 dark:text-gray-500">
                          {timeAgo(n.createdAt)}
                        </span>
                      </DropdownMenu.Item>
                    ))
                  )}
                </div>
                <div className="border-t border-gray-100 dark:border-gray-800 px-4 py-2.5">
                  <button
                    onClick={() => { setOpen(false); if (user) router.push(`/${user.role}/notifications`); }}
                    className="text-xs font-medium text-[#1E2B7A] dark:text-blue-400 hover:underline"
                  >
                    View all notifications
                  </button>
                </div>
              </motion.div>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        )}
      </AnimatePresence>
    </DropdownMenu.Root>
  );
}

function UserDropdown() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <button
          className="flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="User menu"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#1E2B7A] to-[#76BC21] text-xs font-bold text-white">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="hidden text-left sm:block">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-none">
              {user.name}
            </p>
            <p className="mt-0.5 text-[11px] text-gray-400 dark:text-gray-500">
              {ROLE_LABELS[user.role]}
            </p>
          </div>
        </button>
      </DropdownMenu.Trigger>

      <AnimatePresence>
        {open && (
          <DropdownMenu.Portal forceMount>
            <DropdownMenu.Content
              asChild
              align="end"
              sideOffset={8}
              className="z-50"
            >
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="w-56 rounded-2xl border border-gray-200/80 dark:border-gray-700/60 bg-white dark:bg-gray-900 shadow-xl shadow-gray-200/60 dark:shadow-gray-950/60 p-1.5 overflow-hidden"
              >
                {/* User info */}
                <div className="mb-1 rounded-xl bg-gray-50 dark:bg-gray-800/60 px-3 py-2.5">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {user.email}
                  </p>
                </div>

                <DropdownMenu.Item className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-gray-700 dark:text-gray-300 outline-none transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile Settings
                </DropdownMenu.Item>

                <DropdownMenu.Separator className="my-1 h-px bg-gray-100 dark:bg-gray-800" />

                <DropdownMenu.Item
                  onClick={logout}
                  className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-red-500 dark:text-red-400 outline-none transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
                  </svg>
                  Sign Out
                </DropdownMenu.Item>
              </motion.div>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        )}
      </AnimatePresence>
    </DropdownMenu.Root>
  );
}

interface HeaderProps {
  onMenuToggle: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const pathname = usePathname();
  // Derive page title from path
  const segments = pathname.split("/").filter(Boolean);
  const pageTitle = segments.at(-1)
    ?.replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase()) ?? "Dashboard";

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-gray-200/80 dark:border-gray-700/60 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-4 sm:px-6">
      {/* Mobile menu button */}
      <button
        onClick={onMenuToggle}
        className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors lg:hidden"
        aria-label="Open sidebar"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Breadcrumb */}
      <div className="flex-1 min-w-0">
        <Breadcrumb />
      </div>

      {/* Right actions */}
      <div className="flex shrink-0 items-center gap-1">
        {/* Search — desktop only */}
        <button
          className="hidden sm:flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </button>

        <ThemeToggle />
        <NotificationDropdown />

        {/* Divider */}
        <div className="mx-1 h-6 w-px bg-gray-200 dark:bg-gray-700" />

        <UserDropdown />
      </div>
    </header>
  );
}
