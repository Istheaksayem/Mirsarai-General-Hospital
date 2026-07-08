"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiUsers, FiCalendar, FiClock, FiDollarSign, FiBell,
  FiAlertCircle, FiUserPlus, FiFileText, FiCheckCircle,
  FiEdit3, FiSearch, FiPlus, FiPrinter,
} from "react-icons/fi";
import {
  useDashboard, usePatients, useAppointments, useNotifications,
} from "../../../hooks/useDashboardData";
import StatsCard from "../StatsCard";
import DataTable from "../DataTable";
import QuickActions from "../QuickActions";
import SkeletonLoader from "../SkeletonLoader";
import EmptyState from "../EmptyState";
import Drawer from "../Drawer";
import { AreaChart } from "../Charts";

interface ModuleProps { activeModule: string; }

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    active:          "bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 border border-emerald-550/20",
    waiting:         "bg-amber-500/10 text-amber-600 dark:text-amber-450 border border-amber-550/20",
    "in-progress":   "bg-blue-500/10 text-blue-600 dark:text-blue-450 border border-blue-550/20",
    completed:       "bg-slate-500/10 text-slate-650 dark:text-slate-400 border border-slate-500/10",
    confirmed:       "bg-blue-500/10 text-blue-600 dark:text-blue-450 border border-blue-550/20",
    pending:         "bg-amber-500/10 text-amber-600 dark:text-amber-450 border border-amber-550/20",
    cancelled:       "bg-rose-500/10 text-rose-600 dark:text-rose-450 border border-rose-550/20",
    paid:            "bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 border border-emerald-555/20",
    unpaid:          "bg-rose-500/10 text-rose-600 dark:text-rose-450 border border-rose-550/20",
    partial:         "bg-amber-500/10 text-amber-600 dark:text-amber-450 border border-amber-550/20",
    info:            "bg-blue-500/10 text-blue-600 dark:text-blue-450 border border-blue-550/20",
    success:         "bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 border border-emerald-550/20",
    warning:         "bg-amber-500/10 text-amber-600 dark:text-amber-450 border border-amber-550/20",
    error:           "bg-rose-500/10 text-rose-600 dark:text-rose-450 border border-rose-550/20",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${map[status] || "bg-slate-100/50 text-slate-500 border border-slate-200"}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {status}
    </span>
  );
};

const ActionBtn = ({ icon, label, variant = "ghost", onClick }: {
  icon: React.ReactNode; label?: string; variant?: "ghost" | "primary" | "danger"; onClick?: () => void;
}) => {
  const variantCls = {
    ghost:   "text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/40",
    primary: "text-[#1E2B7A] dark:text-accent hover:bg-[#1E2B7A]/5 dark:hover:bg-accent/10",
    danger:  "text-rose-450 hover:text-rose-650 hover:bg-rose-50 dark:hover:bg-rose-500/10",
  };
  return (
    <button onClick={onClick} className={`p-1.5 rounded-xl transition-all duration-150 cursor-pointer ${variantCls[variant]}`} title={label}>
      {icon}
    </button>
  );
};

export default function ReceptionAdminModules({ activeModule }: ModuleProps) {
  const dashboardQuery   = useDashboard("reception-admin");
  const patientsQuery    = usePatients();
  const appointmentsQuery = useAppointments();
  const notificationsQuery = useNotifications();

  const [drawerOpen, setDrawerOpen]       = useState(false);
  const [drawerContent, setDrawerContent] = useState<any>(null);
  const openDrawer = (item: any) => { setDrawerContent(item); setDrawerOpen(true); };

  const isLoading = dashboardQuery.isLoading || patientsQuery.isLoading || appointmentsQuery.isLoading;
  if (isLoading) return <SkeletonLoader type="card" cardsCount={4} />;

  const dashData = dashboardQuery.data || {};
  const stats    = dashData.statistics || {};

  const cardVariants = {
    hidden:  { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };
  const containerVariants = {
    hidden:  {},
    visible: { transition: { staggerChildren: 0.07 } },
  };

  switch (activeModule) {

    /* ─── DASHBOARD ──────────────────────────────────────────────── */
    case "Dashboard":
      return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
          <motion.div variants={cardVariants} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            <StatsCard title="Today's Appointments"  value={stats.todayAppointments  || "0"} icon={<FiCalendar size={18}/>}  trend={stats.todayAppointmentsTrend} />
            <StatsCard title="Checked-In"            value={stats.checkedIn          || "0"} icon={<FiCheckCircle size={18}/>} trend={stats.checkedInTrend}       colorClass="text-emerald-500" />
            <StatsCard title="In Queue"              value={stats.waiting            || "0"} icon={<FiClock size={18}/>}     trend={stats.waitingTrend}           colorClass="text-amber-500" />
            <StatsCard title="Today Billing"         value={`৳${stats.totalBillingToday?.toLocaleString() || "0"}`} icon={<FiDollarSign size={18}/>} trend={stats.totalBillingTodayTrend} />
          </motion.div>

          <motion.div variants={cardVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2">
              <AreaChart data={dashData.appointmentTrend || []} title="Appointment Volume — Last 7 Days" color="blue" />
            </div>
            {/* Quick Actions Panel */}
            <div className="glass-panel rounded-2xl p-5">
              <h3 className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: <FiUserPlus size={18}/>, label: "New Patient",    color: "from-primary to-blue-500" },
                  { icon: <FiCalendar size={18}/>, label: "Book Appt",      color: "from-emerald-500 to-teal-500" },
                  { icon: <FiSearch  size={18}/>,  label: "Find Patient",   color: "from-amber-500 to-orange-500" },
                  { icon: <FiPrinter size={18}/>,  label: "Print Token",    color: "from-purple-500 to-indigo-500" },
                  { icon: <FiDollarSign size={18}/>,label: "New Invoice",   color: "from-rose-500 to-pink-500" },
                  { icon: <FiFileText size={18}/>, label: "Discharge",      color: "from-cyan-500 to-blue-400" },
                ].map((a) => (
                  <button key={a.label} className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-gradient-to-br ${a.color} text-white shadow-sm hover:opacity-90 active:scale-95 transition-all duration-150 cursor-pointer`}>
                    {a.icon}
                    <span className="text-[9px] font-black tracking-wide">{a.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Queue status */}
          <motion.div variants={cardVariants} className="glass-panel rounded-2xl p-5">
            <h3 className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-4">Live Queue</h3>
            <div className="space-y-2">
              {(dashData.recentQueue || []).slice(0, 5).map((q: any) => (
                <div key={q.id} className="flex items-center justify-between py-2.5 border-b border-gray-100/40 dark:border-slate-700/30 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-primary/10 dark:bg-accent/10 text-primary dark:text-accent flex items-center justify-center text-xs font-black">#{q.tokenNumber}</span>
                    <div>
                      <p className="text-xs font-black text-gray-900 dark:text-white">{q.patientName}</p>
                      <p className="text-[10px] text-gray-400">{q.department} · {q.estimatedWait}</p>
                    </div>
                  </div>
                  <StatusBadge status={q.status} />
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      );

    /* ─── PATIENTS ────────────────────────────────────────────────── */
    case "Patients":
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400 dark:text-slate-500 font-semibold">{patientsQuery.data?.length || 0} registered patients</p>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white dark:bg-accent dark:text-slate-900 rounded-xl text-xs font-black shadow-sm hover:opacity-90 transition cursor-pointer">
              <FiUserPlus size={13}/> Register Patient
            </button>
          </div>
          <DataTable
            columns={[
              { header: "Name",        accessor: "name"      },
              { header: "Age / Gender",accessor: (i: any) => `${i.age}y / ${i.gender}` },
              { header: "Phone",       accessor: "phone"     },
              { header: "Last Visit",  accessor: "lastVisit" },
              { header: "Status",      accessor: (i: any) => <StatusBadge status={i.status} /> },
            ]}
            data={patientsQuery.data || []}
            searchKey="name"
            filterKey="status"
            filterOptions={[
              { label: "Active",       value: "active"       },
              { label: "In Treatment", value: "in-treatment" },
              { label: "Completed",    value: "completed"    },
            ]}
            actions={(item: any) => (
              <div className="flex gap-1 justify-end">
                <ActionBtn icon={<FiEdit3 size={14}/>} label="Edit" variant="primary" onClick={() => openDrawer(item)} />
              </div>
            )}
          />
          <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title="Patient Profile" description="Quick view and edit patient record.">
            {drawerContent && (
              <div className="grid grid-cols-2 gap-4 text-xs">
                {[
                  ["Name",       drawerContent.name],
                  ["Age",        `${drawerContent.age}y / ${drawerContent.gender}`],
                  ["Phone",      drawerContent.phone],
                  ["Blood",      drawerContent.bloodGroup],
                  ["Address",    drawerContent.address],
                  ["Last Visit", drawerContent.lastVisit],
                ].map(([k, v]) => (
                  <div key={k} className="space-y-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">{k}</span>
                    <p className="font-bold text-gray-900 dark:text-white text-xs">{v}</p>
                  </div>
                ))}
              </div>
            )}
          </Drawer>
        </div>
      );

    /* ─── APPOINTMENTS ────────────────────────────────────────────── */
    case "Appointments":
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400 dark:text-slate-500 font-semibold">{appointmentsQuery.data?.length || 0} appointments</p>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white dark:bg-accent dark:text-slate-900 rounded-xl text-xs font-black shadow-sm hover:opacity-90 transition cursor-pointer">
              <FiPlus size={13}/> Book Appointment
            </button>
          </div>
          <DataTable
            columns={[
              { header: "Patient",     accessor: "patientName" },
              { header: "Doctor",      accessor: "doctorName"  },
              { header: "Department",  accessor: "department"  },
              { header: "Date & Time", accessor: (i: any) => <span className="font-mono text-[11px]">{i.date} {i.timeSlot}</span> },
              { header: "Type",        accessor: (i: any) => <span className="text-xs font-bold capitalize">{i.type}</span> },
              { header: "Status",      accessor: (i: any) => <StatusBadge status={i.status} /> },
            ]}
            data={appointmentsQuery.data || []}
            searchKey="patientName"
            filterKey="status"
            filterOptions={[
              { label: "Confirmed", value: "confirmed" },
              { label: "Pending",   value: "pending"   },
              { label: "Completed", value: "completed" },
              { label: "Cancelled", value: "cancelled" },
            ]}
            actions={(item: any) => (
              <ActionBtn icon={<FiEdit3 size={14}/>} label="Reschedule" variant="primary" onClick={() => openDrawer(item)} />
            )}
          />
        </div>
      );

    /* ─── QUEUE ───────────────────────────────────────────────────── */
    case "Queue":
      return (
        <div className="space-y-4">
          <div className="glass-panel rounded-2xl p-5">
            <h3 className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-4">Live Token Queue</h3>
            <div className="space-y-2">
              {(dashData.recentQueue || []).map((q: any) => (
                <motion.div key={q.id} layout
                  className="flex items-center justify-between p-4 rounded-xl bg-gray-50/60 dark:bg-slate-800/30 border border-gray-100/40 dark:border-slate-700/30 hover:shadow-sm transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-blue-500 dark:from-accent dark:to-emerald-400 text-white flex items-center justify-center text-sm font-black shadow-sm">
                      #{q.tokenNumber}
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-900 dark:text-white">{q.patientName}</p>
                      <p className="text-[11px] text-gray-400 font-semibold">{q.department} · Est. wait: {q.estimatedWait}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={q.status} />
                    <ActionBtn icon={<FiCheckCircle size={14}/>} label="Check In" variant="primary" />
                  </div>
                </motion.div>
              ))}
              {(!dashData.recentQueue || dashData.recentQueue.length === 0) && <EmptyState />}
            </div>
          </div>
        </div>
      );

    /* ─── BILLING ─────────────────────────────────────────────────── */
    case "Billing":
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatsCard title="Today Collected"   value={`৳${stats.totalBillingToday?.toLocaleString() || "0"}`} icon={<FiDollarSign size={18}/>}  trend={stats.totalBillingTodayTrend} />
            <StatsCard title="Pending Invoices"  value="18"  icon={<FiFileText size={18}/>}   trend={-8.2} colorClass="text-amber-500" />
            <StatsCard title="Paid This Month"   value="342" icon={<FiCheckCircle size={18}/>} trend={22.4} colorClass="text-emerald-500" />
          </div>
          <DataTable
            columns={[
              { header: "Invoice #",  accessor: "id"          },
              { header: "Patient",    accessor: "patientName" },
              { header: "Amount",     accessor: (i: any) => <span className="font-mono font-black text-gray-900 dark:text-white">৳{i.amount?.toLocaleString()}</span> },
              { header: "Services",   accessor: (i: any) => i.services?.join(", ") || "–" },
              { header: "Date",       accessor: "date"        },
              { header: "Status",     accessor: (i: any) => <StatusBadge status={i.paymentStatus} /> },
            ]}
            data={(dashData.billingRecords || []).map((b: any) => ({ ...b, patientName: b.patientName || "Patient" }))}
            searchKey="patientName"
            filterKey="paymentStatus"
            filterOptions={[
              { label: "Paid",    value: "paid"    },
              { label: "Unpaid",  value: "unpaid"  },
              { label: "Partial", value: "partial" },
            ]}
            actions={() => (
              <ActionBtn icon={<FiPrinter size={14}/>} label="Print Invoice" variant="primary" />
            )}
          />
        </div>
      );

    /* ─── NOTIFICATIONS ────────────────────────────────────────────── */
    case "Notifications":
      return (
        <div className="max-w-2xl space-y-3">
          {(notificationsQuery.data || []).map((n: any) => {
            const typeColor: Record<string, string> = {
              info:    "bg-blue-500/10 border-blue-200/30 dark:border-blue-700/20",
              success: "bg-emerald-500/10 border-emerald-200/30 dark:border-emerald-700/20",
              warning: "bg-amber-500/10 border-amber-200/30 dark:border-amber-700/20",
              error:   "bg-rose-500/10 border-rose-200/30 dark:border-rose-700/20",
            };
            return (
              <motion.div key={n.id} layout
                className={`flex items-start gap-4 p-4 rounded-2xl border ${typeColor[n.type] || typeColor.info} transition-all`}
              >
                <div className="pt-0.5">
                  <FiBell size={15} className="text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-xs font-black text-gray-900 dark:text-white">{n.title}</h4>
                    <span className="text-[9px] font-bold text-gray-400 shrink-0 ml-4">
                      {new Date(n.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-slate-400 leading-relaxed">{n.message}</p>
                </div>
                <StatusBadge status={n.type} />
              </motion.div>
            );
          })}
          {(!notificationsQuery.data || notificationsQuery.data.length === 0) && <EmptyState />}
        </div>
      );

    default:
      return <EmptyState />;
  }
}
