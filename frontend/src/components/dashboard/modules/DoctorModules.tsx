"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiCalendar, FiUser, FiFileText, FiUploadCloud, FiBarChart2,
  FiClock, FiCheckCircle, FiPlus, FiEdit3, FiDownload,
  FiActivity, FiStar, FiMapPin, FiUsers,
} from "react-icons/fi";
import {
  useDashboard, useAppointments, usePatients, useReports,
} from "../../../hooks/useDashboardData";
import StatsCard from "../StatsCard";
import DataTable from "../DataTable";
import SkeletonLoader from "../SkeletonLoader";
import EmptyState from "../EmptyState";
import Drawer from "../Drawer";
import { AreaChart } from "../Charts";

interface ModuleProps { activeModule: string; }

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    confirmed:      "bg-blue-500/10 text-blue-600 dark:text-blue-450 border border-blue-550/20",
    pending:        "bg-amber-500/10 text-amber-600 dark:text-amber-450 border border-amber-550/20",
    completed:      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 border border-emerald-550/20",
    cancelled:      "bg-rose-500/10 text-rose-600 dark:text-rose-445 border border-rose-550/20",
    "in-treatment": "bg-amber-500/10 text-amber-600 dark:text-amber-445 border border-amber-550/20",
    active:         "bg-emerald-500/10 text-emerald-600 dark:text-emerald-445 border border-emerald-550/20",
    final:          "bg-emerald-500/10 text-emerald-600 dark:text-emerald-445 border border-emerald-550/20",
    "pending-review": "bg-amber-500/10 text-amber-600 dark:text-amber-445 border border-amber-555/20",
    draft:          "bg-slate-500/10 text-slate-650 dark:text-slate-400 border border-slate-500/10",
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

export default function DoctorModules({ activeModule }: ModuleProps) {
  const dashboardQuery    = useDashboard("doctor");
  const appointmentsQuery = useAppointments();
  const patientsQuery     = usePatients();
  const reportsQuery      = useReports();

  const [drawerOpen, setDrawerOpen]       = useState(false);
  const [drawerContent, setDrawerContent] = useState<any>(null);
  const [prescriptionText, setPrescriptionText] = useState("");
  const [presPatient, setPresPatient]     = useState("");

  const openDrawer = (item: any) => { setDrawerContent(item); setDrawerOpen(true); };

  const isLoading = dashboardQuery.isLoading || appointmentsQuery.isLoading || patientsQuery.isLoading;
  if (isLoading) return <SkeletonLoader type="card" cardsCount={4} />;

  const dashData = (dashboardQuery.data || {}) as Record<string, unknown>;
  const stats    = ((dashData.statistics as Record<string, string | number>) || {});

  const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };
  const cardVariants      = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

  const todayAppts = (appointmentsQuery.data || []).filter((a: any) => a.status === "confirmed" || a.status === "pending").slice(0, 5);

  switch (activeModule) {

    /* ─── DASHBOARD ──────────────────────────────────────────────── */
    case "Dashboard":
      return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
          <motion.div variants={cardVariants} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            <StatsCard title="Today's Patients"     value={stats.todayPatients     || "0"} icon={<FiUsers size={18}/>}     trend={stats.todayPatientsTrend} />
            <StatsCard title="Appointments Today"   value={stats.appointmentsToday || "0"} icon={<FiCalendar size={18}/>}  trend={stats.appointmentsTodayTrend} colorClass="text-blue-500" />
            <StatsCard title="Completed Consults"   value={stats.completedConsults || "0"} icon={<FiCheckCircle size={18}/>} trend={stats.completedConsultsTrend} colorClass="text-emerald-500" />
            <StatsCard title="Prescriptions Issued" value={stats.prescriptionsIssued || "0"} icon={<FiFileText size={18}/>}  trend={stats.prescriptionsIssuedTrend} colorClass="text-purple-500" />
          </motion.div>

          <motion.div variants={cardVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2">
              <AreaChart data={dashData.consultationHistory || []} title="Consultation Load — Last 7 Days" color="purple" />
            </div>
            {/* Today's schedule mini */}
            <div className="glass-panel rounded-2xl p-5 flex flex-col">
              <h3 className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-4">Today&apos;s Schedule</h3>
              <div className="space-y-2 flex-1">
                {todayAppts.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-6">No appointments scheduled today.</p>
                ) : (
                  todayAppts.map((a: any) => (
                    <div key={a.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50/60 dark:bg-slate-800/30 hover:bg-gray-100/50 dark:hover:bg-slate-800/50 transition">
                      <div className="flex flex-col items-center text-center w-9 shrink-0">
                        <span className="text-[10px] font-black text-primary dark:text-accent">{a.timeSlot?.split(":")[0] || "—"}</span>
                        <span className="text-[8px] font-bold text-gray-400">{a.timeSlot?.split(":")[1] ? ":" + a.timeSlot.split(":")[1] : ""}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-black text-gray-900 dark:text-white truncate">{a.patientName}</p>
                        <p className="text-[9px] text-gray-400 font-semibold capitalize">{a.type}</p>
                      </div>
                      <StatusBadge status={a.status} />
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>

          {/* Patient satisfaction */}
          <motion.div variants={cardVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="glass-panel rounded-2xl p-5">
              <h3 className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-4">My Performance</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Rating",         value: "4.8 ★", sub: "from 320 reviews",  color: "text-amber-500" },
                  { label: "Return Patients",value: "74%",   sub: "patient loyalty",    color: "text-emerald-500" },
                  { label: "Avg. Consult",   value: "18 min",sub: "per consultation",   color: "text-blue-500" },
                  { label: "Monthly Cases",  value: "142",   sub: "this month",         color: "text-purple-500" },
                ].map((m) => (
                  <div key={m.label} className="p-4 rounded-xl bg-gray-50/60 dark:bg-slate-800/30">
                    <p className={`text-xl font-black ${m.color}`}>{m.value}</p>
                    <p className="text-[10px] font-black text-gray-700 dark:text-slate-300 mt-1">{m.label}</p>
                    <p className="text-[9px] text-gray-400 font-semibold">{m.sub}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-panel rounded-2xl p-5">
              <h3 className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-4">Recent Patient Reviews</h3>
              <div className="space-y-3">
                {[
                  { name: "Fatima Akter",    text: "Very professional and thorough. Great experience!", stars: 5 },
                  { name: "Mohammed Karim",  text: "Explained everything clearly. Highly recommended.",  stars: 5 },
                  { name: "Rashida Begum",   text: "Very caring and patient.",                           stars: 4 },
                ].map((r) => (
                  <div key={r.name} className="p-3 rounded-xl bg-gray-50/60 dark:bg-slate-800/30">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-[11px] font-black text-gray-900 dark:text-white">{r.name}</p>
                      <span className="text-amber-400 text-[10px] font-black">{"★".repeat(r.stars)}</span>
                    </div>
                    <p className="text-[10px] text-gray-500 dark:text-slate-400 leading-relaxed">&quot;{r.text}&quot;</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      );

    /* ─── TODAY'S APPOINTMENTS ────────────────────────────────────── */
    case "Today's Appointments":
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400 dark:text-slate-500 font-semibold">{todayAppts.length} appointments today</p>
          </div>
          <div className="space-y-3">
            {todayAppts.length === 0 && <EmptyState />}
            {todayAppts.map((a: any, idx: number) => (
              <motion.div key={a.id} layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-panel rounded-2xl p-5 flex items-center justify-between hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-blue-500 dark:from-accent dark:to-emerald-400 text-white flex items-center justify-center text-xs font-black shadow-sm">
                    #{idx + 1}
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-900 dark:text-white">{a.patientName}</p>
                    <p className="text-[11px] text-gray-400 font-semibold mt-0.5">{a.department} · {a.timeSlot} · <span className="capitalize">{a.type}</span></p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <StatusBadge status={a.status} />
                  <ActionBtn icon={<FiUser size={14}/>} label="View Patient" variant="primary" onClick={() => openDrawer(a)} />
                </div>
              </motion.div>
            ))}
          </div>
          <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title="Appointment Details" description="Patient consultation info.">
            {drawerContent && (
              <div className="grid grid-cols-2 gap-4 text-xs">
                {[
                  ["Patient",    drawerContent.patientName],
                  ["Date",       drawerContent.date],
                  ["Time",       drawerContent.timeSlot],
                  ["Department", drawerContent.department],
                  ["Type",       drawerContent.type],
                  ["Status",     drawerContent.status],
                ].map(([k, v]) => (
                  <div key={k} className="space-y-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">{k}</span>
                    <p className="font-bold text-gray-900 dark:text-white text-xs capitalize">{v}</p>
                  </div>
                ))}
              </div>
            )}
          </Drawer>
        </div>
      );

    /* ─── PATIENT HISTORY ─────────────────────────────────────────── */
    case "Patient History":
      return (
        <DataTable
          columns={[
            { header: "Patient",   accessor: "name"        },
            { header: "Age",       accessor: (i: any) => `${i.age}y / ${i.gender}` },
            { header: "Blood",     accessor: "bloodGroup"  },
            { header: "Condition", accessor: "diagnosis"   },
            { header: "Last Visit",accessor: "lastVisit"   },
            { header: "Status",    accessor: (i: any) => <StatusBadge status={i.status} /> },
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
            <ActionBtn icon={<FiUser size={14}/>} label="Full History" variant="primary" onClick={() => openDrawer(item)} />
          )}
        />
      );

    /* ─── PRESCRIPTION UPLOAD ─────────────────────────────────────── */
    case "Prescription Upload":
      return (
        <div className="max-w-xl space-y-5">
          <div className="glass-panel rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100/50 dark:border-slate-700/30">
              <div className="p-2.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl">
                <FiFileText size={18}/>
              </div>
              <div>
                <h3 className="text-sm font-black text-gray-900 dark:text-white">Write / Upload Prescription</h3>
                <p className="text-[11px] text-gray-400 font-semibold mt-0.5">Digital or scanned prescriptions are accepted.</p>
              </div>
            </div>
            <div>
              <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Patient Name</label>
              <input type="text" value={presPatient} onChange={(e) => setPresPatient(e.target.value)} placeholder="Type patient name..."
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900/20 text-gray-900 dark:text-white border border-gray-200/60 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/40 text-xs font-semibold placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Prescription Notes</label>
              <textarea rows={6} value={prescriptionText} onChange={(e) => setPrescriptionText(e.target.value)}
                placeholder="Rx: Tab. Amoxicillin 500mg — 1+0+1 × 7 days&#10;Tab. Pantoprazole 40mg — 1+0+0 × 5 days"
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900/20 text-gray-900 dark:text-white border border-gray-200/60 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/40 text-xs font-semibold font-mono resize-none placeholder:text-gray-400 placeholder:font-sans"
              />
            </div>
            <div>
              <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Or Upload Scanned Copy</label>
              <label className="block cursor-pointer border-2 border-dashed border-gray-200 dark:border-slate-700 hover:border-purple-400 dark:hover:border-purple-500 rounded-xl p-6 text-center transition-colors">
                <input type="file" className="sr-only" />
                <FiUploadCloud size={24} className="mx-auto text-gray-300 dark:text-slate-600 mb-2" />
                <p className="text-xs font-bold text-gray-500 dark:text-slate-400">Click or drag prescription scan</p>
              </label>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => { setPrescriptionText(""); setPresPatient(""); }}
                className="px-4 py-2.5 border border-gray-200 dark:border-slate-700 text-xs font-black text-gray-600 dark:text-slate-300 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800/30 transition cursor-pointer">
                Clear
              </button>
              <button onClick={() => alert("Prescription saved!")}
                className="px-5 py-2.5 bg-purple-600 text-white rounded-xl text-xs font-black shadow-sm hover:opacity-90 transition cursor-pointer flex items-center gap-2">
                <FiFileText size={13}/> Save Prescription
              </button>
            </div>
          </div>
        </div>
      );

    /* ─── MEDICAL REPORTS ─────────────────────────────────────────── */
    case "Medical Reports":
      return (
        <DataTable
          columns={[
            { header: "Report ID",  accessor: "id"          },
            { header: "Patient",    accessor: "patientName" },
            { header: "Test",       accessor: "testName"    },
            { header: "Category",   accessor: "category"    },
            { header: "Date",       accessor: "date"        },
            { header: "Lab Tech",   accessor: "labTechnician" },
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
            <ActionBtn icon={<FiDownload size={14}/>} label="Download Report" variant="primary" />
          )}
        />
      );

    /* ─── SCHEDULE ────────────────────────────────────────────────── */
    case "Schedule":
      return (
        <div className="space-y-5">
          <div className="glass-panel rounded-2xl p-5">
            <h3 className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-5">Weekly Schedule</h3>
            <div className="grid grid-cols-7 gap-2">
              {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((day, idx) => {
                const isOff    = day === "Fri" || day === "Sun";
                const isToday  = day === "Tue";
                return (
                  <div key={day} className={`p-3 rounded-xl border transition-all ${isToday ? "bg-primary dark:bg-accent border-primary dark:border-accent text-white" : isOff ? "bg-rose-50 dark:bg-rose-900/10 border-rose-100 dark:border-rose-800/20" : "bg-gray-50/60 dark:bg-slate-800/30 border-gray-100/40 dark:border-slate-700/30"}`}>
                    <p className={`text-[9px] font-black uppercase tracking-widest text-center mb-2 ${isToday ? "text-white" : isOff ? "text-rose-400" : "text-gray-400"}`}>{day}</p>
                    {!isOff && (
                      <div className="space-y-1">
                        <p className={`text-[9px] font-bold text-center ${isToday ? "text-white/80" : "text-gray-500 dark:text-slate-400"}`}>9–1 PM</p>
                        <p className={`text-[9px] font-bold text-center ${isToday ? "text-white/80" : "text-gray-500 dark:text-slate-400"}`}>3–6 PM</p>
                      </div>
                    )}
                    {isOff && <p className="text-[9px] text-rose-400 font-black text-center">Off</p>}
                  </div>
                );
              })}
            </div>
          </div>
          {/* Upcoming appointments list */}
          <div className="glass-panel rounded-2xl p-5">
            <h3 className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-4">Upcoming Appointments</h3>
            <div className="space-y-2">
              {(appointmentsQuery.data || []).slice(0, 6).map((a: any) => (
                <div key={a.id} className="flex items-center justify-between py-2.5 border-b border-gray-100/40 dark:border-slate-700/30 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary dark:bg-accent" />
                    <div>
                      <p className="text-xs font-black text-gray-900 dark:text-white">{a.patientName}</p>
                      <p className="text-[10px] text-gray-400">{a.date} · {a.timeSlot}</p>
                    </div>
                  </div>
                  <StatusBadge status={a.status} />
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    /* ─── PROFILE ─────────────────────────────────────────────────── */
    case "Profile":
      return (
        <div className="max-w-2xl space-y-5">
          <div className="glass-panel rounded-2xl p-6">
            <div className="flex items-center gap-6 pb-6 mb-6 border-b border-gray-100/50 dark:border-slate-700/30">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-blue-500 dark:from-accent dark:to-emerald-400 text-white flex items-center justify-center text-2xl font-black shadow-lg flex-shrink-0">
                Dr
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-black text-gray-900 dark:text-white">Dr. Arif Hossain</h2>
                <p className="text-sm text-gray-500 dark:text-slate-400 font-semibold mt-0.5">MBBS, MD (Medicine) · Cardiology</p>
                <div className="flex items-center gap-4 mt-3">
                  <span className="flex items-center gap-1.5 text-amber-500 text-xs font-black"><FiStar size={12}/> 4.8 Rating</span>
                  <span className="flex items-center gap-1.5 text-gray-400 text-xs font-semibold"><FiMapPin size={12}/> Mirsarai General Hospital</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-5">
              {[
                { label: "BMDC Registration",  value: "BMDC-12345"            },
                { label: "Phone",              value: "+880 1812-000001"       },
                { label: "Email",              value: "dr.arif@mgh.health"    },
                { label: "Years of Experience",value: "12 Years"              },
                { label: "Consultation Fee",   value: "৳500"                  },
                { label: "Availability",       value: "Sat–Thu 9AM–6PM"       },
              ].map(({ label, value }) => (
                <div key={label} className="space-y-1">
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">{label}</span>
                  <p className="font-bold text-gray-900 dark:text-white text-sm">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-5 border-t border-gray-100/50 dark:border-slate-700/30 flex justify-end">
              <button className="px-5 py-2.5 bg-primary text-white dark:bg-accent dark:text-slate-900 rounded-xl text-xs font-black shadow-sm hover:opacity-90 transition cursor-pointer flex items-center gap-2">
                <FiEdit3 size={13}/> Edit Profile
              </button>
            </div>
          </div>
        </div>
      );

    default:
      return <EmptyState />;
  }
}
