"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiUsers, FiActivity, FiFolder, FiBriefcase, FiSettings,
  FiShield, FiTrendingUp, FiGlobe, FiFileText, FiCheckCircle,
  FiTrash2, FiEdit3, FiPlus, FiAlertTriangle, FiBarChart2,
  FiRefreshCw, FiDownload,
} from "react-icons/fi";
import {
  useDashboard, usePatients, useDoctors, useDepartments,
  useAppointments, useReports, useRoles, useActivities,
} from "../../../hooks/useDashboardData";
import StatsCard from "../StatsCard";
import DataTable from "../DataTable";
import { AreaChart, DonutChart } from "../Charts";
import RecentActivity from "../RecentActivity";
import SkeletonLoader from "../SkeletonLoader";
import EmptyState from "../EmptyState";
import Drawer from "../Drawer";

interface ModuleProps { activeModule: string; }

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    active:          "bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 border border-emerald-550/20",
    "in-treatment":  "bg-amber-500/10 text-amber-600 dark:text-amber-450 border border-amber-550/20",
    completed:       "bg-slate-500/10 text-slate-650 dark:text-slate-400 border border-slate-500/10",
    confirmed:       "bg-blue-500/10 text-blue-600 dark:text-blue-450 border border-blue-550/20",
    pending:         "bg-amber-500/10 text-amber-600 dark:text-amber-450 border border-amber-550/20",
    cancelled:       "bg-rose-500/10 text-rose-600 dark:text-rose-450 border border-rose-550/20",
    "on-leave":      "bg-rose-500/10 text-rose-600 dark:text-rose-450 border border-rose-550/20",
    final:           "bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 border border-emerald-550/20",
    draft:           "bg-slate-500/10 text-slate-650 dark:text-slate-400 border border-slate-550/10",
    "pending-review":"bg-amber-500/10 text-amber-600 dark:text-amber-450 border border-amber-555/20",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${map[status] || "bg-slate-100/50 text-slate-500 border border-slate-200"}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {status}
    </span>
  );
};

// Action button
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

export default function SuperAdminModules({ activeModule }: ModuleProps) {
  const dashboardQuery  = useDashboard("super-admin");
  const patientsQuery   = usePatients();
  const doctorsQuery    = useDoctors();
  const deptsQuery      = useDepartments();
  const apptsQuery      = useAppointments();
  const reportsQuery    = useReports();
  const rolesQuery      = useRoles();
  const activitiesQuery = useActivities();

  const [drawerOpen, setDrawerOpen]       = useState(false);
  const [drawerContent, setDrawerContent] = useState<any>(null);
  const [cmsHeroTitle, setCmsHeroTitle]   = useState("Your Health, Our Priority");
  const [cmsHeroSub, setCmsHeroSub]       = useState("Providing World-Class Healthcare in Mirsarai");

  const openDrawer = (item: any) => { setDrawerContent(item); setDrawerOpen(true); };

  const isLoading = dashboardQuery.isLoading || activitiesQuery.isLoading ||
    patientsQuery.isLoading || doctorsQuery.isLoading || deptsQuery.isLoading ||
    apptsQuery.isLoading || reportsQuery.isLoading || rolesQuery.isLoading;

  if (isLoading) return <SkeletonLoader type="card" cardsCount={4} />;

  const dashData  = (dashboardQuery.data || {}) as Record<string, unknown>;
  const stats     = ((dashData.statistics as Record<string, string | number>) || {});
  const activities = activitiesQuery.data || [];

  // Shared container animation
  const containerVariants = {
    hidden:  {},
    visible: { transition: { staggerChildren: 0.07 } },
  };
  const cardVariants = {
    hidden:  { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  switch (activeModule) {

    /* ─── DASHBOARD ─────────────────────────────────────────────── */
    case "Dashboard":
      return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
          {/* KPI Row */}
          <motion.div variants={cardVariants} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            <StatsCard title="Total Patients"      value={stats.totalPatients?.toLocaleString() || "0"} icon={<FiUsers size={18}/>}      trend={Number(stats.totalPatientsTrend) || 0}      progress={82} />
            <StatsCard title="Active Doctors"      value={stats.totalDoctors || "0"}                   icon={<FiActivity size={18}/>}    trend={Number(stats.totalDoctorsTrend) || 0}       colorClass="text-emerald-500" />
            <StatsCard title="Departments"         value={stats.activeDepartments || "0"}              icon={<FiBriefcase size={18}/>}   trend={Number(stats.activeDepartmentsTrend) || 0} />
            <StatsCard title="Monthly Revenue"     value={`৳${stats.totalRevenue?.toLocaleString() || "0"}`} icon={<FiTrendingUp size={18}/>} trend={Number(stats.totalRevenueTrend) || 0} colorClass="text-amber-500" />
          </motion.div>

          {/* Charts row */}
          <motion.div variants={cardVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2">
              <AreaChart data={(dashData.revenueOverview as any) || []} title="Revenue Overview — Last 6 Months" color="cyan" />
            </div>
            <DonutChart
              data={[
                { label: "Doctors",    value: 84, colorClass: "stroke-cyan-500"    },
                { label: "Nurses",     value: 65, colorClass: "stroke-emerald-500" },
                { label: "Reception",  value: 12, colorClass: "stroke-primary"     },
                { label: "Lab Admins", value: 8,  colorClass: "stroke-amber-500"   },
              ]}
              title="Staff Distribution"
            />
          </motion.div>

          {/* Activity + Department performance */}
          <motion.div variants={cardVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2">
              <RecentActivity activities={(activities as any[])} title="System Audit Log" />
            </div>
            <div className="glass-panel rounded-2xl p-5">
              <h3 className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-4">
                Dept. Efficiency
              </h3>
              <div className="space-y-4">
                {((dashData.departmentPerformance as any[]) || []).slice(0, 5).map((d: any) => (
                  <div key={d.id}>
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className="text-gray-700 dark:text-slate-300">{d.name}</span>
                      <span className="text-gray-900 dark:text-white">{d.efficiency}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 dark:bg-slate-700/50 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${d.efficiency}%` }}
                        transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      );

    /* ─── PATIENT MANAGEMENT ─────────────────────────────────────── */
    case "Patient Management":
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400 dark:text-slate-500 font-semibold">{patientsQuery.data?.length || 0} patients registered</p>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white dark:bg-accent dark:text-slate-900 rounded-xl text-xs font-black shadow-sm hover:opacity-90 transition cursor-pointer">
              <FiPlus size={13}/> Add Patient
            </button>
          </div>
          <DataTable
            columns={[
              { header: "Name",   accessor: "name"      },
              { header: "Age",    accessor: (i: any) => `${i.age}y / ${i.gender}` },
              { header: "Blood",  accessor: "bloodGroup" },
              { header: "Phone",  accessor: "phone"      },
              { header: "Status", accessor: (i: any) => <StatusBadge status={i.status} /> },
            ]}
            data={patientsQuery.data || []}
            searchPlaceholder="Search patients by name..."
            searchKey="name"
            filterKey="status"
            filterOptions={[
              { label: "Active",       value: "active"       },
              { label: "In Treatment", value: "in-treatment" },
              { label: "Completed",    value: "completed"    },
            ]}
            actions={(item: any) => (
              <div className="flex gap-1 justify-end">
                <ActionBtn icon={<FiEdit3 size={14}/>}  label="Edit"   variant="primary" onClick={() => openDrawer(item)} />
                <ActionBtn icon={<FiTrash2 size={14}/>} label="Delete" variant="danger"  />
              </div>
            )}
          />
          {/* Edit Drawer */}
          <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title="Patient Details" description="Viewing full profile and clinical history.">
            {drawerContent && (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  {[
                    ["Patient ID",   drawerContent.id],
                    ["Full Name",    drawerContent.name],
                    ["Age / Gender", `${drawerContent.age} / ${drawerContent.gender}`],
                    ["Blood Group",  drawerContent.bloodGroup],
                    ["Phone",        drawerContent.phone],
                    ["Last Visit",   drawerContent.lastVisit],
                    ["Status",       drawerContent.status],
                    ["Address",      drawerContent.address],
                  ].map(([k, v]) => (
                    <div key={k} className="space-y-1">
                      <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">{k}</span>
                      <p className="font-bold text-gray-900 dark:text-white text-xs">{v}</p>
                    </div>
                    ))}
                  </div>
                </div>
              )}
            </Drawer>
          </div>
        );

      /* ─── DOCTOR MANAGEMENT ──────────────────────────────────────── */
      case "Doctor Management":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-400 dark:text-slate-500 font-semibold">{doctorsQuery.data?.length || 0} doctors on roster</p>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white dark:bg-accent dark:text-slate-900 rounded-xl text-xs font-black shadow-sm hover:opacity-90 transition cursor-pointer">
                <FiPlus size={13}/> Onboard Doctor
              </button>
            </div>
            <DataTable
              columns={[
                { header: "Name",       accessor: "name"             },
                { header: "Specialty",  accessor: "specialty"        },
                { header: "Department", accessor: "department"       },
                { header: "Fee",        accessor: (i: any) => `৳${i.consultationFee}` },
                { header: "Rating",     accessor: (i: any) => <span className="text-amber-500 font-black">★ {i.rating}</span> },
                { header: "Status",     accessor: (i: any) => <StatusBadge status={i.status} /> },
            ]}
            data={doctorsQuery.data || []}
            searchKey="name"
            filterKey="status"
            filterOptions={[
              { label: "Active",   value: "active"   },
              { label: "On Leave", value: "on-leave" },
            ]}
            actions={(item: any) => (
              <div className="flex gap-1 justify-end">
                <ActionBtn icon={<FiEdit3 size={14}/>} label="Edit Profile" variant="primary" onClick={() => openDrawer(item)} />
              </div>
            )}
          />
          <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title="Doctor Profile" description="Full doctor credentials and schedule.">
            {drawerContent && (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  {[
                    ["Doctor ID",   drawerContent.id],
                    ["Name",        drawerContent.name],
                    ["Specialty",   drawerContent.specialty],
                    ["Department",  drawerContent.department],
                    ["Fee",         `৳${drawerContent.consultationFee}`],
                    ["Rating",      `★ ${drawerContent.rating}`],
                    ["Email",       drawerContent.email],
                    ["Phone",       drawerContent.phone],
                    ["Schedule",    drawerContent.availability],
                  ].map(([k, v]) => (
                    <div key={k} className="space-y-1">
                      <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">{k}</span>
                      <p className="font-bold text-gray-900 dark:text-white text-xs">{v}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Drawer>
        </div>
      );

    /* ─── DEPARTMENT MANAGEMENT ──────────────────────────────────── */
    case "Department Management":
      return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
        >
          {(deptsQuery.data || []).map((dept: any) => (
            <motion.div key={dept.id} variants={cardVariants}
              className="glass-panel rounded-2xl p-5 hover:shadow-md transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="px-2 py-0.5 text-[10px] font-black bg-primary/10 text-primary dark:bg-accent/10 dark:text-accent rounded-md tracking-wide">
                  {dept.code}
                </span>
                <StatusBadge status={dept.status} />
              </div>
              <h4 className="text-base font-black text-gray-900 dark:text-white mb-1.5">{dept.name}</h4>
              <p className="text-[11px] text-gray-500 dark:text-slate-400 leading-relaxed line-clamp-2 mb-4">{dept.description}</p>
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100/50 dark:border-slate-700/30 text-xs">
                <div>
                  <span className="text-[9px] font-black text-gray-400 uppercase block mb-0.5">Head of Dept.</span>
                  <span className="font-bold text-gray-800 dark:text-slate-200 truncate block text-[11px]">{dept.headOfDepartment}</span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-black text-gray-400 uppercase block mb-0.5">Staff / Beds</span>
                  <span className="font-bold text-gray-800 dark:text-slate-200 text-[11px]">{dept.staffCount} / {dept.bedCount}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      );

    /* ─── APPOINTMENT MANAGEMENT ─────────────────────────────────── */
    case "Appointment Management":
      return (
        <DataTable
          columns={[
            { header: "ID",         accessor: "id"          },
            { header: "Patient",    accessor: "patientName" },
            { header: "Doctor",     accessor: "doctorName"  },
            { header: "Department", accessor: "department"  },
            { header: "Date & Time",accessor: (i: any) => <span className="font-mono text-[11px]">{i.date} {i.timeSlot}</span> },
            { header: "Status",     accessor: (i: any) => <StatusBadge status={i.status} /> },
          ]}
          data={apptsQuery.data || []}
          searchKey="patientName"
          filterKey="status"
          filterOptions={[
            { label: "Completed", value: "completed" },
            { label: "Confirmed", value: "confirmed" },
            { label: "Pending",   value: "pending"   },
            { label: "Cancelled", value: "cancelled" },
          ]}
          actions={(item: any) => (
            <div className="flex gap-1 justify-end">
              <ActionBtn icon={<FiEdit3 size={14}/>} label="Reschedule" variant="primary" onClick={() => openDrawer(item)} />
            </div>
          )}
        />
      );

    /* ─── DOCUMENT MANAGEMENT ─────────────────────────────────────── */
    case "Document Management":
      return (
        <DataTable
          columns={[
            { header: "Report ID",  accessor: "id"          },
            { header: "Patient",    accessor: "patientName" },
            { header: "Doctor",     accessor: "doctorName"  },
            { header: "Test",       accessor: "testName"    },
            { header: "Category",   accessor: "category"    },
            { header: "Date",       accessor: "date"        },
            { header: "Status",     accessor: (i: any) => <StatusBadge status={i.status} /> },
          ]}
          data={reportsQuery.data || []}
          searchKey="patientName"
          filterKey="status"
          filterOptions={[
            { label: "Final",          value: "final"          },
            { label: "Pending Review", value: "pending-review" },
            { label: "Draft",          value: "draft"          },
          ]}
          actions={() => (
            <ActionBtn icon={<FiDownload size={14}/>} label="Download" variant="primary" />
          )}
        />
      );

    /* ─── ROLE MANAGEMENT ─────────────────────────────────────────── */
    case "Role Management":
      return (
        <div className="space-y-4">
          <DataTable
            columns={[
              { header: "Role",        accessor: "name"        },
              { header: "Description", accessor: "description", className: "max-w-xs" },
              { header: "Users",       accessor: (i: any) => <span className="font-mono font-black">{i.userCount}</span> },
              {
                header: "Permissions",
                accessor: (i: any) => (
                  <div className="flex flex-wrap gap-1">
                    {i.permissions.slice(0, 3).map((p: string) => (
                      <span key={p} className="px-1.5 py-0.5 bg-gray-100 dark:bg-slate-700/40 text-gray-500 dark:text-slate-400 text-[9px] font-black rounded uppercase tracking-wide">{p}</span>
                    ))}
                    {i.permissions.length > 3 && (
                      <span className="text-[9px] text-gray-400 font-bold">+{i.permissions.length - 3}</span>
                    )}
                  </div>
                ),
              },
            ]}
            data={rolesQuery.data || []}
            searchKey="name"
            actions={() => (
              <ActionBtn icon={<FiShield size={14}/>} label="Edit Permissions" variant="primary" />
            )}
          />
        </div>
      );

    /* ─── WEBSITE CMS ─────────────────────────────────────────────── */
    case "Website CMS":
      return (
        <div className="max-w-2xl space-y-5">
          <div className="glass-panel rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100/50 dark:border-slate-700/30">
              <div className="p-2.5 bg-primary/10 text-primary dark:bg-accent/10 dark:text-accent rounded-xl">
                <FiGlobe size={18}/>
              </div>
              <div>
                <h3 className="text-sm font-black text-gray-900 dark:text-white">Homepage CMS Editor</h3>
                <p className="text-[11px] text-gray-400 font-semibold mt-0.5">Changes publish live to the public portal instantly.</p>
              </div>
            </div>

            {[
              { label: "Hero Title",    value: cmsHeroTitle, set: setCmsHeroTitle, type: "text"     },
              { label: "Hero Subtitle", value: cmsHeroSub,   set: setCmsHeroSub,   type: "textarea" },
            ].map(({ label, value, set, type }) => (
              <div key={label}>
                <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">{label}</label>
                {type === "textarea" ? (
                  <textarea rows={3} value={value} onChange={(e) => set(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900/20 text-gray-900 dark:text-white border border-gray-200/60 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-xs font-semibold"
                  />
                ) : (
                  <input type="text" value={value} onChange={(e) => set(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900/20 text-gray-900 dark:text-white border border-gray-200/60 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-xs font-semibold"
                  />
                )}
              </div>
            ))}

            <div className="flex justify-end pt-2">
              <button onClick={() => alert("Published!")}
                className="px-5 py-2.5 bg-primary text-white dark:bg-accent dark:text-slate-900 rounded-xl text-xs font-black shadow-sm hover:opacity-90 transition cursor-pointer"
              >
                Publish Changes
              </button>
            </div>
          </div>
        </div>
      );

    /* ─── REPORTS ─────────────────────────────────────────────────── */
    case "Reports":
      return (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <StatsCard title="Active Queries"       value="412"     icon={<FiFileText size={18}/>}   trend={12.4} />
            <StatsCard title="Reports Finalized"    value="2,482"   icon={<FiCheckCircle size={18}/>} trend={5.8}  colorClass="text-emerald-500" />
            <StatsCard title="Avg. Turnaround"      value="1.8 hrs" icon={<FiRefreshCw size={18}/>}  trend={-14.2} colorClass="text-cyan-500" />
          </div>
          {/* Bar chart block */}
          <div className="glass-panel rounded-2xl p-6">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-5">Consultations vs. Lab Tests (6 Months)</h3>
            <div className="flex items-end gap-3 h-40">
              {[
                { month:"Jan", c:60,  l:40 }, { month:"Feb", c:75,  l:48 },
                { month:"Mar", c:90,  l:62 }, { month:"Apr", c:82,  l:58 },
                { month:"May", c:110, l:85 }, { month:"Jun", c:140, l:105 },
              ].map((d) => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                  <div className="flex gap-1 w-full justify-center items-end h-[85%]">
                    <motion.div initial={{ height: 0 }} animate={{ height: `${d.c*100/150}%` }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                      className="w-4 bg-primary dark:bg-accent rounded-t-md opacity-80 hover:opacity-100 transition"
                    />
                    <motion.div initial={{ height: 0 }} animate={{ height: `${d.l*100/150}%` }}
                      transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
                      className="w-4 bg-secondary rounded-t-md opacity-80 hover:opacity-100 transition"
                    />
                  </div>
                  <span className="text-[9px] font-black text-gray-400 uppercase">{d.month}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-5 mt-4 pt-4 border-t border-gray-100/50 dark:border-slate-700/30">
              {[{ label: "Consultations", color: "bg-primary dark:bg-accent" }, { label: "Lab Tests", color: "bg-secondary" }].map(l => (
                <div key={l.label} className="flex items-center gap-2 text-[10px] font-bold text-gray-500 dark:text-slate-400">
                  <span className={`w-2.5 h-2.5 rounded-sm ${l.color}`} /> {l.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    /* ─── SETTINGS ────────────────────────────────────────────────── */
    case "Settings":
      return (
        <div className="max-w-2xl space-y-4">
          <div className="glass-panel rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100/50 dark:border-slate-700/30">
              <h3 className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-2.5">
                <FiSettings size={16} className="text-gray-400"/> System Configuration
              </h3>
            </div>
            <div className="divide-y divide-gray-100/50 dark:divide-slate-700/30">
              {[
                { title: "Hospital Formal Name",  desc: "Displayed on prescriptions and billing invoices.", defaultValue: "Mirsarai General Hospital Ltd.", type: "input" },
                { title: "Emergency Phone Line",  desc: "Shown prominently on public portal header.",       defaultValue: "+880 1812-990000",               type: "input" },
                { title: "Maintenance Mode",      desc: "Halt non-admin traffic for system operations.",    defaultValue: null,                              type: "toggle" },
              ].map((item) => (
                <div key={item.title} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-black text-gray-800 dark:text-slate-200">{item.title}</h4>
                    <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                  {item.type === "input" ? (
                    <input type="text" defaultValue={item.defaultValue || ""}
                      className="px-3 py-1.5 bg-gray-50 dark:bg-slate-900/20 text-xs border border-gray-200/60 dark:border-slate-700 rounded-lg text-gray-800 dark:text-slate-200 font-bold focus:outline-none focus:ring-2 focus:ring-primary/40 min-w-[200px]"
                    />
                  ) : (
                    <button onClick={() => alert("Toggled")}
                      className="relative w-11 h-6 rounded-full bg-gray-200 dark:bg-slate-700 cursor-pointer transition">
                      <span className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform"/>
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="px-6 py-4 bg-gray-50/30 dark:bg-slate-900/10 flex justify-end">
              <button onClick={() => alert("Settings saved")}
                className="px-5 py-2.5 bg-primary text-white dark:bg-accent dark:text-slate-900 rounded-xl text-xs font-black shadow-sm hover:opacity-90 transition cursor-pointer">
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      );

    default:
      return <EmptyState />;
  }
}
