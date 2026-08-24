'use client';

import { FileText, FolderKanban, ImageIcon, Languages, LayoutDashboard, LogOut, MenuSquare, Palette, PanelLeftClose, Search, Settings, Sparkles, Users } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { logoutAction } from '@/app/admin/actions';
import { cn } from '@/lib/utils';

const navigation = [
  { href: '/admin/dashboard', label: '数据概览', labelEn: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/content', label: '页面内容', labelEn: 'Content', icon: FileText },
  { href: '/admin/projects', label: '作品管理', labelEn: 'Projects', icon: FolderKanban },
  { href: '/admin/media', label: '媒体资源', labelEn: 'Media', icon: ImageIcon },
  { href: '/admin/navigation', label: '导航菜单', labelEn: 'Navigation', icon: MenuSquare },
  { href: '/admin/settings', label: '网站设置', labelEn: 'Settings', icon: Settings },
  { href: '/admin/seo', label: 'SEO 设置', labelEn: 'SEO', icon: Search },
  { href: '/admin/languages', label: '多语言', labelEn: 'Languages', icon: Languages },
  { href: '/admin/theme', label: '主题样式', labelEn: 'Theme', icon: Palette, adminOnly: true },
  { href: '/admin/users', label: '用户管理', labelEn: 'Users', icon: Users, adminOnly: true },
];

export function AdminSidebar({ email, role, onNavigate }: { email?: string; role?: string; onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col p-2.5">
      <div className="flex items-center justify-between px-3 py-3">
        <a href="/" className="group flex items-center gap-3" onClick={onNavigate}>
          <span className="brand-mark transition-transform duration-300 group-hover:rotate-45" />
          <span>
            <span className="block text-sm font-semibold tracking-[-0.02em]">YU WANG</span>
            <span className="mt-0.5 block text-[8px] uppercase tracking-[0.18em] text-muted-foreground">Portfolio OS</span>
          </span>
        </a>
        {onNavigate ? <button className="flex size-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground" onClick={onNavigate} aria-label="关闭侧边栏"><PanelLeftClose size={16} /></button> : null}
      </div>

      <div className="mx-2.5 mt-3 rounded-[12px] border border-violet-500/15 bg-gradient-to-br from-violet-500/10 to-blue-500/5 p-3.5">
        <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.16em] text-violet-600 dark:text-violet-300"><Sparkles size={12} /> Creative control</div>
        <p className="mt-3 text-sm font-medium leading-5 text-foreground">专注管理作品与案例内容。</p>
      </div>

      <nav className="mt-5 space-y-1" aria-label="后台导航">
        {navigation.filter((item) => !item.adminOnly || role === 'admin').map((item) => {
          const active = item.href === '/admin/projects' ? pathname === item.href || /\/admin\/projects\/.+\/edit/.test(pathname) : pathname === item.href;
          const Icon = item.icon;
          return (
            <a
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                'ui-pressable flex items-center gap-3 rounded-[8px] px-3 py-2.5 text-sm',
                active ? 'bg-foreground text-background shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <Icon size={16} strokeWidth={1.7} />
              <span className="flex-1">{item.label}</span>
              <span className={cn('text-[8px] uppercase tracking-[0.12em]', active ? 'opacity-60' : 'opacity-45')}>{item.labelEn}</span>
            </a>
          );
        })}
      </nav>

      <div className="mt-auto rounded-[12px] border border-border bg-card/60 p-3">
        <p className="truncate text-xs font-medium text-foreground">{email ?? 'Administrator'}</p>
        <p className="mt-1 text-[9px] uppercase tracking-[0.14em] text-muted-foreground">{role ?? 'administrator'} access</p>
        <form action={logoutAction} className="mt-3">
          <button type="submit" className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <LogOut size={14} /> 退出登录
          </button>
        </form>
      </div>
    </div>
  );
}
