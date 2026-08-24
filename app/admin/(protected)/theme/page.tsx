import { Save } from 'lucide-react';
import { saveThemeSettingsAction } from '@/app/admin/cms-actions';
import { AdminNotice, AdminPageIntro, Field, adminButton, adminCard, adminInput } from '@/components/admin/admin-ui';
import { requireAdmin } from '@/lib/supabase/admin';
import { getCmsConfig } from '@/lib/supabase/cms';

export const dynamic = 'force-dynamic';

export default async function ThemePage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const [, cms, params] = await Promise.all([requireAdmin(), getCmsConfig(), searchParams]);
  const t = cms.theme;
  const colors = [['primary', '主色', t.primary], ['secondary', '辅助色', t.secondary], ['lightBackground', '日间背景', t.lightBackground], ['lightForeground', '日间文字', t.lightForeground], ['darkBackground', '夜间背景', t.darkBackground], ['darkForeground', '夜间文字', t.darkForeground]];
  return <div><AdminPageIntro eyebrow="Design tokens" title="主题与样式" description="调整全站基础 Token；限制范围可避免局部样式失控。仅管理员可修改。" /><AdminNotice status={params.status} /><form action={saveThemeSettingsAction} className="space-y-4"><section className={adminCard}><h3 className="text-base font-semibold">颜色系统</h3><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{colors.map(([name, label, val]) => <Field key={name} label={label}><div className="flex gap-2"><input type="color" name={name} defaultValue={val} className="h-10 w-12 rounded-[8px] border border-border bg-transparent p-1" /><input className={adminInput} value={val} readOnly tabIndex={-1} /></div></Field>)}</div></section><section className={adminCard}><h3 className="text-base font-semibold">尺寸与层级</h3><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Field label="基础字号（13–18）"><input className={adminInput} type="number" name="baseFontSize" min="13" max="18" defaultValue={t.baseFontSize} /></Field><Field label="卡片圆角（6–24）"><input className={adminInput} type="number" name="radius" min="6" max="24" defaultValue={t.radius} /></Field><Field label="内容宽度（960–1280）"><input className={adminInput} type="number" name="containerWidth" min="960" max="1280" defaultValue={t.containerWidth} /></Field><Field label="卡片阴影"><select className={adminInput} name="shadow" defaultValue={t.shadow}><option value="none">无</option><option value="soft">柔和</option><option value="medium">中等</option></select></Field></div></section><div className="flex justify-end"><button className={adminButton}><Save size={15} /> 应用主题</button></div></form></div>;
}
