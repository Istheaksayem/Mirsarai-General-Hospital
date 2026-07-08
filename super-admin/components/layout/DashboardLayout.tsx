"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { RouteGuard } from "@/components/auth/RouteGuard";
import { Role } from "@/types/auth";
import { motion } from "framer-motion";

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: Role;
}

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <RouteGuard allowedRole={role}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main content — offset by sidebar width on desktop */}
        <div className="lg:pl-64">
          <Header onMenuToggle={() => setSidebarOpen(true)} />

          <main className="p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </RouteGuard>
  );
}
