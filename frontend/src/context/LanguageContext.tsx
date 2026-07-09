"use client";

import React, { createContext, useContext, useState, type ReactNode } from "react";

type Language = "en" | "bn";

interface LanguageContextValue {
  lang: Language;
  toggleLang: () => void;
  t: (en: string, bn: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>("en");

  const toggleLang = () => setLang((l) => (l === "en" ? "bn" : "en"));

  const t = (en: string, bn: string) => (lang === "bn" ? bn : en);

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}
