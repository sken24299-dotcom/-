'use client';

import { ArrowUpRight, Edit3, Search, SlidersHorizontal } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { DeleteProjectButton } from '@/components/admin/delete-project-button';
import { PortfolioImage } from '@/components/portfolio-image';
import type { Project } from '@/types/project';

const notices: Record<string, string> = {
  created: '作品已新增并同步到前台。',
  updated: '作品内容已保存。',
  deleted: '作品已删除。',
  error: '操作失败，请稍后重试。',
};

export function ProjectTable({ projects, notice }: { projects: Project[]; notice?: string }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const categories = useMemo(() => Array.from(new Set(projects.map((project) => project.category))), [projects]);
  const filtered = useMemo(() => projects.filter((project) => {
    const matchesCategory = category === 'all' || project.category === category;
    const haystack = `${project.title} ${project.titleEn ?? ''} ${project.category} ${project.tags.join(' ')}`.toLowerCase();
    return matchesCategory && haystack.includes(query.toLowerCase());
  }), [projects, query, category]);

  useEffect(() => {
    if (!notice || !notices[notice]) return;
    if (notice === 'error') toast.error(notices[notice]);
    else toast.success(notices[notice]);
  }, [notice]);

  return (
    <section className="overflow-hidden rounded-[14px] border border-border bg-card shadow-sm">
      <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center">
        <label className="relative flex-1"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={15} /><input className="h-11 w-full rounded-[10px] border border-border bg-background/55 pl-11 pr-4 text-sm outline-none transition focus:border-violet-500/40 focus:ring-4 focus:ring-violet-500/10" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索标题、分类或标签…" /></label>
        <label className="relative sm:w-52"><SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} /><select className="h-11 w-full appearance-none rounded-[10px] border border-border bg-background/55 pl-11 pr-4 text-sm outline-none focus:border-violet-500/40" value={category} onChange={(event) => setCategory(event.target.value)}><option value="all">全部分类</option>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
      </div>

      {filtered.length ? (
        <>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[900px] border-collapse text-left">
              <thead><tr className="border-b border-border text-[9px] uppercase tracking-[0.14em] text-muted-foreground"><th className="px-5 py-4 font-medium">作品</th><th className="px-5 py-4 font-medium">分类</th><th className="px-5 py-4 font-medium">首页展示</th><th className="px-5 py-4 font-medium">排序</th><th className="px-5 py-4 text-right font-medium">操作</th></tr></thead>
              <tbody className="divide-y divide-border">
                {filtered.map((project) => (
                  <tr key={project.id} className="group transition-colors hover:bg-muted/45">
                    <td className="px-5 py-4"><div className="flex items-center gap-4"><PortfolioImage src={project.coverImage} alt="" width={84} height={56} className="h-14 w-[84px] rounded-xl border border-border object-cover" /><div className="min-w-0"><p className="max-w-[360px] truncate text-sm font-semibold">{project.title}</p><p className="mt-1 max-w-[360px] truncate text-[10px] text-muted-foreground">/{project.slug}</p></div></div></td>
                    <td className="px-5 py-4 text-xs text-muted-foreground">{project.category}</td>
                    <td className="px-5 py-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.1em] ${project.published === false ? 'bg-red-500/10 text-red-500' : project.featured ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'bg-muted text-muted-foreground'}`}>{project.published === false ? 'Draft' : project.featured ? 'Featured' : 'Published'}</span></td>
                    <td className="px-5 py-4 font-mono text-xs text-muted-foreground">{project.sortOrder}</td>
                    <td className="px-5 py-4"><div className="flex justify-end gap-2"><a href={`/work/${project.slug}`} target="_blank" className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:bg-muted hover:text-foreground" aria-label="查看前台页面"><ArrowUpRight size={14} /></a><a href={`/admin/projects/${project.id}/edit`} className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:bg-muted hover:text-foreground" aria-label={`编辑 ${project.title}`}><Edit3 size={14} /></a><DeleteProjectButton id={project.id} title={project.title} /></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="divide-y divide-border md:hidden">
            {filtered.map((project) => (
              <article key={project.id} className="p-4">
                <PortfolioImage src={project.coverImage} alt="" width={640} height={360} sizes="(max-width: 768px) 100vw, 640px" className="aspect-video w-full rounded-[12px] border border-border object-cover" />
                <div className="mt-4 flex items-start justify-between gap-3"><div><p className="text-sm font-semibold leading-6">{project.title}</p><p className="mt-1 text-[10px] text-muted-foreground">{project.category} · Sort {project.sortOrder}</p></div><span className={`rounded-full px-2 py-1 text-[8px] uppercase tracking-[0.1em] ${project.featured ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'bg-muted text-muted-foreground'}`}>{project.featured ? 'Featured' : 'Hidden'}</span></div>
                <div className="mt-4 flex gap-2"><a href={`/admin/projects/${project.id}/edit`} className="flex h-10 flex-1 items-center justify-center gap-2 rounded-[10px] border border-border text-sm text-muted-foreground"><Edit3 size={13} /> 编辑</a><a href={`/work/${project.slug}`} target="_blank" className="flex size-10 items-center justify-center rounded-[10px] border border-border text-muted-foreground"><ArrowUpRight size={14} /></a><DeleteProjectButton id={project.id} title={project.title} /></div>
              </article>
            ))}
          </div>
        </>
      ) : (
        <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center"><Search className="text-muted-foreground/45" size={26} /><h3 className="mt-4 text-sm font-semibold">没有匹配的作品</h3><p className="mt-2 text-xs text-muted-foreground">调整搜索条件，或创建一个新的案例。</p></div>
      )}
    </section>
  );
}
