import { AdminNotice, AdminPageIntro } from '@/components/admin/admin-ui';
import { UsersManager } from '@/components/admin/users-manager';
import { requireAdmin } from '@/lib/supabase/admin';
import { getProfiles } from '@/lib/supabase/cms';

export const dynamic = 'force-dynamic';
export default async function UsersPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) { const [session, users, params] = await Promise.all([requireAdmin(), getProfiles(), searchParams]); return <div><AdminPageIntro eyebrow="Access control" title="用户管理" description="管理 Auth 用户、角色与状态。Admin 拥有全部权限；Editor 可编辑内容但不能管理用户。" /><AdminNotice status={params.status} />{!users.length ? <div className="mb-4 rounded-[12px] border border-amber-500/20 bg-amber-500/[.06] p-4 text-xs leading-5 text-amber-700 dark:text-amber-300">当前没有可显示的用户。若已有账号，请检查 SUPABASE_SERVICE_ROLE_KEY 与最新 CMS 数据库迁移。</div> : null}<UsersManager users={users} currentUserId={session.userId} /></div>; }
