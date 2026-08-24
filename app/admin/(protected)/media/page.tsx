import { AdminPageIntro } from '@/components/admin/admin-ui';
import { MediaLibrary } from '@/components/admin/media-library';
import { getMediaAssets } from '@/lib/supabase/cms';

export const dynamic = 'force-dynamic';
export default async function MediaPage() { const assets = await getMediaAssets(); return <div><AdminPageIntro eyebrow="Media library" title="媒体资源" description="集中上传、预览、复制和删除前台使用的图片、Logo、封面与视频。" /><MediaLibrary initialAssets={assets} /></div>; }
