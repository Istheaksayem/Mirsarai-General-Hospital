"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Globe, Save, ArrowLeft, Plus, Trash, Check, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { getAdminHomepage, updateAdminHomepage, HomepageData, LocalizedString, StatItem } from "@/lib/services/api";

export default function EditHomepageCMS() {
  const router = useRouter();
  const [data, setData] = useState<HomepageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"en" | "bn">("en");
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Fetch initial data on mount
  useEffect(() => {
    async function loadData() {
      try {
        const res = await getAdminHomepage();
        setData(res);
      } catch (err: any) {
        console.error(err);
        setStatusMessage({ type: "error", text: err.message || "Failed to load homepage content." });
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSave = async () => {
    if (!data) return;
    setIsSaving(true);
    setStatusMessage(null);
    try {
      // Use PUT to save full data replacement
      const result = await updateAdminHomepage(data, "PUT"); setData(result);
      setStatusMessage({ type: "success", text: "Homepage content updated successfully!" });
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      console.error(err);
      setStatusMessage({ type: "error", text: err.message || "Failed to save updates." });
    } finally {
      setIsSaving(false);
    }
  };

  // Helper to update localized strings
  const updateLocStr = (
    section: "emergency" | "appointmentCTA" | "statistics",
    field: string,
    lang: "en" | "bn",
    value: string
  ) => {
    if (!data) return;
    setData({
      ...data,
      [section]: {
        ...data[section],
        [field]: {
          ...(data[section] as any)[field],
          [lang]: value
        }
      }
    });
  };

  // Helper to update flat fields
  const updateFlatField = (
    section: "emergency" | "appointmentCTA" | "statistics",
    field: string,
    value: any
  ) => {
    if (!data) return;
    setData({
      ...data,
      [section]: {
        ...data[section],
        [field]: value
      }
    });
  };

  // Helper for button fields
  const updateButtonField = (
    btnName: "primaryBtn" | "secondaryBtn",
    field: "en" | "bn" | "link",
    value: string
  ) => {
    if (!data) return;
    setData({
      ...data,
      appointmentCTA: {
        ...data.appointmentCTA,
        [btnName]: {
          ...data.appointmentCTA[btnName],
          [field]: value
        }
      }
    });
  };

  // Quick Info list items management
  const handleAddQuickInfo = () => {
    if (!data) return;
    const newItems = [...data.emergency.quickInfo, { en: "New feature", bn: "নতুন বৈশিষ্ট্য" }];
    updateFlatField("emergency", "quickInfo", newItems);
  };

  const handleRemoveQuickInfo = (index: number) => {
    if (!data) return;
    const newItems = data.emergency.quickInfo.filter((_, i) => i !== index);
    updateFlatField("emergency", "quickInfo", newItems);
  };

  const handleQuickInfoChange = (index: number, lang: "en" | "bn", value: string) => {
    if (!data) return;
    const newItems = data.emergency.quickInfo.map((item, i) =>
      i === index ? { ...item, [lang]: value } : item
    );
    updateFlatField("emergency", "quickInfo", newItems);
  };

  // CTA Features list items management
  const handleAddFeature = () => {
    if (!data) return;
    const newItems = [...data.appointmentCTA.features, { en: "New advantage", bn: "নতুন সুবিধা" }];
    updateFlatField("appointmentCTA", "features", newItems);
  };

  const handleRemoveFeature = (index: number) => {
    if (!data) return;
    const newItems = data.appointmentCTA.features.filter((_, i) => i !== index);
    updateFlatField("appointmentCTA", "features", newItems);
  };

  const handleFeatureChange = (index: number, lang: "en" | "bn", value: string) => {
    if (!data) return;
    const newItems = data.appointmentCTA.features.map((item, i) =>
      i === index ? { ...item, [lang]: value } : item
    );
    updateFlatField("appointmentCTA", "features", newItems);
  };

  // Stats items management
  const handleAddStat = () => {
    if (!data) return;
    const newStats: StatItem[] = [
      ...data.statistics.stats,
      { number: "100+", label: { en: "New Stat", bn: "নতুন তথ্য" }, icon: "FaUsers", color: "#1E2B7A" }
    ];
    updateFlatField("statistics", "stats", newStats);
  };

  const handleRemoveStat = (index: number) => {
    if (!data) return;
    const newStats = data.statistics.stats.filter((_, i) => i !== index);
    updateFlatField("statistics", "stats", newStats);
  };

  const handleStatChange = (index: number, field: keyof StatItem, value: any) => {
    if (!data) return;
    const newStats = data.statistics.stats.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    updateFlatField("statistics", "stats", newStats);
  };

  const handleStatLabelChange = (index: number, lang: "en" | "bn", value: string) => {
    if (!data) return;
    const newStats = data.statistics.stats.map((item, i) =>
      i === index
        ? { ...item, label: { ...item.label, [lang]: value } }
        : item
    );
    updateFlatField("statistics", "stats", newStats);
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[#1E2B7A]" />
        <p className="text-sm text-gray-500">Loading Homepage Content...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-red-600">
        <p className="font-semibold">Error Loading Content</p>
        <p className="text-sm mt-1">{statusMessage?.text || "Please verify the backend server is running."}</p>
        <Button className="mt-4" onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => router.push("/super-admin/cms")}>
            <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
          </Button>
          <PageHeader title="Homepage CMS" description="Manage sections of the website landing page" icon={Globe} />
        </div>
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <div className="flex rounded-xl bg-gray-100 dark:bg-gray-800 p-1 border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab("en")}
              className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all ${
                activeTab === "en" ? "bg-white dark:bg-gray-900 text-[#1E2B7A] dark:text-blue-400 shadow-sm" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              English
            </button>
            <button
              onClick={() => setActiveTab("bn")}
              className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all ${
                activeTab === "bn" ? "bg-white dark:bg-gray-900 text-[#1E2B7A] dark:text-blue-400 shadow-sm" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              বাংলা (Bangla)
            </button>
          </div>

          <Button onClick={handleSave} disabled={isSaving} className="shadow-md bg-[#1E2B7A] hover:bg-[#76BC21]">
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : <Save className="h-4 w-4 mr-1.5" />}
            Save Changes
          </Button>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`rounded-xl p-4 text-sm font-medium ${
            statusMessage.type === "success" ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      {/* 1. Emergency Section */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 space-y-6">
        <h2 className="text-lg font-bold border-b border-gray-100 dark:border-gray-800 pb-2 text-gray-900 dark:text-gray-100">
          Emergency Response Section
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Emergency Phone Number</label>
            <input
              type="text"
              value={data.emergency.phone}
              onChange={(e) => updateFlatField("emergency", "phone", e.target.value)}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Badge ({activeTab === "en" ? "English" : "Bangla"})
            </label>
            <input
              type="text"
              value={data.emergency.badge[activeTab]}
              onChange={(e) => updateLocStr("emergency", "badge", activeTab, e.target.value)}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Heading ({activeTab === "en" ? "English" : "Bangla"})
            </label>
            <input
              type="text"
              value={data.emergency.heading[activeTab]}
              onChange={(e) => updateLocStr("emergency", "heading", activeTab, e.target.value)}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Subheading ({activeTab === "en" ? "English" : "Bangla"})
            </label>
            <input
              type="text"
              value={data.emergency.subheading[activeTab]}
              onChange={(e) => updateLocStr("emergency", "subheading", activeTab, e.target.value)}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]"
            />
          </div>
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Description ({activeTab === "en" ? "English" : "Bangla"})
            </label>
            <textarea
              rows={3}
              value={data.emergency.description[activeTab]}
              onChange={(e) => updateLocStr("emergency", "description", activeTab, e.target.value)}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]"
            />
          </div>
        </div>

        {/* Quick Info Items */}
        <div className="space-y-3 pt-3 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Emergency Quick Info</h3>
            <Button size="sm" variant="outline" onClick={handleAddQuickInfo} className="text-xs h-7 px-2 border-dashed">
              <Plus className="h-3 w-3 mr-1" /> Add Item
            </Button>
          </div>
          <div className="space-y-2">
            {data.emergency.quickInfo.map((info, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-400 w-6">{idx + 1}.</span>
                <input
                  type="text"
                  placeholder={`Bullet point text (${activeTab === "en" ? "English" : "Bangla"})`}
                  value={info[activeTab]}
                  onChange={(e) => handleQuickInfoChange(idx, activeTab, e.target.value)}
                  className="flex-1 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]"
                />
                <Button size="icon" variant="ghost" onClick={() => handleRemoveQuickInfo(idx)} className="text-red-500 hover:bg-red-50">
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Appointment CTA Section */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 space-y-6">
        <h2 className="text-lg font-bold border-b border-gray-100 dark:border-gray-800 pb-2 text-gray-900 dark:text-gray-100">
          Appointment Call to Action (CTA)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Badge ({activeTab === "en" ? "English" : "Bangla"})
            </label>
            <input
              type="text"
              value={data.appointmentCTA.badge[activeTab]}
              onChange={(e) => updateLocStr("appointmentCTA", "badge", activeTab, e.target.value)}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Heading ({activeTab === "en" ? "English" : "Bangla"})
            </label>
            <input
              type="text"
              value={data.appointmentCTA.heading[activeTab]}
              onChange={(e) => updateLocStr("appointmentCTA", "heading", activeTab, e.target.value)}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]"
            />
          </div>
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Description ({activeTab === "en" ? "English" : "Bangla"})
            </label>
            <textarea
              rows={3}
              value={data.appointmentCTA.description[activeTab]}
              onChange={(e) => updateLocStr("appointmentCTA", "description", activeTab, e.target.value)}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]"
            />
          </div>

          {/* Primary Button */}
          <div className="border border-gray-100 dark:border-gray-800 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#1E2B7A] dark:text-blue-400">Primary Button</h4>
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-gray-400">Label ({activeTab === "en" ? "English" : "Bangla"})</label>
              <input
                type="text"
                value={data.appointmentCTA.primaryBtn[activeTab]}
                onChange={(e) => updateButtonField("primaryBtn", activeTab, e.target.value)}
                className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-gray-400">Link URL</label>
              <input
                type="text"
                value={data.appointmentCTA.primaryBtn.link}
                onChange={(e) => updateButtonField("primaryBtn", "link", e.target.value)}
                className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]"
              />
            </div>
          </div>

          {/* Secondary Button */}
          <div className="border border-gray-100 dark:border-gray-800 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#76BC21]">Secondary Button</h4>
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-gray-400">Label ({activeTab === "en" ? "English" : "Bangla"})</label>
              <input
                type="text"
                value={data.appointmentCTA.secondaryBtn[activeTab]}
                onChange={(e) => updateButtonField("secondaryBtn", activeTab, e.target.value)}
                className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-gray-400">Link URL</label>
              <input
                type="text"
                value={data.appointmentCTA.secondaryBtn.link}
                onChange={(e) => updateButtonField("secondaryBtn", "link", e.target.value)}
                className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]"
              />
            </div>
          </div>
        </div>

        {/* Features list */}
        <div className="space-y-3 pt-3 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">CTA Advantages / Features</h3>
            <Button size="sm" variant="outline" onClick={handleAddFeature} className="text-xs h-7 px-2 border-dashed">
              <Plus className="h-3 w-3 mr-1" /> Add Feature
            </Button>
          </div>
          <div className="space-y-2">
            {data.appointmentCTA.features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-400 w-6">{idx + 1}.</span>
                <input
                  type="text"
                  placeholder={`Feature text (${activeTab === "en" ? "English" : "Bangla"})`}
                  value={feature[activeTab]}
                  onChange={(e) => handleFeatureChange(idx, activeTab, e.target.value)}
                  className="flex-1 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]"
                />
                <Button size="icon" variant="ghost" onClick={() => handleRemoveFeature(idx)} className="text-red-500 hover:bg-red-50">
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Statistics Section */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 space-y-6">
        <h2 className="text-lg font-bold border-b border-gray-100 dark:border-gray-800 pb-2 text-gray-900 dark:text-gray-100">
          Hospital Statistics Impact
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Section Badge ({activeTab === "en" ? "English" : "Bangla"})
            </label>
            <input
              type="text"
              value={data.statistics.sectionBadge[activeTab]}
              onChange={(e) => updateLocStr("statistics", "sectionBadge", activeTab, e.target.value)}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Heading ({activeTab === "en" ? "English" : "Bangla"})
            </label>
            <input
              type="text"
              value={data.statistics.heading[activeTab]}
              onChange={(e) => updateLocStr("statistics", "heading", activeTab, e.target.value)}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]"
            />
          </div>
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Description ({activeTab === "en" ? "English" : "Bangla"})
            </label>
            <textarea
              rows={3}
              value={data.statistics.description[activeTab]}
              onChange={(e) => updateLocStr("statistics", "description", activeTab, e.target.value)}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1E2B7A]"
            />
          </div>
        </div>

        {/* Live stats grids */}
        <div className="space-y-3 pt-3 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Counters & Statistics</h3>
            <Button size="sm" variant="outline" onClick={handleAddStat} className="text-xs h-7 px-2 border-dashed">
              <Plus className="h-3 w-3 mr-1" /> Add Counter
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.statistics.stats.map((stat, idx) => (
              <div key={idx} className="relative rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 p-4 space-y-3 shadow-sm hover:shadow-md transition-shadow">
                <button
                  onClick={() => handleRemoveStat(idx)}
                  className="absolute top-2 right-2 text-red-500 hover:bg-red-50 rounded-lg p-1.5 transition-colors"
                  title="Remove Stat"
                >
                  <Trash className="h-4 w-4" />
                </button>
                <div className="grid grid-cols-2 gap-2 pr-6">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-400">Value (e.g. 50+)</label>
                    <input
                      type="text"
                      value={stat.number}
                      onChange={(e) => handleStatChange(idx, "number", e.target.value)}
                      className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-850 px-2 py-1 text-xs font-semibold text-gray-700"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-400">Icon Class (Fa...)</label>
                    <input
                      type="text"
                      value={stat.icon}
                      disabled
                      className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-850 px-2 py-1 text-xs text-gray-700 cursor-not-allowed opacity-60"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-400">Label ({activeTab === "en" ? "English" : "Bangla"})</label>
                    <input
                      type="text"
                      value={stat.label[activeTab]}
                      onChange={(e) => handleStatLabelChange(idx, activeTab, e.target.value)}
                      className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-850 px-2 py-1 text-xs text-gray-700"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-400">Color Code (Hex/Color)</label>
                    <input
                      type="text"
                      value={stat.color}
                      disabled
                      className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-850 px-2 py-1 text-xs text-gray-700 cursor-not-allowed opacity-60"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 pb-12">
        <Button variant="ghost" onClick={() => router.push("/super-admin/cms")}>Cancel</Button>
        <Button onClick={handleSave} disabled={isSaving} className="shadow-lg bg-[#1E2B7A] hover:bg-[#76BC21] px-8 py-5 text-base">
          {isSaving ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Check className="h-5 w-5 mr-2" />}
          Save All Sections
        </Button>
      </div>
    </div>
  );
}
