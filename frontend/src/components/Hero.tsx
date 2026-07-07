"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const Hero = () => {
  const containerRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const btnContainerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();

    // Subtle background zoom
    tl.fromTo(bgRef.current,
      { scale: 1.15, filter: "brightness(0.5)" },
      { scale: 1, filter: "brightness(1)", duration: 2.5, ease: "power2.out" }
    )
      // Logo entrance
      .fromTo(logoRef.current,
        { y: -60, opacity: 0, rotate: -15 },
        { y: 0, opacity: 1, rotate: 0, duration: 1, ease: "back.out(1.5)" },
        "-=2"
      )
      // Title entrance
      .fromTo(titleRef.current,
        { y: 50, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "power3.out" },
        "-=1.5"
      )
      // Description
      .fromTo(descRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power2.out" },
        "-=1"
      )
      // Buttons stagger
      .fromTo(btnContainerRef.current?.children ? Array.from(btnContainerRef.current.children) : [],
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power2.out" },
        "-=0.8"
      );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        ref={bgRef}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('hospital-banner.jpg')" }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto flex flex-col items-center">
        <div
          ref={logoRef}
          className="mb-8 bg-white/10 p-4 rounded-full backdrop-blur-sm"
        >
          <img src="/genaral_Hospital_logo.jpeg" alt="Hospital Logo" className="h-20 w-auto rounded-full" />
        </div>

        <h1
          ref={titleRef}
          className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight"
        >
          Mirsarai General Hospital
        </h1>

        <p
          ref={descRef}
          className="text-xl md:text-2xl text-gray-200 mb-10 font-light"
        >
          Compassionate Care, Advanced Medicine.
        </p>

        <div
          ref={btnContainerRef}
          className="flex flex-col sm:flex-row gap-4"
        >
          <a href="/appointment" className="bg-primary hover:bg-opacity-90 text-white px-8 py-4 rounded-full font-semibold text-lg transition duration-300 shadow-lg hover:shadow-primary/50 transform hover:-translate-y-1 inline-block text-center">
            Book Appointment
          </a>
          <a href="/contact" className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border border-white/50 px-8 py-4 rounded-full font-semibold text-lg transition duration-300 transform hover:-translate-y-1 inline-block text-center">
            Contact Us
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
