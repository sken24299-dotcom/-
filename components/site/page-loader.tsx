'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { BrandLogo } from '@/components/brand-logo';

export function PageLoader() {
  const [visible, setVisible] = useState(true);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const seen = sessionStorage.getItem('yu-wang-intro-seen');
    const timeout = window.setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem('yu-wang-intro-seen', 'true');
    }, seen || reduceMotion ? 120 : 900);
    return () => window.clearTimeout(timeout);
  }, [reduceMotion]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#05010a] text-white"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(8px)' }}
          transition={{ duration: reduceMotion ? 0.01 : 0.5, ease: [0.76, 0, 0.24, 1] }}
          aria-hidden="true"
        >
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <BrandLogo inverse className="mx-auto" />
            <div className="mt-5 h-px w-40 overflow-hidden bg-white/10">
              <motion.div className="h-full bg-[#8750f7]" initial={{ x: '-100%' }} animate={{ x: 0 }} transition={{ duration: reduceMotion ? 0.01 : 0.72, ease: [0.22, 1, 0.36, 1] }} />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
