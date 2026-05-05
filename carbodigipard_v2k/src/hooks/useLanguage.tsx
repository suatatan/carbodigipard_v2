import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type Language = "tr" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (tr: string, en?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

const STORAGE_KEY = "carbodigipard-lang";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLangState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem(STORAGE_KEY) as Language) || "tr";
    }
    return "tr";
  });

  const setLanguage = useCallback((lang: Language) => {
    setLangState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  }, []);

  const t = useCallback(
    (tr: string, en?: string) => {
      if (language === "en" && en) return en;
      return tr;
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
