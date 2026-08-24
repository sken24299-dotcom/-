import { GraduationCap, Sparkles } from 'lucide-react';
import { Localized } from '@/components/localized';
import { Reveal } from '@/components/reveal';
import { education, experience } from '@/lib/site-content';

function Column({ title, titleEn, subtitle, subtitleEn, icon: Icon, items }: { title: string; titleEn: string; subtitle: string; subtitleEn: string; icon: typeof Sparkles; items: typeof experience }) {
  return (
    <div>
      <Reveal>
        <div className="mb-5 flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-[8px] bg-violet-500/10 text-violet-500"><Icon size={16} /></span>
          <div>
            <h3 className="text-xl font-semibold tracking-[-.03em]"><Localized zh={title} en={titleEn} /></h3>
            <p className="mt-1 text-[11px] uppercase tracking-[.13em] text-muted-foreground"><Localized zh={subtitle} en={subtitleEn} /></p>
          </div>
        </div>
      </Reveal>
      <div className="space-y-3">
        {items.map((item, index) => (
          <Reveal key={item.titleEn} delay={index * .05}>
            <article className="premium-card group rounded-[14px] border border-border bg-card/65 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-500/30 hover:bg-violet-500/[.05] sm:p-5">
              <p className="text-xs font-semibold tracking-[.1em] text-violet-500"><Localized zh={item.period} en={item.periodEn} /></p>
              <h4 className="mt-2.5 text-lg font-semibold tracking-[-.025em]"><Localized zh={item.title} en={item.titleEn} /></h4>
              <p className="mt-2 text-xs uppercase tracking-[.1em] text-muted-foreground"><Localized zh={item.organization} en={item.organizationEn} /></p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground"><Localized zh={item.description} en={item.descriptionEn} /></p>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

export function ExperienceEducation() {
  return (
    <section id="experience" className="section-shell section-space relative">
      <div className="site-container">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-6"><Column title="经历" titleEn="Experience" subtitle="职业路径" subtitleEn="Career path" icon={Sparkles} items={experience} /><Column title="学习" titleEn="Education" subtitle="持续进化" subtitleEn="Continuous learning" icon={GraduationCap} items={education} /></div>
      </div>
    </section>
  );
}
