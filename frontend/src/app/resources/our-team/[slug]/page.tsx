"use client";

import { useParams } from "next/navigation";
import { useTeamMemberBySlug } from "@/hooks/useAboutData";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FiArrowLeft, FiMail, FiPhone, FiCalendar } from "react-icons/fi";
import { FaGraduationCap, FaBriefcase, FaStar, FaUserMd, FaUsers, FaGlobe, FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaYoutube } from "react-icons/fa";
import { getImageUrl } from "@/lib/getImageUrl";

const platformIcons: Record<string, React.ReactNode> = {
  facebook: <FaFacebook />,
  twitter: <FaTwitter />,
  linkedin: <FaLinkedin />,
  instagram: <FaInstagram />,
  youtube: <FaYoutube />,
  website: <FaGlobe />,
};

const TeamMemberDetailPage = () => {
  const params = useParams();
  const slug = params?.slug as string;
  const { data: member, isLoading, isError } = useTeamMemberBySlug(slug);
  const { lang, t } = useLanguage();

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

  if (isError || !member) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <FaUserMd className="mx-auto text-6xl text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg font-medium">
            {t("Team member not found.", "টিম সদস্য পাওয়া যায়নি।")}
          </p>
          <Link
            href="/resources/our-team"
            className="mt-4 inline-flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            <FiArrowLeft /> {t("Back to Team", "টিমে ফিরুন")}
          </Link>
        </div>
      </div>
    );
  }

  const memberName = t(member.name.en, member.name.bn);
  const memberDesignation = t(member.designation.en, member.designation.bn);
  const memberDepartment = t(member.department.en, member.department.bn);
  const memberBio = t(member.bio.en, member.bio.bn);

  const hasQualifications = member.qualifications && member.qualifications.length > 0;
  const hasExperience = member.experience && member.experience.length > 0;
  const hasSpecialties = member.specialties && member.specialties.length > 0;
  const hasSocialLinks = member.socialLinks && member.socialLinks.length > 0;

  return (
    <main className="bg-white overflow-hidden">
      {/* Back navigation */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/resources/our-team"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors"
          >
            <FiArrowLeft /> {t("Back to Our Team", "আমাদের টিমে ফিরুন")}
          </Link>
        </div>
      </div>

      {/* Hero Profile Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary/95 to-blue-900">
        <div className="absolute inset-0 medical-pattern opacity-10" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12"
          >
            {/* Profile Image */}
            <div className="relative w-48 h-48 lg:w-64 lg:h-64 rounded-2xl overflow-hidden border-4 border-white/20 shadow-2xl flex-shrink-0">
              {member.image ? (
                <Image
                  src={getImageUrl(member.image)}
                  alt={memberName}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/30">
                  <FaUserMd className="text-6xl text-white/40" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="text-center lg:text-left text-white flex-1">
              <div className="inline-block px-4 py-1.5 rounded-full bg-secondary/20 text-secondary text-xs font-bold mb-4 border border-secondary/30">
                {memberDepartment}
              </div>
              <h1 className="text-3xl lg:text-5xl font-extrabold mb-2">{memberName}</h1>
              <p className="text-xl text-white/80 font-semibold mb-4">{memberDesignation}</p>
              <p className="text-white/60 max-w-2xl leading-relaxed">{memberBio}</p>

              {/* Contact */}
              <div className="flex flex-wrap gap-4 mt-6 justify-center lg:justify-start">
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm transition-colors"
                  >
                    <FiMail /> {member.email}
                  </a>
                )}
                {member.phone && (
                  <a
                    href={`tel:${member.phone}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm transition-colors"
                  >
                    <FiPhone /> {member.phone}
                  </a>
                )}
              </div>

              {/* Social Links */}
              {hasSocialLinks && (
                <div className="flex flex-wrap gap-3 mt-4 justify-center lg:justify-start">
                  {member.socialLinks.map((link, li) => (
                    <a
                      key={li}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs transition-colors"
                      title={link.platform}
                    >
                      {platformIcons[link.platform] || <FaGlobe />}
                      <span className="capitalize">{link.platform}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Details Section — only renders when data exists */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Qualifications + Specialties */}
          <div className="space-y-8">
            {hasQualifications && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 border border-blue-100"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                    <FaGraduationCap className="text-blue-600 text-lg" />
                  </div>
                  <h2 className="text-lg font-extrabold text-primary">
                    {t("Qualifications", "যোগ্যতা")}
                  </h2>
                </div>
                <div className="space-y-4">
                  {member.qualifications.map((q, qi) => (
                    <div key={qi} className="border-l-2 border-blue-200 pl-4">
                      <p className="font-bold text-gray-900">{t(q.title.en, q.title.bn)}</p>
                      <p className="text-sm text-gray-500">{t(q.institution.en, q.institution.bn)}</p>
                      {q.year && <p className="text-xs text-gray-400 mt-1">{q.year}</p>}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {hasSpecialties && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-amber-50 to-white rounded-2xl p-6 border border-amber-100"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                    <FaStar className="text-amber-600 text-lg" />
                  </div>
                  <h2 className="text-lg font-extrabold text-primary">
                    {t("Specialties", "বিশেষত্ব")}
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {member.specialties.map((spec, si) => (
                    <span
                      key={si}
                      className="px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 text-sm font-medium border border-amber-200"
                    >
                      {t(spec.en, spec.bn)}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column (spans 2 cols): Experience */}
          <div className="lg:col-span-2 space-y-8">
            {hasExperience && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl p-6 border border-emerald-100"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <FaBriefcase className="text-emerald-600 text-lg" />
                  </div>
                  <h2 className="text-lg font-extrabold text-primary">
                    {t("Experience", "অভিজ্ঞতা")}
                  </h2>
                </div>
                <div className="space-y-6">
                  {member.experience.map((ex, ei) => (
                    <div key={ei} className="relative pl-8 pb-6 border-l-2 border-emerald-200 last:pb-0">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-emerald-400 border-2 border-white" />
                      <p className="font-bold text-gray-900">{t(ex.title.en, ex.title.bn)}</p>
                      <p className="text-sm text-gray-500">{t(ex.institution.en, ex.institution.bn)}</p>
                      {ex.period && (
                        <p className="inline-flex items-center gap-1 text-xs text-gray-400 mt-1">
                          <FiCalendar /> {ex.period}
                        </p>
                      )}
                      {ex.description && (ex.description.en || ex.description.bn) && (
                        <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                          {t(ex.description.en, ex.description.bn)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Back to Team */}
      <section className="bg-gradient-to-br from-primary via-primary/90 to-blue-900 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <FaUsers className="mx-auto text-4xl text-secondary mb-4" />
          <h2 className="text-3xl font-extrabold text-white mb-4">
            {t("Meet the Rest of Our Team", "আমাদের টিমের বাকি সদস্যদের সাথে পরিচিত হন")}
          </h2>
          <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
            {t(
              "Our dedicated healthcare professionals are here to provide you with the best possible care.",
              "আমাদের নিবেদিতপ্রাণ স্বাস্থ্যসেবা পেশাদাররা আপনাকে সর্বোত্তম সম্ভাব্য সেবা প্রদান করতে এখানে আছেন।"
            )}
          </p>
          <Link
            href="/resources/our-team"
            className="inline-flex items-center gap-3 bg-secondary hover:bg-secondary/90 text-white px-8 py-3.5 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <FiArrowLeft /> {t("View All Team Members", "সকল টিম সদস্য দেখুন")}
          </Link>
        </div>
      </section>
    </main>
  );
};

export default TeamMemberDetailPage;
