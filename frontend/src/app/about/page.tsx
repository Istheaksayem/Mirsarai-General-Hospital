"use client";

import { useAboutData } from "@/hooks/useAboutData";
import { FaUserMd, FaUsers, FaSmile, FaAward, FaHeart, FaShieldAlt, FaStethoscope, FaMicroscope } from "react-icons/fa";
import { FiCheckCircle, FiArrowRight, FiTarget, FiEye } from "react-icons/fi";
import { MdLocalHospital, MdSecurity } from "react-icons/md";
import { useEffect, useRef } from "react";
import { BsFillHeartPulseFill } from "react-icons/bs";

const statIcons = [FaUserMd, FaUsers, FaSmile, FaAward];

const AboutPage = () => {
  const { data, isLoading, isError } = useAboutData();
  const parallaxRef = useRef<HTMLDivElement>(null);

  // Parallax scrolling effect
  useEffect(() => {
    const handleScroll = () => {
      if (parallaxRef.current) {
        const scrolled = window.pageYOffset;
        parallaxRef.current.style.transform = `translateY(${scrolled * 0.5}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-primary font-semibold text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-red-500 text-lg font-medium">Failed to load About data.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { about } = data;

  return (
    <main className="bg-white overflow-hidden">
      {/* ══════════════════════════════════════════
          HERO SECTION - با PARALLAX BACKGROUND
          ══════════════════════════════════════════ */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Parallax Background Image Layer */}
        <div 
          ref={parallaxRef}
          className="absolute inset-0 w-full h-[120%] parallax-container"
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('/about-us.jpg')`,
            }}
          />
          
          {/* Light Overlay for Text Readability */}
          <div className="absolute inset-0 bg-primary/40" />
        </div>

        {/* Animated Decorative Elements */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-2xl animate-scale-pulse" />

        {/* Hero Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Side - Text Content */}
            <div className="text-white">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass-card-dark text-secondary text-sm font-semibold tracking-wider uppercase mb-8 animate-fade-in">
                <MdLocalHospital className="text-xl" />
                <span>About Our Hospital</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight text-shadow-strong animate-slide-up">
                {about.title}
              </h1>
              
              <p className="text-2xl md:text-3xl text-secondary font-bold mb-6 text-shadow-glow animate-slide-up delay-200">
                {about.subtitle}
              </p>

              <p className="text-lg text-white/90 leading-relaxed mb-8 animate-slide-up delay-400">
                {about.description}
              </p>

              <div className="flex flex-wrap gap-4 animate-slide-up delay-400">
                <a
                  href="/appointment"
                  className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white px-8 py-4 rounded-full font-bold shadow-2xl hover:shadow-secondary/50 transition-all duration-300 hover:-translate-y-1 transform"
                >
                  <BsFillHeartPulseFill />
                  Book Appointment
                  <FiArrowRight />
                </a>
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 glass-card-dark hover:bg-white/20 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:-translate-y-1 transform"
                >
                  Contact Us
                </a>
              </div>
            </div>

            {/* Right Side - Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              {about.statistics.map((stat, i) => {
                const Icon = statIcons[i];
                return (
                  <div
                    key={i}
                    className="glass-card-dark rounded-2xl p-6 text-center hover:scale-105 transition-transform duration-300 animate-fade-in"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <div className="w-14 h-14 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4">
                      <Icon className="text-secondary text-2xl" />
                    </div>
                    <p className="text-4xl font-extrabold text-white mb-2">{stat.value}</p>
                    <p className="text-white/80 text-sm font-medium">{stat.title}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-30">
          <div className="w-6 h-10 rounded-full border-2 border-white/40 flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/60 rounded-full animate-scroll" />
          </div>
        </div>

        {/* Wave Divider */}
        <div className="wave-divider absolute bottom-0 left-0 right-0" />
      </section>

      {/* ══════════════════════════════════════════
          STORY SECTION - DUAL IMAGE LAYOUT
          ══════════════════════════════════════════ */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-white">
        {/* Medical Pattern Background */}
        <div className="absolute inset-0 medical-pattern opacity-50" />

        <div className="max-w-7xl mx-auto relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left - Image Collage */}
            <div className="relative">
              {/* Main Large Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl hover-lift">
                <div 
                  className="w-full h-[500px] bg-cover bg-center"
                  style={{
                    backgroundImage: `url('/about-us.jpg')`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
                
                {/* Overlay Badge */}
                <div className="absolute bottom-6 left-6 right-6 glass-card rounded-2xl p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                      <FaAward className="text-secondary text-3xl" />
                    </div>
                    <div>
                      <p className="text-2xl font-extrabold text-primary mb-1">10+ Years</p>
                      <p className="text-sm text-gray-600 font-medium">Trusted Healthcare Service</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Small Floating Images */}
              <div className="absolute -top-8 -right-8 w-40 h-40 rounded-2xl overflow-hidden shadow-xl border-4 border-white animate-float">
                <div 
                  className="w-full h-full bg-cover bg-center"
                  style={{
                    backgroundImage: `url('/hospital-banner.jpg')`,
                  }}
                />
              </div>
              
              <div className="absolute -bottom-8 -left-8 w-48 h-48 rounded-2xl overflow-hidden shadow-xl border-4 border-white animate-float delay-500">
                <div 
                  className="w-full h-full bg-cover bg-center"
                  style={{
                    backgroundImage: `url('/hospital-banner.jpg')`,
                  }}
                />
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 border-4 border-secondary/30 rounded-full animate-rotate-slow" />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 border-4 border-primary/20 rounded-full animate-rotate-slow" />
            </div>

            {/* Right - Content */}
            <div className="space-y-8">
              <div>
                <span className="inline-block px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-bold mb-4">
                  ✨ Our Story
                </span>
                
                <h2 className="text-4xl md:text-5xl font-extrabold text-primary mb-6 leading-tight">
                  Dedicated to{" "}
                  <span className="text-gradient">Better Healthcare</span>{" "}
                  for All
                </h2>
                
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  {about.description}
                </p>
              </div>

              {/* Feature List with Icons */}
              <div className="space-y-4">
                {about.content.map((point, i) => (
                  <div 
                    key={i} 
                    className="group flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-transparent hover:from-blue-100 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-900 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <FiCheckCircle className="text-white" size={20} />
                    </div>
                    <p className="text-gray-700 text-base leading-relaxed pt-1">{point}</p>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <a
                href="/about/mission-vision"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-primary via-blue-900 to-primary bg-size-200 hover:bg-pos-100 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-primary/40 transition-all duration-500 hover:-translate-y-1 transform group"
              >
                <FiTarget className="group-hover:rotate-180 transition-transform duration-500" />
                Our Mission & Vision
                <FiArrowRight className="group-hover:translate-x-2 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FEATURES SECTION - BACKGROUND IMAGE
          ══════════════════════════════════════════ */}
      <section className="relative py-24 px-4 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-fixed"
            style={{
              backgroundImage: `url('/about-us.jpg')`,
            }}
          />
          <div className="absolute inset-0 bg-primary/50" />
        </div>

        {/* Decorative Blobs */}
        <div className="absolute top-20 left-20 w-80 h-80 bg-secondary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block px-6 py-2 rounded-full glass-card-dark text-secondary text-sm font-bold mb-6">
              Why Choose Us
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 text-shadow-strong">
              Excellence in Every Aspect
            </h2>
            <p className="text-white/90 text-xl max-w-2xl mx-auto">
              We combine expertise, compassion, and modern technology to deliver exceptional healthcare.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: FaStethoscope,
                title: "Expert Medical Team",
                description: "Board-certified doctors and healthcare professionals dedicated to your well-being.",
                color: "from-blue-500 via-primary to-blue-900"
              },
              {
                icon: MdSecurity,
                title: "Patient Safety First",
                description: "Highest standards of safety protocols and hygiene in all our facilities.",
                color: "from-secondary via-green-600 to-green-700"
              },
              {
                icon: FaHeart,
                title: "Compassionate Care",
                description: "Every patient receives empathy, respect, and personalized attention.",
                color: "from-red-500 via-pink-600 to-pink-700"
              }
            ].map((item, i) => (
              <div 
                key={i}
                className="group glass-card rounded-3xl p-8 hover:scale-105 transition-all duration-500 hover:shadow-2xl"
              >
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6 group-hover:rotate-6 group-hover:scale-110 transition-all duration-300 shadow-xl`}>
                  <item.icon className="text-white text-4xl" />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed text-lg">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          STATISTICS SHOWCASE
          ══════════════════════════════════════════ */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 via-blue-50/30 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Our Impact in Numbers
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Over a decade of service, we've grown stronger with each patient we've cared for.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {about.statistics.map((stat, i) => {
              const Icon = statIcons[i];
              return (
                <div
                  key={i}
                  className="group bg-white rounded-3xl p-8 text-center border-2 border-gray-100 hover:border-secondary/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 transform"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                    <Icon className="text-secondary text-3xl" />
                  </div>
                  <p className="text-5xl font-extrabold bg-gradient-to-r from-primary to-blue-900 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                    {stat.value}
                  </p>
                  <p className="text-gray-600 text-base font-semibold">{stat.title}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CTA SECTION - WITH BACKGROUND IMAGE
          ══════════════════════════════════════════ */}
      <section className="relative py-32 px-4 text-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('/about-us.jpg')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-blue-50/95 to-white/95" />
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-block mb-6">
            <div className="flex items-center gap-3 bg-secondary/10 border border-secondary/20 px-6 py-3 rounded-full backdrop-blur-sm">
              <BsFillHeartPulseFill className="text-secondary text-2xl animate-pulse" />
              <span className="text-primary font-bold">Your Health is Our Priority</span>
            </div>
          </div>

          <h2 className="text-5xl md:text-6xl font-extrabold text-primary mb-6 leading-tight">
            Ready to Experience<br />Better Healthcare?
          </h2>
          
          <p className="text-gray-600 text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
            Book an appointment today and let our experienced medical team take care of you and your family with compassion and expertise.
          </p>
          
          <div className="flex flex-wrap gap-6 justify-center">
            <a
              href="/appointment"
              className="inline-flex items-center gap-3 bg-secondary hover:bg-secondary/90 text-white px-12 py-5 rounded-full font-bold text-xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-2 transform group"
            >
              <FaStethoscope className="text-2xl" />
              Book Appointment Now
              <FiArrowRight className="text-2xl group-hover:translate-x-2 transition-transform" />
            </a>
            <a
              href="/contact"
              className="inline-flex items-center gap-3 bg-white hover:bg-gray-50 text-primary border-2 border-gray-200 hover:border-primary/30 px-12 py-5 rounded-full font-bold text-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-2 transform"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
