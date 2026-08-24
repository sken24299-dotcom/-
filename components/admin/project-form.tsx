'use client';

import { ArrowLeft, Check, LoaderCircle, Save, Sparkles } from 'lucide-react';
import { useActionState, useRef, useState } from 'react';
import { createProjectAction, updateProjectAction } from '@/app/admin/actions';
import { ImageUploader } from '@/components/admin/image-uploader';
import { cn } from '@/lib/utils';
import type { Project, ProjectActionState } from '@/types/project';

const categories = ['AI 产品设计', '电商视觉设计', '品牌视觉设计', '前端开发', 'SaaS 产品', '创意实验'];
const initialState: ProjectActionState = { status: 'idle' };

type FormAction = (state: ProjectActionState, formData: FormData) => Promise<ProjectActionState>;

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function FieldError({ errors }: { errors?: string[] }) {
  return errors?.length ? <p className="mt-2 text-xs text-red-600 dark:text-red-300">{errors[0]}</p> : null;
}

const inputClass = 'h-11 w-full rounded-[8px] border border-border bg-background/55 px-3.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/45 focus:border-violet-500/45 focus:ring-4 focus:ring-violet-500/10';
const textareaClass = 'min-h-28 w-full resize-y rounded-[8px] border border-border bg-background/55 px-3.5 py-3 text-sm leading-6 text-foreground outline-none transition placeholder:text-muted-foreground/45 focus:border-violet-500/45 focus:ring-4 focus:ring-violet-500/10';

export function ProjectForm({ project }: { project?: Project }) {
  const mode = project ? 'edit' : 'create';
  const action: FormAction = project ? updateProjectAction.bind(null, project.id) : createProjectAction;
  const [state, formAction, pending] = useActionState(action, initialState);
  const [coverImage, setCoverImage] = useState(project?.coverImage ?? '');
  const [images, setImages] = useState((project?.images ?? []).filter((image) => image !== project?.coverImage));
  const [slug, setSlug] = useState(project?.slug ?? '');
  const slugTouched = useRef(Boolean(project));

  return (
    <form action={formAction} className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
      <input type="hidden" name="coverImage" value={coverImage} />
      <input type="hidden" name="images" value={JSON.stringify(images)} />

      <div className="space-y-5">
        <section className="rounded-[14px] border border-border bg-card p-4 shadow-sm sm:p-5">
          <div className="mb-7 flex items-start gap-3">
            <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-violet-500"><Sparkles size={15} /></span>
            <div><h2 className="text-base font-semibold">作品基本信息</h2><p className="mt-1 text-xs text-muted-foreground">用中文建立主要叙事，英文作为国际化补充。</p></div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="sm:col-span-2"><span className="mb-2 block text-xs font-medium">中文标题 *</span><input className={inputClass} name="title" required maxLength={120} defaultValue={project?.title} placeholder="例如：让强大的 AI，变得自然且可信。" /><FieldError errors={state.fieldErrors?.title} /></label>
            <label className="sm:col-span-2"><span className="mb-2 block text-xs font-medium">英文标题</span><input className={inputClass} name="titleEn" maxLength={160} defaultValue={project?.titleEn} placeholder="Making powerful AI feel effortlessly useful." onChange={(event) => { if (!slugTouched.current) setSlug(slugify(event.target.value)); }} /><FieldError errors={state.fieldErrors?.titleEn} /></label>
            <label><span className="mb-2 block text-xs font-medium">Slug *</span><input className={inputClass} name="slug" required value={slug} placeholder="ai-platform-design" onChange={(event) => { slugTouched.current = true; setSlug(event.target.value.toLowerCase()); }} /><FieldError errors={state.fieldErrors?.slug} /></label>
            <label><span className="mb-2 block text-xs font-medium">作品分类 *</span><select className={inputClass} name="category" required defaultValue={project?.category ?? ''}><option value="" disabled>选择分类</option>{categories.map((category) => <option key={category}>{category}</option>)}</select><FieldError errors={state.fieldErrors?.category} /></label>
            <label className="sm:col-span-2"><span className="mb-2 block text-xs font-medium">中文描述 *</span><textarea className={textareaClass} name="description" required maxLength={1000} defaultValue={project?.description} placeholder="用简洁的语言说明项目目标、设计价值与最终影响。" /><FieldError errors={state.fieldErrors?.description} /></label>
            <label className="sm:col-span-2"><span className="mb-2 block text-xs font-medium">英文描述</span><textarea className={textareaClass} name="descriptionEn" maxLength={1200} defaultValue={project?.descriptionEn} placeholder="A concise English summary for international visitors." /><FieldError errors={state.fieldErrors?.descriptionEn} /></label>
          </div>
        </section>

        <section className="rounded-[14px] border border-border bg-card p-4 shadow-sm sm:p-5">
          <h2 className="text-base font-semibold">标签与外部链接</h2>
          <p className="mt-1 text-xs text-muted-foreground">标签使用逗号分隔；链接请填写完整 https:// 地址。</p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <label className="sm:col-span-2"><span className="mb-2 block text-xs font-medium">项目标签 *</span><input className={inputClass} name="tags" required defaultValue={project?.tags.join(', ')} placeholder="AI, Product Design, Design System" /><FieldError errors={state.fieldErrors?.tags} /></label>
            <label><span className="mb-2 block text-xs font-medium">项目链接</span><input className={inputClass} name="projectUrl" type="url" defaultValue={project?.projectUrl} placeholder="https://example.com" /><FieldError errors={state.fieldErrors?.projectUrl} /></label>
            <label><span className="mb-2 block text-xs font-medium">GitHub 链接</span><input className={inputClass} name="githubUrl" type="url" defaultValue={project?.githubUrl} placeholder="https://github.com/..." /><FieldError errors={state.fieldErrors?.githubUrl} /></label>
          </div>
        </section>

        <section className="rounded-[14px] border border-border bg-card p-4 shadow-sm sm:p-5">
          <ImageUploader label="作品封面 *" description="建议 3:2 或 16:10，至少 1600px 宽；将用于首页卡片和 SEO 分享图。" value={coverImage ? [coverImage] : []} onChange={(value) => setCoverImage(value[0] ?? '')} />
          <FieldError errors={state.fieldErrors?.coverImage} />
          <div className="mt-8 border-t border-border pt-8"><ImageUploader label="案例图库" description="用于详情页的过程、界面与成果展示，最多 12 张。" value={images} onChange={setImages} multiple max={12} /></div>
          <FieldError errors={state.fieldErrors?.images} />
        </section>
      </div>

      <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
        <section className="rounded-[14px] border border-border bg-card p-4 shadow-sm">
          <h2 className="text-sm font-semibold">发布设置</h2>
          <div className="mt-5 space-y-5">
            <label className="flex cursor-pointer items-center justify-between gap-5 rounded-[12px] border border-border bg-background/50 p-4">
              <span><span className="block text-xs font-medium">首页精选</span><span className="mt-1 block text-[10px] leading-4 text-muted-foreground">仅精选作品会出现在首页。</span></span>
              <span className="relative inline-flex h-6 w-11 shrink-0 items-center"><input className="peer sr-only" type="checkbox" name="featured" defaultChecked={project?.featured ?? true} /><span className="absolute inset-0 rounded-full bg-muted transition peer-checked:bg-violet-500" /><span className="relative ml-1 size-4 rounded-full bg-white shadow transition peer-checked:translate-x-5" /></span>
            </label>
            <label className="flex cursor-pointer items-center justify-between gap-5 rounded-[12px] border border-border bg-background/50 p-4">
              <span><span className="block text-xs font-medium">公开发布</span><span className="mt-1 block text-[10px] leading-4 text-muted-foreground">关闭后前台列表和详情页都不可见。</span></span>
              <span className="relative inline-flex h-6 w-11 shrink-0 items-center"><input className="peer sr-only" type="checkbox" name="published" defaultChecked={project?.published ?? true} /><span className="absolute inset-0 rounded-full bg-muted transition peer-checked:bg-emerald-500" /><span className="relative ml-1 size-4 rounded-full bg-white shadow transition peer-checked:translate-x-5" /></span>
            </label>
            <label><span className="mb-2 block text-xs font-medium">排序权重</span><input className={inputClass} name="sortOrder" type="number" min={-9999} max={9999} defaultValue={project?.sortOrder ?? 10} /><span className="mt-2 block text-[10px] leading-4 text-muted-foreground">数字越小越靠前，例如 10、20、30。</span><FieldError errors={state.fieldErrors?.sortOrder} /></label>
          </div>
        </section>

        {state.message ? <div role="alert" className={cn('rounded-2xl border px-4 py-3 text-xs leading-5', state.status === 'error' ? 'border-red-500/15 bg-red-500/[0.07] text-red-600 dark:text-red-300' : 'border-emerald-500/15 bg-emerald-500/[0.07] text-emerald-700 dark:text-emerald-300')} >{state.message}</div> : null}

        <div className="grid gap-2">
          <button type="submit" disabled={pending} className="group flex h-12 items-center justify-center gap-2 rounded-[10px] bg-[var(--primary)] text-sm font-semibold text-white transition-all hover:-translate-y-px hover:bg-[var(--primary-hover)] disabled:pointer-events-none disabled:opacity-50">
            {pending ? <LoaderCircle className="animate-spin" size={16} /> : mode === 'edit' ? <><Save size={15} /> 保存修改</> : <><Check size={15} /> 发布作品</>}
          </button>
          <a href="/admin/projects" className="flex h-11 items-center justify-center gap-2 rounded-[10px] text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"><ArrowLeft size={14} /> 返回作品列表</a>
        </div>
      </aside>
    </form>
  );
}
