"use client";

import React from "react";
import {
  FaFacebookF, FaYoutube, FaInstagram,
  FaPhoneAlt, FaEnvelope, FaMapMarkerAlt,
  FaHeartbeat, FaArrowRight,
} from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";
import { useFooterData, FooterData } from "@/hooks/useFooterData";
import { getImageUrl } from "@/lib/getImageUrl";
import Link from "next/link";

const iconMap: Record<string, React.ReactNode> = {
  FaFacebookF: <FaFacebookF />,
  FaYoutube: <FaYoutube />,
  FaInstagram: <FaInstagram />,
  FaPhoneAlt: <FaPhoneAlt />,
  FaEnvelope: <FaEnvelope />,
  FaMapMarkerAlt: <FaMapMarkerAlt />,
  FaHeartbeat: <FaHeartbeat />,
};

const hoverColorMap: Record<string, string> = {
  "bg-blue-500": "hover:bg-blue-500 hover:border-blue-500",
  "bg-red-500": "hover:bg-red-500 hover:border-red-500",
  "bg-pink-500": "hover:bg-pink-500 hover:border-pink-500",
};

const FALLBACK: FooterData = {
  brand: {
    logo: "/genaral_Hospital_logo.jpeg",
    description: {
      en: "Committed to providing compassionate care and advanced medical solutions. We combine state-of-the-art technology with human empathy, because your health is our top priority.",
      bn: "সহানুভূতিশীল সেবা এবং উন্নত চিকিৎসা সমাধান প্রদানে প্রতিশ্রুতিবদ্ধ। আমরা অত্যাধুনিক প্রযুক্তির সাথে মানবিক সহানুভূতি যুক্ত করি, কারণ আপনার স্বাস্থ্যই আমাদের সর্বোচ্চ অগ্রাধিকার।"
    },
    socialLinks: [
      { platform: "facebook", icon: "FaFacebookF", url: "https://www.facebook.com/mirsaraigeneralhospital", hoverColor: "bg-blue-500" },
      { platform: "youtube", icon: "FaYoutube", url: "#", hoverColor: "bg-red-500" },
      { platform: "instagram", icon: "FaInstagram", url: "#", hoverColor: "bg-pink-500" }
    ]
  },
  exploreLinks: {
    title: { en: "Explore", bn: "এক্সপ্লোর" },
    links: [
      { label: { en: "Home", bn: "হোম" }, href: "/" },
      { label: { en: "About Us", bn: "আমাদের সম্পর্কে" }, href: "/about" },
      { label: { en: "Services", bn: "সেবাসমূহ" }, href: "/services/diagnostic" },
      { label: { en: "Our Doctors", bn: "আমাদের ডাক্তার" }, href: "/doctors" },
      { label: { en: "Appointments", bn: "অ্যাপয়েন্টমেন্ট" }, href: "/appointment" },
      { label: { en: "Contact Us", bn: "যোগাযোগ" }, href: "/contact" }
    ]
  },
  departments: {
    title: { en: "Departments", bn: "বিভাগসমূহ" },
    items: [
      { name: { en: "Cardiology", bn: "কার্ডিওলজি" }, href: "/departments" },
      { name: { en: "Neurology", bn: "নিউরোলজি" }, href: "/departments" },
      { name: { en: "Orthopedics", bn: "অর্থোপেডিক্স" }, href: "/departments" },
      { name: { en: "Pediatrics", bn: "শিশুরোগ" }, href: "/departments" },
      { name: { en: "General Surgery", bn: "সাধারণ অস্ত্রোপচার" }, href: "/departments" },
      { name: { en: "Diagnostic Lab", bn: "ডায়াগনস্টিক ল্যাব" }, href: "/departments" }
    ]
  },
  contactInfo: {
    title: { en: "Get In Touch", bn: "যোগাযোগ করুন" },
    address: {
      icon: "FaMapMarkerAlt",
      hospitalName: { en: "Mirsarai General Hospital", bn: "মীরসরাই জেনারেল হাসপাতাল" },
      location: {
        en: "Opposite the Police Station, Mirsarai Pouroshava, Chittagong.",
        bn: "পুলিশ স্টেশনের বিপরীতে, মীরসরাই পৌরসভা, চট্টগ্রাম।"
      }
    },
    phone: { icon: "FaPhoneAlt", number: "+8801969-997799" },
    email: { icon: "FaEnvelope", address: "mirsaraigeneralhospital@gmail.com" }
  },
  emergencyCard: {
    icon: "FaHeartbeat",
    label: { en: "24/7 Emergency", bn: "২৪/৭ জরুরি সেবা" },
    phoneNumber: "+01969-997799",
    gradient: "from-[#76BC21] to-green-600",
    badgeGradient: "from-white/10 to-white/5",
    blobColor: "bg-[#76BC21]/20",
    iconGradient: "from-[#76BC21] to-green-600"
  },
  bottomBar: {
    hospitalName: { en: "Mirsarai General Hospital", bn: "মীরসরাই জেনারেল হাসপাতাল" },
    rightsText: { en: "All Rights Reserved.", bn: "সর্বস্বত্ব সংরক্ষিত।" },
    privacyPolicy: { label: { en: "Privacy Policy", bn: "গোপনীয়তা নীতি" }, href: "/privacy" },
    termsOfService: { label: { en: "Terms of Service", bn: "সেবার শর্তাবলী" }, href: "/terms" }
  },
  sections: {
    brand: { isVisible: true, order: 1 },
    exploreLinks: { isVisible: true, order: 2 },
    departments: { isVisible: true, order: 3 },
    contactInfo: { isVisible: true, order: 4 },
    emergencyCard: { isVisible: true, order: 5 },
    bottomBar: { isVisible: true, order: 6 }
  }
};

const Footer = () => {
  const { data: cmsData, isError } = useFooterData();
  const data = isError || !cmsData ? FALLBACK : cmsData;
  const { lang } = useLanguage();
  const t = (en: string, bn: string) => lang === "bn" ? bn : en;
  const tBi = (val: { en: string; bn: string }) => lang === "bn" ? val.bn : val.en;
  const s = (key: string) => data.sections?.[key]?.isVisible !== false;

  const renderIcon = (name: string, className?: string) => {
    const icon = iconMap[name];
    if (!icon) return <FaArrowRight className={className} />;
    return React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className });
  };

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
          {s("brand") && (
            <div className="lg:col-span-4">
              <div className="bg-white/95 inline-block p-3 rounded-xl mb-6 shadow-lg border border-white/20 hover:scale-105 transition-transform duration-300">
                <img src={getImageUrl(data.brand.logo)} alt="Hospital Logo" className="h-14 w-auto rounded-md" />
              </div>
              <p className="text-gray-300 mb-8 font-light leading-relaxed text-sm pr-4">
                {tBi(data.brand.description)}
              </p>
              <div className="flex space-x-4">
                {data.brand.socialLinks.map((link, i) => (
                  <a key={i}
                    href={link.url}
                    className={`group w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300 ${hoverColorMap[link.hoverColor] || "hover:bg-gray-500 hover:border-gray-500"}`}
                  >
                    <span className="text-gray-300 group-hover:text-white">
                      {renderIcon(link.icon, "")}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Explore Links */}
          {s("exploreLinks") && (
            <div className="lg:col-span-2">
              <h3 className="text-lg font-bold mb-6 text-white flex items-center">
                <span className="w-8 h-[2px] bg-[#76BC21] mr-3 rounded-full" />
                {tBi(data.exploreLinks.title)}
              </h3>
              <ul className="space-y-4 text-sm text-gray-300">
                {data.exploreLinks.links.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="group flex items-center hover:text-[#76BC21] transition-colors duration-300">
                      <FaArrowRight className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 text-[#76BC21] text-xs mr-2 transition-all duration-300" />
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {tBi(item.label)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Departments */}
          {s("departments") && (
            <div className="lg:col-span-2">
              <h3 className="text-lg font-bold mb-6 text-white flex items-center">
                <span className="w-8 h-[2px] bg-white/40 mr-3 rounded-full" />
                {tBi(data.departments.title)}
              </h3>
              <ul className="space-y-4 text-sm text-gray-300">
                {data.departments.items.map((dept, i) => (
                  <li key={i}>
                    <Link href={dept.href} className="group flex items-center hover:text-white transition-colors duration-300">
                      <FaArrowRight className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 text-white/60 text-xs mr-2 transition-all duration-300" />
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {tBi(dept.name)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Contact Info + Emergency Card */}
          {s("contactInfo") && (
            <div className="lg:col-span-4">
              <h3 className="text-lg font-bold mb-6 text-white flex items-center">
                <span className="w-8 h-[2px] bg-gradient-to-r from-[#76BC21] to-white/40 mr-3 rounded-full" />
                {tBi(data.contactInfo.title)}
              </h3>

              <ul className="space-y-4 text-sm text-gray-300 mb-8">
                <li className="flex items-start group">
                  <div className="mt-1 mr-4 p-2 rounded-full bg-white/5 text-[#76BC21] group-hover:bg-[#76BC21] group-hover:text-white transition-all duration-300">
                    {renderIcon(data.contactInfo.address.icon, "")}
                  </div>
                  <span className="leading-relaxed">
                    <strong className="text-white block mb-1">
                      {tBi(data.contactInfo.address.hospitalName)}
                    </strong>
                    {tBi(data.contactInfo.address.location)}
                  </span>
                </li>
                <li className="flex items-center group">
                  <div className="mr-4 p-2 rounded-full bg-white/5 text-white/60 group-hover:bg-white/20 group-hover:text-white transition-all duration-300">
                    {renderIcon(data.contactInfo.phone.icon, "")}
                  </div>
                  <span className="group-hover:text-white transition-colors duration-300">{data.contactInfo.phone.number}</span>
                </li>
                <li className="flex items-center group">
                  <div className="mr-4 p-2 rounded-full bg-white/5 text-white/60 group-hover:bg-white/20 group-hover:text-white transition-all duration-300">
                    {renderIcon(data.contactInfo.email.icon, "")}
                  </div>
                  <span className="group-hover:text-white transition-colors duration-300">{data.contactInfo.email.address}</span>
                </li>
              </ul>

              {/* Emergency card */}
              {s("emergencyCard") && (
                <div className="relative group overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 hover:border-[#76BC21]/50 transition-all duration-500">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#76BC21]/20 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-[#76BC21]/40 transition-colors duration-500" />
                  <div className="flex items-center relative z-10">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#76BC21] to-green-600 rounded-full flex items-center justify-center mr-4 shadow-lg shadow-[#76BC21]/30 animate-pulse">
                      {renderIcon(data.emergencyCard.icon, "text-white text-xl")}
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">
                        {tBi(data.emergencyCard.label)}
                      </p>
                      <p className="text-xl sm:text-2xl font-bold text-white tracking-tight group-hover:text-[#76BC21] transition-colors duration-300">
                        {data.emergencyCard.phoneNumber}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom bar */}
        {s("bottomBar") && (
          <div className="border-t border-white/10 pt-8 pb-4">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
              <p className="text-gray-400 text-sm text-center lg:text-left order-2 lg:order-1">
                &copy; {new Date().getFullYear()}{" "}
                <span className="text-white font-medium">
                  {tBi(data.bottomBar.hospitalName)}
                </span>
                {". "}
                {tBi(data.bottomBar.rightsText)}
              </p>
              <div className="flex space-x-6 text-sm text-gray-400 order-1 lg:order-2">
                <Link href={data.bottomBar.privacyPolicy.href}
                  className="hover:text-[#76BC21] transition-colors duration-300 relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[1px] after:bg-[#76BC21] hover:after:w-full after:transition-all after:duration-300">
                  {tBi(data.bottomBar.privacyPolicy.label)}
                </Link>
                <Link href={data.bottomBar.termsOfService.href}
                  className="hover:text-white transition-colors duration-300 relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[1px] after:bg-white hover:after:w-full after:transition-all after:duration-300">
                  {tBi(data.bottomBar.termsOfService.label)}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;
