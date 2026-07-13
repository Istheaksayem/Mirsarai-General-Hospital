"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { FaClock, FaUser, FaTag } from "react-icons/fa";
import { useHealthBlog, HealthBlogData } from "@/hooks/useHealthBlog";

const HealthBlogPage = () => {
  const { lang } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data, isLoading, error } = useHealthBlog();

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

  const filteredPosts =
    selectedCategory === "all"
      ? data.posts
      : data.posts.filter((post) => post.category === selectedCategory);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (lang === "bn") {
      return date.toLocaleDateString("bn-BD", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[400px] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={data.hero.image}
            alt="Health Blog"
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
                {lang === "bn" ? "ব্লগ" : "BLOG"}
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

      {/* Category Filter */}
      <section className="py-12 bg-white sticky top-[72px] z-40 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3">
            {data.categories.map((category, index) => (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ${
                  selectedCategory === category.id
                    ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {lang === "bn" ? category.name.bn : category.name.en}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-accent hover:shadow-xl transition-all group cursor-pointer"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={lang === "bn" ? post.title.bn : post.title.en}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 px-3 py-1 bg-secondary text-white text-xs font-bold rounded-full">
                    {lang === "bn"
                      ? data.categories.find((c) => c.id === post.category)
                          ?.name.bn
                      : data.categories.find((c) => c.id === post.category)
                          ?.name.en}
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-bold text-primary group-hover:text-accent transition-colors line-clamp-2">
                    {lang === "bn" ? post.title.bn : post.title.en}
                  </h3>

                  <p className="text-gray-600 text-sm line-clamp-3">
                    {lang === "bn" ? post.excerpt.bn : post.excerpt.en}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <FaUser className="text-accent" />
                      <span>
                        {lang === "bn" ? post.author.bn : post.author.en}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <FaClock className="text-accent" />
                      <span>
                        {lang === "bn" ? post.readTime.bn : post.readTime.en}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>{formatDate(post.date)}</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Tags Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-[3px] w-12 bg-secondary" />
              <p className="text-sm uppercase tracking-wider font-semibold text-secondary">
                {lang === "bn" ? "ট্যাগ" : "TAGS"}
              </p>
              <div className="h-[3px] w-12 bg-secondary" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-primary">
              {lang === "bn" ? "জনপ্রিয় বিষয়" : "Popular Topics"}
            </h2>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-3">
            {data.tags.map((tag, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-accent hover:text-accent transition-all cursor-pointer flex items-center gap-2"
              >
                <FaTag className="text-xs" />
                {lang === "bn" ? tag.bn : tag.en}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HealthBlogPage;
