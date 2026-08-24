'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type Language = 'zh' | 'en';

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);
const storageKey = 'portfolio-language';

function applyLanguage(language: Language) {
  document.documentElement.dataset.language = language;
  document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('zh');

  const setLanguage = useCallback((nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    applyLanguage(nextLanguage);
    try { window.localStorage.setItem(storageKey, nextLanguage); } catch { /* Storage may be unavailable in privacy mode. */ }
  }, []);

  useEffect(() => {
    const initial = document.documentElement.dataset.language === 'en' ? 'en' : 'zh';
    setLanguageState(initial);
    applyLanguage(initial);
  }, []);

  const toggleLanguage = useCallback(() => setLanguage(language === 'zh' ? 'en' : 'zh'), [language, setLanguage]);
  const value = useMemo(() => ({ language, setLanguage, toggleLanguage }), [language, setLanguage, toggleLanguage]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider.');
  return context;
}
