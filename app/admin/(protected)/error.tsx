'use client';

import { RotateCcw } from 'lucide-react';
import { useEffect } from 'react';

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <section className="flex min-h-[460px] flex-col items-center justify-center rounded-[18px] border border-border bg-card px-6 text-center">
      <p className="text-[9px] uppercase tracking-[0.18em] text-red-500">Admin error</p>
      <h2 className="mt-4 text-2xl font-semibold tracking-[-0.04em]">后台数据暂时无法加载</h2>
      <p className="mt-3 max-w-md text-sm leading-7 text-muted-foreground">请检查 Supabase 连接或网络状态，然后重新尝试。</p>
      <button type="button" onClick={reset} className="mt-7 inline-flex h-11 items-center gap-2 rounded-[10px] bg-[var(--primary)] px-5 text-sm font-semibold text-white transition hover:-translate-y-px hover:bg-[var(--primary-hover)]">
        <RotateCcw size={14} /> 重新加载
      </button>
    </section>
  );
}
