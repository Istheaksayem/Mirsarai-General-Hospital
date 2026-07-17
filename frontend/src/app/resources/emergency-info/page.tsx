"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useEmergencyInfo, EmergencyInfoData } from "@/hooks/useEmergencyInfo";
import {
  FaAmbulance,
  FaPhoneAlt,
  FaHospital,
  FaUserMd,
  FaHeartbeat,
  FaBandAid,
  FaFire,
  FaLungs,
  FaFirstAid,
  FaListAlt,
  FaPills,
  FaHospitalUser,
  FaExclamationTriangle,
} from "react-icons/fa";

const iconMap: { [key: string]: React.ElementType } = {
  FaAmbulance,
  FaPhoneAlt,
  FaHospital,
  FaUserMd,
  FaHeartbeat,
  FaBandAid,
  FaFire,
  FaLungs,
  FaFirstAid,
  FaListAlt,
  FaPills,
  FaHospitalUser,
};

const EmergencyInfoPage = () => {
  const { lang } = useLanguage();

  const { data, isLoading, error } = useEmergencyInfo();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-gray-600 font-medium">
            {lang === "bn" ? "লোড হচ্ছে..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-red-600 font-semibold text-lg">
            {lang === "bn" ? "ডেটা লোড করতে ব্যর্থ" : "Failed to load data"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[400px] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={data.hero.image}
            alt="Emergency"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-black/50" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl text-white"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-[3px] w-12 bg-secondary" />
              <p className="text-sm uppercase tracking-wider font-semibold text-secondary">
                {lang === "bn" ? "জরুরি" : "EMERGENCY"}
              </p>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              {lang === "bn" ? data.hero.title.bn : data.hero.title.en}
            </h1>

            <p className="text-xl md:text-2xl font-light text-white/90 mb-4">
              {lang === "bn" ? data.hero.subtitle.bn : data.hero.subtitle.en}
            </p>

            <p className="text-base md:text-lg text-white/80 max-w-2xl">
              {lang === "bn"
                ? data.hero.description.bn
                : data.hero.description.en}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Emergency Contacts */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-[3px] w-12 bg-secondary" />
              <p className="text-sm uppercase tracking-wider font-semibold text-secondary">
                {lang === "bn" ? "যোগাযোগ" : "CONTACTS"}
              </p>
              <div className="h-[3px] w-12 bg-secondary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              {lang === "bn"
                ? data.emergencyContacts.title.bn
                : data.emergencyContacts.title.en}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.emergencyContacts.contacts.map((contact, index) => {
              const IconComponent = iconMap[contact.icon] || FaPhoneAlt;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="bg-gradient-to-br from-red-50 to-red-100/50 border-2 border-red-200 p-6 rounded-2xl text-center space-y-4 hover:shadow-xl transition-all group"
                >
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                    <IconComponent size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-primary">
                    {lang === "bn" ? contact.title.bn : contact.title.en}
                  </h3>
                  <a
                    href={`tel:${contact.number}`}
                    className="text-2xl font-bold text-red-600 hover:text-red-700 block"
                  >
                    {contact.number}
                  </a>
                  <p className="text-sm text-gray-600 font-medium">
                    {lang === "bn"
                      ? contact.available.bn
                      : contact.available.en}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* First Aid Guidelines */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-[3px] w-12 bg-secondary" />
              <p className="text-sm uppercase tracking-wider font-semibold text-secondary">
                {lang === "bn" ? "প্রাথমিক চিকিৎসা" : "FIRST AID"}
              </p>
              <div className="h-[3px] w-12 bg-secondary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              {lang === "bn" ? data.firstAid.title.bn : data.firstAid.title.en}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {data.firstAid.items.map((item, index) => {
              const IconComponent = iconMap[item.icon] || FaFirstAid;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white border-2 border-gray-200 p-6 rounded-2xl hover:border-accent hover:shadow-xl transition-all"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-accent to-tertiary rounded-xl flex items-center justify-center text-white">
                      <IconComponent size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-primary">
                      {lang === "bn" ? item.title.bn : item.title.en}
                    </h3>
                  </div>
                  <ol className="space-y-2">
                    {item.steps.map((step, stepIndex) => (
                      <li
                        key={stepIndex}
                        className="flex items-start gap-3 text-gray-600"
                      >
                        <span className="flex-shrink-0 w-6 h-6 bg-secondary/20 text-secondary rounded-full flex items-center justify-center text-sm font-bold">
                          {stepIndex + 1}
                        </span>
                        <span>{lang === "bn" ? step.bn : step.en}</span>
                      </li>
                    ))}
                  </ol>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* When to Call Emergency */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 p-8 rounded-2xl"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white">
                <FaExclamationTriangle size={32} />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-primary">
                  {lang === "bn"
                    ? data.whenToCallEmergency.title.bn
                    : data.whenToCallEmergency.title.en}
                </h2>
                <p className="text-gray-600 mt-2">
                  {lang === "bn"
                    ? data.whenToCallEmergency.description.bn
                    : data.whenToCallEmergency.description.en}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {data.whenToCallEmergency.situations.map((situation, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-3 bg-white p-4 rounded-xl"
                >
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                  <p className="text-gray-700">
                    {lang === "bn" ? situation.bn : situation.en}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Emergency Preparedness */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-[3px] w-12 bg-secondary" />
              <p className="text-sm uppercase tracking-wider font-semibold text-secondary">
                {lang === "bn" ? "প্রস্তুতি" : "PREPAREDNESS"}
              </p>
              <div className="h-[3px] w-12 bg-secondary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              {lang === "bn"
                ? data.emergencyPreparedness.title.bn
                : data.emergencyPreparedness.title.en}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.emergencyPreparedness.tips.map((tip, index) => {
              const IconComponent = iconMap[tip.icon] || FaFirstAid;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="bg-white border-2 border-gray-200 p-6 rounded-2xl hover:border-accent hover:shadow-xl transition-all"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-white mb-4 mx-auto">
                    <IconComponent size={28} />
                  </div>
                  <h3 className="text-lg font-bold text-primary text-center mb-2">
                    {lang === "bn" ? tip.title.bn : tip.title.en}
                  </h3>
                  <p className="text-gray-600 text-center text-sm">
                    {lang === "bn" ? tip.description.bn : tip.description.en}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default EmergencyInfoPage;

