"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useQuery } from "@tanstack/react-query";

gsap.registerPlugin(useGSAP);

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
  const containerRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const btnContainerRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError } = useQuery<HeroData>({
    queryKey: ["hero"],
    queryFn: fetchHeroData,
    staleTime: 1000 * 60 * 10, // cache 10 min
  });

  // Run GSAP animation once data is ready
  useGSAP(
    () => {
      if (!data) return;
      const tl = gsap.timeline();

      tl.fromTo(
        bgRef.current,
        { scale: 1.15, filter: "brightness(0.5)" },
        { scale: 1, filter: "brightness(1)", duration: 2.5, ease: "power2.out" }
      )
        .fromTo(
          logoRef.current,
          { y: -60, opacity: 0, rotate: -15 },
          { y: 0, opacity: 1, rotate: 0, duration: 1, ease: "back.out(1.5)" },
          "-=2"
        )
        .fromTo(
          titleRef.current,
          { y: 50, opacity: 0, scale: 0.9 },
          { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "power3.out" },
          "-=1.5"
        )
        .fromTo(
          descRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: "power2.out" },
          "-=1"
        )
        .fromTo(
          btnContainerRef.current?.children
            ? Array.from(btnContainerRef.current.children)
            : [],
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power2.out" },
          "-=0.8"
        );
    },
    { scope: containerRef, dependencies: [data] }
  );

  if (isLoading) return <HeroSkeleton />;

  if (isError || !data) {
    return (
      <section className="relative w-full h-[90vh] flex items-center justify-center bg-gray-900">
        <p className="text-white text-lg">Failed to load hero section. Please try again.</p>
      </section>
    );
  }

  const overlayStyle = {
    backgroundColor: data.background.overlay.color,
    opacity: data.background.overlay.opacity,
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full flex items-center justify-center overflow-hidden"
      style={{ height: data.layout.height }}
    >
      {/* Background Image */}
      <div
        ref={bgRef}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${data.background.image}')` }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0" style={overlayStyle} />
      </div>

      {/* Content */}
      <div
        className={`relative z-10 text-center px-4 sm:px-6 lg:px-8 ${data.layout.contentWidth} mx-auto flex flex-col items-center`}
      >
        {/* Logo */}
        <div
          ref={logoRef}
          className="mb-8 bg-white/10 p-4 rounded-full backdrop-blur-sm"
        >
          <img
            src={data.logo.image}
            alt="Hospital Logo"
            className="h-20 w-auto rounded-full"
          />
        </div>

        {/* Heading */}
        <h1
          ref={titleRef}
          className={`${data.heading.fontSize.mobile} md:${data.heading.fontSize.desktop} font-bold text-white mb-4 tracking-tight`}
        >
          {data.heading.text}
        </h1>

        {/* Description */}
        <p
          ref={descRef}
          className={`${data.description.fontSize.mobile} md:${data.description.fontSize.desktop} mb-10 font-light`}
          style={{ color: data.description.color }}
        >
          {data.description.text}
        </p>

        {/* Buttons */}
        <div ref={btnContainerRef} className="flex flex-col sm:flex-row gap-4">
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
        </div>
      </div>
    </section>
  );
};

export default Hero;
