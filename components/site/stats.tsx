import { Localized } from '@/components/localized';
import { stats } from '@/lib/site-content';

export function Stats() {
  return (
    <section id="stats" className="relative border-y border-border bg-[var(--surface)]" aria-label="项目数据 / Portfolio metrics">
      <div className="site-container grid grid-cols-2 lg:grid-cols-4">
        {stats.map((item, index) => (
          <article key={item.labelEn} className={`py-4 sm:py-5 ${index % 2 ? 'border-l border-border' : ''} ${index > 1 ? 'border-t border-border lg:border-t-0' : ''} ${index > 0 ? 'lg:border-l lg:border-border' : ''}`}>
            <div className="flex min-h-12 items-center justify-center px-3 text-center sm:min-h-14 sm:px-5">
              <p className="max-w-32 text-[13px] font-medium leading-5 text-foreground"><Localized zh={item.label} en={item.labelEn} /></p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
