import { ArrowLeft, ArrowUpRight, ExternalLink, Github } from 'lucide-react';
import { Localized } from '@/components/localized';
import { PortfolioImage } from '@/components/portfolio-image';
import { Reveal } from '@/components/reveal';
import { buttonVariants } from '@/components/ui/button';
import { getProjectCategoryEn } from '@/lib/project-category';
import { cn } from '@/lib/utils';
import type { Project } from '@/types/project';

function CaseVisual({ project, image, priority = false }: { project: Project; image: string; priority?: boolean }) {
  return (
    <PortfolioImage
      className="h-auto w-full object-cover"
      src={priority && project.imageBase ? `${project.imageBase}-1536.webp` : image}
      alt={`${project.title} 案例视觉`}
      width={1536}
      height={1024}
      sizes="(max-width: 1024px) 100vw, 960px"
      priority={priority}
    />
  );
}

export function CaseStudy({ project, nextProject }: { project: Project; nextProject?: Project }) {
  const details: Array<{ number: string; titleZh: string; titleEn: string; body: string }> = [];
  if (project.challenge) details.push({ number: '01', titleZh: '项目挑战', titleEn: 'Challenge', body: project.challenge });
  if (project.approach) details.push({ number: '02', titleZh: '设计方法', titleEn: 'Approach', body: project.approach });
  if (project.outcome) details.push({ number: '03', titleZh: '项目成果', titleEn: 'Outcome', body: project.outcome });
  const gallery = (project.images ?? []).filter((image) => image && image !== project.coverImage);
  const safeExternalUrl = (value?: string) => {
    if (!value) return undefined;
    try {
      const url = new URL(value);
      return url.protocol === 'http:' || url.protocol === 'https:' ? value : undefined;
    } catch { return undefined; }
  };
  const projectUrl = safeExternalUrl(project.projectUrl);
  const githubUrl = safeExternalUrl(project.githubUrl);

  return (
    <main id="main-content" className="case-page overflow-hidden bg-background text-foreground">
      <section className="case-hero relative overflow-hidden pb-8 pt-20 sm:pb-9 sm:pt-24">
        <div className="hero-grid absolute inset-0" aria-hidden="true" />
        <div className="case-hero-glow" aria-hidden="true" />
        <div className="site-container relative z-[1]">
          <Reveal>
            <a className="mb-5 inline-flex min-h-9 items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground" href="/work">
              <ArrowLeft size={15} /> <Localized zh="返回精选作品" en="Back to work" />
            </a>
            <div className="flex flex-wrap items-center gap-3 font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
              <span className="text-violet-600 dark:text-violet-200/70">Project / {project.number ?? 'Case'}</span>
              <span className="h-px w-5 bg-border" />
              <span><Localized zh={project.category} en={getProjectCategoryEn(project.category)} /></span>
              <span className="ml-auto">{project.year ?? new Date(project.createdAt).getFullYear()}</span>
            </div>
            <h1 className="mt-4 max-w-[760px] text-balance text-[clamp(2rem,4vw,3.25rem)] font-[750] leading-[1.06] tracking-[-0.05em] text-foreground">
              <Localized zh={project.title} en={project.titleEn ?? project.title} />
            </h1>
            {project.titleEn ? <p className="mt-3 text-[13px] tracking-[0.11em] text-muted-foreground"><Localized zh={project.titleEn} en={project.title} /></p> : null}
            <p className="body-copy mt-4 max-w-[620px] text-balance"><Localized zh={project.description} en={project.descriptionEn ?? project.description} /></p>
            <div className="mt-5 flex flex-wrap gap-2">
              {project.tags.map((tag) => <span key={tag} className="rounded-[8px] border border-border bg-card/55 px-2.5 py-1 text-[11px] uppercase tracking-[0.1em] text-muted-foreground">{tag}</span>)}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="site-container">
        <Reveal amount={0.08}>
          <div className="case-image case-media overflow-hidden rounded-[14px] border border-border bg-card">
            <CaseVisual project={project} image={project.coverImage} priority />
          </div>
        </Reveal>
      </section>

      <section className="site-container section-space grid gap-6 lg:grid-cols-[.72fr_1.28fr] lg:gap-10">
        <Reveal>
          <div className="lg:sticky lg:top-24 lg:self-start">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground"><Localized zh="项目概览" en="Project overview" /></p>
            <div className="mt-5 space-y-5 border-t border-border pt-5">
              <div><p className="text-[9px] uppercase tracking-[0.16em] text-muted-foreground/70">Services</p><p className="mt-2 text-sm leading-7 text-muted-foreground">{(project.services ?? project.tags).join(' · ')}</p></div>
              {project.value ? <div><p className="text-[9px] uppercase tracking-[0.16em] text-muted-foreground/70">Outcome</p><p className="mt-2 text-sm leading-7 text-muted-foreground">{project.value}</p></div> : null}
              <div><p className="text-[9px] uppercase tracking-[0.16em] text-muted-foreground/70">Year</p><p className="mt-2 text-sm text-muted-foreground">{project.year ?? new Date(project.createdAt).getFullYear()}</p></div>
              {(projectUrl || githubUrl) ? (
                <div className="flex flex-wrap gap-2 pt-2">
                  {projectUrl ? <a className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))} href={projectUrl} target="_blank" rel="noreferrer"><Localized zh="访问项目" en="Visit project" /> <ExternalLink size={14} /></a> : null}
                  {githubUrl ? <a className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))} href={githubUrl} target="_blank" rel="noreferrer">GitHub <Github size={14} /></a> : null}
                </div>
              ) : null}
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="text-pretty text-[clamp(1.25rem,2vw,1.75rem)] font-semibold leading-[1.46] tracking-[-0.03em] text-foreground/90"><Localized zh={project.overview ?? project.description} en={project.descriptionEn ?? project.overview ?? project.description} /></p>
        </Reveal>
      </section>

      {details.length ? (
        <section className="border-y border-border bg-[var(--surface)]">
          <div className="site-container divide-y divide-border">
            {details.map(({ number, titleZh, titleEn, body }, index) => (
              <Reveal key={number} delay={index * 0.05} amount={0.24}>
                <article className="grid gap-4 py-8 sm:py-10 lg:grid-cols-[.72fr_1.28fr] lg:gap-10">
                  <div className="flex items-start gap-4">
                    <span className="font-mono text-[10px] text-violet-500">{number}</span>
                    <h2 className="text-xl font-semibold tracking-[-0.04em] sm:text-2xl"><Localized zh={titleZh} en={titleEn} /></h2>
                  </div>
                  <p className="body-copy max-w-[720px]">{body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}

      {gallery.length ? (
        <section className="site-container section-space grid gap-4">
          {gallery.map((image, index) => (
            <Reveal key={image} delay={index * 0.04} amount={0.08}>
              <div className="case-image case-media overflow-hidden rounded-[14px] border border-border bg-card">
                <CaseVisual project={project} image={image} />
              </div>
            </Reveal>
          ))}
        </section>
      ) : null}

      {(project.principles?.length ?? 0) > 0 ? (
        <section className="site-container section-space">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground"><Localized zh="设计原则" en="Design principles" /></p>
            <h2 className="type-page-title mt-4 max-w-3xl text-balance"><Localized zh="塑造体验的关键判断。" en="Principles that shape the experience." /></h2>
          </Reveal>
          <div className="mt-6 grid gap-px overflow-hidden rounded-[14px] border border-border bg-border sm:grid-cols-3">
            {project.principles?.map((principle, index) => (
              <Reveal key={principle} delay={index * 0.06}>
                <div className="min-h-[128px] bg-card p-4">
                  <span className="font-mono text-[10px] text-muted-foreground/60">0{index + 1}</span>
                  <p className="mt-10 text-base font-semibold tracking-[-0.03em] text-foreground/85">{principle}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}

      <section className="border-t border-border">
        {nextProject ? (
          <a className="site-container group flex items-end justify-between gap-6 py-10" href={`/work/${nextProject.slug}`}>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground"><Localized zh="下一个项目" en="Next project" /></p>
              <h2 className="type-page-title mt-4 max-w-[760px] text-balance transition-colors group-hover:text-violet-500"><Localized zh={nextProject.title} en={nextProject.titleEn ?? nextProject.title} /></h2>
            </div>
            <span className="mb-1 flex size-10 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:border-foreground/20 group-hover:text-foreground sm:size-12"><ArrowUpRight size={18} /></span>
          </a>
        ) : (
          <div className="site-container flex justify-center py-10">
            <a className={buttonVariants({ variant: 'outline' })} href="/work"><ArrowLeft size={14} /> <Localized zh="返回作品列表" en="Back to all work" /></a>
          </div>
        )}
      </section>
    </main>
  );
}
