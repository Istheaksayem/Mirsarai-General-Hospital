"use client";

import { useOurTeamData, TeamMember } from "@/hooks/useAboutData";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import { FiArrowRight, FiMail, FiPhone, FiEye } from "react-icons/fi";
import { FaUserMd, FaUsers, FaHeartbeat } from "react-icons/fa";
import { BsFillHeartPulseFill } from "react-icons/bs";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getImageUrl } from "@/lib/getImageUrl";
import EmployeeIdCardModal from "@/components/our-team/EmployeeIdCardModal";

const OurTeamPage = () => {
  const { data, isLoading, isError } = useOurTeamData();
  const { lang, t } = useLanguage();
  const [idCardMember, setIdCardMember] = useState<TeamMember | null>(null);

  // SEO meta tag update
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
          <p className="text-primary font-semibold text-lg">{t("Loading...", "লোড হচ্ছে...")}</p>
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
            {t("Failed to load Our Team data.", "আমাদের টিম ডেটা লোড করতে ব্যর্থ হয়েছে।")}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            {t("Retry", "আবার চেষ্টা করুন")}
          </button>
        </div>
      </div>
    );
  }

  // Sort members by order
  const sortedMembers = [...(data.members || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  // Section visibility config
  const sectionConfig = data.sections || {
    hero: { isVisible: true, order: 1 },
    members: { isVisible: true, order: 2 },
    cta: { isVisible: true, order: 3 },
  };

  const activeSections = Object.entries(sectionConfig)
    .filter(([_, cfg]) => cfg.isVisible)
    .sort(([_, a], [__, b]) => a.order - b.order)
    .map(([name]) => name);

  // ── Hero Section ──────────────────────────────────────────────────────────
  const renderHero = () => (
    <section key="hero" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background */}
      {data.hero.image ? (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${getImageUrl(data.hero.image)}')` }}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-blue-900" />
      )}
      <div className="absolute inset-0 bg-black/55" />

      {/* Decorative medical pattern */}
      <div className="absolute inset-0 medical-pattern opacity-20" />

      {/* Animated blobs */}
      <div className="absolute top-20 right-20 w-80 h-80 bg-secondary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-20 w-60 h-60 bg-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="border-l-4 border-secondary pl-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/20 text-secondary text-xs font-bold mb-6 border border-secondary/30">
            <FaUsers className="animate-pulse" />
            <span>{t("Meet Our Team", "আমাদের টিমের সাথে পরিচিত হন")}</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 tracking-tight">
            {t(data.hero.title.en, data.hero.title.bn)}
          </h1>
          <p className="text-xl text-white/80 max-w-2xl leading-relaxed mb-3">
            {t(data.hero.subtitle.en, data.hero.subtitle.bn)}
          </p>
          <p className="text-base text-white/60 max-w-xl leading-relaxed">
            {t(data.hero.description.en, data.hero.description.bn)}
          </p>
        </motion.div>
      </div>
    </section>
  );

  // ── Members Section ───────────────────────────────────────────────────────
  const renderMembers = () => (
    <section key="members" className="relative py-24 px-4 bg-gradient-to-br from-white via-blue-50/20 to-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 medical-pattern opacity-30" />
      <div className="absolute top-20 right-10 w-96 h-96 bg-secondary/8 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-primary/8 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6">
            <FaUserMd className="animate-pulse" />
            <span>{t("Our Dedicated Professionals", "আমাদের নিবেদিতপ্রাণ পেশাদার")}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-primary mb-6">
            {t(data.sectionTitle.en, data.sectionTitle.bn)}
          </h2>
          <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
            {t(data.sectionDescription.en, data.sectionDescription.bn)}
          </p>
        </motion.div>

        {/* Team Members Grid */}
        {sortedMembers.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <FaUsers className="mx-auto text-6xl mb-4 opacity-30" />
            <p className="text-lg">{t("Team members will appear here.", "টিম সদস্যরা এখানে প্রদর্শিত হবে।")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedMembers.map((member: TeamMember, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group relative"
              >
                <div className="glass-card rounded-3xl p-0 overflow-hidden hover-lift border-2 border-gray-100 hover:border-secondary/30 transition-all duration-300 shadow-md hover:shadow-xl flex flex-col sm:flex-row">
                  {/* Image Area */}
                  <div className="relative w-full sm:w-48 aspect-[3/4] sm:aspect-auto bg-gradient-to-br from-primary/10 to-blue-100 shrink-0">
                    {member.image ? (
                      <Image
                        src={getImageUrl(member.image)}
                        alt={lang === "bn" ? member.name.bn : member.name.en}
                        fill
                        className="object-cover sm:object-cover transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, 12rem"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <FaUserMd className="text-6xl text-primary/30" />
                      </div>
                    )}
                    {/* Department badge */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="inline-block px-3 py-1 rounded-full bg-secondary text-white text-xs font-bold shadow-lg">
                        {t(member.department.en, member.department.bn)}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 p-6">
                    <h3 className="text-xl font-extrabold text-primary mb-1 group-hover:text-secondary transition-colors">
                      {t(member.name.en, member.name.bn)}
                    </h3>
                    <p className="text-sm font-semibold text-secondary mb-3">
                      {t(member.designation.en, member.designation.bn)}
                    </p>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                      {t(member.bio.en, member.bio.bn)}
                    </p>

                    {/* Contact */}
                    {(member.email || member.phone) && (
                      <div className="flex flex-wrap gap-3 pt-3 border-t border-gray-100">
                        {member.email && (
                          <a
                            href={`mailto:${member.email}`}
                            className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-primary transition-colors"
                          >
                            <FiMail className="text-secondary" />
                            <span className="truncate max-w-[130px]">{member.email}</span>
                          </a>
                        )}
                        {member.phone && (
                          <a
                            href={`tel:${member.phone}`}
                            className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-primary transition-colors"
                          >
                            <FiPhone className="text-secondary" />
                            <span>{member.phone}</span>
                          </a>
                        )}
                      </div>
                    )}

                    {/* View ID action */}
                    <button
                      onClick={() => setIdCardMember(member)}
                      className="mt-4 w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-secondary/5 hover:bg-secondary/10 text-secondary text-sm font-semibold transition-colors"
                    >
                      <FiEye className="h-4 w-4" />
                      {t("View ID", "ভিউ আইডি")}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );

  // ── CTA Section ───────────────────────────────────────────────────────────
  const renderCTA = () => (
    <section key="cta" className="relative py-24 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-blue-900" />
      <div className="absolute inset-0 medical-pattern opacity-20" />
      <div className="absolute top-10 left-10 w-72 h-72 bg-secondary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full glass-card-dark mb-8">
            <FaHeartbeat className="text-secondary text-4xl animate-pulse" />
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight text-shadow-strong">
            {t("Join Our Healthcare Family", "আমাদের স্বাস্থ্যসেবা পরিবারে যোগ দিন")}
          </h2>
          <p className="text-white/85 text-xl leading-relaxed mb-10">
            {t(
              "Our team of dedicated professionals is here to provide you with the highest quality care.",
              "আমাদের নিবেদিতপ্রাণ পেশাদারদের টিম আপনাকে সর্বোচ্চ মানের সেবা প্রদান করতে এখানে আছেন।"
            )}
          </p>
          <div className="flex flex-wrap gap-5 justify-center">
            <a
              href="/appointment"
              className="inline-flex items-center gap-3 bg-secondary hover:bg-secondary/90 text-white px-10 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
            >
              <BsFillHeartPulseFill className="text-xl" />
              {t("Book an Appointment", "অ্যাপয়েন্টমেন্ট বুক করুন")}
              <FiArrowRight className="text-xl group-hover:translate-x-2 transition-transform" />
            </a>
            <a
              href="/about/career"
              className="inline-flex items-center gap-3 bg-white/15 hover:bg-white/25 text-white border border-white/30 px-10 py-4 rounded-full font-bold text-lg shadow-lg transition-all duration-300 hover:-translate-y-2"
            >
              {t("Join Our Team", "আমাদের টিমে যোগ দিন")}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );

  return (
    <main className="bg-white overflow-hidden">
      {activeSections.map((sectionName) => {
        switch (sectionName) {
          case "hero": return renderHero();
          case "members": return renderMembers();
          case "cta": return renderCTA();
          default: return null;
        }
      })}

      <EmployeeIdCardModal
        member={idCardMember}
        isOpen={!!idCardMember}
        onClose={() => setIdCardMember(null)}
      />
    </main>
  );
};

export default OurTeamPage;
