'use client';

import { motion, useMotionTemplate, useMotionValue, useReducedMotion } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight, Dribbble, Github, Linkedin, Mail, PanelsTopLeft } from 'lucide-react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { useLanguage } from '@/components/language-provider';
import { useCms } from '@/components/cms-provider';
import { Localized } from '@/components/localized';
import { PortfolioImage } from '@/components/portfolio-image';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/yuwang', icon: Github },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/yuwang', icon: Linkedin },
  { label: 'Behance', href: 'https://www.behance.net/yuwang', icon: PanelsTopLeft },
  { label: 'Dribbble', href: 'https://dribbble.com/yuwang', icon: Dribbble },
  { label: 'Email', href: 'mailto:hello@yuwang.design', icon: Mail },
];

const particles = Array.from({ length: 26 }, (_, index) => ({ left: (index * 41 + 9) % 98, top: (index * 59 + 13) % 94, delay: (index % 8) * 0.6 }));

export function Hero() {
  const { language } = useLanguage();
  const reduceMotion = useReducedMotion();
  const { hero, site } = useCms();
  const configuredSocialLinks = socialLinks.map((link) => ({ ...link, href: link.label === 'GitHub' ? site.github : link.label === 'LinkedIn' ? site.linkedin : link.label === 'Email' ? `mailto:${site.email}` : link.href })).filter((link) => Boolean(link.href));
  const mouseX = useMotionValue(720);
  const mouseY = useMotionValue(420);
  const glow = useMotionTemplate`radial-gradient(460px circle at ${mouseX}px ${mouseY}px, rgba(135,80,247,.14), transparent 68%)`;

  function handlePointerMove(event: ReactPointerEvent<HTMLElement>) {
    if (reduceMotion) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    mouseX.set(event.clientX - bounds.left);
    mouseY.set(event.clientY - bounds.top);
  }

  const reveal = (delay: number, y = 18) => ({
    initial: reduceMotion ? false : { opacity: 0, y, filter: 'blur(5px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    transition: { delay, duration: 0.62, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  });

  return (
    <section id="top" className="hero-shell relative overflow-hidden pt-16 sm:pt-[68px] md:h-[620px]" onPointerMove={handlePointerMove}>
      <div className="hero-grid absolute inset-0" aria-hidden="true" />
      <div className="hero-orb hero-orb-one" aria-hidden="true" />
      <div className="hero-orb hero-orb-two" aria-hidden="true" />
      <motion.div className="pointer-events-none absolute inset-0 hidden md:block" style={{ background: glow }} aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {particles.map((particle, index) => <span key={index} className="hero-particle" style={{ left: `${particle.left}%`, top: `${particle.top}%`, animationDelay: `${particle.delay}s`, animationDuration: `${6 + index % 5}s` }} />)}
      </div>

      <div className="site-container relative z-[2] grid items-center gap-6 py-7 sm:gap-7 sm:py-10 md:h-[552px] md:grid-cols-[1.08fr_.92fr] md:py-7 lg:gap-10">
        <div>
          <motion.p {...reveal(0.14)} className="mb-3 text-xs font-semibold uppercase tracking-[.14em] text-violet-500">
            <Localized zh={hero.eyebrow.zh} en={hero.eyebrow.en} />
          </motion.p>
          <motion.h1 {...reveal(0.2, 24)} className="hero-gradient type-display max-w-[690px] text-balance">
            <span data-lang="zh" className="whitespace-pre-line">{hero.title.zh}</span>
            <span data-lang="en" className="whitespace-pre-line">{hero.title.en}</span>
          </motion.h1>
          <motion.p {...reveal(0.32)} className="body-copy mt-4 max-w-[540px]">
            <Localized zh={hero.subtitle.zh} en={hero.subtitle.en} />
          </motion.p>

          <motion.div {...reveal(0.42)} className="mt-6 flex flex-col items-start gap-2.5">
            <div className="flex flex-wrap gap-3">
              <a className={cn(buttonVariants({ size: 'lg' }), 'group min-w-32')} href={hero.primaryHref}><Localized zh={hero.primaryLabel.zh} en={hero.primaryLabel.en} /> <ArrowDownRight className="transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" size={15} /></a>
              <a className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'group min-w-32')} href={hero.secondaryHref}><Localized zh={hero.secondaryLabel.zh} en={hero.secondaryLabel.en} /> <ArrowUpRight className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" size={15} /></a>
            </div>
            <div className="flex flex-wrap gap-3">
              {configuredSocialLinks.map((social) => { const Icon = social.icon; return <a key={social.label} href={social.href} target={social.label === 'Email' ? undefined : '_blank'} rel={social.label === 'Email' ? undefined : 'noreferrer'} className="group flex size-9 items-center justify-center rounded-[8px] border border-border bg-card/55 text-muted-foreground transition duration-200 hover:-translate-y-px hover:border-violet-500/40 hover:bg-violet-500/10 hover:text-violet-500" aria-label={social.label}><Icon size={14} strokeWidth={1.6} /></a>; })}
            </div>
          </motion.div>
        </div>

        <motion.div initial={reduceMotion ? false : { opacity: 0, scale: .96, rotate: -1 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ delay: .22, duration: .72, ease: [0.16, 1, 0.3, 1] }} className="relative mx-auto w-[min(68%,240px)] sm:w-[min(72%,320px)] md:w-[min(100%,300px)] lg:w-[min(100%,350px)]">
          <div className="absolute inset-[8%] rounded-full bg-primary/35 blur-[90px]" aria-hidden="true" />
          <motion.div className="hero-portrait-card relative aspect-[4/5] overflow-hidden rounded-[15px] border border-violet-400/30 bg-[#090510] p-px shadow-[0_20px_60px_rgba(0,0,0,.4),0_0_44px_rgba(135,80,247,.1)]" initial={{ rotate: 2.25 }} whileHover={reduceMotion ? undefined : { rotate: 0, y: -2 }} transition={{ type: 'spring', stiffness: 170, damping: 23 }}>
            <div className="relative size-full overflow-hidden rounded-[14px]">
              <PortfolioImage src={hero.portrait} alt={language === 'zh' ? 'Yu Wang — AI 产品设计师与创意前端开发者原创品牌视觉' : 'Yu Wang — AI product designer and creative developer'} fill priority sizes="(max-width: 1024px) 92vw, 520px" className="object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#05010a]/70 via-transparent to-white/[0.025]" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4 sm:p-5">
                <div className="min-w-0"><p className="whitespace-nowrap text-[8px] uppercase tracking-[0.14em] text-white/50 sm:text-[9px]">AI × Design × Code</p><p className="mt-1.5 whitespace-nowrap text-lg font-semibold tracking-[-0.035em] text-white sm:mt-2 sm:text-xl">Yu Wang</p></div>
                <span className="shrink-0 rounded-full border border-white/15 bg-black/25 px-2 py-1.5 text-[10px] uppercase tracking-[0.1em] text-white/65 backdrop-blur-xl sm:px-3 sm:py-2 sm:text-xs">{site.location.split('·')[0].trim()}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
