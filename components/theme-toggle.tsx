'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Check, Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/components/language-provider';
import { cn } from '@/lib/utils';

const themes = [
  { value: 'system', label: '跟随系统', labelEn: 'System', icon: Monitor },
  { value: 'light', label: '日间模式', labelEn: 'Light', icon: Sun },
  { value: 'dark', label: '夜间模式', labelEn: 'Dark', icon: Moon },
] as const;

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { language } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', close);
      document.removeEventListener('keydown', escape);
    };
  }, [open]);

  const activeTheme = mounted ? theme : 'system';
  const active = themes.find((item) => item.value === activeTheme) ?? themes[0];
  const ActiveIcon = active.icon;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className={cn(
          'ui-pressable flex h-9 items-center justify-center gap-2 rounded-[9px] border border-border bg-card/70 text-muted-foreground shadow-sm backdrop-blur-xl hover:border-foreground/15 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400',
          compact ? 'w-9' : 'px-3',
        )}
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={language === 'zh' ? '切换网站主题' : 'Change website theme'}
      >
        <ActiveIcon size={14} strokeWidth={1.7} />
        {!compact ? <span className="hidden text-xs font-medium uppercase tracking-[0.12em] lg:inline">{language === 'zh' ? active.label : active.labelEn}</span> : null}
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="absolute right-0 top-[calc(100%+10px)] z-[70] w-48 overflow-hidden rounded-[14px] border border-border bg-card/95 p-1.5 shadow-[0_20px_55px_rgba(0,0,0,.18)] backdrop-blur-2xl"
            role="menu"
            initial={reduceMotion ? false : { opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.18 }}
          >
            {themes.map((item) => {
              const Icon = item.icon;
              const selected = activeTheme === item.value;
              return (
                <button
                  key={item.value}
                  type="button"
                  role="menuitemradio"
                  aria-checked={selected}
                  className="ui-pressable flex w-full items-center gap-3 rounded-[9px] px-3 py-2.5 text-left text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
                  onClick={() => {
                    setTheme(item.value);
                    setOpen(false);
                  }}
                >
                  <Icon size={15} strokeWidth={1.7} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-foreground">{language === 'zh' ? item.label : item.labelEn}</span>
                  </span>
                  {selected ? <Check size={13} className="text-violet-500" /> : null}
                </button>
              );
            })}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
