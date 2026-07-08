"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { Role, ROLE_LABELS } from "@/types/auth";
import { NavItem, NAV_CONFIG } from "@/config/navigation";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// ─── Nav Link ────────────────────────────────────────────────────────────────

function NavLink({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const isActive =
    item.href === pathname ||
    (item.href !== "/" && pathname.startsWith(item.href + "/")) ||
    item.href === pathname;

  return (
    <li>
      <Link
        href={item.href}
        className={cn(
          "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium",
          "transition-all duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E2B7A]/40",
          isActive
            ? "bg-[#1E2B7A] text-white shadow-md shadow-[#1E2B7A]/25"
            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
        )}
      >
        {item.icon && (
          <item.icon
            className={cn(
              "h-4 w-4 shrink-0 transition-colors",
              isActive
                ? "text-white"
                : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
            )}
            strokeWidth={isActive ? 2.2 : 1.8}
          />
        )}

        <span className="flex-1 truncate">{item.label}</span>

        {item.badge && (
          <span
            className={cn(
              "ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5",
              "text-[10px] font-bold tabular-nums",
              isActive
                ? "bg-white/20 text-white"
                : "bg-[#76BC21]/15 text-[#76BC21] dark:bg-[#76BC21]/20"
            )}
          >
            {item.badge}
          </span>
        )}

        {isActive && !item.badge && (
          <ChevronRight
            className="ml-auto h-3.5 w-3.5 shrink-0 opacity-60"
            strokeWidth={2.5}
          />
        )}
      </Link>
    </li>
  );
}

// ─── Nav Section ─────────────────────────────────────────────────────────────

function NavSection({ role }: { role: Role }) {
  const sections = NAV_CONFIG[role] ?? [];

  return (
    <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-3">
      {sections.map((section, idx) => (
        <div key={section.title ?? idx}>
          {section.title && (
            <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600">
              {section.title}
            </p>
          )}
          <ul className="space-y-0.5">
            {section.items.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

// ─── Role badge colors ────────────────────────────────────────────────────────

const ROLE_BADGE_COLORS: Record<Role, string> = {
  "super-admin":     "from-[#1E2B7A] to-[#2d3fa8]",
  "reception-admin": "from-emerald-500 to-teal-500",
  "lab-admin":       "from-violet-500 to-purple-500",
  doctor:            "from-[#76BC21] to-[#63a01b]",
};

// ─── Sidebar Content ──────────────────────────────────────────────────────────

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-full flex-col bg-white dark:bg-[#0a0a0a] border-r border-gray-200/80 dark:border-gray-800/80">

      {/* Logo & Brand */}
      <div className="flex h-[60px] shrink-0 items-center gap-3 border-b border-gray-100 dark:border-gray-800/80 px-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#1E2B7A] to-[#2d3fa8] shadow-md shadow-[#1E2B7A]/20">
          <span className="text-[13px] font-extrabold text-white">M</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-gray-900 dark:text-gray-50 leading-none">
            MGH Admin
          </p>
          <p className="mt-0.5 truncate text-[11px] text-gray-400 dark:text-gray-500 leading-none">
            {user ? ROLE_LABELS[user.role] : ""}
          </p>
        </div>
        {/* Mobile close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 transition-colors lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* User profile pill */}
      {user && (
        <div className="mx-3 mt-3 mb-1">
          <div className="flex items-center gap-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800 p-2.5">
            <div className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
              "bg-gradient-to-br text-[13px] font-bold text-white shadow-sm",
              ROLE_BADGE_COLORS[user.role]
            )}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold text-gray-900 dark:text-gray-100 leading-none">
                {user.name}
              </p>
              <p className="mt-0.5 truncate text-[11px] text-gray-400 dark:text-gray-500 leading-none">
                {user.email}
              </p>
            </div>
            {/* Online indicator */}
            <div className="ml-auto shrink-0 relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#76BC21] opacity-50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#76BC21]" />
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      {user && <NavSection role={user.role} />}

      {/* Footer — Sign out */}
      <div className="shrink-0 border-t border-gray-100 dark:border-gray-800/80 p-3">
        <button
          onClick={logout}
          className={cn(
            "group flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5",
            "text-sm font-medium text-gray-500 dark:text-gray-400",
            "transition-all duration-150",
            "hover:bg-red-50 dark:hover:bg-red-900/20",
            "hover:text-red-500 dark:hover:text-red-400"
          )}
        >
          <LogOut
            className="h-4 w-4 shrink-0 text-gray-400 group-hover:text-red-400 transition-colors"
            strokeWidth={1.8}
          />
          Sign Out
        </button>
      </div>
    </div>
  );
}

// ─── Sidebar Export ───────────────────────────────────────────────────────────

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Desktop — fixed, always visible */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:z-30">
        <SidebarContent />
      </aside>

      {/* Mobile — animated drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32, mass: 0.8 }}
              className="fixed inset-y-0 left-0 z-50 w-72 lg:hidden"
            >
              <SidebarContent onClose={onClose} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
