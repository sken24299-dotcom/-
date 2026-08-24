'use client';

import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { useMemo, useState } from 'react';
import { useLanguage } from '@/components/language-provider';
import { useCms } from '@/components/cms-provider';
import { Localized } from '@/components/localized';
import { PortfolioImage } from '@/components/portfolio-image';
import { Reveal } from '@/components/reveal';
import { SectionHeading } from '@/components/section-heading';
import { getProjectCategoryEn } from '@/lib/project-category';
import type { Project } from '@/types/project';

const filters = [
  { label: '全部', labelEn: 'All', value: 'all' },
  { label: 'AI 产品', labelEn: 'AI Product', value: 'ai' },
  { label: '电商视觉', labelEn: 'Commerce', value: 'commerce' },
  { label: '品牌设计', labelEn: 'Brand', value: 'brand' },
  { label: '前端开发', labelEn: 'Frontend', value: 'frontend' },
  { label: 'SaaS', labelEn: 'SaaS', value: 'saas' },
  { label: '创意实验', labelEn: 'Lab', value: 'creative' },
];

function matchesFilter(project: Project, filter: string) {
  const category = project.category.toLowerCase();
  const searchable = [project.title, project.titleEn, project.category, ...project.tags].filter(Boolean).join(' ').toLowerCase();
  if (filter === 'all') return true;
  if (filter === 'ai') return searchable.includes('ai');
  if (filter === 'commerce') return searchable.includes('电商') || searchable.includes('commerce') || searchable.includes('listing');
  if (filter === 'brand') return searchable.includes('品牌') || searchable.includes('brand');
  if (filter === 'frontend') return category.includes('前端') || searchable.includes('frontend') || searchable.includes('next.js');
  if (filter === 'saas') return searchable.includes('saas');
  return searchable.includes('创意') || searchable.includes('experiment') || searchable.includes('creative') || searchable.includes('motion');
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const { language } = useLanguage();
  const reduceMotion = useReducedMotion();
  const rotateX = useSpring(useMotionValue(0), { stiffness: 180, damping: 24 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 180, damping: 24 });
  const source = project.imageBase ? `${project.imageBase}-1536.webp` : project.coverImage;

  function move(event: ReactPointerEvent<HTMLElement>) {
    if (event.pointerType === 'touch' || reduceMotion) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    rotateX.set(((y / bounds.height) - .5) * -3.5);
    rotateY.set(((x / bounds.width) - .5) * 3.5);
    event.currentTarget.style.setProperty('--pointer-x', `${x}px`);
    event.currentTarget.style.setProperty('--pointer-y', `${y}px`);
  }

  return (
    <motion.a href={`/work/${project.slug}`} aria-label={language === 'zh' ? `查看 ${project.title} 详情` : `View ${project.titleEn ?? project.title} case study`} layout className="project-card group relative block aspect-[4/3] overflow-hidden rounded-[14px] border border-white/10 bg-[#0b0614] shadow-[0_14px_40px_rgba(0,0,0,.2)]" onPointerMove={move} onPointerLeave={() => { rotateX.set(0); rotateY.set(0); }} style={{ rotateX, rotateY, transformPerspective: 1400 }} whileHover={reduceMotion ? undefined : { y: -2 }} whileTap={reduceMotion ? undefined : { scale: .992 }} transition={{ duration: .22 }}>
      <PortfolioImage src={source} alt={language === 'zh' ? `${project.title} 项目封面` : `${project.titleEn ?? project.title} project cover`} fill sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 360px" priority={index < 3} className="object-cover transition-transform duration-700 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-[1.045]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/10 to-black/5" />
      <div className="project-pointer-glow pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="absolute inset-x-0 top-0 z-[2] flex items-center justify-between p-3 sm:p-4">
        <span className="rounded-full border border-white/12 bg-black/30 px-3 py-1.5 font-mono text-[9px] tracking-[.16em] text-white/60 backdrop-blur-xl">PROJECT / {project.number ?? String(index + 1).padStart(2, '0')}</span>
        <span className="text-xs uppercase tracking-[.12em] text-white/45"><Localized zh={project.category} en={getProjectCategoryEn(project.category)} /></span>
      </div>
      <div className="absolute inset-x-0 bottom-0 z-[2] p-2.5 sm:p-3">
        <div className="translate-y-1 rounded-[12px] border border-white/10 bg-black/58 p-3 backdrop-blur-2xl transition-all duration-300 group-hover:translate-y-0 group-hover:border-violet-300/20 sm:p-4">
          <h3 className="max-w-[540px] text-lg font-semibold leading-[1.2] tracking-[-.03em] text-white sm:text-xl"><Localized zh={project.title} en={project.titleEn ?? project.title} /></h3>
          <p className="mt-1.5 hidden line-clamp-1 text-[13px] leading-5 text-white/58 sm:block"><Localized zh={project.description} en={project.descriptionEn ?? project.description} /></p>
          <div className="mt-2.5 flex items-end justify-end gap-3 border-t border-white/10 pt-2.5 sm:justify-between">
            <div className="hidden flex-wrap gap-1.5 sm:flex">{project.tags.slice(0, 2).map((tag) => <span key={tag} className="rounded-full border border-white/10 px-2 py-0.5 text-[8px] uppercase tracking-[.11em] text-white/48">{tag}</span>)}</div>
            <span className="flex size-9 shrink-0 items-center justify-center rounded-[8px] bg-primary text-white opacity-100 shadow-[0_8px_22px_rgba(135,80,247,.24)] transition-all group-hover:-translate-y-px group-hover:translate-x-px sm:opacity-0 sm:group-hover:opacity-100"><ArrowUpRight size={15} /></span>
          </div>
        </div>
      </div>
    </motion.a>
  );
}

export function Projects({ projects, archive = false }: { projects: Project[]; archive?: boolean }) {
  const { sectionHeadings } = useCms();
  const [filter, setFilter] = useState('all');
  const filtered = useMemo(() => projects.filter((project) => matchesFilter(project, filter)), [projects, filter]);

  return (
    <section id="work" className="section-space relative border-y border-border bg-[var(--surface)]">
      <div className="section-glow section-glow-right" />
      <div className="site-container">
        <Reveal><SectionHeading align="center" index={archive ? 'WORK' : '03'} eyebrow={<Localized zh={archive ? '作品档案' : '精选作品'} en={archive ? 'Work Archive' : 'Selected Work'} />} title={<Localized zh={archive ? '作品，记录思考与结果。' : sectionHeadings.workTitle.zh} en={archive ? 'Work that records thinking and outcomes.' : sectionHeadings.workTitle.en} />} description={<Localized zh={sectionHeadings.workDescription.zh} en={sectionHeadings.workDescription.en} />} /></Reveal>
        <Reveal delay={.06}>
          <div className="mx-auto mb-8 flex w-fit max-w-full flex-wrap justify-center gap-1 rounded-[10px] border border-border bg-card/70 p-1 shadow-sm backdrop-blur-xl">
            {filters.map((item) => <button key={item.value} type="button" onClick={() => setFilter(item.value)} className={`ui-pressable rounded-[7px] px-3 py-1.5 text-[13px] font-medium ${filter === item.value ? 'bg-primary text-white shadow-[0_6px_18px_rgba(135,80,247,.18)]' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`} aria-pressed={filter === item.value}><Localized zh={item.label} en={item.labelEn} /></button>)}
          </div>
        </Reveal>
        <motion.div layout className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, index) => <motion.div key={project.id} layout initial={{ opacity: 0, scale: .97, y: 14 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: .97, y: 8 }} transition={{ duration: .35, delay: index * .035 }}><ProjectCard project={project} index={index} /></motion.div>)}
          </AnimatePresence>
        </motion.div>
        {!archive ? <div className="mt-8 flex justify-center"><a href="/work" className="premium-action group relative isolate inline-flex h-10 items-center gap-2 overflow-hidden rounded-[8px] border border-border bg-card/60 px-5 text-sm font-semibold text-foreground transition hover:-translate-y-px hover:border-violet-500/35"><Localized zh="全部作品" en="All Work" /> <ArrowUpRight className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" size={14} /></a></div> : null}
      </div>
    </section>
  );
}
