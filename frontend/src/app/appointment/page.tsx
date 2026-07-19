"use client";

import React, { Suspense, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { FaHospital, FaShieldAlt, FaHeadset, FaUserMd, FaAmbulance, FaClock, FaHeartbeat } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import AppointmentForm from "@/components/appointment/AppointmentForm";
import { useAppointmentPageData } from "@/hooks/useAppointmentPageData";
import { getImageUrl } from "@/lib/getImageUrl";

const ICON_MAP: Record<string, React.ComponentType> = {
  FaHospital,
  MdVerified,
  FaShieldAlt,
  FaHeadset,
  FaUserMd,
  FaAmbulance,
  FaClock,
  FaHeartbeat,
};

const FALLBACK_ICON: React.ComponentType = FaHospital;

const FeatureIcon = ({ name }: { name: string }) => {
  const Icon = ICON_MAP[name] || FALLBACK_ICON;
  return <Icon />;
};

export default function AppointmentPage() {
  const { lang } = useLanguage();
  const { data, isLoading, isError } = useAppointmentPageData();

  useEffect(() => {
    if (data?.seo) {
      const seo = data.seo;
      document.title = lang === "bn" ? seo.metaTitle.bn : seo.metaTitle.en;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute("content", lang === "bn" ? seo.metaDescription.bn : seo.metaDescription.en);
      }
    }
  }, [data, lang]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-primary font-semibold text-lg">{lang === "bn" ? "লোড হচ্ছে..." : "Loading..."}</p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-red-500 text-lg font-medium">
            {lang === "bn" ? "অ্যাপয়েন্টমেন্ট পৃষ্ঠা লোড করতে ব্যর্থ হয়েছে।" : "Failed to load Appointment page."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            {lang === "bn" ? "আবার চেষ্টা করুন" : "Retry"}
          </button>
        </div>
      </div>
    );
  }

  const sectionConfig = data.sections || {
    hero: { isVisible: true, order: 1 },
    features: { isVisible: true, order: 2 },
    sidebar: { isVisible: true, order: 3 },
    form: { isVisible: true, order: 4 },
  };

  const activeSections = Object.entries(sectionConfig)
    .filter(([_, cfg]) => cfg.isVisible)
    .sort(([_, a], [__, b]) => a.order - b.order)
    .map(([name]) => name);

  const t = (en: string, bn: string) => lang === "bn" ? bn : en;

  const renderHero = () => (
    <section key="hero" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${getImageUrl(data.hero.image)}')` }}
      />
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-l-4 border-orange-500 pl-6 animate-slide-up">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 tracking-tight">
            {t(data.hero.title.en, data.hero.title.bn)}
          </h1>
          <div className="flex items-center text-xs md:text-sm font-bold tracking-widest uppercase text-gray-300 gap-3">
            <span className="text-white">{t(data.hero.subtitle.en, data.hero.subtitle.bn)}</span>
          </div>
          {data.hero.description.en && (
            <p className="mt-4 text-lg text-white/80 max-w-2xl">
              {t(data.hero.description.en, data.hero.description.bn)}
            </p>
          )}
        </div>
      </div>
    </section>
  );

  const renderFeatures = () => (
    <section key="features" className="bg-white/70 backdrop-blur-md border-b border-gray-200/30 shadow-sm relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100/50">
          {data.features.map((f, i) => (
            <div key={i} className="flex items-center gap-3 py-5 px-6 transition hover:bg-white/40">
              <span className="text-2xl text-primary shrink-0 drop-shadow-sm">
                <FeatureIcon name={f.icon} />
              </span>
              <div>
                <p className="font-bold text-gray-800 text-sm leading-tight">{t(f.title.en, f.title.bn)}</p>
                <p className="text-gray-500 text-xs leading-snug">{t(f.description.en, f.description.bn)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const renderSidebar = () => (
    <aside key="sidebar" className="lg:col-span-1 space-y-6">
      {/* Why Choose Us */}
      <div className="glass-card rounded-2xl p-6 border border-white/60 shadow-lg hover-lift">
        <h2 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">
          {t(data.whyChooseUs.title.en, data.whyChooseUs.title.bn)}
        </h2>
        <ul className="space-y-3.5 text-sm text-gray-600">
          {data.whyChooseUs.items.map((item, i) => (
            <li key={i} className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-full bg-secondary/15 text-secondary flex items-center justify-center text-xs font-bold shrink-0">✓</span>
              <span className="font-medium">{t(item.en, item.bn)}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Emergency Banner */}
      <div className="bg-red-50/90 backdrop-blur-sm border border-red-200/50 rounded-2xl p-6 shadow-md hover-lift">
        <p className="text-red-600 font-extrabold text-base mb-1 flex items-center gap-1.5">
          <span className="animate-pulse">🚨</span> {t(data.emergencyBanner.title.en, data.emergencyBanner.title.bn)}
        </p>
        <p className="text-red-500 text-sm mb-4 font-medium">
          {t(data.emergencyBanner.description.en, data.emergencyBanner.description.bn)}
        </p>
        <a
          href={`tel:${data.emergencyBanner.phone}`}
          className="block text-center bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-all duration-200 text-sm shadow-md hover:shadow-lg active:scale-95"
        >
          {t(data.emergencyBanner.buttonText.en, data.emergencyBanner.buttonText.bn)}
        </a>
      </div>

      {/* Contact Card */}
      <div className="gradient-overlay-primary rounded-2xl p-6 text-white shadow-xl relative overflow-hidden hover-lift">
        <div className="absolute inset-0 medical-pattern opacity-10 pointer-events-none" />
        <div className="relative z-10">
          <p className="font-bold text-lg mb-1">{t(data.contactCard.title.en, data.contactCard.title.bn)}</p>
          <p className="text-blue-200 text-sm mb-4 font-light">
            {t(data.contactCard.description.en, data.contactCard.description.bn)}
          </p>
          <a
            href={`tel:${data.contactCard.phone}`}
            className="block text-center bg-white/15 hover:bg-white/25 border border-white/20 text-white font-semibold py-3 rounded-xl transition-all duration-200 text-sm active:scale-95 shadow-inner"
          >
            📞 {data.contactCard.phone}
          </a>
        </div>
      </div>
    </aside>
  );

  const renderForm = () => (
    <div key="form" className="lg:col-span-2 glass-card rounded-2xl p-8 sm:p-10 border border-white/60 shadow-2xl">
      <div className="mb-8 border-b border-gray-100/50 pb-4">
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
          {t(data.formSection.title.en, data.formSection.title.bn)}
        </h2>
        <p className="text-gray-500 text-sm mt-1.5">
          {t(data.formSection.description.en, data.formSection.description.bn)}
        </p>
      </div>
      <Suspense fallback={<div className="text-center py-8 text-gray-400">{lang === "bn" ? "ফর্ম লোড হচ্ছে..." : "Loading form..."}</div>}>
        <AppointmentForm />
      </Suspense>
    </div>
  );

  const hasSidebar = activeSections.includes("sidebar");
  const hasForm = activeSections.includes("form");

  return (
    <div className="min-h-screen flex flex-col">
      {activeSections.includes("hero") && renderHero()}
      {activeSections.includes("features") && renderFeatures()}

      {(hasSidebar || hasForm) && (
        <section className="flex-1 py-16 px-4 sm:px-6 lg:px-8 relative bg-cover bg-center bg-no-repeat">
          <div className="absolute inset-0 bg-slate-50/85 backdrop-blur-[6px]" />
          <div className="relative z-10 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
              {hasSidebar && renderSidebar()}
              {hasForm && renderForm()}
            </div>
          </div>
        </section>
      )}

      {activeSections.includes("form") && (
        <div className="bg-slate-50/80 border-t border-gray-200/20 py-8 px-4 text-center">
          <p className="text-xs text-gray-400 max-w-7xl mx-auto">
            {t(data.disclaimer.en, data.disclaimer.bn)}
          </p>
        </div>
      )}
    </div>
  );
}
