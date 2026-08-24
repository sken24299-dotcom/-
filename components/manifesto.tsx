'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Localized } from '@/components/localized';
import { Reveal } from '@/components/reveal';

const particles = Array.from({ length: 26 }, (_, index) => ({
  left: (index * 43 + 9) % 96,
  top: (index * 29 + 17) % 90,
  delay: (index % 8) * 0.65,
}));

export function Manifesto() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="manifesto-shell section-space relative flex min-h-[360px] items-center overflow-hidden border-y border-border">
      <div className="manifesto-grid absolute inset-0" aria-hidden="true" />
      <div className="manifesto-glow" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {particles.map((particle, index) => (
          <span key={index} className="manifesto-particle" style={{ left: `${particle.left}%`, top: `${particle.top}%`, animationDelay: `${particle.delay}s` }} />
        ))}
      </div>
      <div className="site-container relative z-[1] text-center">
        <Reveal>
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground"><Localized zh="设计观点" en="Design point of view" /></p>
          <blockquote className="mx-auto max-w-[820px] text-balance text-[clamp(2rem,4.2vw,3.75rem)] font-semibold leading-[1.04] tracking-[-0.05em]">
            <span className="text-muted-foreground/55"><Localized zh="设计不是装饰。" en="Design is not decoration." /></span>
            <br />
            <motion.span
              className="manifesto-gradient"
              initial={reduceMotion ? false : { backgroundPosition: '0% 50%' }}
              whileInView={reduceMotion ? undefined : { backgroundPosition: '100% 50%' }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
            >
              <Localized zh="它是解决问题。" en="It is problem solving." />
            </motion.span>
          </blockquote>
          <p className="body-copy mx-auto mt-5 max-w-[560px] text-balance">
            <Localized zh="好的体验目标清晰、使用自然，并拥有安静的力量。" en="Good experiences feel purposeful, intuitive and quietly confident." />
          </p>
        </Reveal>
      </div>
    </section>
  );
}
