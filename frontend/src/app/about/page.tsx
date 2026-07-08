"use client";

import { useAboutData } from "@/hooks/useAboutData";
import { FaUserMd, FaUsers, FaSmile, FaAward } from "react-icons/fa";
import { FiCheckCircle } from "react-icons/fi";

const statIcons = [FaUserMd, FaUsers, FaSmile, FaAward];

const AboutPage = () => {
  const { data, isLoading, isError } = useAboutData();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-primary font-semibold text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-lg font-medium">Failed to load About data.</p>
      </div>
    );
  }

  const { about } = data;

  return (
    <main className="bg-white overflow-hidden">
      {/* ── Hero Banner ── */}
      <section className="relative bg-primary py-24 px-4 text-white text-center overflow-hidden">
        {/* decorative circles */}
        <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-secondary/20 blur-3xl" />
        <div className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full bg-tertiary/20 blur-3xl" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/20 text-secondary text-sm font-semibold tracking-wider uppercase mb-4">
            Who We Are
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
            {about.title}
          </h1>
          <p className="text-lg md:text-xl text-white/80 font-light">
            {about.subtitle}
          </p>
        </div>
      </section>

      {/* ── Main Content ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — Image */}
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-full h-full rounded-3xl border-2 border-secondary/30" />
            <div className="absolute -bottom-4 -right-4 w-full h-full rounded-3xl bg-tertiary/10" />
            <img
              src={about.image}
              alt="About Hospital"
              className="relative z-10 w-full h-[420px] object-cover rounded-3xl shadow-2xl"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://placehold.co/700x420/1E2B7A/ffffff?text=Mirsarai+General+Hospital";
              }}
            />
            {/* Floating badge */}
            <div className="absolute z-20 -bottom-6 -right-6 bg-white rounded-2xl shadow-xl px-6 py-4 border border-gray-100">
              <p className="text-3xl font-extrabold text-primary">10+</p>
              <p className="text-sm text-gray-500 font-medium">Years of Trust</p>
            </div>
          </div>

          {/* Right — Text */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6 leading-snug">
              Dedicated to{" "}
              <span className="text-secondary">Better Healthcare</span>{" "}
              for All
            </h2>
            <p className="text-gray-600 text-base leading-relaxed mb-8">
              {about.description}
            </p>
            <ul className="space-y-3">
              {about.content.map((point, i) => (
                <li key={i} className="flex items-start gap-3">
                  <FiCheckCircle className="text-secondary mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-600 text-sm leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>

            <a
              href="/about/mission-vision"
              className="mt-10 inline-flex items-center gap-2 bg-primary text-white px-7 py-3.5 rounded-full font-semibold text-sm hover:bg-primary/90 transition duration-300 shadow-md hover:shadow-primary/30 hover:-translate-y-0.5 transform"
            >
              Our Mission & Vision →
            </a>
          </div>
        </div>
      </section>

      {/* ── Statistics ── */}
      <section className="bg-gradient-to-br from-primary via-primary/95 to-[#1a246e] py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Our Impact in Numbers
            </h2>
            <p className="text-white/70 text-base max-w-xl mx-auto">
              Over a decade of service, we've grown stronger with each patient we've cared for.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {about.statistics.map((stat, i) => {
              const Icon = statIcons[i] || FaAward;
              return (
                <div
                  key={stat.title}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 hover:bg-white/20 transition duration-300 group"
                >
                  <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary/30 transition">
                    <Icon className="text-secondary" size={22} />
                  </div>
                  <p className="text-4xl font-extrabold text-white mb-1">{stat.value}</p>
                  <p className="text-white/70 text-sm font-medium">{stat.title}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-4 text-center bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Ready to Experience Better Care?
          </h2>
          <p className="text-gray-500 mb-8">
            Book an appointment today and let our team take care of you.
          </p>
          <a
            href="/appointment"
            className="inline-block bg-secondary text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-secondary/90 transition duration-300 shadow-lg hover:shadow-secondary/40 hover:-translate-y-1 transform"
          >
            Book an Appointment
          </a>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
