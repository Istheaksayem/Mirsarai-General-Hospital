"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiGrid, FiCalendar, FiBell, FiFileText, FiUser,
  FiClock, FiFolder, FiActivity, FiSun, FiMoon,
  FiMenu, FiX, FiChevronLeft, FiChevronRight, FiLogOut,
  FiSearch, FiHeart,
} from "react-icons/fi";
import Breadcrumbs from "@/components/dashboard/Breadcrumbs";
import Tooltip from "@/components/dashboard/Tooltip";

// ── Patient Portal Modules ────────────────────────────────────────────────────
import PatientDashboard from "@/components/dashboard/patient/PatientDashboard";
import PatientProfile from "@/components/dashboard/patient/PatientProfile";
import UpcomingAppointments from "@/components/dashboard/patient/UpcomingAppointments";
import AppointmentHistory from "@/components/dashboard/patient/AppointmentHistory";
import PatientNotifications from "@/components/dashboard/patient/PatientNotifications";
import DocumentVault from "@/components/dashboard/patient/DocumentVault";
import MedicalTimeline from "@/components/dashboard/patient/MedicalTimeline";

// ── Nav config ────────────────────────────────────────────────────────────────
interface NavGroup { title: string; modules: { key: string; icon: React.ReactNode }[] }

const NAV_GROUPS: NavGroup[] = [
  {
    title: "Overview",
    modules: [
      { key: "Dashboard",   icon: <FiGrid size={16} /> },
      { key: "Profile",     icon: <FiUser size={16} /> },
    ],
  },
  {
    title: "Appointments",
    modules: [
      { key: "Upcoming Appointments",    icon: <FiCalendar size={16} /> },
      { key: "Appointment History",      icon: <FiClock size={16} /> },
    ],
  },
  {
    title: "Records",
    modules: [
      { key: "Notifications",   icon: <FiBell size={16} /> },
      { key: "Document Vault",  icon: <FiFolder size={16} /> },
      { key: "Medical Timeline", icon: <FiActivity size={16} /> },
    ],
  },
];

const ALL_MODULES = NAV_GROUPS.flatMap(g => g.modules.map(m => m.key));

// ── Component map ─────────────────────────────────────────────────────────────
function ActiveModule({ mod }: { mod: string }) {
  switch (mod) {
    case "Dashboard":            return <PatientDashboard />;
    case "Profile":              return <PatientProfile />;
    case "Upcoming Appointments": return <UpcomingAppointments />;
    case "Appointment History":  return <AppointmentHistory />;
    case "Notifications":        return <PatientNotifications />;
    case "Document Vault":       return <DocumentVault />;
    case "Medical Timeline":     return <MedicalTimeline />;
    default:                     return <PatientDashboard />;
  }
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function PatientPortalPage() {
  const { theme, toggleTheme } = useTheme();
  const [activeModule, setActiveModule]       = useState("Dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Close mobile sidebar on resize
  useEffect(() => {
    const h = () => { if (window.innerWidth >= 1280) setMobileSidebarOpen(false); };
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#060913] flex text-slate-800 dark:text-slate-200 transition-colors duration-300 font-sans">

      {/* ── SIDEBAR ── */}
      <aside className={`fixed inset-y-0 left-0 z-40 bg-white dark:bg-[#070b13] border-r border-slate-200/50 dark:border-slate-800/40 flex flex-col justify-between transition-all duration-300 xl:translate-x-0 xl:static ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"} ${sidebarCollapsed ? "w-20" : "w-64"}`}>
        <div>
          {/* Sidebar header */}
          <div className="h-20 flex items-center justify-between px-5 border-b border-slate-200/50 dark:border-slate-800/40">
            <div className="flex items-center gap-3 overflow-hidden">
              <img src="/genaral_Hospital_logo.jpeg" alt="Logo" className="w-8 h-8 rounded-lg shadow-sm" />
              {!sidebarCollapsed && (
                <div className="leading-tight">
                  <h1 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Mirsarai Gen.</h1>
                  <span className="text-[9px] text-[#1E2B7A] dark:text-[#76BC21] font-black tracking-widest block">PATIENT PORTAL</span>
                </div>
              )}
            </div>
            <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="hidden xl:flex p-1.5 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg text-slate-400 transition">
              {sidebarCollapsed ? <FiChevronRight size={15} /> : <FiChevronLeft size={15} />}
            </button>
            <button onClick={() => setMobileSidebarOpen(false)} className="xl:hidden p-1.5 text-slate-400">
              <FiX size={18} />
            </button>
          </div>

          {/* Nav groups */}
          <nav className="p-3.5 space-y-4 overflow-y-auto max-h-[calc(100vh-170px)]">
            {NAV_GROUPS.map(group => (
              <div key={group.title} className="space-y-1">
                {!sidebarCollapsed ? (
                  <h3 className="px-3.5 text-[9px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">{group.title}</h3>
                ) : (
                  <div className="h-1 border-t border-gray-100 dark:border-slate-800/50 my-3" />
                )}
                {group.modules.map(({ key, icon }) => {
                  const isActive = activeModule === key;
                  const btn = (
                    <button
                      onClick={() => { setActiveModule(key); setMobileSidebarOpen(false); }}
                      className={`w-full flex items-center rounded-xl text-xs font-bold tracking-tight transition-all duration-200 ${sidebarCollapsed ? "justify-center p-3" : "px-3.5 py-2.5 gap-3"} ${isActive ? "bg-[#1E2B7A] text-white border border-[#1E2B7A] shadow-md shadow-[#1E2B7A]/15" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/30 hover:text-slate-900 dark:hover:text-white"}`}
                    >
                      <span className={isActive ? "scale-110 text-white" : "text-slate-400 dark:text-slate-500"}>{icon}</span>
                      {!sidebarCollapsed && <span className="truncate">{key}</span>}
                    </button>
                  );
                  return sidebarCollapsed
                    ? <Tooltip key={key} content={key} position="right">{btn}</Tooltip>
                    : <React.Fragment key={key}>{btn}</React.Fragment>;
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Sidebar footer */}
        <div className="p-3.5 border-t border-slate-200/50 dark:border-slate-800/40 bg-slate-50/30 dark:bg-slate-900/5 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1E2B7A] to-[#76BC21] text-white flex items-center justify-center font-extrabold text-sm shadow-sm shrink-0">P</div>
            {!sidebarCollapsed && (
              <div className="leading-tight truncate">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">Patient</h4>
                <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold block uppercase tracking-wider mt-0.5">Portal</span>
              </div>
            )}
          </div>
          {!sidebarCollapsed && (
            <div className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#76BC21] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#76BC21]" />
            </div>
          )}
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileSidebarOpen && <div onClick={() => setMobileSidebarOpen(false)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30 xl:hidden" />}

      {/* ── MAIN AREA ── */}
      <div className="flex-grow flex flex-col min-w-0 h-screen overflow-y-auto bg-slate-50/50 dark:bg-[#060913]">

        {/* Header */}
        <header className="sticky top-0 z-20 h-20 bg-white/70 dark:bg-[#060913]/70 backdrop-blur-md border-b border-slate-200/40 dark:border-slate-800/40 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileSidebarOpen(true)} className="p-2.5 xl:hidden border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-950 transition">
              <FiMenu size={16} />
            </button>
            <div className="hidden sm:block">
              <Breadcrumbs items={[{ label: "Patient Portal" }, { label: activeModule }]} />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className="p-2.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 transition">
              {theme === "dark" ? <FiSun size={14} className="text-amber-400" /> : <FiMoon size={14} />}
            </button>
            <button onClick={() => setActiveModule("Notifications")} className="p-2.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 transition">
              <FiBell size={14} />
            </button>
            <div className="pl-3 border-l border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1E2B7A] to-[#76BC21] text-white font-extrabold text-xs flex items-center justify-center shadow-md">P</div>
              <a href="/login" className="p-1.5 text-slate-400 hover:text-rose-500 transition" title="Sign Out">
                <FiLogOut size={14} />
              </a>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-grow p-6 md:p-8 space-y-6 pb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">{activeModule}</h2>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-bold mt-1.5">
                Workspace: <span className="text-[#1E2B7A] dark:text-[#76BC21] font-extrabold">Patient Portal</span>
              </p>
            </div>
            <span className="px-3.5 py-2 bg-white dark:bg-[#0f1524] border border-slate-200/50 dark:border-slate-800/40 text-[10px] font-black text-slate-400 rounded-xl shadow-sm self-start md:self-auto flex items-center gap-2 tracking-wide uppercase">
              <span className="w-1.5 h-1.5 bg-[#76BC21] rounded-full animate-ping" />
              Live • {new Date().toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <ActiveModule mod={activeModule} />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
