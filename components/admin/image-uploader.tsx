'use client';

import { ImagePlus, LoaderCircle, Trash2, UploadCloud } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { PortfolioImage } from '@/components/portfolio-image';
import { createClient } from '@/lib/supabase/client';

type ImageUploaderProps = {
  label: string;
  description: string;
  value: string[];
  onChange: (value: string[]) => void;
  multiple?: boolean;
  max?: number;
};

export function ImageUploader({ label, description, value, onChange, multiple = false, max = 1 }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    const available = Math.max(0, max - value.length);
    const queue = Array.from(files).slice(0, multiple ? available : 1);
    if (!queue.length) return toast.error(`最多上传 ${max} 张图片。`);

    setUploading(true);
    const uploaded: string[] = [];
    try {
      for (const file of queue) {
        if (!['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(file.type)) throw new Error('仅支持 JPG、PNG、WebP 和 AVIF。');
        if (file.size > 8 * 1024 * 1024) throw new Error('单张图片不能超过 8MB。');
        const response = await fetch('/api/admin/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: file.name, type: file.type, size: file.size }),
        });
        const result = await response.json() as { path?: string; token?: string; url?: string; error?: string };
        if (!response.ok || !result.url || !result.path || !result.token) throw new Error(result.error ?? '上传失败。');
        const supabase = createClient();
        if (!supabase) throw new Error('Supabase 尚未配置。');
        const { error } = await supabase.storage.from('project-assets').uploadToSignedUrl(result.path, result.token, file, { contentType: file.type });
        if (error) throw new Error('图片上传失败，请稍后重试。');
        uploaded.push(result.url);
      }
      onChange(multiple ? [...value, ...uploaded] : uploaded);
      toast.success(uploaded.length > 1 ? '图片上传完成' : '图片上传完成');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '上传失败，请稍后重试。');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div>
      <div className="mb-3 flex items-end justify-between gap-4">
        <div><p className="text-sm font-semibold">{label}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p></div>
        <span className="shrink-0 text-[9px] uppercase tracking-[0.12em] text-muted-foreground">{value.length} / {max}</span>
      </div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading || value.length >= max}
        className="flex min-h-28 w-full flex-col items-center justify-center rounded-[12px] border border-dashed border-border bg-background/55 px-4 text-center transition hover:border-violet-500/35 hover:bg-violet-500/[0.04] disabled:pointer-events-none disabled:opacity-45"
      >
        {uploading ? <LoaderCircle className="animate-spin text-violet-500" size={22} /> : <UploadCloud className="text-muted-foreground" size={22} strokeWidth={1.5} />}
        <span className="mt-3 text-xs font-medium">{uploading ? '正在安全上传…' : '点击上传图片'}</span>
        <span className="mt-1 text-[10px] text-muted-foreground">JPG / PNG / WebP / AVIF · Max 8MB</span>
      </button>
      <input ref={inputRef} className="sr-only" type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple={multiple} onChange={(event) => upload(event.target.files)} />

      {value.length ? (
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {value.map((image, index) => (
            <div key={`${image}-${index}`} className="group relative aspect-[4/3] overflow-hidden rounded-[12px] border border-border bg-muted">
              <PortfolioImage src={image} alt={`${label} ${index + 1}`} fill sizes="(max-width: 640px) 50vw, 240px" className="size-full object-cover" />
              <button type="button" className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-black/60 text-white opacity-100 backdrop-blur transition hover:bg-red-500 sm:opacity-0 sm:group-hover:opacity-100" onClick={() => onChange(value.filter((_, itemIndex) => itemIndex !== index))} aria-label={`移除第 ${index + 1} 张图片`}><Trash2 size={13} /></button>
            </div>
          ))}
          {multiple && value.length < max ? <button type="button" className="flex aspect-[4/3] items-center justify-center rounded-[12px] border border-dashed border-border text-muted-foreground transition hover:border-violet-500/35 hover:text-violet-500" onClick={() => inputRef.current?.click()} aria-label="继续添加图片"><ImagePlus size={20} /></button> : null}
        </div>
      ) : null}
    </div>
  );
}
