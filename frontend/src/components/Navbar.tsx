"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiMenu, FiX, FiUser, FiChevronDown } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

// ── Nav data ──────────────────────────────────────────────────────────────────
type NavLink = { en: string; bn: string; href: string };
type NavItem =
  | { type: "link"; en: string; bn: string; href: string }
  | { type: "dropdown"; en: string; bn: string; links: NavLink[] };

const NAV_ITEMS: NavItem[] = [
  { type: "link", en: "Home", bn: "হোম", href: "/" },
  { type: "link", en: "Doctors", bn: "ডাক্তার", href: "/doctors" },
  {
    type: "dropdown",
    en: "Services",
    bn: "সেবাসমূহ",
    links: [
      { en: "All Services", bn: "সকল সেবা", href: "/services" },
      { en: "Diagnostic Services", bn: "ডায়াগনস্টিক সেবা", href: "/services/diagnostic" },
      { en: "NICU & Baby Care", bn: "এনআইসিইউ ও শিশু সেবা", href: "/services/nicu" },
    ],
  },
  {
    type: "dropdown",
    en: "About",
    bn: "আমাদের সম্পর্কে",
    links: [
      { en: "About Us", bn: "আমাদের পরিচয়", href: "/about" },
      { en: "Mission & Vision", bn: "লক্ষ্য ও দর্শন", href: "/about/mission-vision" },
      { en: "Gallery", bn: "গ্যালারি", href: "/about/gallery" },
      { en: "Career", bn: "ক্যারিয়ার", href: "/about/career" },
    ],
  },
  { type: "link", en: "Departments", bn: "বিভাগসমূহ", href: "/departments" },
  {
    type: "dropdown",
    en: "Resources",
    bn: "রিসোর্স",
    links: [
      { en: "Health Blog", bn: "স্বাস্থ্য ব্লগ", href: "/resources/health-blog" },
      { en: "Emergency Info", bn: "জরুরি তথ্য", href: "/resources/emergency-info" },
      { en: "FAQ", bn: "প্রশ্নোত্তর", href: "/resources/faq" },
      { en: "Our Team", bn: "আমাদের টিম", href: "/resources/our-team" },
    ],
  },
  { type: "link", en: "Appointment", bn: "অ্যাপয়েন্টমেন্ট", href: "/appointment" },
  { type: "link", en: "Contact", bn: "যোগাযোগ", href: "/contact" },
];

// ── Language Toggle ───────────────────────────────────────────────────────────
function LangToggle() {
  const { lang, toggleLang } = useLanguage();
  return (
    <button
      onClick={toggleLang}
      aria-label="Toggle language"
      className="relative inline-flex h-8 w-[68px] items-center rounded-full border border-gray-200 bg-gray-100 px-1 transition-colors hover:border-[#3b82f6]/50 focus:outline-none"
    >
      {/* sliding pill */}
      <span
        className={[
          "absolute h-6 w-[30px] rounded-full bg-[#3b82f6] shadow transition-all duration-300",
          lang === "en" ? "left-1" : "left-[34px]",
        ].join(" ")}
      />
      <span
        className={[
          "relative z-10 w-[30px] text-center text-[11px] font-bold transition-colors duration-200",
          lang === "en" ? "text-white" : "text-gray-500",
        ].join(" ")}
      >
        EN
      </span>
      <span
        className={[
          "relative z-10 w-[30px] text-center text-[11px] font-bold transition-colors duration-200",
          lang === "bn" ? "text-white" : "text-gray-500",
        ].join(" ")}
      >
        বাং
      </span>
    </button>
  );
}

// ── Desktop Dropdown ──────────────────────────────────────────────────────────
function DesktopDropdown({ label, links }: { label: string; links: NavLink[] }) {
  const [open, setOpen] = useState(false);
  const timer = useRef<NodeJS.Timeout | null>(null);
  const { lang } = useLanguage();

  const open_ = () => { if (timer.current) clearTimeout(timer.current); setOpen(true); };
  const close_ = () => { timer.current = setTimeout(() => setOpen(false), 250); };
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  return (
    <div className="relative flex items-center h-full" onMouseEnter={open_} onMouseLeave={close_}>
      <button className="flex items-center gap-1 px-4 py-2 rounded-full text-[#4e5b6f] font-semibold text-[15px] hover:bg-blue-50 hover:text-[#3b82f6] transition-all duration-200">
        {label}
        <FiChevronDown
          size={14}
          className={["transition-transform duration-200", open ? "rotate-180" : ""].join(" ")}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
            className="absolute top-full left-0 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.10)] border border-gray-100 py-2 z-50"
          >
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 px-5 py-2.5 text-[14px] text-[#4e5b6f] font-semibold hover:text-[#3b82f6] hover:bg-blue-50/60 hover:pl-6 transition-all duration-200"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#3b82f6]/40 shrink-0" />
                {lang === "bn" ? item.bn : item.en}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Mobile Dropdown ───────────────────────────────────────────────────────────
function MobileDropdown({ label, links }: { label: string; links: NavLink[] }) {
  const [open, setOpen] = useState(false);
  const { lang } = useLanguage();

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2.5 text-[#4e5b6f] hover:text-[#3b82f6] hover:bg-gray-50 rounded-xl font-semibold transition-colors"
      >
        <span>{label}</span>
        <FiChevronDown
          size={16}
          className={["transition-transform duration-200", open ? "rotate-180" : ""].join(" ")}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden ml-3 border-l-2 border-[#3b82f6]/20 pl-3 mt-1 space-y-0.5"
          >
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-3 py-2 text-[14px] text-gray-600 hover:text-[#3b82f6] hover:bg-blue-50/60 rounded-lg font-medium transition-colors"
              >
                {lang === "bn" ? item.bn : item.en}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main Navbar ───────────────────────────────────────────────────────────────
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { lang, t } = useLanguage();

  // close mobile menu on resize to desktop
  useEffect(() => {
    const handler = () => { if (window.innerWidth >= 1280) setIsOpen(false); };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px] gap-4">

          {/* ── Logo ── */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2.5 group">
            <div className="relative h-10 w-10 rounded-xl overflow-hidden border border-gray-100 shadow-sm">
              <Image
                src="/genaral_Hospital_logo.jpeg"
                alt="Mirsarai General Hospital"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="hidden sm:block leading-tight">
              <p className="text-[13px] font-extrabold text-[#1E2B7A] group-hover:text-[#3b82f6] transition-colors leading-none">
                {t("Mirsarai", "মীরসরাই")}
              </p>
              <p className="text-[11px] font-semibold text-gray-400 leading-none mt-0.5">
                {t("General Hospital", "জেনারেল হাসপাতাল")}
              </p>
            </div>
          </Link>

          {/* ── Desktop nav links (center) ── */}
          <div className="hidden xl:flex flex-1 justify-center items-center h-full gap-1">
            {NAV_ITEMS.map((item, idx) => (
              <React.Fragment key={item.en}>
                {item.type === "dropdown" ? (
                  <DesktopDropdown
                    label={lang === "bn" ? item.bn : item.en}
                    links={item.links}
                  />
                ) : (
                  <Link
                    href={item.href}
                    className="px-4 py-2 rounded-full text-[#4e5b6f] font-semibold text-[15px] hover:bg-blue-50 hover:text-[#3b82f6] transition-all duration-200 whitespace-nowrap"
                  >
                    {lang === "bn" ? item.bn : item.en}
                  </Link>
                )}
                {idx < NAV_ITEMS.length - 1 && item.type === "dropdown" && (
                  <span className="text-primary font-bold text-[16px] leading-none select-none">•</span>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* ── Desktop right actions ── */}
          <div className="hidden xl:flex items-center gap-4 flex-shrink-0">
            {/* Language toggle */}
            <LangToggle />

            {/* User / Login */}
            <Link
              href="/login"
              className="flex items-center gap-2 group"
            >
              <div className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden group-hover:border-[#3b82f6] transition-colors">
                <FiUser size={20} className="text-gray-400 mt-1.5" />
              </div>
              <span className="text-[#4e5b6f] font-semibold text-[15px] group-hover:text-[#3b82f6] transition-colors">
                {t("Login", "লগইন")}
              </span>
            </Link>


          </div>

          {/* ── Mobile right (lang toggle + hamburger) ── */}
          <div className="xl:hidden flex items-center gap-3">
            <LangToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              className="text-gray-700 hover:text-[#3b82f6] bg-gray-50 hover:bg-blue-50 p-2 rounded-xl transition-colors"
            >
              {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="xl:hidden overflow-hidden bg-white border-t border-gray-100 shadow-lg"
          >
            <div className="px-4 pt-3 pb-6 space-y-1 max-h-[80vh] overflow-y-auto">
              {NAV_ITEMS.map((item) =>
                item.type === "dropdown" ? (
                  <MobileDropdown
                    key={item.en}
                    label={lang === "bn" ? item.bn : item.en}
                    links={item.links}
                  />
                ) : (
                  <Link
                    key={item.en}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2.5 text-[#4e5b6f] hover:text-[#3b82f6] hover:bg-blue-50/60 rounded-xl font-semibold transition-colors"
                  >
                    {lang === "bn" ? item.bn : item.en}
                  </Link>
                )
              )}

              {/* Mobile auth */}
              <div className="border-t border-gray-100 mt-3 pt-4 space-y-3 px-1">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-[#4e5b6f] hover:text-[#3b82f6] hover:bg-blue-50/60 rounded-xl font-semibold transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
                    <FiUser size={20} className="text-gray-400 mt-1.5" />
                  </div>
                  {t("Login", "লগইন")}
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="block text-center border-2 border-[#3b82f6] bg-[#3b82f6] text-white px-4 py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors w-full"
                >
                  {t("Join Now", "যোগ দিন")}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
