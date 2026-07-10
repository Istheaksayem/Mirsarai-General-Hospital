"use client";

import { useBabyCare } from "@/hooks/useBabyCare";
import { 
  FaUserMd, 
  FaSyringe, 
  FaSmile, 
  FaBook,
  FaBaby,
  FaHeartbeat,
  FaCheckCircle,
  FaClock
} from "react-icons/fa";
import { MdChildCare } from "react-icons/md";

const iconMap: Record<string, any> = {
  FaUserMd,
  FaSyringe,
  FaSmile,
  FaBook,
};

const BabyCarePage = () => {
  const { data, isLoading, isError } = useBabyCare();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--background)" }}>
        <div className="flex flex-col items-center gap-4 animate-fadeInSlide">
          <div className="w-16 h-16 rounded-full border-4 border-[var(--color-secondary)] border-t-transparent animate-spin" />
          <p className="font-semibold text-lg" style={{ color: "var(--color-secondary)" }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--background)" }}>
        <p className="text-red-500 text-lg font-medium">Failed to load baby care data.</p>
      </div>
    );
  }

  const { babyCare } = data;

  return (
    <main className="overflow-hidden" style={{ background: "var(--background)" }}>
      {/* ── Hero Section with Background Image ── */}
      <section className="relative py-40 px-4 overflow-hidden">
        {/* Background Image with Minimal Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={babyCare.backgroundImage}
            alt="Baby Care"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=1920&h=800&fit=crop";
            }}
          />
          {/* Light overlay for text readability */}
          <div 
            className="absolute inset-0" 
            style={{ 
              background: "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.55) 100%)" 
            }} 
          />
        </div>

        {/* Decorative floating elements */}
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-20 blur-3xl" style={{ background: "var(--color-secondary)" }} />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-15 blur-3xl" style={{ background: "#8bc34a" }} />

        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="animate-fadeInSlide text-white">
              <div 
                className="inline-flex items-center gap-3 px-5 py-2.5 mb-6"
                style={{
                  background: "rgba(118, 188, 33, 0.2)",
                  borderRadius: "var(--radius-xl)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(118, 188, 33, 0.3)"
                }}
              >
                <FaBaby size={20} />
                <span className="text-sm font-semibold tracking-wider uppercase">
                  Pediatric Excellence
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
                {babyCare.title}
              </h1>
              <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-8">
                {babyCare.heroDescription}
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="#services"
                  className="inline-block px-8 py-4 font-bold text-white transition-all duration-300 hover:-translate-y-1 transform"
                  style={{
                    background: "linear-gradient(135deg, var(--color-secondary), #8bc34a)",
                    borderRadius: "var(--radius-lg)",
                    boxShadow: "var(--shadow-xl)"
                  }}
                >
                  Our Services
                </a>
                <a
                  href="/appointment"
                  className="inline-block px-8 py-4 font-bold text-white transition-all duration-300 hover:-translate-y-1 transform"
                  style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(10px)",
                    borderRadius: "var(--radius-lg)",
                    border: "2px solid rgba(255, 255, 255, 0.3)"
                  }}
                >
                  Book Appointment
                </a>
              </div>
            </div>

            {/* Right Stats Cards */}
            <div className="grid grid-cols-2 gap-4 animate-fadeInSlide" style={{ animationDelay: "0.2s" }}>
              {babyCare.statistics.map((stat, i) => (
                <div
                  key={i}
                  className="glass-panel p-6 text-center hover:-translate-y-2 transition-all duration-300"
                  style={{
                    borderRadius: "var(--radius-lg)",
                    background: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)"
                  }}
                >
                  <p className="text-4xl font-extrabold text-white mb-1">{stat.value}</p>
                  <p className="text-white/80 text-sm font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 -mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {babyCare.features.map((feature, index) => {
            const Icon = iconMap[feature.icon] || FaBaby;
            return (
              <div
                key={index}
                className="glass-panel p-8 text-center group hover:-translate-y-2 transition-all duration-500 animate-fadeInSlide"
                style={{
                  borderRadius: "var(--radius-lg)",
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div 
                  className="w-16 h-16 flex items-center justify-center mx-auto mb-5 transition-all duration-300 group-hover:scale-110"
                  style={{
                    borderRadius: "var(--radius-md)",
                    background: "linear-gradient(135deg, var(--color-secondary), #8bc34a)"
                  }}
                >
                  <Icon className="text-white" size={28} />
                </div>
                <h3 className="text-lg font-bold mb-3" style={{ color: "var(--color-primary)" }}>
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)", opacity: 0.7 }}>
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── About Section ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="animate-fadeInSlide">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight" style={{ color: "var(--color-primary)" }}>
              Complete <span style={{ color: "var(--color-secondary)" }}>Pediatric Healthcare</span>
            </h2>
            <p 
              className="text-lg leading-relaxed mb-8"
              style={{ color: "var(--foreground)", opacity: 0.75 }}
            >
              {babyCare.description}
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "rgba(118, 188, 33, 0.1)",
                    borderRadius: "var(--radius-md)"
                  }}
                >
                  <FaClock style={{ color: "var(--color-secondary)" }} size={20} />
                </div>
                <div>
                  <p className="font-semibold" style={{ color: "var(--color-primary)" }}>
                    Working Hours
                  </p>
                  <p className="text-sm" style={{ color: "var(--foreground)", opacity: 0.6 }}>
                    {babyCare.workingHours.weekdays} (Weekdays)
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "rgba(239, 68, 68, 0.1)",
                    borderRadius: "var(--radius-md)"
                  }}
                >
                  <FaHeartbeat style={{ color: "#ef4444" }} size={20} />
                </div>
                <div>
                  <p className="font-semibold" style={{ color: "var(--color-primary)" }}>
                    Emergency Care
                  </p>
                  <p className="text-sm" style={{ color: "var(--foreground)", opacity: 0.6 }}>
                    {babyCare.workingHours.emergency}
                  </p>
                </div>
              </div>
            </div>

            <a
              href="/appointment"
              className="inline-flex items-center gap-3 px-8 py-4 font-semibold text-base text-white transition-all duration-300 hover:-translate-y-1 transform"
              style={{
                background: "var(--color-secondary)",
                borderRadius: "var(--radius-xl)",
                boxShadow: "var(--shadow-lg)"
              }}
            >
              Book Pediatric Appointment →
            </a>
          </div>

          <div className="relative animate-fadeInSlide" style={{ animationDelay: "0.2s" }}>
            <div 
              className="absolute -top-6 -right-6 w-full h-full"
              style={{
                background: "linear-gradient(135deg, var(--color-secondary), #8bc34a)",
                opacity: 0.1,
                borderRadius: "var(--radius-xl)"
              }}
            />
            <img
              src="https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800&h=600&fit=crop"
              alt="Baby Care"
              className="relative z-10 w-full h-[500px] object-cover"
              style={{
                borderRadius: "var(--radius-xl)",
                boxShadow: "var(--shadow-xl)"
              }}
            />
          </div>
        </div>
      </section>

      {/* ── Services Grid ── */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[var(--color-secondary)] blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-[#fbbf24] blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 animate-fadeInSlide">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight" style={{ color: "var(--color-primary)" }}>
              Our Baby Care Services
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: "var(--foreground)", opacity: 0.7 }}>
              Comprehensive healthcare for infants, children, and adolescents
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {babyCare.services.map((service, index) => (
              <div
                key={index}
                className="premium-card p-8 hover:scale-[1.02] transition-all duration-300 animate-fadeInSlide"
                style={{
                  borderRadius: "var(--radius-lg)",
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div 
                    className="w-12 h-12 flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, var(--color-secondary), #8bc34a)",
                      borderRadius: "var(--radius-md)"
                    }}
                  >
                    <MdChildCare className="text-white" size={24} />
                  </div>
                  <h3 className="text-2xl font-bold" style={{ color: "var(--color-primary)" }}>
                    {service.category}
                  </h3>
                </div>
                <ul className="grid grid-cols-1 gap-3">
                  {service.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <FaCheckCircle 
                        className="mt-1 flex-shrink-0" 
                        size={16} 
                        style={{ color: "var(--color-secondary)" }}
                      />
                      <span className="text-sm leading-relaxed" style={{ color: "var(--foreground)", opacity: 0.75 }}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Vaccination Schedule ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16 animate-fadeInSlide">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight" style={{ color: "var(--color-primary)" }}>
            Vaccination Schedule
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "var(--foreground)", opacity: 0.7 }}>
            Complete immunization program for your child's health protection
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {babyCare.vaccinationSchedule.map((schedule, i) => (
            <div
              key={i}
              className="glass-panel p-6 hover:-translate-y-1 transition-all duration-300 animate-fadeInSlide"
              style={{
                borderRadius: "var(--radius-lg)",
                animationDelay: `${i * 0.1}s`
              }}
            >
              <div 
                className="inline-block px-4 py-2 mb-4 font-bold text-white"
                style={{
                  background: "linear-gradient(135deg, var(--color-secondary), #8bc34a)",
                  borderRadius: "var(--radius-md)"
                }}
              >
                {schedule.age}
              </div>
              <ul className="space-y-2">
                {schedule.vaccines.map((vaccine, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <FaCheckCircle style={{ color: "var(--color-secondary)" }} size={14} />
                    <span className="text-sm" style={{ color: "var(--foreground)", opacity: 0.8 }}>
                      {vaccine}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── Statistics ── */}
      <section className="py-28 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[var(--color-secondary)] blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-[#8bc34a] blur-3xl" />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 animate-fadeInSlide">
            <div 
              className="inline-block px-5 py-2 mb-6 text-sm font-bold tracking-wider uppercase text-white"
              style={{
                background: "linear-gradient(135deg, var(--color-secondary), #8bc34a)",
                borderRadius: "var(--radius-xl)"
              }}
            >
              Our Impact
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight" style={{ color: "var(--color-primary)" }}>
              Trusted by Families
            </h2>
            <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: "var(--foreground)", opacity: 0.7 }}>
              Providing exceptional pediatric care with compassion and expertise
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {babyCare.statistics.map((stat, i) => (
              <div
                key={i}
                className="premium-card text-center p-10 group hover:-translate-y-2 animate-fadeInSlide glow-effect"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  borderRadius: "var(--radius-lg)"
                }}
              >
                <div 
                  className="w-14 h-14 flex items-center justify-center mx-auto mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: "linear-gradient(135deg, var(--color-secondary), #8bc34a)",
                    borderRadius: "var(--radius-md)"
                  }}
                >
                  <FaBaby className="text-white" size={24} />
                </div>
                <p className="text-5xl font-extrabold mb-2 tracking-tight" style={{ color: "var(--color-secondary)" }}>
                  {stat.value}
                </p>
                <p className="text-sm font-medium tracking-wide" style={{ color: "var(--foreground)", opacity: 0.7 }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-28 px-4 text-center">
        <div className="max-w-3xl mx-auto animate-fadeInSlide">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight tracking-tight" style={{ color: "var(--color-primary)" }}>
            Your Child's Health is Our Priority
          </h2>
          <p 
            className="text-lg mb-12 leading-relaxed max-w-xl mx-auto"
            style={{ color: "var(--foreground)", opacity: 0.7 }}
          >
            Schedule an appointment with our experienced pediatricians for routine checkups or consultations
          </p>
          <a
            href="/appointment"
            className="inline-block text-white px-12 py-5 font-bold text-lg transition-all duration-500 hover:-translate-y-2 transform"
            style={{
              background: "linear-gradient(135deg, var(--color-secondary) 0%, #8bc34a 100%)",
              borderRadius: "var(--radius-xl)",
              boxShadow: "var(--shadow-xl)"
            }}
          >
            Book Appointment Now
          </a>
        </div>
      </section>
    </main>
  );
};

export default BabyCarePage;
