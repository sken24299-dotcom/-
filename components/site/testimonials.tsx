'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Quote, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/components/language-provider';
import { Localized } from '@/components/localized';
import { Reveal } from '@/components/reveal';
import { testimonials } from '@/lib/site-content';

export function Testimonials() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const reduceMotion = useReducedMotion();
  const { language } = useLanguage();

  useEffect(() => {
    if (reduceMotion) return;
    const interval = window.setInterval(() => {
      setDirection(1);
      setActive((value) => (value + 1) % testimonials.length);
    }, 6500);
    return () => window.clearInterval(interval);
  }, [reduceMotion]);

  function navigate(next: number) {
    setDirection(next > active || (active === testimonials.length - 1 && next === 0) ? 1 : -1);
    setActive(next);
  }

  const visibleItems = [testimonials[active], testimonials[(active + 1) % testimonials.length]];

  return (
    <section id="testimonials" className="section-shell section-space relative overflow-hidden">
      <div className="absolute left-1/2 top-1/2 size-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/[.07] blur-[140px]" />
      <div className="site-container relative grid items-start gap-8 lg:grid-cols-[.7fr_1.3fr] lg:gap-9">
        <Reveal>
          <div className="lg:sticky lg:top-24">
            <p className="text-xs uppercase tracking-[.15em] text-violet-500"><Localized zh="客户反馈" en="Client Stories" /></p>
            <h2 className="type-page-title mt-3 text-balance"><Localized zh="合作反馈。" en="Client stories." /></h2>
            <p className="body-copy mt-4 max-w-md"><Localized zh="清晰沟通，可靠交付，长期合作。" en="Clear communication, reliable delivery and lasting collaboration." /></p>
            <div className="mt-6 flex gap-2">
              <button type="button" onClick={() => navigate((active - 1 + testimonials.length) % testimonials.length)} className="ui-pressable flex size-10 items-center justify-center rounded-[8px] border border-border bg-card text-muted-foreground hover:border-violet-500/30 hover:text-violet-500" aria-label={language === 'zh' ? '上一组评价' : 'Previous testimonials'}><ArrowLeft size={16} /></button>
              <button type="button" onClick={() => navigate((active + 1) % testimonials.length)} className="ui-pressable flex size-10 items-center justify-center rounded-[8px] bg-primary text-white hover:bg-[var(--primary-hover)]" aria-label={language === 'zh' ? '下一组评价' : 'Next testimonials'}><ArrowRight size={16} /></button>
            </div>
          </div>
        </Reveal>

        <div className="min-h-[270px] overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div key={active} className="grid gap-4 md:grid-cols-2" custom={direction} initial={reduceMotion ? false : { opacity: 0, x: direction * 36 }} animate={{ opacity: 1, x: 0 }} exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: direction * -32 }} transition={{ duration: reduceMotion ? .01 : .46, ease: [0.22, 1, .36, 1] }}>
              {visibleItems.map((item, index) => (
                <article key={`${item.name}-${index}`} className={`premium-card relative min-h-[260px] flex-col overflow-hidden rounded-[14px] border border-border bg-card/70 p-5 shadow-sm backdrop-blur-xl ${index === 1 ? 'hidden md:flex' : 'flex'}`}>
                  <Quote className="absolute right-5 top-5 text-violet-500/12" size={56} strokeWidth={1} />
                  <div className="flex gap-1 text-violet-500">{Array.from({ length: 5 }).map((_, star) => <Star key={star} size={14} fill="currentColor" />)}</div>
                  <blockquote className="relative mt-6 text-[15px] font-semibold leading-[1.65] tracking-[-.02em]">“<Localized zh={item.quote} en={item.quoteEn} />”</blockquote>
                  <div className="mt-auto flex items-center gap-3 pt-7"><span className="flex size-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,#8750f7,#b78cff)] text-[11px] font-semibold text-white">{item.initials}</span><div><p className="text-sm font-semibold">{item.name}</p><p className="mt-1 text-[11px] uppercase tracking-[.1em] text-muted-foreground"><Localized zh={item.role} en={item.roleEn} /></p></div></div>
                </article>
              ))}
            </motion.div>
          </AnimatePresence>
          <div className="mt-4 flex gap-1.5">{testimonials.map((testimonial, index) => <button key={testimonial.name} type="button" onClick={() => navigate(index)} className={`ui-pressable h-1.5 rounded-full ${active === index ? 'w-7 bg-[#8750f7]' : 'w-2 bg-muted-foreground/25'}`} aria-label={language === 'zh' ? `查看第 ${index + 1} 组评价` : `View testimonial group ${index + 1}`} />)}</div>
        </div>
      </div>
    </section>
  );
}
