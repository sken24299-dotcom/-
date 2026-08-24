'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Languages, Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { BrandLogo } from '@/components/brand-logo';
import { useCms } from '@/components/cms-provider';
import { useLanguage } from '@/components/language-provider';
import { Localized } from '@/components/localized';
import { ThemeToggle } from '@/components/theme-toggle';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState('top');
  const [pressedId, setPressedId] = useState<string>();
  const { language, toggleLanguage } = useLanguage();
  const reduceMotion = useReducedMotion();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const { navigation, site } = useCms();
  const links = useMemo(() => navigation.filter((item) => item.visible).map((item) => ({ id: item.id, label: item.labelZh, labelEn: item.labelEn, href: item.href, newWindow: item.newWindow })), [navigation]);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 32);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  useEffect(() => {
    if (pathname !== '/') return;
    const sections = links.map((link) => document.getElementById(link.id)).filter((section): section is HTMLElement => Boolean(section));
    if (!sections.length) return;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target.id) setActiveId(visible.target.id);
    }, { rootMargin: '-28% 0px -58% 0px', threshold: [0.02, 0.15, 0.4] });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname, links]);

  useEffect(() => {
    if (pathname.startsWith('/work')) setActiveId('work');
    else if (pathname.startsWith('/contact')) setActiveId('contact');
    else if (pathname === '/about') setActiveId('experience');
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', keydown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', keydown);
    };
  }, [open]);

  function activateLink(id: string) {
    setActiveId(id);
    setPressedId(id);
    window.setTimeout(() => setPressedId(undefined), 420);
  }

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-2 z-50 sm:top-3">
        <motion.div
          className={cn('nav-shell site-container pointer-events-auto flex h-14 items-center gap-5 rounded-[16px] border border-border/75 bg-[var(--glass)]/78 px-3 shadow-[0_10px_38px_rgba(0,0,0,.07)] backdrop-blur-2xl transition-[background-color,border-color,box-shadow] duration-300 sm:h-[60px] sm:px-4', scrolled && 'border-foreground/10 bg-[var(--glass)] shadow-[0_14px_44px_rgba(0,0,0,.12)]')}
          initial={reduceMotion ? false : { opacity: 0, y: -10, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: reduceMotion ? 0.01 : 0.46, ease: [0.22, 1, 0.36, 1] }}
        >
          <a href="/#top" className="flex shrink-0 items-center" aria-label={language === 'zh' ? 'ZhiLink AI 首页' : 'ZhiLink AI home'}><BrandLogo /></a>
          <a href={`mailto:${site.email}`} className="hidden text-sm font-medium text-muted-foreground transition hover:text-foreground 2xl:block">{site.email}</a>

          <nav className="ml-auto hidden items-center xl:flex" aria-label={language === 'zh' ? '主导航' : 'Primary navigation'}>
            {links.map((link) => {
              const active = activeId === link.id;
              return (
                <motion.a key={link.id} href={link.href} target={link.newWindow ? '_blank' : undefined} rel={link.newWindow ? 'noreferrer' : undefined} onClick={() => activateLink(link.id)} whileTap={reduceMotion ? undefined : { scale: 0.94 }} className={cn('relative isolate px-2.5 py-2 text-sm font-medium transition-colors', active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground')} aria-current={active ? 'page' : undefined}>
                  {active ? <motion.span layoutId="active-nav" className="absolute inset-0 -z-10 rounded-[8px] border border-border bg-card/72 shadow-sm" transition={{ type: 'spring', stiffness: 420, damping: 36 }} /> : null}
                  {pressedId === link.id ? <motion.span className="pointer-events-none absolute inset-0 -z-10 rounded-[8px] border border-violet-400/45" initial={{ opacity: .8, scale: .82 }} animate={{ opacity: 0, scale: 1.18 }} transition={{ duration: .4 }} /> : null}
                  <Localized zh={link.label} en={link.labelEn} />
                </motion.a>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2 xl:ml-2">
            <button type="button" className="ui-pressable hidden h-9 items-center gap-1.5 rounded-[9px] border border-border bg-card/55 px-3 text-xs font-semibold tracking-[.08em] text-muted-foreground hover:border-violet-500/30 hover:text-foreground md:flex" onClick={toggleLanguage} aria-label={language === 'zh' ? 'Switch to English' : '切换为中文'}><Languages size={14} /> {language === 'zh' ? 'EN' : '中'}</button>
            <ThemeToggle compact />
            <a className={cn(buttonVariants({ size: 'sm' }), 'hidden gap-1.5 sm:inline-flex')} href="/#contact"><Localized zh="联系我" en="Contact" /> <ArrowUpRight size={14} /></a>
            <button ref={menuButtonRef} type="button" className="ui-pressable flex size-9 items-center justify-center rounded-[9px] border border-border bg-card/55 text-foreground hover:border-violet-500/30 hover:text-violet-500 xl:hidden" aria-label={open ? (language === 'zh' ? '关闭菜单' : 'Close menu') : (language === 'zh' ? '打开菜单' : 'Open menu')} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(true)}><Menu size={17} /></button>
          </div>
        </motion.div>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div className="fixed inset-0 z-[80] bg-black/65 p-3 backdrop-blur-md xl:hidden" initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button type="button" className="absolute inset-0 cursor-default" aria-label={language === 'zh' ? '关闭菜单背景' : 'Close menu overlay'} onClick={() => setOpen(false)} />
            <motion.aside id="mobile-menu" className="relative ml-auto flex h-full w-full max-w-[420px] flex-col overflow-x-hidden overflow-y-auto rounded-[18px] border border-white/10 bg-[#0b0614]/95 p-5 text-white shadow-[0_28px_90px_rgba(0,0,0,.48)] backdrop-blur-2xl sm:p-7" initial={reduceMotion ? false : { opacity: 0, y: -14, scale: .985 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: .99 }} transition={{ duration: reduceMotion ? .01 : .3, ease: [0.22, 1, 0.36, 1] }} role="dialog" aria-modal="true" aria-label={language === 'zh' ? '移动端导航' : 'Mobile navigation'}>
              <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-violet-500/15 blur-[90px]" />
              <div className="flex items-center justify-between">
                <a href="/#top" onClick={() => setOpen(false)} className="flex items-center" aria-label={language === 'zh' ? 'ZhiLink AI 首页' : 'ZhiLink AI home'}><BrandLogo inverse /></a>
                <button type="button" className="ui-pressable flex size-11 items-center justify-center rounded-[10px] border border-white/12 text-white/70 hover:bg-white/10 hover:text-white" onClick={() => setOpen(false)} aria-label={language === 'zh' ? '关闭菜单' : 'Close menu'}><X size={20} /></button>
              </div>

              <nav className="my-auto py-12" aria-label={language === 'zh' ? '移动端导航链接' : 'Mobile navigation links'}>
                {links.map((link, index) => (
                  <motion.a key={link.id} href={link.href} onClick={() => { activateLink(link.id); setOpen(false); }} whileTap={reduceMotion ? undefined : { scale: .98, x: 3 }} className={cn('group flex items-center justify-between border-b py-3.5 text-[clamp(1.35rem,6vw,1.75rem)] font-semibold tracking-[-.035em] transition', activeId === link.id ? 'border-violet-400/35 text-white' : 'border-white/10 text-white/68 hover:border-violet-400/40 hover:text-white')} initial={reduceMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .035, duration: .32 }}>
                    <span className="flex items-center gap-3">{activeId === link.id ? <motion.span layoutId="mobile-active-dot" className="size-1.5 rounded-full bg-violet-400 shadow-[0_0_14px_#a78bfa]" /> : null}<Localized zh={link.label} en={link.labelEn} /></span>
                    <span className="font-mono text-xs font-normal tracking-[.12em] text-white/30">0{index + 1}</span>
                  </motion.a>
                ))}
              </nav>

              <div className="border-t border-white/10 pt-6">
                <div className="flex items-center gap-2">
                  <button type="button" className="ui-pressable flex h-11 flex-1 items-center justify-center gap-2 rounded-[10px] border border-white/12 text-sm font-semibold text-white/70" onClick={toggleLanguage}><Languages size={15} /> {language === 'zh' ? 'English' : '中文'}</button>
                  <ThemeToggle compact />
                  <a href="/#contact" onClick={() => setOpen(false)} className="premium-action relative isolate flex h-11 flex-[1.2] items-center justify-center gap-2 overflow-hidden rounded-[10px] bg-primary px-4 text-sm font-semibold text-white"><Localized zh="联系我" en="Contact" /> <ArrowUpRight size={14} /></a>
                </div>
            <a href={`mailto:${site.email}`} className="mt-6 block text-sm text-white/45">{site.email}</a>
              </div>
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
