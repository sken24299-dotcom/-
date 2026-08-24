import { ArrowUpRight, FileText, FolderKanban, ImageIcon, Settings, Sparkles, Users } from 'lucide-react';
import { PortfolioImage } from '@/components/portfolio-image';
import { getAdminProjects } from '@/lib/supabase/projects';
import { getMediaAssets, getProfiles } from '@/lib/supabase/cms';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const [projects, users, media] = await Promise.all([getAdminProjects(), getProfiles(), getMediaAssets()]);
  const featured = projects.filter((project) => project.featured).length;
  const imageCount = media.length || projects.reduce((total, project) => total + 1 + (project.images?.length ?? 0), 0);
  const metrics = [
    { label: '作品数量', value: projects.length, note: 'Portfolio items', icon: FolderKanban, color: 'text-blue-500 bg-blue-500/10' },
    { label: '首页精选', value: featured, note: 'Featured work', icon: Sparkles, color: 'text-violet-500 bg-violet-500/10' },
    { label: '媒体资源', value: imageCount, note: 'Uploaded assets', icon: ImageIcon, color: 'text-emerald-500 bg-emerald-500/10' },
    { label: '后台用户', value: users.length, note: 'Managed users', icon: Users, color: 'text-amber-500 bg-amber-500/10' },
  ];

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-[14px] border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="absolute -right-20 -top-28 size-80 rounded-full bg-violet-500/10 blur-[90px]" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-xs uppercase tracking-[0.14em] text-violet-500">Portfolio dashboard</p><h2 className="mt-3 max-w-2xl text-balance text-2xl font-semibold leading-[1.25] tracking-[-0.035em]">保持作品内容准确、清晰、及时。</h2><p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">管理案例、图片、标签和首页顺序，修改将同步到前台。</p></div>
          <a href="/admin/projects/new" className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-[10px] bg-[var(--primary)] px-5 text-sm font-semibold text-white transition hover:-translate-y-px hover:bg-[var(--primary-hover)]">新增作品 <ArrowUpRight size={14} /></a>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => { const Icon = metric.icon; return <article key={metric.label} className="rounded-[12px] border border-border bg-card p-4 shadow-sm"><div className={`flex size-9 items-center justify-center rounded-[8px] ${metric.color}`}><Icon size={16} /></div><p className="mt-5 text-2xl font-semibold tracking-[-0.04em]">{String(metric.value).padStart(2, '0')}</p><p className="mt-2 text-sm font-medium">{metric.label}</p><p className="mt-1 text-xs uppercase tracking-[0.1em] text-muted-foreground">{metric.note}</p></article>; })}
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[{ href: '/admin/content', label: '管理首页内容', note: 'Hero · About · Contact', icon: FileText }, { href: '/admin/projects/new', label: '上传新作品', note: 'Case study', icon: FolderKanban }, { href: '/admin/users', label: '管理用户', note: 'Roles · Status', icon: Users }, { href: '/admin/settings', label: '网站设置', note: 'Brand · Contact · Social', icon: Settings }].map((item) => { const Icon = item.icon; return <a key={item.href} href={item.href} className="group rounded-[12px] border border-border bg-card p-4 shadow-sm transition hover:-translate-y-px hover:border-violet-500/30"><div className="flex items-center justify-between"><span className="flex size-9 items-center justify-center rounded-[8px] bg-muted text-muted-foreground"><Icon size={16} /></span><ArrowUpRight className="text-muted-foreground transition group-hover:text-violet-500" size={15} /></div><p className="mt-4 text-sm font-semibold">{item.label}</p><p className="mt-1 text-[9px] uppercase tracking-[.1em] text-muted-foreground">{item.note}</p></a>; })}
      </section>

      <section className="overflow-hidden rounded-[14px] border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-5 py-4"><div><h2 className="text-sm font-semibold">最近作品</h2><p className="mt-1 text-[10px] text-muted-foreground">按排序权重显示</p></div><a href="/admin/projects" className="text-xs text-muted-foreground transition hover:text-foreground">查看全部 →</a></div>
        {projects.length ? <div className="divide-y divide-border">{projects.slice(0, 5).map((project) => <a key={project.id} href={`/admin/projects/${project.id}/edit`} className="flex items-center gap-4 px-5 py-4 transition hover:bg-muted/50"><PortfolioImage src={project.coverImage} alt="" width={72} height={48} className="h-12 w-[72px] rounded-xl border border-border object-cover" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{project.title}</p><p className="mt-1 text-[10px] text-muted-foreground">{project.category} · Sort {project.sortOrder}</p></div><span className={`rounded-full px-2.5 py-1 text-[8px] uppercase tracking-[0.1em] ${project.featured ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'bg-muted text-muted-foreground'}`}>{project.featured ? 'Featured' : 'Hidden'}</span></a>)}</div> : <div className="px-5 py-16 text-center"><p className="text-sm font-medium">还没有作品</p><p className="mt-2 text-xs text-muted-foreground">创建第一条真实案例，前台会自动读取。</p></div>}
      </section>
    </div>
  );
}
