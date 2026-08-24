'use client';

import { ArrowDownRight } from 'lucide-react';
import { useCms } from '@/components/cms-provider';
import { Localized } from '@/components/localized';
import { Reveal } from '@/components/reveal';
import { SectionHeading } from '@/components/section-heading';

const skills = [
  { zh: 'AI 产品策略', en: 'AI Product Strategy' },
  { zh: 'UI/UX', en: 'UI/UX' },
  { zh: 'Next.js', en: 'Next.js' },
  { zh: 'React', en: 'React' },
  { zh: 'TypeScript', en: 'TypeScript' },
  { zh: 'AI 系统', en: 'AI Systems' },
  { zh: '设计系统', en: 'Design Systems' },
  { zh: '动效设计', en: 'Motion Design' },
];

export function About() {
  const { about } = useCms();
  return (
    <section id="about" className="section-shell section-space relative overflow-hidden">
      <div className="section-glow section-glow-right" aria-hidden="true" />
      <div className="site-container">
        <Reveal>
          <SectionHeading index="01" eyebrow={<Localized zh="关于我" en="About" />} title={<Localized zh={about.title.zh} en={about.title.en} />} />
        </Reveal>
        <div className="grid items-stretch gap-8 lg:grid-cols-[.88fr_1.12fr] lg:gap-9">
          <Reveal amount={0.12}>
            <div className="portrait-stage relative min-h-[340px] overflow-hidden rounded-[14px] border border-border bg-card shadow-[var(--shadow-card)] sm:min-h-[400px]">
              <div className="portrait-grid absolute inset-0" aria-hidden="true" />
              <div className="portrait-halo" aria-hidden="true" />
              <div className="portrait-orbit portrait-orbit-one" aria-hidden="true" />
              <div className="portrait-orbit portrait-orbit-two" aria-hidden="true" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative flex size-[180px] items-center justify-center sm:size-[230px]">
                  <div className="portrait-disc absolute inset-0" />
                  <span className="relative z-[1] text-[68px] font-medium tracking-[-0.08em] text-white sm:text-[88px]">YW</span>
                </div>
              </div>
              <div className="absolute left-5 top-5 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-white/60 backdrop-blur-md sm:left-7 sm:top-7">
                <Localized zh="AI 设计师 / 开发者" en="AI Designer / Developer" />
              </div>
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between border-t border-white/10 pt-4 font-mono text-[9px] uppercase tracking-[0.15em] text-white/50 sm:bottom-7 sm:left-7 sm:right-7">
                <span><Localized zh="思考 · 设计 · 构建" en="Think · Design · Build" /></span>
                <span className="flex items-center gap-2">Portrait 001 <ArrowDownRight size={12} /></span>
              </div>
            </div>
          </Reveal>

          <div className="flex flex-col justify-between py-1 lg:py-3">
            <Reveal delay={0.08}>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-violet-600 dark:text-violet-200/62">Strategy to interface. Concept to production.</p>
                <h3 className="type-section-title mt-4 max-w-[650px] text-balance text-foreground"><Localized zh="在策略、界面与代码之间工作。" en="Working across strategy, interface and code." /></h3>
                <p className="body-copy mt-4 max-w-[620px]">
                  <Localized zh={about.description.zh} en={about.description.en} />
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.14} className="mt-8 lg:mt-10">
              <div>
                <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
                  <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground"><Localized zh="工作工具箱" en="Working toolkit" /></span>
                  <span className="font-mono text-xs text-muted-foreground/60">08 / CORE SKILLS</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span key={skill.en} className="rounded-[8px] border border-border bg-card/50 px-3 py-1.5 text-[13px] text-muted-foreground shadow-sm transition-all duration-200 hover:-translate-y-px hover:border-violet-400/30 hover:bg-violet-500/[0.07] hover:text-foreground">
                      <Localized zh={skill.zh} en={skill.en} />
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
