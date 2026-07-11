"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiActivity, FiFileText, FiUploadCloud, FiSearch,
  FiCheckCircle, FiAlertTriangle, FiUser, FiPlus,
  FiDownload, FiRefreshCw, FiBarChart2, FiClock,
} from "react-icons/fi";
import {
  useDashboard, usePatients, useReports, useActivities,
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
    final:           "bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 border border-emerald-550/20",
    "pending-review":"bg-amber-500/10 text-amber-600 dark:text-amber-450 border border-amber-550/20",
    draft:           "bg-slate-500/10 text-slate-650 dark:text-slate-400 border border-slate-500/10",
    active:          "bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 border border-emerald-550/20",
    completed:       "bg-slate-500/10 text-slate-650 dark:text-slate-400 border border-slate-500/10",
    normal:          "bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 border border-emerald-550/20",
    abnormal:        "bg-rose-500/10 text-rose-600 dark:text-rose-450 border border-rose-550/20",
    critical:        "bg-red-600/10 text-red-700 dark:text-red-400 border border-red-500/25",
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

export default function LabAdminModules({ activeModule }: ModuleProps) {
  const dashboardQuery  = useDashboard("lab-admin");
  const patientsQuery   = usePatients();
  const reportsQuery    = useReports();
  const activitiesQuery = useActivities();

  const [drawerOpen, setDrawerOpen]       = useState(false);
  const [drawerContent, setDrawerContent] = useState<any>(null);
  const [patientSearch, setPatientSearch] = useState("");
  const [uploadName, setUploadName]       = useState("");
  const [uploadCategory, setUploadCategory] = useState("blood");
  const [uploadFile, setUploadFile]       = useState<string>("");

  const openDrawer = (item: any) => { setDrawerContent(item); setDrawerOpen(true); };

  const isLoading = dashboardQuery.isLoading || patientsQuery.isLoading || reportsQuery.isLoading;
  if (isLoading) return <SkeletonLoader type="card" cardsCount={4} />;

  const dashData = (dashboardQuery.data || {}) as Record<string, unknown>;
  const stats    = ((dashData.statistics as Record<string, string | number>) || {});

  const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };
  const cardVariants      = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

  const filteredPatients = (patientsQuery.data || []).filter((p: any) =>
    p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
    p.phone?.includes(patientSearch)
  );

  switch (activeModule) {

    /* ─── DASHBOARD ──────────────────────────────────────────────── */
    case "Dashboard":
      return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
          <motion.div variants={cardVariants} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            <StatsCard title="Tests Today"         value={stats.testsToday          || "0"} icon={<FiActivity size={18}/>}     trend={Number(stats.testsTodayTrend) || 0} />
            <StatsCard title="Pending Reports"     value={stats.pendingReports      || "0"} icon={<FiClock size={18}/>}        trend={Number(stats.pendingReportsTrend) || 0}   colorClass="text-amber-500" />
            <StatsCard title="Completed Reports"   value={stats.completedReports    || "0"} icon={<FiCheckCircle size={18}/>}  trend={Number(stats.completedReportsTrend) || 0} colorClass="text-emerald-500" />
            <StatsCard title="Avg. Turnaround"     value={`${stats.averageTurnaround || "0"}h`} icon={<FiRefreshCw size={18}/>} trend={Number(stats.averageTurnaroundTrend) || 0} colorClass="text-cyan-500" />
          </motion.div>

          <motion.div variants={cardVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2">
              <AreaChart data={(dashData.testTrend as any) || []} title="Test Volume — Last 7 Days" color="cyan" />
            </div>
            {/* Test category breakdown */}
            <div className="glass-panel rounded-2xl p-5">
              <h3 className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-4">Test Categories</h3>
              <div className="space-y-4">
                {((dashData.testCategoryBreakdown as any[]) || [
                  { name: "Blood Tests",    count: 140, pct: 42 },
                  { name: "Urine Analysis", count: 86,  pct: 26 },
                  { name: "Imaging",        count: 64,  pct: 19 },
                  { name: "Microbiology",   count: 43,  pct: 13 },
                ]).map((c: any) => (
                  <div key={c.name}>
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className="text-gray-700 dark:text-slate-300">{c.name}</span>
                      <span className="text-gray-900 dark:text-white">{c.pct || 0}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 dark:bg-slate-700/50 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${c.pct || 0}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-cyan-500 to-primary rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Recent test results */}
          <motion.div variants={cardVariants} className="glass-panel rounded-2xl p-5">
            <h3 className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-4">Recent Lab Results</h3>
            <div className="divide-y divide-gray-100/40 dark:divide-slate-700/30">
              {((dashData.recentTests as any[]) || []).slice(0, 5).map((t: any) => (
                <div key={t.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                      <FiActivity size={14}/>
                    </div>
                    <div>
                      <p className="text-xs font-black text-gray-900 dark:text-white">{t.testName}</p>
                      <p className="text-[10px] text-gray-400">{t.patientName} · {t.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={t.resultStatus || "final"} />
                    <ActionBtn icon={<FiDownload size={13}/>} label="Download" variant="primary" />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      );

    /* ─── DIAGNOSTIC RECORDS ─────────────────────────────────────── */
    case "Diagnostic Records":
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400 dark:text-slate-500 font-semibold">{reportsQuery.data?.length || 0} diagnostic records</p>
          </div>
          <DataTable
            columns={[
              { header: "Record ID",  accessor: "id"          },
              { header: "Patient",    accessor: "patientName" },
              { header: "Test",       accessor: "testName"    },
              { header: "Category",   accessor: "category"    },
              { header: "Doctor",     accessor: "doctorName"  },
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
            actions={(item: any) => (
              <div className="flex gap-1">
                <ActionBtn icon={<FiFileText size={14}/>} label="View" variant="primary" onClick={() => openDrawer(item)} />
                <ActionBtn icon={<FiDownload size={14}/>} label="Download" variant="ghost" />
              </div>
            )}
          />
          <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title="Diagnostic Report" description="Full report details and results.">
            {drawerContent && (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  {[
                    ["Report ID",   drawerContent.id],
                    ["Patient",     drawerContent.patientName],
                    ["Test Name",   drawerContent.testName],
                    ["Category",    drawerContent.category],
                    ["Doctor",      drawerContent.doctorName],
                    ["Date",        drawerContent.date],
                    ["Status",      drawerContent.status],
                    ["Lab Tech",    drawerContent.labTechnician],
                  ].map(([k, v]) => (
                    <div key={k} className="space-y-1">
                      <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">{k}</span>
                      <p className="font-bold text-gray-900 dark:text-white text-xs">{v}</p>
                    </div>
                  ))}
                </div>
                {drawerContent.findings && (
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 block mb-2">Findings</span>
                    <p className="text-xs text-gray-600 dark:text-slate-300 leading-relaxed font-semibold bg-gray-50 dark:bg-slate-800/30 p-3 rounded-xl">{drawerContent.findings}</p>
                  </div>
                )}
              </div>
            )}
          </Drawer>
        </div>
      );

    /* ─── REPORTS ─────────────────────────────────────────────────── */
    case "Reports":
      return (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatsCard title="Reports Finalized"  value={stats.completedReports || "0"}  icon={<FiCheckCircle size={18}/>} trend={8.4}  colorClass="text-emerald-500" />
            <StatsCard title="Awaiting Review"    value={stats.pendingReports   || "0"}  icon={<FiAlertTriangle size={18}/>} trend={-3.2} colorClass="text-amber-500" />
            <StatsCard title="Avg. Turnaround"    value={`${stats.averageTurnaround || "0"}h`} icon={<FiRefreshCw size={18}/>} trend={-14.2} colorClass="text-cyan-500" />
          </div>
          {/* Repeat diagnostic records table for completed only */}
          <DataTable
            columns={[
              { header: "Report ID",  accessor: "id"          },
              { header: "Patient",    accessor: "patientName" },
              { header: "Test",       accessor: "testName"    },
              { header: "Category",   accessor: "category"    },
              { header: "Date",       accessor: "date"        },
              { header: "Technician", accessor: "labTechnician" },
              { header: "Status",     accessor: (i: any) => <StatusBadge status={i.status} /> },
            ]}
            data={(reportsQuery.data || []).filter((r: any) => r.status === "final")}
            searchKey="patientName"
            actions={() => (
              <ActionBtn icon={<FiDownload size={14}/>} label="Download PDF" variant="primary" />
            )}
          />
        </div>
      );

    /* ─── UPLOAD REPORTS ──────────────────────────────────────────── */
    case "Upload Reports":
      return (
        <div className="max-w-xl space-y-5">
          <div className="glass-panel rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100/50 dark:border-slate-700/30">
              <div className="p-2.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-xl">
                <FiUploadCloud size={18}/>
              </div>
              <div>
                <h3 className="text-sm font-black text-gray-900 dark:text-white">Upload Diagnostic Report</h3>
                <p className="text-[11px] text-gray-400 font-semibold mt-0.5">Supports PDF, JPEG, PNG. Max 20MB per file.</p>
              </div>
            </div>
            {[
              { label: "Patient Name",      type: "input",    value: uploadName,     set: setUploadName, placeholder: "Search patient by name or ID" },
              { label: "Test Category",     type: "select",   value: uploadCategory, set: setUploadCategory, options: ["blood", "urine", "imaging", "microbiology", "pathology"] },
            ].map(({ label, type, value, set, placeholder, options }) => (
              <div key={label}>
                <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">{label}</label>
                {type === "select" ? (
                  <select value={value} onChange={(e) => (set as any)(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900/20 text-gray-900 dark:text-white border border-gray-200/60 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/40 text-xs font-semibold"
                  >
                    {(options || []).map((o: string) => <option key={o} value={o} className="capitalize">{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
                  </select>
                ) : (
                  <input type="text" value={value} onChange={(e) => (set as any)(e.target.value)} placeholder={placeholder || ""}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900/20 text-gray-900 dark:text-white border border-gray-200/60 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/40 text-xs font-semibold placeholder:text-gray-400"
                  />
                )}
              </div>
            ))}
            {/* File drop zone */}
            <div>
              <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Report File</label>
              <label className="block cursor-pointer border-2 border-dashed border-gray-200 dark:border-slate-700 hover:border-cyan-400 dark:hover:border-cyan-500 rounded-xl p-8 text-center transition-colors">
                <input type="file" className="sr-only" onChange={(e) => setUploadFile(e.target.files?.[0]?.name || "")} />
                <FiUploadCloud size={28} className="mx-auto text-gray-300 dark:text-slate-600 mb-3" />
                <p className="text-xs font-bold text-gray-500 dark:text-slate-400">
                  {uploadFile ? uploadFile : "Click or drag a file to upload"}
                </p>
                <p className="text-[10px] text-gray-400 mt-1">PDF · JPEG · PNG up to 20 MB</p>
              </label>
            </div>
            <div className="flex justify-end pt-2">
              <button onClick={() => alert("Report uploaded!")}
                className="px-5 py-2.5 bg-cyan-600 text-white rounded-xl text-xs font-black shadow-sm hover:opacity-90 transition cursor-pointer flex items-center gap-2">
                <FiUploadCloud size={13}/> Upload Report
              </button>
            </div>
          </div>
        </div>
      );

    /* ─── PATIENT SEARCH ──────────────────────────────────────────── */
    case "Patient Search":
      return (
        <div className="space-y-5">
          <div className="glass-panel rounded-2xl p-5">
            <div className="relative">
              <FiSearch size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={patientSearch}
                onChange={(e) => setPatientSearch(e.target.value)}
                placeholder="Search by name, phone, or patient ID…"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-900/20 text-gray-900 dark:text-white border border-gray-200/60 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/40 text-sm font-semibold placeholder:text-gray-400"
              />
            </div>
          </div>
          {patientSearch && (
            <div className="space-y-2">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{filteredPatients.length} result{filteredPatients.length !== 1 ? "s" : ""}</p>
              {filteredPatients.length === 0 ? (
                <EmptyState />
              ) : (
                filteredPatients.map((p: any) => (
                  <motion.div key={p.id} layout
                    className="glass-panel rounded-xl p-4 flex items-center justify-between hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                        <FiUser size={16}/>
                      </div>
                      <div>
                        <p className="text-sm font-black text-gray-900 dark:text-white">{p.name}</p>
                        <p className="text-[11px] text-gray-400 font-semibold">{p.phone} · {p.age}y · {p.gender}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-gray-400">{p.bloodGroup}</span>
                      <ActionBtn icon={<FiFileText size={14}/>} label="View Reports" variant="primary" onClick={() => openDrawer(p)} />
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}
          {!patientSearch && (
            <div className="glass-panel rounded-2xl p-12 flex flex-col items-center gap-3 text-center">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
                <FiSearch size={24}/>
              </div>
              <h3 className="text-sm font-black text-gray-900 dark:text-white">Patient Lookup</h3>
              <p className="text-xs text-gray-400 dark:text-slate-500 max-w-sm">Type a patient name, phone number, or ID to instantly find their diagnostic history and upload new reports.</p>
            </div>
          )}
          <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title="Patient Lab Records" description="All diagnostic records for this patient.">
            {drawerContent && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  {[
                    ["Name",    drawerContent.name],
                    ["Age",     `${drawerContent.age}y / ${drawerContent.gender}`],
                    ["Phone",   drawerContent.phone],
                    ["Blood",   drawerContent.bloodGroup],
                    ["Address", drawerContent.address],
                  ].map(([k, v]) => (
                    <div key={k} className="space-y-1">
                      <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">{k}</span>
                      <p className="font-bold text-gray-900 dark:text-white text-xs">{v}</p>
                    </div>
                  ))}
                </div>
                <div className="pt-3 border-t border-gray-100/50 dark:border-slate-700/30">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Recent Lab Reports</p>
                  {(reportsQuery.data || []).filter((r: any) => r.patientName === drawerContent.name).slice(0, 3).map((r: any) => (
                    <div key={r.id} className="flex items-center justify-between py-2 border-b border-gray-100/30 dark:border-slate-700/20 last:border-0">
                      <div>
                        <p className="text-xs font-black text-gray-900 dark:text-white">{r.testName}</p>
                        <p className="text-[10px] text-gray-400">{r.date} · {r.category}</p>
                      </div>
                      <StatusBadge status={r.status} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Drawer>
        </div>
      );

    default:
      return <EmptyState />;
  }
}
