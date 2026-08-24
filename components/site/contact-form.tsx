'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Check, LoaderCircle, X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useLanguage } from '@/components/language-provider';
import { contactSchema, type ContactValues } from '@/lib/validation/contact';

const inputClass = 'h-11 w-full rounded-[8px] border border-border bg-background/55 px-3.5 text-sm outline-none transition placeholder:text-muted-foreground/45 focus:border-violet-500/45 focus:ring-4 focus:ring-violet-500/10';

export function ContactForm() {
  const { language } = useLanguage();
  const [success, setSuccess] = useState(false);
  const [website, setWebsite] = useState('');
  const reduceMotion = useReducedMotion();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactValues>({ resolver: zodResolver(contactSchema), defaultValues: { name: '', email: '', phone: '', service: '', budget: '', description: '' } });

  async function submit(values: ContactValues) {
    try {
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...values, website }) });
      const result = await response.json() as { ok?: boolean; error?: string };
      if (!response.ok || !result.ok) throw new Error(language === 'zh' ? (result.error ?? '消息发送失败。') : 'Your message could not be sent. Please try again.');
      reset();
      setWebsite('');
      setSuccess(true);
      toast.success(language === 'zh' ? '项目消息已安全发送' : 'Your project message was sent');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : (language === 'zh' ? '消息发送失败，请稍后重试。' : 'Message failed. Please try again later.'));
    }
  }

  const translateError = (message?: string) => {
    if (!message || language === 'zh') return message;
    if (message.includes('邮箱')) return 'Enter a valid email address.';
    if (message.includes('姓名') || message.includes('2 个字符')) return 'Enter at least 2 characters.';
    if (message.includes('服务')) return 'Choose a valid service.';
    if (message.includes('预算')) return 'Choose a budget range.';
    if (message.includes('20 个字符')) return 'Describe the project in at least 20 characters.';
    if (message.includes('2000')) return 'Keep the project brief under 2,000 characters.';
    if (message.includes('电话')) return 'The phone number is too long.';
    return 'Check this field and try again.';
  };
  const ErrorText = ({ message }: { message?: string }) => message ? <span className="mt-2 block text-xs text-red-600 dark:text-red-300">{translateError(message)}</span> : null;
  const services = [
    ['AI 产品设计', 'AI Product Design'],
    ['前端界面开发', 'Frontend Development'],
    ['电商视觉设计', 'E-commerce Visual Design'],
    ['品牌视觉系统', 'Brand Visual System'],
    ['作品集网站', 'Portfolio Website'],
    ['其他合作', 'Other'],
  ] as const;

  return (
    <>
      <form onSubmit={handleSubmit(submit)} className="grid min-w-0 gap-3.5 sm:grid-cols-2" noValidate>
        <label className="pointer-events-none absolute -left-[10000px] top-auto size-px overflow-hidden" aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" name="website" value={website} onChange={(event) => setWebsite(event.target.value)} /></label>
        <label className="min-w-0"><span className="mb-2 block text-xs font-medium uppercase tracking-[.11em] text-muted-foreground">{language === 'zh' ? '姓名 *' : 'Name *'}</span><input className={inputClass} placeholder={language === 'zh' ? '如何称呼你' : 'How should I address you?'} autoComplete="name" {...register('name')} /><ErrorText message={errors.name?.message} /></label>
        <label className="min-w-0"><span className="mb-2 block text-xs font-medium uppercase tracking-[.11em] text-muted-foreground">{language === 'zh' ? '邮箱 *' : 'Email *'}</span><input className={inputClass} type="email" placeholder="name@company.com" autoComplete="email" {...register('email')} /><ErrorText message={errors.email?.message} /></label>
        <label className="min-w-0"><span className="mb-2 block text-xs font-medium uppercase tracking-[.11em] text-muted-foreground">{language === 'zh' ? '电话' : 'Phone'}</span><input className={inputClass} placeholder={language === 'zh' ? '选填' : 'Optional'} autoComplete="tel" {...register('phone')} /><ErrorText message={errors.phone?.message} /></label>
        <label className="min-w-0"><span className="mb-2 block text-xs font-medium uppercase tracking-[.11em] text-muted-foreground">{language === 'zh' ? '服务类型 *' : 'Service *'}</span><select className={inputClass} {...register('service')}><option value="">{language === 'zh' ? '请选择' : 'Select a service'}</option>{services.map(([value, labelEn]) => <option key={value} value={value}>{language === 'zh' ? value : labelEn}</option>)}</select><ErrorText message={errors.service?.message} /></label>
        <label className="min-w-0 sm:col-span-2"><span className="mb-2 block text-xs font-medium uppercase tracking-[.11em] text-muted-foreground">{language === 'zh' ? '预算范围 *' : 'Budget *'}</span><select className={inputClass} {...register('budget')}><option value="">{language === 'zh' ? '请选择' : 'Select a range'}</option><option>¥5,000 — ¥15,000</option><option>¥15,000 — ¥30,000</option><option>¥30,000 — ¥60,000</option><option>¥60,000+</option><option value="先讨论范围">{language === 'zh' ? '先讨论范围' : 'Discuss the scope first'}</option></select><ErrorText message={errors.budget?.message} /></label>
        <label className="min-w-0 sm:col-span-2"><span className="mb-2 block text-xs font-medium uppercase tracking-[.11em] text-muted-foreground">{language === 'zh' ? '项目描述 *' : 'Project brief *'}</span><textarea className="min-h-28 w-full resize-y rounded-[8px] border border-border bg-background/55 px-3.5 py-3 text-sm leading-6 outline-none transition placeholder:text-muted-foreground/45 focus:border-violet-500/45 focus:ring-4 focus:ring-violet-500/10" placeholder={language === 'zh' ? '简单介绍目标、时间和希望解决的问题。' : 'Share the goal, timing and problem you want to solve.'} {...register('description')} /><ErrorText message={errors.description?.message} /></label>
        <button type="submit" disabled={isSubmitting} className="group flex h-11 items-center justify-center gap-2 rounded-[8px] bg-primary px-5 text-sm font-semibold text-white shadow-[0_8px_22px_rgba(135,80,247,.2)] transition hover:-translate-y-px hover:bg-[var(--primary-hover)] disabled:pointer-events-none disabled:opacity-50 sm:col-span-2 sm:w-fit">{isSubmitting ? <><LoaderCircle className="animate-spin" size={15} /> {language === 'zh' ? '发送中' : 'Sending'}</> : <>{language === 'zh' ? '发送消息' : 'Send Message'} <ArrowUpRight className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" size={15} /></>}</button>
      </form>
      <AnimatePresence>{success ? <motion.div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-5 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-labelledby="contact-success-title"><motion.div className="relative w-full max-w-md rounded-[18px] border border-white/10 bg-[#0b0614] p-8 text-center text-white shadow-[0_30px_90px_rgba(0,0,0,.55)]" initial={reduceMotion ? false : { opacity: 0, scale: .96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: .98, y: 6 }}><button type="button" onClick={() => setSuccess(false)} className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-[10px] border border-white/10 text-white/55 hover:text-white" aria-label={language === 'zh' ? '关闭成功提示' : 'Close success message'}><X size={14} /></button><span className="mx-auto flex size-12 items-center justify-center rounded-[12px] bg-violet-500 text-white"><Check size={20} /></span><h3 id="contact-success-title" className="mt-5 text-2xl font-semibold tracking-[-.035em]">{language === 'zh' ? '消息已收到' : 'Message received'}</h3><p className="mt-3 text-sm leading-7 text-white/55">{language === 'zh' ? '我会尽快阅读项目需求，并通过邮箱与你联系。' : 'I will review your brief and get back to you by email shortly.'}</p><button type="button" onClick={() => setSuccess(false)} className="mt-6 h-11 rounded-[10px] bg-white px-6 text-sm font-semibold text-black">{language === 'zh' ? '完成' : 'Done'}</button></motion.div></motion.div> : null}</AnimatePresence>
    </>
  );
}
