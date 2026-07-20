"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2, ChevronDown, ChevronUp, Eye, EyeOff, GripVertical } from "lucide-react";
import {
  getServicesData,
  createServiceData,
  updateServiceData,
  deleteServiceData,
  reorderServicesData,
  uploadCmsImage,
  ServiceData,
} from "@/lib/services/api";
import { CmsCard, CmsStatusBar, CmsPageHeader } from "@/components/cms/CmsLayout";
import { LanguageTabs } from "@/components/cms/LanguageTabs";
import { ImageUploader } from "@/components/cms/ImageUploader";
import { LocalizedInput, LocalizedTextarea, SectionDivider } from "@/components/cms/LocalizedFields";
import { FormField, FormInput } from "@/components/ui/FormPage";

const EMPTY_SERVICE = (order: number): ServiceData => ({
  _id: "",
  name: { en: "", bn: "" },
  slug: "",
  description: { en: "", bn: "" },
  image: "",
  icon: "FaStethoscope",
  color: "#1E2B7A",
  gradient: "from-[#1E2B7A] to-blue-800",
  link: "/departments",
  highlights: [],
  tagline: "",
  displayOrder: order,
  isVisible: true,
});

export default function ServicesListingCmsPage() {
  const router = useRouter();
  const [services, setServices] = useState<ServiceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [langTab, setLangTab] = useState<"en" | "bn">("en");
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setIsLoading(true);
    try {
      const result = await getServicesData({ limit: 100 });
      setServices(result.data);
    } catch (e: any) {
      setStatus({ type: "error", text: e.message || "Failed to load services" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (base64: string) => {
    try {
      return await uploadCmsImage(base64);
    } catch (e: any) {
      setStatus({ type: "error", text: e.message || "Image upload failed" });
      throw e;
    }
  };

  const updateService = useCallback((id: string, updater: (s: ServiceData) => ServiceData) => {
    setServices((prev) => prev.map((s) => (s._id === id ? updater(s) : s)));
  }, []);

  const updateNewService = useCallback((updater: (s: ServiceData) => ServiceData) => {
    setServices((prev) => {
      const copy = [...prev];
      const newIdx = copy.findIndex((s) => s._id === "new");
      if (newIdx >= 0) copy[newIdx] = updater(copy[newIdx]);
      return copy;
    });
  }, []);

  const addNewService = () => {
    const maxOrder = services.reduce((max, s) => Math.max(max, s.displayOrder || 0), 0);
    setServices((prev) => [...prev, { ...EMPTY_SERVICE(maxOrder + 1), _id: "new" }]);
    setExpandedId("new");
  };

  const removeNewService = () => {
    setServices((prev) => prev.filter((s) => s._id !== "new"));
    setExpandedId(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setStatus(null);
    try {
      for (const service of services) {
        if (service._id === "new") {
          const created = await createServiceData(service);
          service._id = created._id;
        } else {
          const { _id, createdAt, createdBy, updatedAt, updatedBy, ...rest } = service;
          await updateServiceData(_id, rest);
        }
      }
      await loadServices();
      setStatus({ type: "success", text: "All services saved successfully!" });
      setTimeout(() => setStatus(null), 4000);
    } catch (e: any) {
      setStatus({ type: "error", text: e.message || "Save failed" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      await deleteServiceData(id);
      setServices((prev) => prev.filter((s) => s._id !== id));
      setStatus({ type: "success", text: "Service deleted successfully!" });
      setTimeout(() => setStatus(null), 4000);
    } catch (e: any) {
      setStatus({ type: "error", text: e.message || "Delete failed" });
    }
  };

  const handleReorder = async () => {
    const orders = services
      .filter((s) => s._id !== "new")
      .map((s, i) => ({ id: s._id, displayOrder: i + 1 }));
    try {
      await reorderServicesData(orders);
      setServices((prev) =>
        prev.map((s, i) => (s._id !== "new" ? { ...s, displayOrder: i + 1 } : s))
      );
      setStatus({ type: "success", text: "Services reordered!" });
      setTimeout(() => setStatus(null), 4000);
    } catch (e: any) {
      setStatus({ type: "error", text: e.message || "Reorder failed" });
    }
  };

  const updateHighlights = (id: string, highlights: string[]) => {
    updateService(id, (s) => ({ ...s, highlights }));
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[#1E2B7A]" />
        <p className="text-sm text-gray-500">Loading services…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <CmsPageHeader
        title="Services Listing"
        description="Manage the service cards displayed on the homepage and services page"
        onBack={() => router.push("/super-admin/cms/services")}
        onSave={handleSave}
        isSaving={isSaving}
      />

      <CmsStatusBar message={status} />

      <CmsCard>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <SectionDivider title="Services" description={`${services.length} service(s) configured`} />
            <div className="flex items-center gap-2">
              <LanguageTabs activeTab={langTab} onTabChange={setLangTab} />
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleReorder}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <GripVertical className="h-4 w-4" />
              Reorder by Current Order
            </button>
            <button
              type="button"
              onClick={addNewService}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1E2B7A] text-white text-sm font-bold hover:bg-[#76BC21] transition-colors"
            >
              <Plus className="h-4 w-4" /> Add Service
            </button>
          </div>

          {services.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-sm">No services configured yet. Click &quot;Add Service&quot; to create one.</p>
            </div>
          )}

          <div className="space-y-4">
            {[...services]
              .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
              .map((service) => {
                const isNew = service._id === "new";
                const isExpanded = expandedId === service._id;

                return (
                  <div
                    key={service._id}
                    className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden"
                  >
                    {/* Header */}
                    <div
                      onClick={() => setExpandedId(isExpanded ? null : service._id)}
                      className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0"
                          style={{ background: service.color || "#1E2B7A" }}
                        >
                          {service.displayOrder || "?"}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                            {langTab === "bn"
                              ? service.name?.bn || "নতুন সেবা"
                              : service.name?.en || "New Service"}
                          </p>
                          <div className="flex items-center gap-3 mt-0.5">
                            <span className="text-xs text-gray-400">#{service.displayOrder || "-"}</span>
                            <span className="text-xs text-gray-400">{service.slug || "—"}</span>
                            <span className="flex items-center gap-1 text-xs text-gray-400">
                              {service.isVisible ? (
                                <Eye className="h-3 w-3 text-green-500" />
                              ) : (
                                <EyeOff className="h-3 w-3 text-gray-400" />
                              )}
                              {service.isVisible ? "Visible" : "Hidden"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!isNew && (
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); handleDelete(service._id); }}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                        {isExpanded ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
                      </div>
                    </div>

                    {/* Expanded editor */}
                    {isExpanded && (
                      <div className="px-5 pb-5 space-y-4 border-t border-gray-100 dark:border-gray-800 pt-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <LocalizedInput
                            label="Service Name"
                            value={service.name}
                            activeTab={langTab}
                            onChange={(v) =>
                              isNew
                                ? updateNewService((s) => ({ ...s, name: v }))
                                : updateService(service._id, (s) => ({ ...s, name: v }))
                            }
                            placeholder={{ en: "Service Name", bn: "সেবার নাম" }}
                            required
                          />
                          <FormField label="Slug">
                            <FormInput
                              value={service.slug}
                              onChange={(e) =>
                                isNew
                                  ? updateNewService((s) => ({ ...s, slug: e.target.value }))
                                  : updateService(service._id, (s) => ({ ...s, slug: e.target.value }))
                              }
                              placeholder="service-name"
                            />
                          </FormField>
                        </div>

                        <LocalizedTextarea
                          label="Description"
                          value={service.description}
                          activeTab={langTab}
                          onChange={(v) =>
                            isNew
                              ? updateNewService((s) => ({ ...s, description: v }))
                              : updateService(service._id, (s) => ({ ...s, description: v }))
                          }
                          rows={3}
                          placeholder={{ en: "Service description...", bn: "সেবার বিবরণ..." }}
                        />

                        <ImageUploader
                          label="Service Image"
                          value={service.image}
                          onChange={(url) =>
                            isNew
                              ? updateNewService((s) => ({ ...s, image: url }))
                              : updateService(service._id, (s) => ({ ...s, image: url }))
                          }
                          onUpload={handleImageUpload}
                          helpText="Optional image for the service card"
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <FormField label="Icon (react-icons/fa name)">
                            <FormInput
                              value={service.icon}
                              onChange={(e) =>
                                isNew
                                  ? updateNewService((s) => ({ ...s, icon: e.target.value }))
                                  : updateService(service._id, (s) => ({ ...s, icon: e.target.value }))
                              }
                              placeholder="FaStethoscope"
                            />
                          </FormField>
                          <FormField label="Color Hex">
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={service.color || "#1E2B7A"}
                                onChange={(e) =>
                                  isNew
                                    ? updateNewService((s) => ({ ...s, color: e.target.value }))
                                    : updateService(service._id, (s) => ({ ...s, color: e.target.value }))
                                }
                                className="h-9 w-9 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer"
                              />
                              <FormInput
                                value={service.color}
                                onChange={(e) =>
                                  isNew
                                    ? updateNewService((s) => ({ ...s, color: e.target.value }))
                                    : updateService(service._id, (s) => ({ ...s, color: e.target.value }))
                                }
                                placeholder="#1E2B7A"
                              />
                            </div>
                          </FormField>
                          <FormField label="Gradient Class">
                            <FormInput
                              value={service.gradient}
                              onChange={(e) =>
                                isNew
                                  ? updateNewService((s) => ({ ...s, gradient: e.target.value }))
                                  : updateService(service._id, (s) => ({ ...s, gradient: e.target.value }))
                              }
                              placeholder="from-[#1E2B7A] to-blue-800"
                            />
                          </FormField>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FormField label="Link URL">
                            <FormInput
                              value={service.link}
                              onChange={(e) =>
                                isNew
                                  ? updateNewService((s) => ({ ...s, link: e.target.value }))
                                  : updateService(service._id, (s) => ({ ...s, link: e.target.value }))
                              }
                              placeholder="/departments"
                            />
                          </FormField>
                          <FormField label="Tagline">
                            <FormInput
                              value={service.tagline}
                              onChange={(e) =>
                                isNew
                                  ? updateNewService((s) => ({ ...s, tagline: e.target.value }))
                                  : updateService(service._id, (s) => ({ ...s, tagline: e.target.value }))
                              }
                              placeholder="Tagline shown on hover"
                            />
                          </FormField>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FormField label="Display Order">
                            <FormInput
                              type="number"
                              min={1}
                              value={String(service.displayOrder || 0)}
                              onChange={(e) =>
                                isNew
                                  ? updateNewService((s) => ({ ...s, displayOrder: parseInt(e.target.value) || 0 }))
                                  : updateService(service._id, (s) => ({ ...s, displayOrder: parseInt(e.target.value) || 0 }))
                              }
                            />
                          </FormField>
                          <div className="flex items-center gap-4 pt-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={service.isVisible}
                                onChange={(e) =>
                                  isNew
                                    ? updateNewService((s) => ({ ...s, isVisible: e.target.checked }))
                                    : updateService(service._id, (s) => ({ ...s, isVisible: e.target.checked }))
                                }
                                className="rounded border-gray-300 text-[#1E2B7A] focus:ring-[#1E2B7A]"
                              />
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {service.isVisible ? "Visible" : "Hidden"}
                              </span>
                            </label>
                          </div>
                        </div>

                        {/* Highlights */}
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                            Highlights
                          </label>
                          {(service.highlights || []).map((h, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <FormInput
                                value={h}
                                onChange={(e) => {
                                  const updated = [...(service.highlights || [])];
                                  updated[i] = e.target.value;
                                  updateHighlights(service._id, updated);
                                }}
                                placeholder="Highlight text"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = (service.highlights || []).filter((_, idx) => idx !== i);
                                  updateHighlights(service._id, updated);
                                }}
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors shrink-0"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...(service.highlights || []), ""];
                              updateHighlights(service._id, updated);
                            }}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 text-sm text-gray-500 hover:border-[#1E2B7A] hover:text-[#1E2B7A] transition-colors"
                          >
                            <Plus className="h-4 w-4" /> Add Highlight
                          </button>
                        </div>

                        {/* Cancel new service button */}
                        {isNew && (
                          <div className="flex justify-end pt-2">
                            <button
                              type="button"
                              onClick={removeNewService}
                              className="px-4 py-2 rounded-xl border border-red-200 text-red-500 text-sm font-semibold hover:bg-red-50 transition-colors"
                            >
                              Cancel (Remove New)
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </CmsCard>
    </div>
  );
}
