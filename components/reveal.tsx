'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

const variants: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.992, filter: 'blur(4px)' },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.52, delay: Math.min(delay, 0.18), ease: [0.22, 1, 0.36, 1] },
  }),
};

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  amount?: number;
};

export function Reveal({ children, className, delay = 0, amount = 0.18 }: RevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={cn(className)}
      initial={reduceMotion ? false : 'hidden'}
      whileInView={reduceMotion ? undefined : 'visible'}
      viewport={{ once: true, amount }}
      variants={variants}
      custom={delay}
    >
      {children}
    </motion.div>
  );
}
