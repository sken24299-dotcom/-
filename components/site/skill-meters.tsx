'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Localized } from '@/components/localized';
import { useCms } from '@/components/cms-provider';
import { Reveal } from '@/components/reveal';
import { SectionHeading } from '@/components/section-heading';
import { skillMeters } from '@/lib/site-content';

export function SkillMeters() {
  const reduceMotion = useReducedMotion();
  const { sectionHeadings } = useCms();

  return (
    <section id="skills" className="section-space relative border-y border-border bg-[var(--surface)]">
      <div className="site-container">
        <Reveal>
          <div data-lang="zh">
            <SectionHeading align="center" index="05" eyebrow="能力" title={sectionHeadings.skillsTitle.zh} description={sectionHeadings.skillsDescription.zh} />
          </div>
          <div data-lang="en">
            <SectionHeading align="center" index="05" eyebrow="Capabilities" title={sectionHeadings.skillsTitle.en} description={sectionHeadings.skillsDescription.en} />
          </div>
        </Reveal>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {skillMeters.map((skill, index) => (
            <Reveal key={skill.code} delay={index * .035}>
              <motion.article
                className="group relative min-h-40 overflow-hidden rounded-[14px] border border-border bg-card/70 p-4 transition-colors hover:border-violet-500/35 hover:bg-violet-500/[.05]"
                whileHover={reduceMotion ? undefined : { y: -2 }}
              >
                <div className="flex items-start justify-between">
                  <span className="flex size-9 items-center justify-center rounded-[8px] border border-border bg-muted font-mono text-[11px] text-violet-500">{skill.code}</span>
                  <span className="text-xl font-semibold tracking-[-.035em] text-foreground">{skill.value}<span className="text-xs text-violet-500">%</span></span>
                </div>
                <h3 className="mt-6 text-base font-semibold tracking-[-.02em]"><Localized zh={skill.name} en={skill.nameEn} /></h3>
                <p className="mt-1.5 text-[13px] leading-5 text-muted-foreground"><Localized zh={skill.focus} en={skill.focusEn} /></p>
                <div className="mt-4 h-1 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className="h-full origin-left rounded-full bg-[linear-gradient(90deg,#8750f7,#b78cff)]"
                    initial={{ scaleX: reduceMotion ? skill.value / 100 : 0 }}
                    whileInView={{ scaleX: skill.value / 100 }}
                    viewport={{ once: true, amount: .8 }}
                    transition={{ duration: reduceMotion ? .01 : .72, delay: index * .035, ease: [0.22, 1, .36, 1] }}
                  />
                </div>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
