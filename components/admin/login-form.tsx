'use client';

import { ArrowRight, LoaderCircle, LockKeyhole, Mail } from 'lucide-react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { loginAction } from '@/app/admin/actions';
import type { ProjectActionState } from '@/types/project';

const initialState: ProjectActionState = { status: 'idle' };

function SubmitButton({ disabled }: { disabled?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={disabled || pending} className="group mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-[8px] bg-[var(--primary)] text-sm font-semibold text-white transition-all hover:-translate-y-px hover:bg-[var(--primary-hover)] disabled:pointer-events-none disabled:opacity-45">
      {pending ? <LoaderCircle className="animate-spin" size={16} /> : <>安全登录 <ArrowRight className="transition-transform group-hover:translate-x-0.5" size={15} /></>}
    </button>
  );
}

export function LoginForm({ configured }: { configured: boolean }) {
  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <label className="block">
        <span className="mb-2 block text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">管理员邮箱 / Email</span>
        <span className="relative block">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={15} />
          <input name="email" type="email" autoComplete="email" required disabled={!configured} className="h-11 w-full rounded-[8px] border border-border bg-background/65 pl-10 pr-3.5 text-sm outline-none transition focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/10 disabled:opacity-50" placeholder="name@example.com" />
        </span>
      </label>
      <label className="block">
        <span className="mb-2 block text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">密码 / Password</span>
        <span className="relative block">
          <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={15} />
          <input name="password" type="password" autoComplete="current-password" required disabled={!configured} className="h-11 w-full rounded-[8px] border border-border bg-background/65 pl-10 pr-3.5 text-sm outline-none transition focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/10 disabled:opacity-50" placeholder="••••••••" />
        </span>
      </label>
      {state.message ? <p role="alert" className="rounded-2xl border border-red-500/15 bg-red-500/[0.07] px-4 py-3 text-xs leading-5 text-red-600 dark:text-red-300">{state.message}</p> : null}
      {!configured ? <p className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.08] px-4 py-3 text-xs leading-5 text-amber-700 dark:text-amber-300">当前为本地结构预览。配置 Supabase 环境变量并执行迁移后即可登录。</p> : null}
      <SubmitButton disabled={!configured} />
    </form>
  );
}
