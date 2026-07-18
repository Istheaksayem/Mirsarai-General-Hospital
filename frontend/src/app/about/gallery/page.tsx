"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/context/LanguageContext";
import { FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { getImageUrl } from "@/lib/getImageUrl";

// ── Types ──────────────────────────────────────────────────────────────────
interface GalleryImage {
  id: number;
  category: string;
  src: string;
  title: { en: string; bn: string };
  description: { en: string; bn: string };
}

interface Category {
  id: string;
  title: { en: string; bn: string };
  description: { en: string; bn: string };
}

interface SEOConfig {
  metaTitle: { en: string; bn: string };
  metaDescription: { en: string; bn: string };
  keywords: { en: string; bn: string };
  ogImage: string;
}

interface GalleryData {
  hero: {
    title: { en: string; bn: string };
    subtitle: { en: string; bn: string };
    description: { en: string; bn: string };
    image?: string;
  };
  categories: Category[];
  images: GalleryImage[];
  stats: {
    title: { en: string; bn: string };
    items: Array<{
      number: string;
      label: { en: string; bn: string };
    }>;
  };
  seo?: SEOConfig;
}

// ── Fetch Gallery Data ─────────────────────────────────────────────────────
const fetchGalleryData = async (): Promise<GalleryData> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
  const res = await fetch(`${apiUrl}/about/gallery`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch gallery data: ${res.statusText}`);
  const result = await res.json();
  return result.data;
};

// ── Main Gallery Page ──────────────────────────────────────────────────────
const GalleryPage = () => {
  const { lang } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);

  const { data, isLoading, error } = useQuery<GalleryData>({
    queryKey: ["gallery"],
    queryFn: fetchGalleryData,
  });

  // Dynamic SEO Meta tags
  useEffect(() => {
    if (data?.seo) {
      const seo = data.seo;
      document.title = lang === "bn" ? seo.metaTitle.bn : seo.metaTitle.en;
      
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute("content", lang === "bn" ? seo.metaDescription.bn : seo.metaDescription.en);
      }
      
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute("content", lang === "bn" ? seo.keywords.bn : seo.keywords.en);
      }
    }
  }, [data, lang]);

  // Reset to "all" if the selected category tab no longer exists in backend data
  useEffect(() => {
    if (!data || selectedCategory === "all") return;
    const stillExists = data.categories.some(c => c.id === selectedCategory);
    if (!stillExists) setSelectedCategory("all");
  }, [data, selectedCategory]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-tertiary/5">
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

  const filteredImages =
    selectedCategory === "all"
      ? data.images
      : data.images.filter((img) => img.category === selectedCategory);

  const openLightbox = (image: GalleryImage, index: number) => {
    setLightboxImage(image);
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxImage(null);
  };

  const nextImage = () => {
    const nextIndex = (lightboxIndex + 1) % filteredImages.length;
    setLightboxImage(filteredImages[nextIndex]);
    setLightboxIndex(nextIndex);
  };

  const prevImage = () => {
    const prevIndex =
      (lightboxIndex - 1 + filteredImages.length) % filteredImages.length;
    setLightboxImage(filteredImages[prevIndex]);
    setLightboxIndex(prevIndex);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Hero Section */}
      <section className="relative text-white py-20 overflow-hidden">
        {/* Background Layer */}
        {data.hero.image ? (
          <>
            <div 
              className="absolute inset-0" 
              style={{ 
                backgroundImage: `url(${getImageUrl(data.hero.image)})`, 
                backgroundSize: 'cover', 
                backgroundPosition: 'center' 
              }} 
            />
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-black/50" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-tertiary" />
        )}
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="hero-pattern-grid absolute inset-0" />
          <div className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-tertiary/20 rounded-full blur-3xl animate-float delay-700" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center space-y-6"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              {lang === "bn" ? data.hero.title.bn : data.hero.title.en}
            </h1>
            <p className="text-xl md:text-2xl font-light text-white/90">
              {lang === "bn" ? data.hero.subtitle.bn : data.hero.subtitle.en}
            </p>
            <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto">
              {lang === "bn" ? data.hero.description.bn : data.hero.description.en}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {data.stats.items.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-tertiary/5 hover:shadow-lg transition-all duration-300"
              >
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-sm md:text-base text-gray-600 font-medium">
                  {lang === "bn" ? stat.label.bn : stat.label.en}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Category Filter + Gallery Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">

          {/* Tab Buttons — driven by backend categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {/* "All" tab */}
            <button
              onClick={() => setSelectedCategory("all")}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 ${
                selectedCategory === "all"
                  ? "bg-primary text-white shadow-lg scale-105"
                  : "bg-white text-gray-700 hover:bg-primary hover:text-white shadow"
              }`}
            >
              {lang === "bn" ? "সব" : "All"}
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                selectedCategory === "all" ? "bg-white/20" : "bg-gray-100"
              }`}>
                {data.images.length}
              </span>
            </button>

            {/* Dynamic category tabs from backend */}
            {data.categories.map((category) => {
              const count = data.images.filter(img => img.category === category.id).length;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 ${
                    selectedCategory === category.id
                      ? "bg-primary text-white shadow-lg scale-105"
                      : "bg-white text-gray-700 hover:bg-primary hover:text-white shadow"
                  }`}
                >
                  {lang === "bn" ? category.title.bn : category.title.en}
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    selectedCategory === category.id ? "bg-white/20" : "bg-gray-100"
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </motion.div>

          {/* Gallery Grid */}
          {filteredImages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 text-gray-400"
            >
              <p className="text-5xl mb-4">🖼️</p>
              <p className="text-lg font-medium">
                {lang === "bn" ? "এই বিভাগে কোনো ছবি নেই।" : "No images in this category yet."}
              </p>
            </motion.div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredImages.map((image, index) => (
                  <motion.div
                    key={image.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    className="group relative aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
                    onClick={() => openLightbox(image, index)}
                  >
                    <Image
                      src={getImageUrl(image.src)}
                      alt={lang === "bn" ? image.title.bn : image.title.en}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <h3 className="font-bold text-lg mb-1">
                          {lang === "bn" ? image.title.bn : image.title.en}
                        </h3>
                        <p className="text-sm text-white/90 line-clamp-2">
                          {lang === "bn" ? image.description.bn : image.description.en}
                        </p>
                        {/* Category badge */}
                        <span className="inline-block mt-2 text-xs bg-white/20 px-2 py-0.5 rounded-full">
                          {lang === "bn"
                            ? (data.categories.find(c => c.id === image.category)?.title.bn ?? image.category)
                            : (data.categories.find(c => c.id === image.category)?.title.en ?? image.category)
                          }
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
            >
              <FiX size={32} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-4 text-white hover:text-gray-300 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
            >
              <FiChevronLeft size={32} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 text-white hover:text-gray-300 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
            >
              <FiChevronRight size={32} />
            </button>

            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-5xl w-full"
            >
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl mb-4">
                <Image
                  src={getImageUrl(lightboxImage.src)}
                  alt={
                    lang === "bn"
                      ? lightboxImage.title.bn
                      : lightboxImage.title.en
                  }
                  fill
                  className="object-contain"
                />
              </div>
              <div className="text-center text-white space-y-2">
                <h3 className="text-2xl font-bold">
                  {lang === "bn"
                    ? lightboxImage.title.bn
                    : lightboxImage.title.en}
                </h3>
                <p className="text-white/80">
                  {lang === "bn"
                    ? lightboxImage.description.bn
                    : lightboxImage.description.en}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryPage;
