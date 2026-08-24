import type { ReactNode } from 'react';
import { Reveal } from '@/components/reveal';

export function InnerHero({ eyebrow, title, description }: { eyebrow: ReactNode; title: ReactNode; description: ReactNode }) {
  return (
    <section id="top" className="case-hero relative overflow-hidden pb-10 pt-24 sm:pb-12 sm:pt-28">
      <div className="hero-grid absolute inset-0" />
      <div className="case-hero-glow" />
      <div className="site-container relative">
        <Reveal><p className="text-xs font-semibold uppercase tracking-[.14em] text-violet-500">{eyebrow}</p><h1 className="type-page-title mt-4 max-w-4xl text-balance">{title}</h1><p className="body-copy mt-4 max-w-2xl">{description}</p></Reveal>
      </div>
    </section>
  );
}
