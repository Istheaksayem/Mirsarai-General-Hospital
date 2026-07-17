"use client";

import React from "react";
import {
  FaFacebookF, FaYoutube, FaInstagram,
  FaPhoneAlt, FaEnvelope, FaMapMarkerAlt,
  FaHeartbeat, FaArrowRight,
} from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

const Footer = () => {
  const { lang } = useLanguage();
  const t = (en: string, bn: string) => lang === "bn" ? bn : en;

  const exploreLinks = [
    { en: "Home",         bn: "হোম",             href: "/" },
    { en: "About Us",     bn: "আমাদের সম্পর্কে",  href: "/about" },
    { en: "Services",     bn: "সেবাসমূহ",         href: "/services/diagnostic" },
    { en: "Our Doctors",  bn: "আমাদের ডাক্তার",   href: "/doctors" },
    { en: "Appointments", bn: "অ্যাপয়েন্টমেন্ট",  href: "/appointment" },
    { en: "Contact Us",   bn: "যোগাযোগ",          href: "/contact" },
  ];

  const departments = [
    { en: "Cardiology",       bn: "কার্ডিওলজি" },
    { en: "Neurology",        bn: "নিউরোলজি" },
    { en: "Orthopedics",      bn: "অর্থোপেডিক্স" },
    { en: "Pediatrics",       bn: "শিশুরোগ" },
    { en: "General Surgery",  bn: "সাধারণ অস্ত্রোপচার" },
    { en: "Diagnostic Lab",   bn: "ডায়াগনস্টিক ল্যাব" },
  ];

  return (
    <footer className="relative bg-primary text-white pt-20 pb-10 overflow-hidden">
      {/* Wave top */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-0">
        <svg
          className="relative block w-full h-[30px] md:h-[60px]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="fill-background"
          />
        </svg>
      </div>

      {/* Decorative blobs */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#76BC21]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mt-10 md:mt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">

          {/* Brand & About */}
          <div className="lg:col-span-4">
            <div className="bg-white/95 inline-block p-3 rounded-xl mb-6 shadow-lg border border-white/20 hover:scale-105 transition-transform duration-300">
              <img src="/genaral_Hospital_logo.jpeg" alt="Hospital Logo" className="h-14 w-auto rounded-md" />
            </div>
            <p className="text-gray-300 mb-8 font-light leading-relaxed text-sm pr-4">
              {t(
                "Committed to providing compassionate care and advanced medical solutions. We combine state-of-the-art technology with human empathy, because your health is our top priority.",
                "সহানুভূতিশীল সেবা এবং উন্নত চিকিৎসা সমাধান প্রদানে প্রতিশ্রুতিবদ্ধ। আমরা অত্যাধুনিক প্রযুক্তির সাথে মানবিক সহানুভূতি যুক্ত করি, কারণ আপনার স্বাস্থ্যই আমাদের সর্বোচ্চ অগ্রাধিকার।"
              )}
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/mirsaraigeneralhospital"
                className="group w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-blue-500 hover:border-blue-500 transition-all duration-300">
                <FaFacebookF className="text-gray-300 group-hover:text-white" />
              </a>
              <a href="#"
                className="group w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-red-500 hover:border-red-500 transition-all duration-300">
                <FaYoutube className="text-gray-300 group-hover:text-white" />
              </a>
              <a href="#"
                className="group w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-pink-500 hover:border-pink-500 transition-all duration-300">
                <FaInstagram className="text-gray-300 group-hover:text-white" />
              </a>
            </div>
          </div>

          {/* Explore Links */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-bold mb-6 text-white flex items-center">
              <span className="w-8 h-[2px] bg-[#76BC21] mr-3 rounded-full" />
              {t("Explore", "এক্সপ্লোর")}
            </h3>
            <ul className="space-y-4 text-sm text-gray-300">
              {exploreLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="group flex items-center hover:text-[#76BC21] transition-colors duration-300">
                    <FaArrowRight className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 text-[#76BC21] text-xs mr-2 transition-all duration-300" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {lang === "bn" ? item.bn : item.en}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Departments */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-bold mb-6 text-white flex items-center">
              <span className="w-8 h-[2px] bg-white/40 mr-3 rounded-full" />
              {t("Departments", "বিভাগসমূহ")}
            </h3>
            <ul className="space-y-4 text-sm text-gray-300">
              {departments.map((dept) => (
                <li key={dept.en}>
                  <Link href="/departments" className="group flex items-center hover:text-white transition-colors duration-300">
                    <FaArrowRight className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 text-white/60 text-xs mr-2 transition-all duration-300" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {lang === "bn" ? dept.bn : dept.en}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-4">
            <h3 className="text-lg font-bold mb-6 text-white flex items-center">
              <span className="w-8 h-[2px] bg-gradient-to-r from-[#76BC21] to-white/40 mr-3 rounded-full" />
              {t("Get In Touch", "যোগাযোগ করুন")}
            </h3>

            <ul className="space-y-4 text-sm text-gray-300 mb-8">
              <li className="flex items-start group">
                <div className="mt-1 mr-4 p-2 rounded-full bg-white/5 text-[#76BC21] group-hover:bg-[#76BC21] group-hover:text-white transition-all duration-300">
                  <FaMapMarkerAlt size={14} />
                </div>
                <span className="leading-relaxed">
                  <strong className="text-white block mb-1">
                    {t("Mirsarai General Hospital", "মীরসরাই জেনারেল হাসপাতাল")}
                  </strong>
                  {t(
                    "Opposite the Police Station, Mirsarai Pouroshava, Chittagong.",
                    "পুলিশ স্টেশনের বিপরীতে, মীরসরাই পৌরসভা, চট্টগ্রাম।"
                  )}
                </span>
              </li>
              <li className="flex items-center group">
                <div className="mr-4 p-2 rounded-full bg-white/5 text-white/60 group-hover:bg-white/20 group-hover:text-white transition-all duration-300">
                  <FaPhoneAlt size={14} />
                </div>
                <span className="group-hover:text-white transition-colors duration-300">+8801969-997799</span>
              </li>
              <li className="flex items-center group">
                <div className="mr-4 p-2 rounded-full bg-white/5 text-white/60 group-hover:bg-white/20 group-hover:text-white transition-all duration-300">
                  <FaEnvelope size={14} />
                </div>
                <span className="group-hover:text-white transition-colors duration-300">
                  mirsaraigeneralhospital@gmail.com
                </span>
              </li>
            </ul>

            {/* Emergency card */}
            <div className="relative group overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 hover:border-[#76BC21]/50 transition-all duration-500">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#76BC21]/20 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-[#76BC21]/40 transition-colors duration-500" />
              <div className="flex items-center relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-[#76BC21] to-green-600 rounded-full flex items-center justify-center mr-4 shadow-lg shadow-[#76BC21]/30 animate-pulse">
                  <FaHeartbeat className="text-white text-xl" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">
                    {t("24/7 Emergency", "২৪/৭ জরুরি সেবা")}
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-white tracking-tight group-hover:text-[#76BC21] transition-colors duration-300">
                    +01969-997799
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 pb-4">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <p className="text-gray-400 text-sm text-center lg:text-left order-2 lg:order-1">
              &copy; {new Date().getFullYear()}{" "}
              <span className="text-white font-medium">
                {t("Mirsarai General Hospital", "মীরসরাই জেনারেল হাসপাতাল")}
              </span>
              {". "}
              {t("All Rights Reserved.", "সর্বস্বত্ব সংরক্ষিত।")}
            </p>
            <div className="flex space-x-6 text-sm text-gray-400 order-1 lg:order-2">
              <Link href="/privacy"
                className="hover:text-[#76BC21] transition-colors duration-300 relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[1px] after:bg-[#76BC21] hover:after:w-full after:transition-all after:duration-300">
                {t("Privacy Policy", "গোপনীয়তা নীতি")}
              </Link>
              <Link href="/terms"
                className="hover:text-white transition-colors duration-300 relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[1px] after:bg-white hover:after:w-full after:transition-all after:duration-300">
                {t("Terms of Service", "সেবার শর্তাবলী")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
