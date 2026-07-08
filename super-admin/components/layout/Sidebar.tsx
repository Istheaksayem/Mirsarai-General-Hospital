"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { Role, ROLE_LABELS } from "@/types/auth";
import { NavItem, NAV_CONFIG } from "@/config/navigation";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function NavLink({ item, depth = 0 }: { item: NavItem; depth?: number }) {
  const pathname = usePathname();
  const isActive =
    item.href === pathname ||
    (item.href !== "/" && pathname.startsWith(item.href));

  return (
    <li>
      <Link
        href={item.href}
        className={cn(
          "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
          depth > 0 && "ml-4 text-xs",
          isActive
            ? "bg-[#1E2B7A] text-white shadow-md shadow-[#1E2B7A]/30"
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
        <span className="truncate">{item.label}</span>
        {item.badge && (
          <span
            className={cn(
              "ml-auto rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
              isActive
                ? "bg-white/20 text-white"
                : "bg-[#76BC21]/20 text-[#76BC21]"
            )}
          >
            {item.badge}
          </span>
        )}
      </Link>
    </li>
  );
}

function NavSection({ role }: { role: Role }) {
  const sections = NAV_CONFIG[role] ?? [];

  return (
    <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-2">
      {sections.map((section) => (
        <div key={section.title}>
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

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-full flex-col bg-white dark:bg-gray-900 border-r border-gray-200/80 dark:border-gray-700/60">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center justify-between px-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#1E2B7A] to-[#2d3fa8] shadow-sm shadow-[#1E2B7A]/30">
            <span className="text-base font-bold text-white">M</span>
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-gray-900 dark:text-gray-50">
              MGH Admin
            </p>
            <p className="truncate text-[11px] text-gray-400 dark:text-gray-500">
              {user ? ROLE_LABELS[user.role] : ""}
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* User pill */}
      {user && (
        <div className="mx-3 mb-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 p-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1E2B7A] to-[#76BC21] text-xs font-bold text-white">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                {user.name}
              </p>
              <p className="truncate text-[11px] text-gray-400 dark:text-gray-500">
                {user.department}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      {user && <NavSection role={user.role} />}

      {/* Footer */}
      <div className="shrink-0 border-t border-gray-200/80 dark:border-gray-700/60 p-3">
        <button
          onClick={logout}
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
        >
          <svg
            className="h-4 w-4 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
            />
          </svg>
          Sign Out
        </button>
      </div>
    </div>
  );
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Desktop — always visible */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:z-30">
        <SidebarContent />
      </aside>

      {/* Mobile — drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            />
            {/* Drawer */}
            <motion.aside
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
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
