import { ArrowUpRight, Clock3 } from 'lucide-react';
import { Localized } from '@/components/localized';
import { Reveal } from '@/components/reveal';
import { SectionHeading } from '@/components/section-heading';
import { articles } from '@/lib/site-content';

export function Articles() {
  return (
    <section className="section-space relative border-y border-border bg-[var(--surface)]">
      <div className="site-container">
        <Reveal>
          <div data-lang="zh"><SectionHeading align="center" index="07" eyebrow="文章" title="设计实践笔记。" description="记录 AI、品牌与设计开发协作中的方法和判断。" /></div>
          <div data-lang="en"><SectionHeading align="center" index="07" eyebrow="Articles" title="Notes from practice." description="Ideas and methods from work across AI, brand and design engineering." /></div>
        </Reveal>
        <div className="grid gap-5 lg:grid-cols-3">
          {articles.map((article, index) => (
            <Reveal key={article.titleEn} delay={index * .05}>
              <article className="premium-card group flex h-full flex-col overflow-hidden rounded-[18px] border border-border bg-card/75 transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-500/30 hover:shadow-[0_18px_50px_rgba(0,0,0,.1)]">
                <div className="relative aspect-[16/9] overflow-hidden border-b border-border bg-[radial-gradient(circle_at_25%_20%,rgba(183,140,255,.28),transparent_32%),linear-gradient(135deg,#0b0614,#1b0d31_58%,#090510)]">
                  <div className="absolute inset-0 hero-grid opacity-30" />
                  <span className="absolute bottom-4 left-4 font-mono text-[3.75rem] font-semibold leading-none tracking-[-.08em] text-white/[.08]">0{index + 1}</span>
                  <span className="absolute right-4 top-4 rounded-[8px] border border-white/12 bg-black/25 px-3 py-1.5 text-xs uppercase tracking-[.1em] text-white/65 backdrop-blur-xl"><Localized zh={article.category} en={article.categoryEn} /></span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[.1em] text-muted-foreground">
                    <span><Localized zh="观点" en="Insight" /></span>
                    <span className="flex items-center gap-1.5"><Clock3 size={13} />{article.date}</span>
                  </div>
                  <h3 className="mt-6 text-xl font-semibold leading-[1.35] tracking-[-.035em]"><Localized zh={article.title} en={article.titleEn} /></h3>
                  <p className="mt-3 text-[15px] leading-7 text-muted-foreground"><Localized zh={article.summary} en={article.summaryEn} /></p>
                  <a href="/about#insights" className="mt-auto flex items-center gap-2 pt-7 text-sm font-semibold text-muted-foreground transition group-hover:text-violet-500"><Localized zh="阅读" en="Read" /> <ArrowUpRight className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" size={14} /></a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
