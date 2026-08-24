import { CheckCircle2, CircleAlert } from 'lucide-react';

export const adminInput = 'h-10 w-full rounded-[8px] border border-border bg-background/65 px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/45 focus:border-violet-500/45 focus:ring-4 focus:ring-violet-500/10';
export const adminTextarea = 'min-h-24 w-full resize-y rounded-[8px] border border-border bg-background/65 px-3 py-2.5 text-sm leading-6 text-foreground outline-none transition placeholder:text-muted-foreground/45 focus:border-violet-500/45 focus:ring-4 focus:ring-violet-500/10';
export const adminCard = 'rounded-[14px] border border-border bg-card p-4 shadow-sm sm:p-5';
export const adminButton = 'inline-flex h-10 items-center justify-center gap-2 rounded-[8px] bg-[var(--primary)] px-4 text-sm font-semibold text-white transition hover:-translate-y-px hover:bg-[var(--primary-hover)] disabled:opacity-50';
export const adminSecondaryButton = 'inline-flex h-10 items-center justify-center gap-2 rounded-[8px] border border-border bg-background px-4 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground';

const messages: Record<string, string> = {
  saved: '内容已保存并同步到前台。', created: '记录已创建。', updated: '记录已更新。', deleted: '记录已删除。', invalid: '请检查表单内容后重试。', error: '操作失败，请稍后重试。', unconfigured: 'Supabase 尚未配置。', 'service-key': '用户管理需要 SUPABASE_SERVICE_ROLE_KEY。',
};

export function AdminNotice({ status }: { status?: string }) {
  if (!status || !messages[status]) return null;
  const error = ['invalid', 'error', 'unconfigured', 'service-key'].includes(status);
  const Icon = error ? CircleAlert : CheckCircle2;
  return <div role="status" className={`mb-4 flex items-center gap-2 rounded-[10px] border px-4 py-3 text-sm ${error ? 'border-red-500/20 bg-red-500/[.07] text-red-600 dark:text-red-300' : 'border-emerald-500/20 bg-emerald-500/[.07] text-emerald-700 dark:text-emerald-300'}`}><Icon size={16} />{messages[status]}</div>;
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 block text-xs font-medium">{label}</span>{children}{hint ? <span className="mt-1.5 block text-[10px] leading-4 text-muted-foreground">{hint}</span> : null}</label>;
}

export function AdminPageIntro({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[.15em] text-violet-500">{eyebrow}</p><h2 className="mt-2 text-xl font-semibold tracking-[-.035em] sm:text-2xl">{title}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p></div>{action}</div>;
}
