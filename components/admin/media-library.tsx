'use client';

import { Check, Clipboard, FileVideo, LoaderCircle, Search, Trash2, UploadCloud } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { PortfolioImage } from '@/components/portfolio-image';
import { createClient } from '@/lib/supabase/client';
import type { MediaAsset } from '@/types/cms';

const accepted = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/svg+xml', 'video/mp4'];

export function MediaLibrary({ initialAssets }: { initialAssets: MediaAsset[] }) {
  const [assets, setAssets] = useState(initialAssets);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const filtered = useMemo(() => assets.filter((asset) => (category === 'all' || asset.category === category) && `${asset.name} ${asset.altText}`.toLowerCase().includes(query.toLowerCase())), [assets, category, query]);
  const categories = Array.from(new Set(assets.map((asset) => asset.category)));

  async function uploadFiles(files: FileList | File[]) {
    const queue = Array.from(files);
    if (!queue.length) return;
    setUploading(true); setProgress(0);
    try {
      const uploaded: MediaAsset[] = [];
      for (let index = 0; index < queue.length; index++) {
        const file = queue[index];
        if (!accepted.includes(file.type)) throw new Error(`${file.name} 格式不支持。`);
        const limit = file.type === 'video/mp4' ? 50 : 8;
        if (file.size > limit * 1024 * 1024) throw new Error(`${file.name} 超过 ${limit}MB。`);
        const signed = await fetch('/api/admin/upload', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: file.name, type: file.type, size: file.size }) });
        const payload = await signed.json() as { path?: string; token?: string; url?: string; error?: string };
        if (!signed.ok || !payload.path || !payload.token || !payload.url) throw new Error(payload.error ?? '无法创建上传地址。');
        const supabase = createClient(); if (!supabase) throw new Error('Supabase 尚未配置。');
        const { error } = await supabase.storage.from('project-assets').uploadToSignedUrl(payload.path, payload.token, file, { contentType: file.type });
        if (error) throw new Error(`${file.name} 上传失败。`);
        const record = await fetch('/api/admin/media', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: file.name, url: payload.url, path: payload.path, mimeType: file.type, size: file.size, category: file.type === 'video/mp4' ? 'video' : 'image', altText: file.name.replace(/\.[^.]+$/, '') }) });
        const recordData = await record.json() as { id?: string; error?: string };
        if (!record.ok || !recordData.id) throw new Error(recordData.error ?? '媒体记录保存失败。');
        uploaded.push({ id: recordData.id, name: file.name, url: payload.url, path: payload.path, mimeType: file.type, size: file.size, category: file.type === 'video/mp4' ? 'video' : 'image', altText: file.name.replace(/\.[^.]+$/, ''), createdAt: new Date().toISOString() });
        setProgress(Math.round(((index + 1) / queue.length) * 100));
      }
      setAssets((current) => [...uploaded, ...current]); toast.success(`已上传 ${uploaded.length} 个文件`);
    } catch (error) { toast.error(error instanceof Error ? error.message : '上传失败。'); }
    finally { setUploading(false); if (inputRef.current) inputRef.current.value = ''; }
  }

  async function remove(asset: MediaAsset) {
    if (!window.confirm(`确认永久删除“${asset.name}”？使用该链接的页面可能无法显示。`)) return;
    const response = await fetch('/api/admin/media', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: asset.id }) });
    const result = await response.json() as { error?: string };
    if (!response.ok) return toast.error(result.error ?? '删除失败。');
    setAssets((current) => current.filter((item) => item.id !== asset.id)); toast.success('媒体已删除');
  }

  return <div className="space-y-4">
    <button type="button" onClick={() => inputRef.current?.click()} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); uploadFiles(event.dataTransfer.files); }} className="flex min-h-36 w-full flex-col items-center justify-center rounded-[14px] border border-dashed border-violet-500/30 bg-violet-500/[.04] px-4 text-center transition hover:bg-violet-500/[.07]" disabled={uploading}>{uploading ? <LoaderCircle className="animate-spin text-violet-500" size={24} /> : <UploadCloud className="text-violet-500" size={24} />}<span className="mt-3 text-sm font-semibold">{uploading ? `正在上传 ${progress}%` : '拖拽文件到此处，或点击上传'}</span><span className="mt-1 text-[10px] text-muted-foreground">JPG / PNG / WebP / AVIF / SVG ≤ 8MB · MP4 ≤ 50MB</span>{uploading ? <span className="mt-4 h-1.5 w-48 overflow-hidden rounded-full bg-muted"><span className="block h-full bg-violet-500 transition-all" style={{ width: `${progress}%` }} /></span> : null}</button>
    <input ref={inputRef} className="sr-only" type="file" multiple accept={accepted.join(',')} onChange={(event) => event.target.files && uploadFiles(event.target.files)} />
    <div className="flex flex-col gap-2 sm:flex-row"><label className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} /><input className="h-10 w-full rounded-[8px] border border-border bg-card pl-9 pr-3 text-sm outline-none" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索媒体…" /></label><select className="h-10 rounded-[8px] border border-border bg-card px-3 text-sm" value={category} onChange={(event) => setCategory(event.target.value)}><option value="all">全部分类</option>{categories.map((item) => <option key={item}>{item}</option>)}</select></div>
    {filtered.length ? <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{filtered.map((asset) => <article key={asset.id} className="overflow-hidden rounded-[12px] border border-border bg-card shadow-sm"><div className="relative aspect-video bg-muted">{asset.mimeType === 'video/mp4' ? <video src={asset.url} controls preload="metadata" className="size-full object-cover" /> : <PortfolioImage src={asset.url} alt={asset.altText} fill sizes="360px" className="object-cover" />}</div><div className="p-3"><div className="flex items-start gap-2"><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold">{asset.name}</p><p className="mt-1 text-[9px] uppercase tracking-[.1em] text-muted-foreground">{asset.mimeType} · {(asset.size / 1024 / 1024).toFixed(2)} MB</p></div>{asset.mimeType === 'video/mp4' ? <FileVideo size={15} className="text-violet-500" /> : null}</div><div className="mt-3 flex gap-2"><button className="flex h-9 flex-1 items-center justify-center gap-2 rounded-[8px] border border-border text-xs text-muted-foreground" onClick={async () => { await navigator.clipboard.writeText(asset.url); toast.success('链接已复制'); }}><Clipboard size={13} /> 复制链接</button><button className="flex size-9 items-center justify-center rounded-[8px] border border-red-500/20 text-red-500" onClick={() => remove(asset)} aria-label={`删除 ${asset.name}`}><Trash2 size={13} /></button></div></div></article>)}</div> : <div className="flex min-h-52 flex-col items-center justify-center rounded-[14px] border border-dashed border-border text-center"><Check className="text-muted-foreground" size={22} /><p className="mt-3 text-sm font-medium">没有匹配的媒体</p><p className="mt-1 text-xs text-muted-foreground">上传文件或调整筛选条件。</p></div>}
  </div>;
}
