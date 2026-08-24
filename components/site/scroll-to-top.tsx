'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useLanguage } from '@/components/language-provider';

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const reduceMotion = useReducedMotion();
  const { language } = useLanguage();

  useEffect(() => {
    const update = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setVisible(window.scrollY > 520);
      setProgress(scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.button
          type="button"
          aria-label={language === 'zh' ? '返回页面顶部' : 'Back to top'}
          initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.9 }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          onClick={() => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })}
          className="ui-pressable group fixed bottom-5 right-5 z-40 grid size-12 place-items-center rounded-full p-[2px] shadow-[0_16px_48px_rgba(43,20,86,.24)] sm:bottom-7 sm:right-7 sm:size-13"
          style={{ background: `conic-gradient(#8750f7 ${progress * 360}deg, var(--border) 0deg)` }}
        >
          <span className="absolute inset-[2px] rounded-full bg-card backdrop-blur-xl" />
          <ArrowUp className="relative z-10 text-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:text-violet-500" size={18} />
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
