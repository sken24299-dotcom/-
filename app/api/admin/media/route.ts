import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

async function authorize() {
  const session = await getAdminSession();
  return session.authenticated && session.status !== 'disabled' && (session.isAdmin || session.role === 'editor') ? session : null;
}

export async function POST(request: Request) {
  const session = await authorize();
  if (!session) return NextResponse.json({ error: '没有媒体管理权限。' }, { status: 403 });
  const input = await request.json().catch(() => null) as { name?: string; url?: string; path?: string; mimeType?: string; size?: number; category?: string; altText?: string } | null;
  if (!input?.name || !input.url || !input.path || !input.mimeType || !input.size) return NextResponse.json({ error: '媒体信息不完整。' }, { status: 400 });
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: 'Supabase 未配置。' }, { status: 503 });
  const { data, error } = await supabase.from('media_assets').insert({ name: input.name.slice(0, 255), url: input.url, path: input.path, mime_type: input.mimeType, size: input.size, category: (input.category || 'general').slice(0, 60), alt_text: (input.altText || '').slice(0, 300), uploaded_by: session.userId }).select('id').single();
  if (error) return NextResponse.json({ error: '媒体记录保存失败。' }, { status: 500 });
  return NextResponse.json({ id: data.id });
}

export async function DELETE(request: Request) {
  const session = await authorize();
  if (!session) return NextResponse.json({ error: '没有媒体管理权限。' }, { status: 403 });
  const input = await request.json().catch(() => null) as { id?: string } | null;
  if (!input?.id) return NextResponse.json({ error: '缺少媒体 ID。' }, { status: 400 });
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: 'Supabase 未配置。' }, { status: 503 });
  const { data: asset } = await supabase.from('media_assets').select('path').eq('id', input.id).maybeSingle();
  if (!asset) return NextResponse.json({ error: '媒体不存在。' }, { status: 404 });
  const { error: storageError } = await supabase.storage.from('project-assets').remove([asset.path]);
  if (storageError) return NextResponse.json({ error: 'Storage 删除失败。' }, { status: 500 });
  const { error } = await supabase.from('media_assets').delete().eq('id', input.id);
  if (error) return NextResponse.json({ error: '媒体记录删除失败。' }, { status: 500 });
  return NextResponse.json({ ok: true });
}
