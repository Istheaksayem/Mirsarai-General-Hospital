"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination, Navigation } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "swiper/css/navigation";

// ---------- Types ----------
interface HeroButton {
  label: string;
  link: string;
  style: {
    background: string;
    text: string;
    backdropBlur?: boolean;
    border?: string;
  };
}

interface HeroData {
  background: { image: string; overlay: { color: string; opacity: number } };
  logo: { image: string };
  heading: { text: string; fontSize: { mobile: string; desktop: string } };
  description: { text: string; fontSize: { mobile: string; desktop: string }; color: string };
  buttons: HeroButton[];
  layout: { height: string; contentWidth: string };
}

// ---------- Fetcher ----------
const fetchHeroData = async (): Promise<HeroData> => {
  const res = await fetch("/data/hero.json");
  if (!res.ok) throw new Error("Failed to fetch hero data");
  return res.json();
};

// ---------- Skeleton ----------
const HeroSkeleton = () => (
  <section className="relative w-full h-[90vh] flex items-center justify-center bg-gray-900 overflow-hidden animate-pulse">
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl px-4">
      <div className="h-24 w-24 rounded-full bg-white/10" />
      <div className="h-12 w-3/4 rounded-lg bg-white/10" />
      <div className="h-6 w-1/2 rounded-lg bg-white/10" />
      <div className="flex gap-4 mt-4">
        <div className="h-14 w-44 rounded-full bg-white/10" />
        <div className="h-14 w-36 rounded-full bg-white/10" />
      </div>
    </div>
  </section>
);

// ---------- Main Hero ----------
const Hero = () => {
  const { data, isLoading, isError } = useQuery<HeroData>({
    queryKey: ["hero"],
    queryFn: fetchHeroData,
    staleTime: 1000 * 60 * 10, // cache 10 min
  });

  if (isLoading) return <HeroSkeleton />;

  if (isError || !data) {
    return (
      <section className="relative w-full h-[90vh] flex items-center justify-center bg-gray-900">
        <p className="text-white text-lg">Failed to load hero section. Please try again.</p>
      </section>
    );
  }

  // Create an array of slides for the slider
  // We use the data from hero.json for the first slide, and mock additional slides for the slider effect
  const slides = [
    {
      id: 1,
      image: data.background.image,
      heading: data.heading.text,
      description: data.description.text,
    },
    {
      id: 2,
      image: "/hospital-banner.jpg", // Assuming this exists or falls back safely
      heading: "Advanced Medical Technology",
      description: "State-of-the-art facilities for accurate diagnosis and treatment.",
    },
    {
      id: 3,
      image: "/hospital-banner.jpg", // Assuming this exists or falls back safely
      heading: "24/7 Emergency Services",
      description: "We are always here when you need us the most.",
    }
  ];

  const overlayStyle = {
    backgroundColor: data.background.overlay.color,
    opacity: data.background.overlay.opacity,
  };

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: data.layout.height }}
    >
      <Swiper
        modules={[Autoplay, EffectFade, Pagination, Navigation]}
        effect="fade"
        speed={1000}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={true}
        loop={true}
        className="w-full h-full hero-swiper"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id} className="relative w-full h-full overflow-hidden">
            {({ isActive }) => (
              <>
                {/* Background Image with Zoom Effect */}
                <motion.div
                  initial={{ scale: 1.15 }}
                  animate={{ scale: isActive ? 1 : 1.15 }}
                  transition={{ duration: 6, ease: "easeOut" }}
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url('${slide.image}')` }}
                />

                {/* Dark Overlay */}
                <div className="absolute inset-0" style={overlayStyle} />

                {/* Content */}
                <div className={`relative z-10 w-full h-full flex items-center justify-center text-center px-4 sm:px-6 lg:px-8 ${data.layout.contentWidth} mx-auto`}>
                  <div className="flex flex-col items-center">
                    {/* Logo */}
                    <motion.div
                      initial={{ y: -50, opacity: 0 }}
                      animate={{ y: isActive ? 0 : -50, opacity: isActive ? 1 : 0 }}
                      transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                      className="mb-8 bg-white/10 p-4 rounded-full backdrop-blur-sm"
                    >
                      <img
                        src={data.logo.image}
                        alt="Hospital Logo"
                        className="h-20 w-auto rounded-full"
                      />
                    </motion.div>

                    {/* Heading */}
                    <motion.h1
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: isActive ? 0 : 30, opacity: isActive ? 1 : 0 }}
                      transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                      className={`${data.heading.fontSize.mobile} md:${data.heading.fontSize.desktop} font-bold text-white mb-4 tracking-tight`}
                    >
                      {slide.heading}
                    </motion.h1>

                    {/* Description */}
                    <motion.p
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: isActive ? 0 : 20, opacity: isActive ? 1 : 0 }}
                      transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                      className={`${data.description.fontSize.mobile} md:${data.description.fontSize.desktop} mb-10 font-light`}
                      style={{ color: data.description.color }}
                    >
                      {slide.description}
                    </motion.p>

                    {/* Buttons */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: isActive ? 0 : 20, opacity: isActive ? 1 : 0 }}
                      transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
                      className="flex flex-col sm:flex-row gap-4"
                    >
                      {data.buttons.map((btn, i) => {
                        const isPrimary = i === 0;
                        return (
                          <a
                            key={btn.label}
                            href={btn.link}
                            className={
                              isPrimary
                                ? "bg-primary hover:bg-opacity-90 text-white px-8 py-4 rounded-full font-semibold text-lg transition duration-300 shadow-lg hover:shadow-primary/50 transform hover:-translate-y-1 inline-block text-center"
                                : "bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border border-white/50 px-8 py-4 rounded-full font-semibold text-lg transition duration-300 transform hover:-translate-y-1 inline-block text-center"
                            }
                          >
                            {btn.label}
                          </a>
                        );
                      })}
                    </motion.div>
                  </div>
                </div>
              </>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Floating Animated Shapes (Overlay for the whole slider) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none mix-blend-screen">
        {/* Shape 1 */}
        <motion.div
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] left-[10%] w-64 h-64 bg-primary/20 rounded-full blur-[80px]"
        />
        {/* Shape 2 */}
        <motion.div
          animate={{
            y: [0, 40, 0],
            x: [0, -30, 0],
            rotate: [0, -10, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[10%] right-[10%] w-80 h-80 bg-secondary/20 rounded-full blur-[100px]"
        />
      </div>

      <style jsx global>{`
        .hero-swiper .swiper-pagination-bullet {
          background-color: white;
          opacity: 0.5;
        }
        .hero-swiper .swiper-pagination-bullet-active {
          background-color: var(--primary);
          opacity: 1;
        }
        .hero-swiper .swiper-button-next,
        .hero-swiper .swiper-button-prev {
          color: white;
          background: rgba(255, 255, 255, 0.1);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          backdrop-filter: blur(4px);
          transition: all 0.3s ease;
        }
        .hero-swiper .swiper-button-next:hover,
        .hero-swiper .swiper-button-prev:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.1);
        }
        .hero-swiper .swiper-button-next:after,
        .hero-swiper .swiper-button-prev:after {
          font-size: 20px;
          font-weight: bold;
        }
      `}</style>
    </section>
  );
};

export default Hero;
