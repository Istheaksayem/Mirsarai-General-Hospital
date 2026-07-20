"use client";

import React, { useEffect } from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaPaperPlane } from "react-icons/fa";
import { useContactData } from "@/hooks/useContactData";
import { useLanguage } from "@/context/LanguageContext";
import { getImageUrl } from "@/lib/getImageUrl";

export default function ContactPage() {
  const { data, isLoading, isError } = useContactData();
  const { lang, t } = useLanguage();

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-red-500 bg-gray-50 pt-24 pb-20">
        <div className="text-6xl mb-4">⚠️</div>
        <p className="text-lg font-medium">{t("Failed to load Contact data.", "যোগাযোগের ডেটা লোড করতে ব্যর্থ হয়েছে।")}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          {t("Retry", "আবার চেষ্টা করুন")}
        </button>
      </div>
    );
  }

  const sectionConfig = data.sections || {
    hero: { isVisible: true, order: 1 },
    contactInfo: { isVisible: true, order: 2 },
    form: { isVisible: true, order: 3 },
  };

  const activeSections = Object.entries(sectionConfig)
    .filter(([_, cfg]) => cfg.isVisible)
    .sort(([_, a], [__, b]) => a.order - b.order)
    .map(([name]) => name);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header Section (Banner) */}
      {activeSections.includes("hero") && (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden mb-16">
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
            </div>
            <p className="text-gray-300 max-w-2xl text-lg mt-6 pl-6">
              {t(data.hero.description.en, data.hero.description.bn)}
            </p>
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8">

          {/* Contact Information Cards */}
          {activeSections.includes("contactInfo") && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-secondary pl-4">
                {t(data.contactInfo.title.en, data.contactInfo.title.bn)}
              </h2>

              {/* Address Card */}
              <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_25px_rgba(30,43,122,0.1)] transition-all duration-300 border border-gray-100 flex items-start group">
                <div className="bg-primary/5 p-4 rounded-full text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300 mr-6 mt-1">
                  <FaMapMarkerAlt className="text-2xl" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4">
                    {t(data.contactInfo.addressCard.label.en, data.contactInfo.addressCard.label.bn)}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-700 leading-relaxed">
                        <strong className="text-primary block text-[15px] mb-1">
                          {t(data.contactInfo.addressCard.name.en, data.contactInfo.addressCard.name.bn)}
                        </strong>
                        {t(data.contactInfo.addressCard.location.en, data.contactInfo.addressCard.location.bn)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hotline Card */}
              <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_25px_rgba(118,188,33,0.1)] transition-all duration-300 border border-gray-100 flex items-start group">
                <div className="bg-secondary/10 p-4 rounded-full text-secondary group-hover:bg-secondary group-hover:text-white transition-colors duration-300 mr-6">
                  <FaPhoneAlt className="text-2xl" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {t(data.contactInfo.hotlineCard.label.en, data.contactInfo.hotlineCard.label.bn)}
                  </h3>
                  <p className="text-gray-600 text-lg font-medium">
                    {data.contactInfo.hotlineCard.number}{" "}
                    <span className="text-gray-400 text-sm ml-2 font-normal">
                      {t(data.contactInfo.hotlineCard.numberLabel.en, data.contactInfo.hotlineCard.numberLabel.bn)}
                    </span>
                  </p>
                </div>
              </div>

              {/* Email Card */}
              <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_25px_rgba(0,188,212,0.1)] transition-all duration-300 border border-gray-100 flex items-start group">
                <div className="bg-tertiary/10 p-4 rounded-full text-tertiary group-hover:bg-tertiary group-hover:text-white transition-colors duration-300 mr-6">
                  <FaEnvelope className="text-2xl" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {t(data.contactInfo.emailCard.label.en, data.contactInfo.emailCard.label.bn)}
                  </h3>
                  <a
                    href={`mailto:${data.contactInfo.emailCard.address}`}
                    className="text-gray-600 hover:text-tertiary transition-colors duration-300 break-all text-lg"
                  >
                    {data.contactInfo.emailCard.address}
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Contact Form */}
          {activeSections.includes("form") && (
            <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-gray-50 relative overflow-hidden h-fit">
              <div className="absolute top-0 right-0 w-40 h-40 bg-secondary/10 rounded-full blur-3xl -mr-20 -mt-20" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-tertiary/10 rounded-full blur-3xl -ml-20 -mb-20" />

              <h2 className="text-2xl font-bold text-gray-800 mb-2 relative z-10">
                {t(data.form.title.en, data.form.title.bn)}
              </h2>
              <p className="text-gray-500 text-sm mb-6 relative z-10">
                {t(data.form.description.en, data.form.description.bn)}
              </p>

              <form className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      {t(data.form.fields.name.label.en, data.form.fields.name.label.bn)}
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                      placeholder={t(data.form.fields.name.placeholder.en, data.form.fields.name.placeholder.bn)}
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      {t(data.form.fields.phone.label.en, data.form.fields.phone.label.bn)}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                      placeholder={t(data.form.fields.phone.placeholder.en, data.form.fields.phone.placeholder.bn)}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    {t(data.form.fields.email.label.en, data.form.fields.email.label.bn)}
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                    placeholder={t(data.form.fields.email.placeholder.en, data.form.fields.email.placeholder.bn)}
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    {t(data.form.fields.message.label.en, data.form.fields.message.label.bn)}
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none transition-all duration-300 bg-gray-50 focus:bg-white resize-none"
                    placeholder={t(data.form.fields.message.placeholder.en, data.form.fields.message.placeholder.bn)}
                  />
                </div>

                <button
                  type="button"
                  className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-4 rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-2 group"
                >
                  <span>{t(data.form.buttonText.en, data.form.buttonText.bn)}</span>
                  <FaPaperPlane className="group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
