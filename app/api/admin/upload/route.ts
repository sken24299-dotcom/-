import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

const allowedTypes = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
  ['image/avif', 'avif'],
  ['image/svg+xml', 'svg'],
  ['video/mp4', 'mp4'],
]);
const maxFileSize = 50 * 1024 * 1024;

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session.configured || session.error) {
    return NextResponse.json({ error: 'Supabase 配置或权限服务不可用。' }, { status: 503 });
  }
  if (!session.authenticated) {
    return NextResponse.json({ error: '未授权访问。' }, { status: 401 });
  }
  if (!(session.isAdmin || session.role === 'editor') || session.status === 'disabled') return NextResponse.json({ error: '没有内容编辑权限。' }, { status: 403 });

  const input = await request.json().catch(() => null) as { name?: string; type?: string; size?: number } | null;
  if (!input?.name?.trim() || input.name.length > 255 || !input.type || typeof input.size !== 'number') {
    return NextResponse.json({ error: '文件信息不完整。' }, { status: 400 });
  }
  if (!Number.isSafeInteger(input.size) || input.size <= 0) return NextResponse.json({ error: '不能上传空文件。' }, { status: 400 });
  if (!allowedTypes.has(input.type)) return NextResponse.json({ error: '仅支持 JPG、PNG、WebP、AVIF、SVG 和 MP4。' }, { status: 415 });
  const typeLimit = input.type === 'video/mp4' ? maxFileSize : 8 * 1024 * 1024;
  if (input.size > typeLimit) return NextResponse.json({ error: input.type === 'video/mp4' ? '视频不能超过 50MB。' : '图片不能超过 8MB。' }, { status: 413 });

  const extension = allowedTypes.get(input.type)!;
  const folder = input.type === 'video/mp4' ? 'videos' : 'images';
  const path = `${folder}/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${extension}`;
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: 'Supabase 连接不可用。' }, { status: 503 });

  const { data: signedUpload, error } = await supabase.storage.from('project-assets').createSignedUploadUrl(path);
  if (error || !signedUpload) {
    console.error('Unable to create a signed project upload:', error?.message ?? 'No signed upload payload');
    return NextResponse.json({ error: '无法创建安全上传地址，请检查 Storage 策略。' }, { status: 500 });
  }
  const { data: publicAsset } = supabase.storage.from('project-assets').getPublicUrl(path);
  return NextResponse.json(
    { path, token: signedUpload.token, url: publicAsset.publicUrl },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
