'use client';

import { Menu, Plus } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/theme-toggle';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

function getTitle(pathname: string) {
  if (pathname.endsWith('/new')) return ['新增作品', 'Create a new case study'];
  if (pathname.endsWith('/edit')) return ['编辑作品', 'Update case study'];
  if (pathname.includes('/projects')) return ['作品管理', 'Manage projects'];
  if (pathname.includes('/users')) return ['用户管理', 'Users & roles'];
  if (pathname.includes('/content')) return ['页面内容', 'Frontend content'];
  if (pathname.includes('/media')) return ['媒体资源', 'Media library'];
  if (pathname.includes('/navigation')) return ['导航菜单', 'Navigation'];
  if (pathname.includes('/settings')) return ['网站设置', 'Site settings'];
  if (pathname.includes('/seo')) return ['SEO 设置', 'Search metadata'];
  if (pathname.includes('/theme')) return ['主题样式', 'Design tokens'];
  if (pathname.includes('/languages')) return ['多语言', 'Chinese & English'];
  return ['数据概览', 'Portfolio dashboard'];
}

export function AdminHeader({ onOpenMenu }: { onOpenMenu: () => void }) {
  const pathname = usePathname();
  const [title, description] = getTitle(pathname);

  return (
    <header className="sticky top-0 z-30 flex min-h-16 items-center gap-3 border-b border-border bg-background/78 px-4 backdrop-blur-xl sm:px-5 lg:px-6">
      <button type="button" className="flex size-10 items-center justify-center rounded-[10px] border border-border bg-card lg:hidden" onClick={onOpenMenu} aria-label="打开侧边栏">
        <Menu size={17} />
      </button>
      <div className="min-w-0">
        <h1 className="text-base font-semibold tracking-[-0.025em] sm:text-lg">{title}</h1>
        <p className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{description}</p>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle compact />
        {pathname.includes('/projects') && !pathname.endsWith('/new') ? <a className={cn(buttonVariants({ size: 'sm' }), 'hidden sm:inline-flex')} href="/admin/projects/new"><Plus size={14} /> 新增作品</a> : null}
      </div>
    </header>
  );
}
