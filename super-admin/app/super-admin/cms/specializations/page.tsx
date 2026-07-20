"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Stethoscope, Plus, Trash2, ArrowLeft, Search,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { SearchFilter } from "@/components/ui/SearchFilter";
import { Badge } from "@/components/ui/Badge";
import {
  getCmsSpecializations,
  deleteCmsSpecialization,
  type CmsSpecialization,
} from "@/lib/services/api";
import { LanguageTabs } from "@/components/cms/LanguageTabs";
import { FormField, FormInput, FormSelect } from "@/components/ui/FormPage";
import { env } from "@/config/env";
import toast from "react-hot-toast";

const API_URL = env.apiUrl;

export default function SpecializationsCmsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [langTab, setLangTab] = useState<"en" | "bn">("en");

  const [newSpec, setNewSpec] = useState({
    name: { en: "", bn: "" },
    slug: "",
    departmentSlug: "",
    description: { en: "", bn: "" },
    isVisible: true,
    displayOrder: 0,
    seo: { metaTitle: { en: "", bn: "" }, metaDescription: { en: "", bn: "" } },
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["cms-specializations", search],
    queryFn: () => getCmsSpecializations({ search, limit: 100 }),
    staleTime: 30_000,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCmsSpecialization(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-specializations"] });
      toast.success("Specialization deleted");
    },
    onError: (err: Error) => toast.error(err?.message || "Failed to delete specialization"),
  });

  const createMutation = useMutation({
    mutationFn: () => {
      const slug = newSpec.slug || newSpec.name.en.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      return fetch(`${API_URL}/admin/specializations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newSpec, slug }),
      }).then(r => r.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms-specializations"] });
      setShowAdd(false);
      setNewSpec({
        name: { en: "", bn: "" }, slug: "", departmentSlug: "",
        description: { en: "", bn: "" }, isVisible: true, displayOrder: 0,
        seo: { metaTitle: { en: "", bn: "" }, metaDescription: { en: "", bn: "" } },
      });
      toast.success("Specialization created");
    },
    onError: (err: Error) => toast.error(err?.message || "Failed to create specialization"),
  });

  const specializations = (data as unknown as { data?: CmsSpecialization[] })?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.push("/super-admin/cms")} className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ArrowLeft className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        </button>
        <PageHeader title="Specializations CMS" description={`${specializations.length} specializations`} icon={Stethoscope}>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#1E2B7A] hover:bg-[#76BC21] text-white rounded-xl text-sm font-bold transition-all"
          >
            <Plus className="h-4 w-4" /> {showAdd ? "Cancel" : "Add Specialization"}
          </button>
        </PageHeader>
      </div>

      <div className="rounded-xl border border-blue-100 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 px-4 py-3 text-xs text-blue-700 dark:text-blue-300">
        🏷️ <strong>Specializations:</strong> Manage doctor specialization terms linked to departments. Changes affect doctor profile display.
      </div>

      {/* Add form */}
      {showAdd && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">New Specialization</h3>
            <LanguageTabs activeTab={langTab} onTabChange={setLangTab} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label={`Name (${langTab.toUpperCase()})`} required>
              <FormInput value={newSpec.name[langTab]} onChange={e => setNewSpec(s => ({ ...s, name: { ...s.name, [langTab]: e.target.value } }))} placeholder={langTab === "en" ? "Cardiologist" : "কার্ডিওলজিস্ট"} />
            </FormField>
            <FormField label="Slug (auto)">
              <FormInput value={newSpec.slug} onChange={e => setNewSpec(s => ({ ...s, slug: e.target.value }))} placeholder="cardiologist" />
            </FormField>
            <FormField label="Department Slug" required>
              <FormInput value={newSpec.departmentSlug} onChange={e => setNewSpec(s => ({ ...s, departmentSlug: e.target.value }))} placeholder="cardiology" />
            </FormField>
            <FormField label={`Description (${langTab.toUpperCase()})`}>
              <FormInput value={newSpec.description[langTab]} onChange={e => setNewSpec(s => ({ ...s, description: { ...s.description, [langTab]: e.target.value } }))} placeholder="Specialized heart care..." />
            </FormField>
          </div>
          <button
            onClick={() => createMutation.mutate()}
            disabled={createMutation.isPending || !newSpec.name.en || !newSpec.departmentSlug}
            className="px-5 py-2.5 bg-[#1E2B7A] hover:bg-[#76BC21] text-white rounded-xl text-sm font-bold transition-all disabled:opacity-50"
          >
            {createMutation.isPending ? "Creating..." : "Create Specialization"}
          </button>
        </motion.div>
      )}

      {/* Search */}
      <SearchFilter value={search} onChange={setSearch} placeholder="Search specializations..." />

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-16 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />)}</div>
      ) : isError ? (
        <div className="rounded-2xl border border-dashed border-red-200 p-8 text-center text-red-500">
          <p className="font-semibold">Could not connect to backend API</p>
        </div>
      ) : specializations.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 p-10 text-center text-gray-400">
          No specializations found
        </div>
      ) : (
        <div className="space-y-2">
          {specializations.map((spec, i) => (
            <motion.div
              key={spec._id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-bold text-gray-900 dark:text-gray-100 text-sm">{spec.name?.en || "Untitled"}</p>
                  {!spec.isVisible && <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded font-bold">Hidden</span>}
                </div>
                <p className="text-xs text-gray-400">
                  {spec.slug} · Dept: {spec.departmentSlug} · Order: {spec.displayOrder}
                </p>
              </div>
              <Badge variant={spec.isVisible ? "success" : "default"}>{spec.isVisible ? "Visible" : "Hidden"}</Badge>
              <button
                onClick={() => {
                  if (window.confirm("Delete this specialization? This cannot be undone.")) {
                    deleteMutation.mutate(spec._id);
                  }
                }}
                className="h-8 w-8 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"
                title="Delete"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
