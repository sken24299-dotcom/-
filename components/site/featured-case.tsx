import { ArrowUpRight } from 'lucide-react';
import { Localized } from '@/components/localized';
import { PortfolioImage } from '@/components/portfolio-image';
import { Reveal } from '@/components/reveal';
import { getProjectCategoryEn } from '@/lib/project-category';
import type { Project } from '@/types/project';

const objectives = [
  { zh: '策略与洞察', en: 'Strategy & insight' },
  { zh: '视觉系统', en: 'Visual system' },
  { zh: '生成式工作流', en: 'Generative workflow' },
  { zh: '前端展示', en: 'Frontend delivery' },
];

export function FeaturedCase({ project }: { project: Project }) {
  const image = project.imageBase ? `${project.imageBase}-1536.webp` : project.coverImage;
  const categoryEn = getProjectCategoryEn(project.category);
  const meta = [
    { label: '项目分类', labelEn: 'Category', value: project.category, valueEn: categoryEn },
    { label: '客户类型', labelEn: 'Client type', value: 'AI / 电商业务', valueEn: 'AI / Commerce Business' },
    { label: '开始时间', labelEn: 'Year', value: project.year ?? '2026', valueEn: project.year ?? '2026' },
    { label: '设计角色', labelEn: 'Role', value: '策略 · 设计 · 开发', valueEn: 'Strategy · Design · Development' },
  ];

  return (
    <section className="section-space relative overflow-hidden border-y border-border bg-[var(--surface)]">
      <div className="case-spotlight absolute left-1/2 top-0 h-[520px] w-[800px] -translate-x-1/2 rounded-full bg-violet-500/10 blur-[150px]" />
      <div className="site-container relative">
        <Reveal>
          <div className="mb-8 flex flex-col gap-4 sm:mb-9 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="text-sm uppercase tracking-[.14em] text-violet-500"><Localized zh="重点案例" en="Featured Case" /></p><h2 className="type-page-title mt-4 max-w-3xl text-balance"><Localized zh={<>AI 电商视觉系统</>} en={<>AI E-commerce Visual System</>} /></h2></div>
            <a href={`/work/${project.slug}`} className="group inline-flex h-10 items-center gap-2 rounded-[8px] border border-border bg-card/60 px-4 text-sm font-semibold transition hover:-translate-y-px hover:border-violet-500/35"><Localized zh="查看案例" en="View Case" /> <ArrowUpRight className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" size={14} /></a>
          </div>
        </Reveal>
        <Reveal amount={.08}>
          <div className="overflow-hidden rounded-[14px] border border-white/10 bg-[#08040e] shadow-[0_18px_56px_rgba(0,0,0,.28)]">
            <div className="relative aspect-[16/9] overflow-hidden"><PortfolioImage src={image} alt={`${project.titleEn ?? project.title} featured case visual`} fill sizes="(max-width: 1280px) 100vw, 1240px" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" /></div>
            <div className="grid gap-px bg-white/10 lg:grid-cols-[1.15fr_.85fr]">
              <div className="bg-[#09050f] p-5 sm:p-6"><p className="text-[11px] uppercase tracking-[.13em] text-violet-300/65"><Localized zh="项目目标" en="Objective" /></p><h3 className="mt-3 text-xl font-semibold leading-[1.35] tracking-[-.03em] text-white sm:text-2xl"><Localized zh="提升 AI 视觉效率，同时保持品牌判断。" en="Improve AI visual production without losing brand judgment." /></h3><p className="mt-4 max-w-2xl text-sm leading-6 text-white/60"><Localized zh={project.overview ?? project.description} en={project.descriptionEn ?? project.description} /></p><div className="mt-5 grid gap-2.5 sm:grid-cols-2">{objectives.map((item, index) => <div key={item.en} className="rounded-[10px] border border-white/10 bg-white/[.035] p-3"><span className="font-mono text-[10px] text-white/40">0{index + 1}</span><p className="mt-2 text-sm font-medium text-white/78"><Localized zh={item.zh} en={item.en} /></p></div>)}</div></div>
              <div className="grid grid-cols-2 gap-px bg-white/10">{meta.map((item) => <div key={item.labelEn} className="min-h-28 bg-[#0b0711] p-4 sm:min-h-36 sm:p-5"><p className="text-[10px] uppercase tracking-[.11em] text-white/45"><Localized zh={item.label} en={item.labelEn} /></p><p className="mt-9 text-sm font-medium leading-6 text-white/75 sm:mt-12"><Localized zh={item.value} en={item.valueEn} /></p></div>)}</div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
