"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { useNotifications } from "@/hooks/useDashboardData";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiGrid,
  FiUsers,
  FiActivity,
  FiBriefcase,
  FiCalendar,
  FiFolder,
  FiShield,
  FiGlobe,
  FiTrendingUp,
  FiSettings,
  FiBell,
  FiSun,
  FiMoon,
  FiMenu,
  FiX,
  FiClock,
  FiDollarSign,
  FiUploadCloud,
  FiSearch,
  FiUser,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiCommand,
  FiLogOut,
  FiInfo,
} from "react-icons/fi";
import Breadcrumbs from "@/components/dashboard/Breadcrumbs";
import CommandPalette from "@/components/dashboard/CommandPalette";
import Drawer from "@/components/dashboard/Drawer";
import Tooltip from "@/components/dashboard/Tooltip";
import SuperAdminModules from "@/components/dashboard/modules/SuperAdminModules";
import ReceptionAdminModules from "@/components/dashboard/modules/ReceptionAdminModules";
import LabAdminModules from "@/components/dashboard/modules/LabAdminModules";
import DoctorModules from "@/components/dashboard/modules/DoctorModules";

// Map roles to config
const roles = [
  { value: "super-admin", label: "Super Admin", icon: "👑" },
  { value: "reception-admin", label: "Reception Admin", icon: "🛎️" },
  { value: "lab-admin", label: "Lab Admin", icon: "🧪" },
  { value: "doctor", label: "Doctor", icon: "🩺" },
];

const moduleIconMap: Record<string, React.ReactNode> = {
  "Dashboard": <FiGrid size={16} />,
  "Reports": <FiTrendingUp size={16} />,
  "Notifications": <FiBell size={16} />,
  "Patient Management": <FiUsers size={16} />,
  "Doctor Management": <FiActivity size={16} />,
  "Department Management": <FiBriefcase size={16} />,
  "Appointment Management": <FiCalendar size={16} />,
  "Document Management": <FiFolder size={16} />,
  "Role Management": <FiShield size={16} />,
  "Website CMS": <FiGlobe size={16} />,
  "Settings": <FiSettings size={16} />,
  "Patients": <FiUsers size={16} />,
  "Appointments": <FiCalendar size={16} />,
  "Queue": <FiClock size={16} />,
  "Billing": <FiDollarSign size={16} />,
  "Diagnostic Records": <FiActivity size={16} />,
  "Upload Reports": <FiUploadCloud size={16} />,
  "Patient Search": <FiSearch size={16} />,
  "Today's Appointments": <FiCalendar size={16} />,
  "Patient History": <FiUsers size={16} />,
  "Prescription Upload": <FiUploadCloud size={16} />,
  "Medical Reports": <FiFolder size={16} />,
  "Schedule": <FiClock size={16} />,
  "Profile": <FiUser size={16} />,
};

// Category Groupings for Linear-style sidebar
interface NavGroup {
  title: string;
  modules: string[];
}

const roleGroups: Record<string, NavGroup[]> = {
  "super-admin": [
    { title: "Overview", modules: ["Dashboard", "Reports"] },
    { title: "Directories", modules: ["Patient Management", "Doctor Management", "Department Management"] },
    { title: "Operations", modules: ["Appointment Management", "Document Management"] },
    { title: "Administration", modules: ["Role Management", "Website CMS", "Settings"] },
  ],
  "reception-admin": [
    { title: "Overview", modules: ["Dashboard"] },
    { title: "Patients", modules: ["Patients", "Appointments", "Queue"] },
    { title: "Billing & Finance", modules: ["Billing"] },
    { title: "System Alerts", modules: ["Notifications"] },
  ],
  "lab-admin": [
    { title: "Overview", modules: ["Dashboard", "Reports"] },
    { title: "Lab Operations", modules: ["Diagnostic Records", "Upload Reports"] },
    { title: "Patients Lookup", modules: ["Patient Search"] },
  ],
  doctor: [
    { title: "Overview", modules: ["Dashboard"] },
    { title: "Shift & Queue", modules: ["Today's Appointments", "Schedule"] },
    { title: "Patient Records", modules: ["Patient History", "Medical Reports"] },
    { title: "Management", modules: ["Prescription Upload", "Profile"] },
  ],
};

export default function DashboardPage() {
  const { theme, toggleTheme } = useTheme();
  
  // States
  const [activeRole, setActiveRole] = useState("super-admin");
  const [activeModule, setActiveModule] = useState("Dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [notificationsDrawerOpen, setNotificationsDrawerOpen] = useState(false);

  // Queries
  const { data: notifications = [] } = useNotifications();
  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  const roleDropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Global keydown list for Command Palette Ctrl+K
  useEffect(() => {
    function handleGlobalKeys(e: KeyboardEvent) {
      if (e.key === "k" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    }
    document.addEventListener("keydown", handleGlobalKeys);
    return () => document.removeEventListener("keydown", handleGlobalKeys);
  }, []);

  // Handle outside click events
  useEffect(() => {
    function clickOutside(e: MouseEvent) {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(e.target as Node)) {
        setRoleMenuOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  const handleRoleSwitch = (role: string) => {
    setActiveRole(role);
    setActiveModule("Dashboard");
    setRoleMenuOpen(false);
  };

  const activeRoleConfig = roles.find((r) => r.value === activeRole);
  const groupsList = roleGroups[activeRole] || [];
  const flatModules = groupsList.flatMap((g) => g.modules);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#060913] flex text-slate-800 dark:text-slate-200 transition-colors duration-305 font-sans">
      
      {/* 1. COLLAPSIBLE SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 bg-white dark:bg-[#070b13] border-r border-slate-200/50 dark:border-slate-800/40 flex flex-col justify-between transition-all duration-300 xl:translate-x-0 xl:static ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } ${sidebarCollapsed ? "w-20" : "w-64"}`}
      >
        <div>
          {/* Sidebar Top Header */}
          <div className="h-20 flex items-center justify-between px-5.5 border-b border-slate-200/50 dark:border-slate-800/40">
            <div className="flex items-center gap-3 overflow-hidden">
              <img src="/genaral_Hospital_logo.jpeg" alt="Logo" className="w-8 h-8 rounded-lg shadow-sm transition-transform duration-300 hover:scale-105" />
              {!sidebarCollapsed && (
                <div className="leading-tight animate-fadeIn">
                  <h1 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    Mirsarai Gen.
                  </h1>
                  <span className="text-[9px] text-[#1E2B7A] dark:text-[#76BC21] font-black tracking-widest block">
                    CLINICAL HUB
                  </span>
                </div>
              )}
            </div>
            
            {/* Collapse Trigger desktop */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden xl:flex p-1.5 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
            >
              {sidebarCollapsed ? <FiChevronRight size={15} /> : <FiChevronLeft size={15} />}
            </button>
            
            {/* Close trigger mobile */}
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="xl:hidden p-1.5 text-slate-400 hover:text-slate-950 dark:hover:text-white transition"
            >
              <FiX size={18} />
            </button>
          </div>

          {/* Navigation link blocks grouped by category */}
          <nav className="p-3.5 space-y-4.5 overflow-y-auto max-h-[calc(100vh-170px)]">
            {groupsList.map((group) => (
              <div key={group.title} className="space-y-1">
                {/* Category Title */}
                {!sidebarCollapsed ? (
                  <h3 className="px-3.5 text-[9px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">
                    {group.title}
                  </h3>
                ) : (
                  <div className="h-1 border-t border-gray-100 dark:border-slate-800/50 my-3" />
                )}

                {/* Sub modules */}
                {group.modules.map((mod) => {
                  const isActive = activeModule === mod;
                  const itemContent = (
                    <button
                      onClick={() => {
                        setActiveModule(mod);
                        setMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center rounded-xl text-xs font-bold tracking-tight transition-all duration-200 cursor-pointer ${
                        sidebarCollapsed ? "justify-center p-3" : "px-3.5 py-2.5 gap-3"
                      } ${
                        isActive
                          ? "bg-[#1E2B7A] text-white dark:bg-accent/15 dark:text-accent border border-[#1E2B7A] dark:border-accent/30 shadow-md shadow-[#1E2B7A]/15 dark:shadow-none"
                          : "text-slate-650 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/30 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      <span className={`transition-transform duration-200 ${isActive ? "scale-110 text-white dark:text-accent" : "text-slate-400 dark:text-slate-500"}`}>
                        {moduleIconMap[mod] || <FiFolder />}
                      </span>
                      {!sidebarCollapsed && <span className="truncate">{mod}</span>}
                    </button>
                  );

                  return sidebarCollapsed ? (
                    <Tooltip key={mod} content={mod} position="right">
                      {itemContent}
                    </Tooltip>
                  ) : (
                    <React.Fragment key={mod}>{itemContent}</React.Fragment>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer User Card */}
        <div className="p-3.5 border-t border-slate-200/50 dark:border-slate-800/40 bg-slate-50/30 dark:bg-slate-900/5 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1E2B7A] to-[#6366F1] text-white border border-[#1E2B7A]/20 flex items-center justify-center font-extrabold flex-shrink-0 text-sm shadow-sm">
              {activeRole.charAt(0).toUpperCase()}
            </div>
            {!sidebarCollapsed && (
              <div className="leading-tight truncate animate-fadeIn">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                  {activeRole === "doctor" ? "Dr. Tasnim" : "Ishtiaque S."}
                </h4>
                <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold block uppercase tracking-wider mt-0.5">
                  {activeRoleConfig?.label}
                </span>
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

      {/* Mobile Drawer Overlay */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-30 xl:hidden transition-opacity"
        />
      )}

      {/* 2. WORKSPACE AREA */}
      <div className="flex-grow flex flex-col min-w-0 h-screen overflow-y-auto bg-slate-50/50 dark:bg-[#060913]">
        
        {/* Top Header Navbar */}
        <header className="sticky top-0 z-20 h-20 bg-white/70 dark:bg-[#060913]/70 backdrop-blur-md border-b border-slate-200/40 dark:border-slate-800/40 flex items-center justify-between px-6">
          
          {/* Breadcrumbs / Burger menu toggler */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2.5 xl:hidden border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-950 transition cursor-pointer"
            >
              <FiMenu size={16} />
            </button>
            <div className="hidden sm:block">
              <Breadcrumbs items={[{ label: activeRoleConfig?.label || "" }, { label: activeModule }]} />
            </div>
          </div>

          {/* Header Action Tools */}
          <div className="flex items-center gap-3">
            
            {/* Global Search command trigger button */}
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="hidden md:flex items-center justify-between gap-6 px-4 py-2 bg-slate-50 dark:bg-slate-900/30 hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-400 border border-slate-205 dark:border-slate-800/60 rounded-xl transition-all duration-200 cursor-pointer hover:border-slate-300 dark:hover:border-slate-700"
            >
              <div className="flex items-center gap-2 text-xs font-semibold">
                <FiSearch size={14} />
                <span>Search command...</span>
              </div>
              <span className="text-[9px] font-black tracking-wide px-1.5 py-0.5 bg-slate-200/50 dark:bg-slate-800 text-slate-450 rounded">
                Ctrl K
              </span>
            </button>

            {/* Quick trigger Command Palette icon for Mobile/Tablet */}
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="md:hidden p-2.5 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-xl border border-slate-200/60 dark:border-slate-800 transition cursor-pointer text-slate-450"
            >
              <FiSearch size={14} />
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 text-slate-500 dark:text-slate-450 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-xl border border-slate-205 dark:border-slate-800 transition cursor-pointer"
              title="Toggle Theme Mode"
            >
              {theme === "dark" ? <FiSun size={14} className="text-amber-400 hover:rotate-45 transition-transform duration-300" /> : <FiMoon size={14} />}
            </button>

            {/* Notifications Hub drawer trigger */}
            <button
              onClick={() => setNotificationsDrawerOpen(true)}
              className="p-2.5 text-slate-500 dark:text-slate-450 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-xl border border-slate-205 dark:border-slate-800 transition cursor-pointer relative"
            >
              <FiBell size={14} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-rose-500 text-white rounded-full flex items-center justify-center text-[9px] font-black ring-2 ring-white dark:ring-[#060913] shadow-sm animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* User Profile dropdown */}
            <div ref={profileDropdownRef} className="relative pl-3.5 border-l border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1E2B7A] to-[#6366F1] text-white font-extrabold text-xs flex items-center justify-center shadow-md select-none hover:scale-102 transition duration-200 cursor-pointer"
              >
                {activeRole === "doctor" ? "D" : "A"}
              </button>

              <AnimatePresence>
                {profileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-[#0f1524] rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-800 py-1.5 z-50 overflow-hidden"
                  >
                    <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800/60 leading-tight">
                      <h4 className="text-xs font-black text-slate-900 dark:text-white">
                        {activeRole === "doctor" ? "Dr. Tasnim Alam" : "Ishtiaque Sayem"}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-bold uppercase mt-1 block tracking-wider">
                        {activeRoleConfig?.label}
                      </span>
                    </div>

                    <div className="p-1 space-y-0.5">
                      <div className="px-3.5 py-1.5 text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                        Switch Workspace
                      </div>
                      
                      {roles.map((r) => (
                        <button
                          key={r.value}
                          onClick={() => handleRoleSwitch(r.value)}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold text-left transition-colors duration-150 ${
                            activeRole === r.value
                              ? "bg-[#1E2B7A]/5 text-[#1E2B7A] dark:bg-[#6366F1]/10 dark:text-[#a5b4fc]"
                              : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                          }`}
                        >
                          <span>{r.icon}</span>
                          {r.label}
                        </button>
                      ))}
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800 p-1 mt-1">
                      <button
                        onClick={() => alert("Sign-out callback")}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition text-left cursor-pointer"
                      >
                        <FiLogOut size={13} />
                        <span>Sign Out Portal</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* 3. WORKSPACE CONTAINER VIEWPORT */}
        <main className="flex-grow p-6 md:p-8 space-y-6">
          
          {/* Welcome title header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                {activeModule}
              </h2>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-bold mt-1.5">
                Workspace: <span className="text-[#1E2B7A] dark:text-accent font-extrabold capitalize">{activeRoleConfig?.label}</span> Portal
              </p>
            </div>
            
            <span className="px-3.5 py-2 bg-white dark:bg-[#0f1524] border border-slate-200/50 dark:border-slate-800/40 text-[10px] font-black text-slate-400 dark:text-slate-400 rounded-xl shadow-sm self-start md:self-auto flex items-center gap-2 tracking-wide uppercase">
              <span className="w-1.5 h-1.5 bg-[#76BC21] rounded-full animate-ping" />
              Live Server • {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
          </div>

          {/* Smooth view transition container */}
          <div className="pb-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeRole}-${activeModule}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="h-full"
              >
                {activeRole === "super-admin" && <SuperAdminModules activeModule={activeModule} />}
                {activeRole === "reception-admin" && <ReceptionAdminModules activeModule={activeModule} />}
                {activeRole === "lab-admin" && <LabAdminModules activeModule={activeModule} />}
                {activeRole === "doctor" && <DoctorModules activeModule={activeModule} />}
              </motion.div>
            </AnimatePresence>
          </div>

        </main>
      </div>

      {/* 3. NOTIFICATIONS SIDE DRAWER */}
      <Drawer
        isOpen={notificationsDrawerOpen}
        onClose={() => setNotificationsDrawerOpen(false)}
        title="Clinical Alerts & Notifications Hub"
        description="Review real-time updates from diagnostic lab logs and check-in transactions."
      >
        <div className="space-y-4">
          {notifications.map((n: any) => (
            <div
              key={n.id}
              className={`p-4 bg-slate-50/50 dark:bg-slate-900/10 border rounded-2xl transition-all duration-200 ${
                n.isRead
                  ? "border-slate-100 dark:border-slate-800/50 opacity-60"
                  : "border-[#1E2B7A]/25 dark:border-accent/25 bg-[#1E2B7A]/3 dark:bg-accent/5"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[9px] font-black uppercase px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded">
                  {n.type}
                </span>
                <span className="text-[9px] text-slate-450 font-bold">
                  {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <h4 className="text-xs font-black text-slate-900 dark:text-white mb-1">
                {n.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                {n.message}
              </p>
            </div>
          ))}
        </div>
      </Drawer>

      {/* 4. KEYBOARD SHORTCUT COMMAND PALETTE */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onNavigate={handleModuleClick => {
          setActiveModule(handleModuleClick);
          setCommandPaletteOpen(false);
        }}
        onSwitchRole={handleRoleSwitch}
        onToggleTheme={toggleTheme}
        currentRole={activeRole}
        modules={flatModules}
      />

    </div>
  );
}
