"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiMail, FiPhone } from "react-icons/fi";
import { FaUserMd, FaGraduationCap, FaIdBadge } from "react-icons/fa";
import { BsFillHeartPulseFill } from "react-icons/bs";
import Image from "next/image";
import { getImageUrl } from "@/lib/getImageUrl";
import { useLanguage } from "@/context/LanguageContext";
import type { TeamMember } from "@/hooks/useAboutData";

interface Props {
  member: TeamMember | null;
  isOpen: boolean;
  onClose: () => void;
}

const EmployeeIdCardModal = ({ member, isOpen, onClose }: Props) => {
  const { lang, t } = useLanguage();

  if (!member) return null;

  const employeeId = `MGH-${String(member.order ?? 0).padStart(3, "0")}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="relative w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl z-10"
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 bg-white/90 hover:bg-white text-gray-700 hover:text-black p-2 rounded-full z-20 shadow-md transition-all"
              aria-label={t("Close", "বন্ধ করুন")}
            >
              <FiX size={16} />
            </button>

            <div className="bg-white">
              <div className="bg-gradient-to-r from-primary to-blue-800 px-6 pt-8 pb-6 text-white text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 mb-3">
                  <BsFillHeartPulseFill className="text-2xl text-secondary" />
                </div>
                <h2 className="text-lg font-extrabold tracking-tight">
                  {t("Mirsarai General Hospital", "মীরসরাই জেনারেল হাসপাতাল")}
                </h2>
                <p className="text-xs text-white/70 mt-0.5">
                  {t("Employee Identification Card", "কর্মচারী পরিচয়পত্র")}
                </p>
              </div>

              <div className="relative -mt-12 px-6 text-center">
                <div className="inline-block w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-gray-100">
                  {member.image ? (
                    <Image
                      src={getImageUrl(member.image)}
                      alt={lang === "bn" ? member.name.bn : member.name.en}
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10">
                      <FaUserMd className="text-3xl text-primary/40" />
                    </div>
                  )}
                </div>

                <h3 className="mt-3 text-xl font-extrabold text-primary">
                  {t(member.name.en, member.name.bn)}
                </h3>
                <p className="text-sm font-semibold text-secondary">
                  {t(member.designation.en, member.designation.bn)}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {t(member.department.en, member.department.bn)}
                </p>
              </div>

              <div className="mx-6 mt-4 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-primary/5 border border-primary/10">
                <FaIdBadge className="text-primary/60 text-sm" />
                <span className="text-sm font-bold text-primary tracking-wider">{employeeId}</span>
              </div>

              {(member.email || member.phone) && (
                <div className="mx-6 mt-4 p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-2">
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="flex items-center gap-2 text-xs text-gray-600 hover:text-primary transition-colors"
                    >
                      <FiMail className="text-secondary shrink-0" />
                      <span className="truncate">{member.email}</span>
                    </a>
                  )}
                  {member.phone && (
                    <a
                      href={`tel:${member.phone}`}
                      className="flex items-center gap-2 text-xs text-gray-600 hover:text-primary transition-colors"
                    >
                      <FiPhone className="text-secondary shrink-0" />
                      <span>{member.phone}</span>
                    </a>
                  )}
                </div>
              )}

              {member.qualifications && member.qualifications.length > 0 && (
                <div className="mx-6 mt-4 pb-6">
                  <div className="flex items-center gap-1.5 mb-2">
                    <FaGraduationCap className="text-primary/60 text-xs" />
                    <span className="text-xs font-bold text-primary">
                      {t("Qualifications", "যোগ্যতা")}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {member.qualifications.slice(0, 3).map((q, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-[10px] font-medium border border-blue-100"
                      >
                        {t(q.title.en, q.title.bn)}
                      </span>
                    ))}
                    {member.qualifications.length > 3 && (
                      <span className="px-2.5 py-1 rounded-lg bg-gray-50 text-gray-400 text-[10px] font-medium border border-gray-100">
                        +{member.qualifications.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EmployeeIdCardModal;
