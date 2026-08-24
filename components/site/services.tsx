'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowDownRight } from 'lucide-react';
import { useState } from 'react';
import { Localized } from '@/components/localized';
import { useCms } from '@/components/cms-provider';
import { Reveal } from '@/components/reveal';
import { SectionHeading } from '@/components/section-heading';
import { services } from '@/lib/site-content';

export function Services() {
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();
  const { sectionHeadings } = useCms();

  return (
    <section id="services" className="section-shell section-space relative">
      <div className="section-glow section-glow-left" />
      <div className="site-container">
        <Reveal>
          <div data-lang="zh"><SectionHeading align="center" index="02" eyebrow="服务" title={sectionHeadings.servicesTitle.zh} description={sectionHeadings.servicesDescription.zh} /></div>
          <div data-lang="en"><SectionHeading align="center" index="02" eyebrow="Services" title={sectionHeadings.servicesTitle.en} description={sectionHeadings.servicesDescription.en} /></div>
        </Reveal>

        <div className="overflow-hidden border-y border-border">
          {services.map((service, index) => {
            const selected = active === index;
            return (
              <motion.article
                key={service.number}
                className={`group relative isolate cursor-pointer overflow-hidden border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet-400 ${index ? 'border-t' : ''}`}
                role="button"
                tabIndex={0}
                aria-pressed={selected}
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                onClick={() => setActive(index)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setActive(index);
                  }
                }}
                layout={!reduceMotion}
                whileTap={reduceMotion ? undefined : { scale: .995 }}
              >
                <AnimatePresence>{selected ? <motion.div className="absolute inset-0 -z-10 bg-[linear-gradient(112deg,#5f2bbd,#8750f7_54%,#6b45cd)]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.28 }} /> : null}</AnimatePresence>
                <div className={`grid grid-cols-[34px_minmax(0,1fr)_36px] items-center gap-x-3 gap-y-2.5 px-2 py-5 transition-colors sm:grid-cols-[48px_minmax(0,1fr)_40px] sm:px-4 lg:grid-cols-[54px_1fr_1.2fr_42px] lg:gap-5 lg:px-5 ${selected ? 'text-white' : 'text-foreground'}`}>
                  <span className={`font-mono text-xs tracking-[0.16em] ${selected ? 'text-white/65' : 'text-violet-500'}`}>{service.number}</span>
                  <div><h3 className="text-lg font-semibold tracking-[-0.03em] sm:text-xl"><Localized zh={service.title} en={service.titleEn} /></h3><p className={`mt-1 text-[11px] uppercase tracking-[0.1em] ${selected ? 'text-white/55' : 'text-muted-foreground'}`}><Localized zh={service.scope} en={service.scopeEn} /></p></div>
                  <motion.p className={`col-span-2 col-start-2 text-sm leading-6 lg:col-span-1 lg:col-start-3 ${selected ? 'text-white/72' : 'text-muted-foreground'}`} animate={{ opacity: selected ? 1 : 0.72, x: selected && !reduceMotion ? 2 : 0 }}><Localized zh={service.description} en={service.descriptionEn} /></motion.p>
                  <span className={`col-start-3 row-start-1 ml-auto flex size-9 items-center justify-center rounded-[8px] border transition-all lg:col-start-4 ${selected ? 'rotate-90 border-white/25 bg-white/12' : 'border-border text-muted-foreground group-hover:rotate-45 group-hover:text-foreground'}`}><ArrowDownRight size={16} /></span>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
