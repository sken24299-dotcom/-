'use client';

import { ArrowUpRight, Github, Linkedin, Mail, MapPin, MessageCircle } from 'lucide-react';
import { useCms } from '@/components/cms-provider';
import { Localized } from '@/components/localized';
import { Reveal } from '@/components/reveal';
import { ContactForm } from '@/components/site/contact-form';

export function ContactSection({ standalone = false }: { standalone?: boolean }) {
  const { contact, site } = useCms();
  const contacts = [
    { icon: Mail, label: 'Email', labelZh: '邮箱', value: site.email, href: `mailto:${site.email}` },
    { icon: MessageCircle, label: 'WeChat', labelZh: '微信', value: site.wechat },
    { icon: MapPin, label: 'Location', labelZh: '地点', value: site.location, valueEn: site.location },
  ].filter((item) => Boolean(item.value));
  return (
    <section id="contact" className={`section-shell relative overflow-hidden ${standalone ? 'pb-12 pt-24 sm:pt-28' : 'section-space'}`}>
      <div className="absolute bottom-0 right-[-180px] size-[520px] rounded-full bg-violet-500/[.08] blur-[140px]" />
      <div className="site-container relative grid min-w-0 grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,.9fr)] lg:items-center lg:gap-10">
        <Reveal className="min-w-0">
          <div className="w-full min-w-0 rounded-[14px] border border-border bg-card/70 p-4 shadow-[var(--shadow-card)] backdrop-blur-xl sm:p-5 lg:p-6">
            <p className="text-sm font-semibold uppercase tracking-[.14em] text-violet-500"><Localized zh={contact.eyebrow.zh} en={contact.eyebrow.en} /></p>
            <h2 className="type-page-title mt-3 text-balance"><Localized zh={contact.title.zh} en={contact.title.en} /></h2>
            <p className="body-copy mt-3 max-w-2xl"><Localized zh={contact.description.zh} en={contact.description.en} /></p>
            <div className="mt-6"><ContactForm /></div>
          </div>
        </Reveal>

        <Reveal className="min-w-0" delay={.08}>
          <aside className="w-full min-w-0 lg:px-2">
            <p className="text-sm uppercase tracking-[.14em] text-violet-500"><Localized zh="直接联系" en="Direct contact" /></p>
            <h3 className="type-section-title mt-3 max-w-lg"><Localized zh="从一个清晰的问题开始。" en="Start with a clear problem." /></h3>
            <div className="mt-6 space-y-4">
              {contacts.map((item) => {
                const Icon = item.icon;
                const content = <><span className="flex size-11 shrink-0 items-center justify-center rounded-[10px] bg-[linear-gradient(135deg,#8750f7,#6d28d9)] text-white shadow-[0_10px_26px_rgba(135,80,247,.2)]"><Icon size={18} /></span><span className="min-w-0"><span className="block text-xs uppercase tracking-[.1em] text-muted-foreground"><Localized zh={item.labelZh} en={item.label} /></span><span className="mt-1 block break-all text-[15px] font-semibold text-foreground">{'valueEn' in item ? <Localized zh={item.value} en={item.valueEn} /> : item.value}</span></span>{item.href ? <ArrowUpRight className="ml-auto shrink-0 text-muted-foreground" size={16} /> : null}</>;
                return item.href ? <a key={item.label} href={item.href} className="flex min-w-0 items-center gap-4 transition hover:translate-x-1">{content}</a> : <div key={item.label} className="flex min-w-0 items-center gap-4">{content}</div>;
              })}
            </div>
            <div className="mt-8 flex gap-2.5 border-t border-border pt-5">
              {site.github ? <a href={site.github} target="_blank" rel="noreferrer" className="flex size-11 items-center justify-center rounded-[10px] border border-border bg-card text-muted-foreground transition hover:-translate-y-px hover:border-violet-500/30 hover:text-violet-500" aria-label="GitHub"><Github size={17} /></a> : null}
              {site.linkedin ? <a href={site.linkedin} target="_blank" rel="noreferrer" className="flex size-11 items-center justify-center rounded-[10px] border border-border bg-card text-muted-foreground transition hover:-translate-y-px hover:border-violet-500/30 hover:text-violet-500" aria-label="LinkedIn"><Linkedin size={17} /></a> : null}
            </div>
          </aside>
        </Reveal>
      </div>
    </section>
  );
}
