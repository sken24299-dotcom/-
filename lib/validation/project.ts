import { z } from 'zod';

function usesHttpProtocol(value: string) {
  try {
    const protocol = new URL(value).protocol;
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
}

function isLocalAssetPath(value: string) {
  return value.startsWith('/')
    && !value.startsWith('//')
    && !value.includes('\\')
    && !/[\u0000-\u001f]/.test(value);
}

const httpUrl = z
  .string()
  .trim()
  .max(2048, 'URL 过长')
  .url('请输入完整的 URL（包含 https://）')
  .refine(usesHttpProtocol, '仅支持 http:// 或 https:// 链接');

const assetReference = z
  .string()
  .trim()
  .min(1, '图片地址不能为空')
  .max(2048, '图片地址过长')
  .refine(
    (value) => isLocalAssetPath(value) || usesHttpProtocol(value),
    '图片仅支持站内 / 路径或 http(s) 地址',
  );

const optionalUrl = z.preprocess(
  (value) => typeof value === 'string' && value.trim() === '' ? undefined : value,
  httpUrl.optional(),
);

export const projectSchema = z.object({
  title: z.string().trim().min(1, '请输入中文标题').max(120, '标题不能超过 120 个字符'),
  titleEn: z.string().trim().max(160, '英文标题不能超过 160 个字符').optional(),
  slug: z.string().trim().min(1, '请输入 Slug').max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, '仅支持小写字母、数字和连字符'),
  category: z.string().trim().min(1, '请选择作品分类'),
  description: z.string().trim().min(10, '项目描述至少需要 10 个字符').max(1000),
  descriptionEn: z.string().trim().max(1200).optional(),
  coverImage: assetReference,
  images: z.array(assetReference).max(20, '项目图片最多 20 张'),
  tags: z.array(z.string().trim().min(1).max(40)).min(1, '至少添加一个标签').max(12, '标签最多 12 个'),
  projectUrl: optionalUrl,
  githubUrl: optionalUrl,
  featured: z.boolean(),
  published: z.boolean(),
  sortOrder: z.number().int().min(-9999).max(9999),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

export function parseProjectFormData(formData: FormData) {
  let images: unknown = [];
  try {
    images = JSON.parse(String(formData.get('images') ?? '[]'));
  } catch {
    images = [];
  }

  const tags = String(formData.get('tags') ?? '')
    .split(/[,，]/)
    .map((tag) => tag.trim())
    .filter(Boolean);

  return projectSchema.safeParse({
    title: formData.get('title'),
    titleEn: formData.get('titleEn') || undefined,
    slug: formData.get('slug'),
    category: formData.get('category'),
    description: formData.get('description'),
    descriptionEn: formData.get('descriptionEn') || undefined,
    coverImage: formData.get('coverImage'),
    images,
    tags,
    projectUrl: formData.get('projectUrl'),
    githubUrl: formData.get('githubUrl'),
    featured: formData.get('featured') === 'on',
    published: formData.get('published') === 'on',
    sortOrder: Number(formData.get('sortOrder') ?? 0),
  });
}
