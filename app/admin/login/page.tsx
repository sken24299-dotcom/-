import { ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';
import { redirect } from 'next/navigation';
import { LoginForm } from '@/components/admin/login-form';
import { ThemeToggle } from '@/components/theme-toggle';
import { getAdminSession } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session.isAdmin) redirect('/admin/dashboard');

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12 text-foreground">
      <div className="hero-grid absolute inset-0 opacity-50" aria-hidden="true" />
      <div className="absolute left-1/2 top-1/3 size-[520px] -translate-x-1/2 rounded-full bg-violet-600/15 blur-[150px]" aria-hidden="true" />
      <div className="absolute right-4 top-4 z-10 sm:right-6 sm:top-6"><ThemeToggle /></div>

      <div className="relative z-[1] grid w-full max-w-[840px] overflow-hidden rounded-[14px] border border-border bg-card/80 shadow-[var(--shadow-card)] backdrop-blur-2xl lg:grid-cols-[1fr_1fr]">
        <section className="relative hidden min-h-[480px] overflow-hidden border-r border-white/10 bg-[#090909] p-6 text-white lg:flex lg:flex-col">
          <div className="hero-grid absolute inset-0" aria-hidden="true" />
          <div className="absolute -left-32 bottom-0 size-[430px] rounded-full bg-violet-700/25 blur-[120px]" aria-hidden="true" />
          <div className="relative z-[1] flex items-center gap-3"><span className="brand-mark" /><span className="text-sm font-semibold">YU WANG</span></div>
          <div className="relative z-[1] my-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-[9px] uppercase tracking-[0.16em] text-white/55"><Sparkles size={12} className="text-violet-300" /> Portfolio operating system</div>
            <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.12] tracking-[-0.045em]">管理作品，保持内容清晰。</h1>
            <p className="mt-5 max-w-md text-sm leading-7 text-white/50">集中管理案例、视觉资源与首页顺序。</p>
          </div>
          <p className="relative z-[1] text-[9px] uppercase tracking-[0.16em] text-white/30">Secure workspace · Powered by Supabase</p>
        </section>

        <section className="flex min-h-[480px] flex-col justify-center p-6 sm:p-7">
          <a href="/" className="mb-7 inline-flex items-center gap-2 self-start text-xs text-muted-foreground transition hover:text-foreground"><ArrowLeft size={14} /> 返回作品集</a>
          <span className="flex size-11 items-center justify-center rounded-full border border-border bg-muted/60 text-violet-500"><ShieldCheck size={19} /></span>
          <h2 className="mt-5 text-2xl font-semibold tracking-[-0.04em]">管理员登录</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">使用 Supabase Auth 管理员账号继续。</p>
          {session.authenticated && !session.isAdmin ? <p className="mt-5 rounded-2xl border border-amber-500/20 bg-amber-500/[0.07] px-4 py-3 text-xs text-amber-700 dark:text-amber-300">当前账号已登录，但未加入 admin_users 管理员列表。</p> : null}
          <div className="mt-6"><LoginForm configured={session.configured} /></div>
          <p className="mt-8 text-[10px] leading-5 text-muted-foreground">后台路由、写入操作与图片上传均在服务端验证管理员身份，并由 Supabase RLS 进行二次授权。</p>
        </section>
      </div>
    </main>
  );
}
