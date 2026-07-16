"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Stethoscope, UserPlus, Building2, Star, LayoutList,
  Edit3, Eye, Trash2, ToggleLeft, ToggleRight,
  Search, Filter, ArrowLeft, Plus, ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/ui/PageHeader";
import { SearchFilter, SelectFilter } from "@/components/ui/SearchFilter";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getImageUrl } from "@/lib/getImageUrl";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

// ── Types ──────────────────────────────────────────────────────────────────
interface AdminDoctor {
  _id: string;
  slug: string;
  name: { en: string; bn: string };
  specialization: { en: string; bn: string };
  department: { en: string; bn: string };
  designation: { en: string; bn: string };
  status: "active" | "on-leave" | "inactive";
  available: boolean;
  featured: boolean;
  isVisible: boolean;
  image: string;
  consultationFee: number;
  displayOrder: number;
}

// ── API calls ──────────────────────────────────────────────────────────────
const fetchAdminDoctors = async (): Promise<AdminDoctor[]> => {
  const res = await fetch(`${API_URL}/admin/doctors?limit=50`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch doctors");
  const json = await res.json();
  return json.data || json.doctors || [];
};

const toggleFeatured = async (id: string) => {
  const res = await fetch(`${API_URL}/admin/doctors/${id}/toggle-featured`, { method: "PATCH" });
  if (!res.ok) throw new Error("Failed to toggle featured");
  return res.json();
};

const toggleVisibility = async (id: string) => {
  const res = await fetch(`${API_URL}/admin/doctors/${id}/toggle-visibility`, { method: "PATCH" });
  if (!res.ok) throw new Error("Failed to toggle visibility");
  return res.json();
};

const deleteDoctor = async (id: string) => {
  const res = await fetch(`${API_URL}/admin/doctors/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete doctor");
  return res.json();
};

// ── Status colors ──────────────────────────────────────────────────────────
const statusVariant: Record<string, "success" | "warning" | "danger"> = {
  active:    "success",
  "on-leave": "warning",
  inactive:  "danger",
};

// ── Main Component ─────────────────────────────────────────────────────────
export default function DoctorsCmsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const { data: doctors = [], isLoading, isError } = useQuery<AdminDoctor[]>({
    queryKey: ["admin-doctors"],
    queryFn: fetchAdminDoctors,
    staleTime: 60_000,
  });

  const featuredMutation = useMutation({
    mutationFn: toggleFeatured,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-doctors"] }),
  });

  const visibilityMutation = useMutation({
    mutationFn: toggleVisibility,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-doctors"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDoctor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-doctors"] });
      setDeleteConfirm(null);
    },
  });

  const filtered = doctors.filter((d) => {
    const ms = !search || d.name.en.toLowerCase().includes(search.toLowerCase()) ||
      d.specialization.en.toLowerCase().includes(search.toLowerCase());
    const st = !statusFilter || d.status === statusFilter;
    return ms && st;
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Doctor CMS Hub" icon={Stethoscope} />
        <div className="grid grid-cols-1 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => router.push("/super-admin/cms")} className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ArrowLeft className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        </button>
        <PageHeader title="Doctor CMS Hub" description={`${doctors.length} doctors in database`} icon={Stethoscope}>
          <button
            onClick={() => router.push("/super-admin/cms/doctors/add")}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#1E2B7A] hover:bg-[#76BC21] text-white rounded-xl text-sm font-bold transition-all"
          >
            <Plus className="h-4 w-4" /> Add Doctor
          </button>
        </PageHeader>
      </div>

      {/* Helper notice */}
      <div className="rounded-xl border border-blue-100 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 px-4 py-3 text-xs text-blue-700 dark:text-blue-300">
        📌 <strong>Doctor CMS:</strong> Changes here update <strong>/doctors</strong> (list page) and <strong>/doctors/[slug]</strong> (detail page) on the public website. Featured doctors also appear on the <strong>Homepage</strong> specialist section.
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {[
          { label: "Total", value: doctors.length, color: "text-[#1E2B7A] dark:text-blue-400" },
          { label: "Active", value: doctors.filter(d => d.status === "active").length, color: "text-green-600 dark:text-green-400" },
          { label: "On Leave", value: doctors.filter(d => d.status === "on-leave").length, color: "text-amber-600 dark:text-amber-400" },
          { label: "Featured", value: doctors.filter(d => d.featured).length, color: "text-purple-600 dark:text-purple-400" },
          { label: "Hidden", value: doctors.filter(d => !d.isVisible).length, color: "text-gray-500 dark:text-gray-400" },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 text-center">
            <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchFilter value={search} onChange={setSearch} placeholder="Search by name or specialization..." className="flex-1" />
        <SelectFilter
          value={statusFilter} onChange={setStatusFilter}
          options={[{ label: "Active", value: "active" }, { label: "On Leave", value: "on-leave" }, { label: "Inactive", value: "inactive" }]}
          placeholder="All Status"
        />
      </div>

      {/* Doctor list */}
      {isError ? (
        <div className="rounded-2xl border border-dashed border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10 p-8 text-center text-red-500">
          <p className="font-semibold">Could not connect to backend API</p>
          <p className="text-xs mt-1">Make sure the backend server is running at {API_URL}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 p-10 text-center text-gray-400">
          No doctors found
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((doctor, i) => (
            <motion.div
              key={doctor._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              {/* Avatar */}
              <div className="h-12 w-12 rounded-xl overflow-hidden bg-[#1E2B7A]/10 shrink-0">
                {doctor.image ? (
                  <img src={getImageUrl(doctor.image)} alt={doctor.name.en} className="w-full h-full object-cover" onError={e => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name.en)}&background=1E2B7A&color=fff`; }} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#1E2B7A] font-black text-lg">
                    {doctor.name.en.charAt(0)}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-bold text-gray-900 dark:text-gray-100 text-sm">{doctor.name.en}</p>
                  {doctor.featured && <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded font-bold">⭐ Featured</span>}
                  {!doctor.isVisible && <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded font-bold">Hidden</span>}
                </div>
                <p className="text-xs text-[#76BC21] font-semibold">{doctor.specialization.en}</p>
                <p className="text-xs text-gray-400">{doctor.department.en} · ৳{doctor.consultationFee}</p>
              </div>

              {/* Status badge */}
              <Badge variant={statusVariant[doctor.status] ?? "default"}>{doctor.status}</Badge>

              {/* Actions */}
              <div className="flex items-center gap-1.5 shrink-0">
                {/* Featured toggle */}
                <button
                  onClick={() => featuredMutation.mutate(doctor._id)}
                  title={doctor.featured ? "Unfeature" : "Feature on homepage"}
                  className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors ${doctor.featured ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600" : "bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-amber-600"}`}
                >
                  <Star className="h-3.5 w-3.5" />
                </button>

                {/* Visibility toggle */}
                <button
                  onClick={() => visibilityMutation.mutate(doctor._id)}
                  title={doctor.isVisible ? "Hide from public" : "Show on public"}
                  className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors ${doctor.isVisible ? "bg-green-100 dark:bg-green-900/30 text-green-600" : "bg-gray-100 dark:bg-gray-800 text-gray-400"}`}
                >
                  {doctor.isVisible ? <Eye className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5 opacity-40" />}
                </button>

                {/* Edit */}
                <button
                  onClick={() => router.push(`/super-admin/cms/doctors/${doctor._id}/edit`)}
                  title="Edit doctor"
                  className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center hover:bg-blue-100 transition-colors"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                </button>

                {/* Delete */}
                <button
                  onClick={() => setDeleteConfirm(doctor._id)}
                  title="Delete doctor"
                  className="h-8 w-8 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Delete confirm modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-gray-200 dark:border-gray-700 space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 mx-auto">
              <Trash2 className="h-5 w-5 text-red-500" />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-gray-900 dark:text-gray-100">Delete Doctor?</h3>
              <p className="text-sm text-gray-500 mt-1">This will permanently remove the doctor from the database and public website.</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 transition-colors">
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate(deleteConfirm)}
                disabled={deleteMutation.isPending}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-colors disabled:opacity-50"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
