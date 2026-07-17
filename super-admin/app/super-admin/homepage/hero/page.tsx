"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Globe, Save, ArrowLeft, Plus, Trash, Check, Loader2, Image as ImageIcon, Sliders, Search, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { getAdminHero, updateAdminHero, HeroData, HeroSlide, SlideButton, ShapeConfig } from "@/lib/services/api";

export default function EditHeroCMS() {
  const router = useRouter();
  const [data, setData] = useState<HeroData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"en" | "bn">("en");
  const [activeSubSection, setActiveSubSection] = useState<"slides" | "search-team" | "shapes">("slides");
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Fetch initial Hero data
  useEffect(() => {
    async function loadData() {
      try {
        const res = await getAdminHero();
        setData(res);
      } catch (err: any) {
        console.error(err);
        setStatusMessage({ type: "error", text: err.message || "Failed to load Hero section content." });
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
    const result = await updateAdminHero(data, "PUT"); setData(result);
      setStatusMessage({ type: "success", text: "Hero content updated successfully!" });
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      console.error(err);
      setStatusMessage({ type: "error", text: err.message || "Failed to save Hero updates." });
    } finally {
      setIsSaving(false);
    }
  };

  // Helper to update root sub-object localized strings
  const updateSubObjLocStr = (
    module: "searchBar" | "joinTeam",
    field: string,
    lang: "en" | "bn",
    value: string
  ) => {
    if (!data) return;
    setData({
      ...data,
      [module]: {
        ...data[module],
        [field]: {
          ...(data[module] as any)[field],
          [lang]: value
        }
      }
    });
  };

  // Helper to toggle boolean configs
  const handleToggle = (module: "searchBar" | "joinTeam" | "decorativeShapes", field: "enabled") => {
    if (!data) return;
    setData({
      ...data,
      [module]: {
        ...data[module],
        [field]: !data[module][field]
      }
    });
  };

  // Slides management
  const handleAddSlide = () => {
    if (!data) return;
    const count = data.slides.length + 1;
    const newSlide: HeroSlide = {
      slideNumber: count < 10 ? `0${count}.` : `${count}.`,
      heading: { en: "New Slide Heading", bn: "নতুন স্লাইড হেডিং" },
      description: { en: "New slide description copy.", bn: "নতুন স্লাইডের বিবরণ।" },
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1920&h=1080&fit=crop",
      buttons: [
        { label: { en: "View Services", bn: "সেবা দেখুন" }, link: "/services", variant: "primary" },
        { label: { en: "Contact Us", bn: "যোগাযোগ করুন" }, link: "/contact", variant: "outline" }
      ]
    };
    setData({ ...data, slides: [...data.slides, newSlide] });
  };

  const handleRemoveSlide = (index: number) => {
    if (!data) return;
    const newSlides = data.slides.filter((_, i) => i !== index).map((slide, i) => {
      const num = i + 1;
      return {
        ...slide,
        slideNumber: num < 10 ? `0${num}.` : `${num}.`
      };
    });
    setData({ ...data, slides: newSlides });
  };

  const handleSlideChange = (index: number, field: keyof HeroSlide, value: any) => {
    if (!data) return;
    const newSlides = data.slides.map((slide, i) =>
      i === index ? { ...slide, [field]: value } : slide
    );
    setData({ ...data, slides: newSlides });
  };

  const handleSlideLocStrChange = (index: number, field: "heading" | "description", lang: "en" | "bn", value: string) => {
    if (!data) return;
    const newSlides = data.slides.map((slide, i) =>
      i === index
        ? { ...slide, [field]: { ...slide[field], [lang]: value } }
        : slide
    );
    setData({ ...data, slides: newSlides });
  };

  // Slide buttons change
  const handleSlideButtonChange = (slideIndex: number, buttonIndex: number, field: "link" | "variant", value: string) => {
    if (!data) return;
    const newSlides = data.slides.map((slide, sIdx) => {
      if (sIdx !== slideIndex) return slide;
      const newButtons = slide.buttons.map((btn, bIdx) =>
        bIdx === buttonIndex ? { ...btn, [field]: value } : btn
      );
      return { ...slide, buttons: newButtons };
    });
    setData({ ...data, slides: newSlides });
  };

  const handleSlideButtonLabelChange = (slideIndex: number, buttonIndex: number, lang: "en" | "bn", value: string) => {
    if (!data) return;
    const newSlides = data.slides.map((slide, sIdx) => {
      if (sIdx !== slideIndex) return slide;
      const newButtons = slide.buttons.map((btn, bIdx) =>
        bIdx === buttonIndex ? { ...btn, label: { ...btn.label, [lang]: value } } : btn
      );
      return { ...slide, buttons: newButtons };
    });
    setData({ ...data, slides: newSlides });
  };

  // Decorative Shapes management
  const handleAddShape = () => {
    if (!data) return;
    const newShape: ShapeConfig = {
      color: "#3b82f6",
      size: 200,
      position: { top: "20%", left: "15%" },
      opacity: 0.15
    };
    setData({
      ...data,
      decorativeShapes: {
        ...data.decorativeShapes,
        shapes: [...data.decorativeShapes.shapes, newShape]
      }
    });
  };

  const handleRemoveShape = (index: number) => {
    if (!data) return;
    const newShapes = data.decorativeShapes.shapes.filter((_, i) => i !== index);
    setData({
      ...data,
      decorativeShapes: { ...data.decorativeShapes, shapes: newShapes }
    });
  };

  const handleShapeChange = (index: number, field: keyof ShapeConfig, value: any) => {
    if (!data) return;
    const newShapes = data.decorativeShapes.shapes.map((shape, i) =>
      i === index ? { ...shape, [field]: value } : shape
    );
    setData({
      ...data,
      decorativeShapes: { ...data.decorativeShapes, shapes: newShapes }
    });
  };

  const handleShapePositionChange = (index: number, key: string, value: string) => {
    if (!data) return;
    const newShapes = data.decorativeShapes.shapes.map((shape, i) => {
      if (i !== index) return shape;
      const newPos = { ...shape.position };
      if (value === "") {
        delete newPos[key];
      } else {
        newPos[key] = value;
      }
      return { ...shape, position: newPos };
    });
    setData({
      ...data,
      decorativeShapes: { ...data.decorativeShapes, shapes: newShapes }
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[#1E2B7A]" />
        <p className="text-sm text-gray-500">Loading Hero Section Content...</p>
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
          <PageHeader title="Homepage Hero CMS" description="Manage slides, search features, and background elements" icon={Globe} />
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

      {/* Subsection Tab Bar */}
      <div className="flex border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setActiveSubSection("slides")}
          className={`flex items-center gap-2 border-b-2 px-6 py-3.5 text-sm font-semibold transition-all ${
            activeSubSection === "slides"
              ? "border-[#1E2B7A] text-[#1E2B7A] dark:border-blue-400 dark:text-blue-400"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          <ImageIcon className="h-4 w-4" /> Slides ({data.slides.length})
        </button>
        <button
          onClick={() => setActiveSubSection("search-team")}
          className={`flex items-center gap-2 border-b-2 px-6 py-3.5 text-sm font-semibold transition-all ${
            activeSubSection === "search-team"
              ? "border-[#1E2B7A] text-[#1E2B7A] dark:border-blue-400 dark:text-blue-400"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          <Search className="h-4 w-4" /> Search Bar & Join Team
        </button>
        <button
          onClick={() => setActiveSubSection("shapes")}
          className={`flex items-center gap-2 border-b-2 px-6 py-3.5 text-sm font-semibold transition-all ${
            activeSubSection === "shapes"
              ? "border-[#1E2B7A] text-[#1E2B7A] dark:border-blue-400 dark:text-blue-400"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          <Sparkles className="h-4 w-4" /> Decorative Shapes
        </button>
      </div>

      {/* ─── SECTION 1: HERO SLIDES ─── */}
      {activeSubSection === "slides" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-800 dark:text-gray-200">Slider Carousel Images ({data.slides.length})</h2>
            <Button size="sm" variant="outline" onClick={handleAddSlide}>
              <Plus className="h-4 w-4 mr-1.5" /> Add Slide
            </Button>
          </div>

          <div className="space-y-6">
            {data.slides.map((slide, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 space-y-5 shadow-sm hover:shadow-md transition-shadow relative"
              >
                <button
                  onClick={() => handleRemoveSlide(idx)}
                  className="absolute top-4 right-4 text-red-500 hover:bg-red-50 rounded-lg p-2 transition-colors"
                  title="Remove Slide"
                >
                  <Trash className="h-5 w-5" />
                </button>

                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-400 h-8 w-12 text-sm font-bold">
                    {slide.slideNumber}
                  </span>
                  <h3 className="font-bold text-gray-800 dark:text-gray-200 text-sm">Slide Config</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Slide Image URL</label>
                    <input
                      type="text"
                      value={slide.image}
                      onChange={(e) => handleSlideChange(idx, "image", e.target.value)}
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-[#1E2B7A]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Slide Heading ({activeTab === "en" ? "English" : "Bangla"})
                    </label>
                    <input
                      type="text"
                      value={slide.heading[activeTab]}
                      onChange={(e) => handleSlideLocStrChange(idx, "heading", activeTab, e.target.value)}
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-[#1E2B7A]"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Slide Description ({activeTab === "en" ? "English" : "Bangla"})
                    </label>
                    <textarea
                      rows={2}
                      value={slide.description[activeTab]}
                      onChange={(e) => handleSlideLocStrChange(idx, "description", activeTab, e.target.value)}
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-[#1E2B7A]"
                    />
                  </div>

                  {/* Buttons editor */}
                  <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {slide.buttons.map((btn, btnIdx) => (
                      <div key={btnIdx} className="rounded-xl border border-gray-100 dark:border-gray-800 p-4 space-y-3 bg-gray-50/50 dark:bg-gray-800/20">
                        <div className="flex justify-between items-center">
                          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Button {btnIdx + 1}</h4>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                          <div className="space-y-1">
                            <label className="text-[10px] font-semibold text-gray-400">Label ({activeTab === "en" ? "English" : "Bangla"})</label>
                            <input
                              type="text"
                              value={btn.label[activeTab]}
                              onChange={(e) => handleSlideButtonLabelChange(idx, btnIdx, activeTab, e.target.value)}
                              className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-850 px-2 py-1.5 text-xs text-gray-700"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-semibold text-gray-400">Link URL</label>
                            <input
                              type="text"
                              value={btn.link}
                              onChange={(e) => handleSlideButtonChange(idx, btnIdx, "link", e.target.value)}
                              className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-850 px-2 py-1.5 text-xs text-gray-700"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-semibold text-gray-400">Variant Style</label>
                            <select
                              value={btn.variant}
                              onChange={(e) => handleSlideButtonChange(idx, btnIdx, "variant", e.target.value)}
                              className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-850 px-2 py-1.5 text-xs text-gray-700"
                            >
                              <option value="primary">Primary (Blue/Green)</option>
                              <option value="outline">Outline (Bordered)</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── SECTION 2: SEARCH & JOIN TEAM ─── */}
      {activeSubSection === "search-team" && (
        <div className="space-y-6">
          {/* Search bar card */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
              <h2 className="text-base font-bold text-gray-800 dark:text-gray-200">Interactive Search Bar</h2>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-semibold">{data.searchBar.enabled ? "Enabled" : "Disabled"}</span>
                <input
                  type="checkbox"
                  checked={data.searchBar.enabled}
                  onChange={() => handleToggle("searchBar", "enabled")}
                  className="rounded border-gray-300 text-[#1E2B7A] focus:ring-[#1E2B7A] h-4 w-4"
                />
              </div>
            </div>

            {data.searchBar.enabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Title ({activeTab === "en" ? "English" : "Bangla"})
                  </label>
                  <input
                    type="text"
                    value={data.searchBar.title[activeTab]}
                    onChange={(e) => updateSubObjLocStr("searchBar", "title", activeTab, e.target.value)}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-[#1E2B7A]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Search Placeholder ({activeTab === "en" ? "English" : "Bangla"})
                  </label>
                  <input
                    type="text"
                    value={data.searchBar.searchPlaceholder[activeTab]}
                    onChange={(e) => updateSubObjLocStr("searchBar", "searchPlaceholder", activeTab, e.target.value)}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-[#1E2B7A]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Location Placeholder ({activeTab === "en" ? "English" : "Bangla"})
                  </label>
                  <input
                    type="text"
                    value={data.searchBar.locationPlaceholder[activeTab]}
                    onChange={(e) => updateSubObjLocStr("searchBar", "locationPlaceholder", activeTab, e.target.value)}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-[#1E2B7A]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Advanced Search link Label ({activeTab === "en" ? "English" : "Bangla"})
                  </label>
                  <input
                    type="text"
                    value={data.searchBar.advancedSearchLink[activeTab]}
                    onChange={(e) => updateSubObjLocStr("searchBar", "advancedSearchLink", activeTab, e.target.value)}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-[#1E2B7A]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Join team card */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
              <h2 className="text-base font-bold text-gray-800 dark:text-gray-200">"Join Our Team" Card Banner</h2>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-semibold">{data.joinTeam.enabled ? "Enabled" : "Disabled"}</span>
                <input
                  type="checkbox"
                  checked={data.joinTeam.enabled}
                  onChange={() => handleToggle("joinTeam", "enabled")}
                  className="rounded border-gray-300 text-[#1E2B7A] focus:ring-[#1E2B7A] h-4 w-4"
                />
              </div>
            </div>

            {data.joinTeam.enabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Question Banner ({activeTab === "en" ? "English" : "Bangla"})
                  </label>
                  <input
                    type="text"
                    value={data.joinTeam.question[activeTab]}
                    onChange={(e) => updateSubObjLocStr("joinTeam", "question", activeTab, e.target.value)}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-[#1E2B7A]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Title Banner ({activeTab === "en" ? "English" : "Bangla"})
                  </label>
                  <input
                    type="text"
                    value={data.joinTeam.title[activeTab]}
                    onChange={(e) => updateSubObjLocStr("joinTeam", "title", activeTab, e.target.value)}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-[#1E2B7A]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Button Label ({activeTab === "en" ? "English" : "Bangla"})
                  </label>
                  <input
                    type="text"
                    value={data.joinTeam.buttonLabel[activeTab]}
                    onChange={(e) => updateSubObjLocStr("joinTeam", "buttonLabel", activeTab, e.target.value)}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-[#1E2B7A]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Button Link Link URL</label>
                  <input
                    type="text"
                    value={data.joinTeam.buttonLink}
                    onChange={(e) => setData({ ...data, joinTeam: { ...data.joinTeam, buttonLink: e.target.value } })}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-[#1E2B7A]"
                  />
                </div>
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Image Path / URL</label>
                  <input
                    type="text"
                    value={data.joinTeam.image}
                    onChange={(e) => setData({ ...data, joinTeam: { ...data.joinTeam, image: e.target.value } })}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-[#1E2B7A]"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── SECTION 3: DECORATIVE SHAPES ─── */}
      {activeSubSection === "shapes" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-2">
            <div>
              <h2 className="text-base font-bold text-gray-800 dark:text-gray-200">Background Decorative Shapes</h2>
              <p className="text-xs text-gray-400">Manage vector blob colors, sizes, and layout placements</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-semibold">{data.decorativeShapes.enabled ? "Enabled" : "Disabled"}</span>
                <input
                  type="checkbox"
                  checked={data.decorativeShapes.enabled}
                  onChange={() => handleToggle("decorativeShapes", "enabled")}
                  className="rounded border-gray-300 text-[#1E2B7A] focus:ring-[#1E2B7A] h-4 w-4"
                />
              </div>
              <Button size="sm" variant="outline" onClick={handleAddShape} disabled={!data.decorativeShapes.enabled}>
                <Plus className="h-4 w-4 mr-1.5" /> Add Shape
              </Button>
            </div>
          </div>

          {data.decorativeShapes.enabled && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.decorativeShapes.shapes.map((shape, idx) => (
                <div key={idx} className="relative rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5 space-y-4 shadow-sm hover:shadow-md transition-shadow">
                  <button
                    onClick={() => handleRemoveShape(idx)}
                    className="absolute top-3 right-3 text-red-500 hover:bg-red-50 rounded-lg p-1.5 transition-colors"
                    title="Remove Shape"
                  >
                    <Trash className="h-4 w-4" />
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full border border-gray-200" style={{ backgroundColor: shape.color }} />
                    <h4 className="font-semibold text-xs text-gray-400 uppercase tracking-widest">Shape {idx + 1}</h4>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-gray-400">Color Hex</label>
                      <input
                        type="text"
                        value={shape.color}
                        onChange={(e) => handleShapeChange(idx, "color", e.target.value)}
                        className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-850 px-2.5 py-1.5 text-xs text-gray-700"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-gray-400">Size (pixels)</label>
                      <input
                        type="number"
                        value={shape.size}
                        onChange={(e) => handleShapeChange(idx, "size", parseInt(e.target.value) || 100)}
                        className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-850 px-2.5 py-1.5 text-xs text-gray-700"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-gray-400">Opacity (0 to 1)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={shape.opacity}
                        onChange={(e) => handleShapeChange(idx, "opacity", parseFloat(e.target.value) || 0.1)}
                        className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-850 px-2.5 py-1.5 text-xs text-gray-700"
                      />
                    </div>
                  </div>

                  <div className="border-t border-gray-100 dark:border-gray-800 pt-3 space-y-2">
                    <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Layout Coordinates</h5>
                    <div className="grid grid-cols-2 gap-2">
                      {["top", "bottom", "left", "right"].map((coord) => (
                        <div key={coord} className="flex items-center gap-2">
                          <span className="text-[10px] font-semibold text-gray-400 w-12 capitalize">{coord}:</span>
                          <input
                            type="text"
                            placeholder="e.g. 15%"
                            value={shape.position[coord] || ""}
                            onChange={(e) => handleShapePositionChange(idx, coord, e.target.value)}
                            className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-850 px-2 py-1 text-xs text-gray-700"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4 pb-12">
        <Button variant="ghost" onClick={() => router.push("/super-admin/cms")}>Cancel</Button>
        <Button onClick={handleSave} disabled={isSaving} className="shadow-lg bg-[#1E2B7A] hover:bg-[#76BC21] px-8 py-5 text-base">
          {isSaving ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Check className="h-5 w-5 mr-2" />}
          Save Hero Settings
        </Button>
      </div>
    </div>
  );
}
