# Yu Wang — AI Designer Portfolio

面向 Vercel 的生产级双语个人品牌网站。前台采用 Next.js 15、TypeScript、Tailwind CSS、Framer Motion、GSAP、next-themes 与 Lucide；Supabase 提供 Auth、Postgres、Row Level Security 和 Storage。

## 已实现

- Gerold 式双栏 Hero、动态数据、服务列表、筛选作品、重点案例、经历 / 教育、技能、评价与文章区
- `/work`、`/work/[slug]`、`/about`、`/contact` 独立页面与中英文高级排版
- 跟随系统 / 日间 / 夜间三种主题，无刷新切换
- `/admin/login` 管理员登录与受保护后台路由
- 作品新增、编辑、删除、筛选、排序与首页精选控制
- 封面和多图直传 Supabase Storage，支持 JPG / PNG / WebP / AVIF，单图最大 8MB
- Zod 表单校验、删除二次确认、上传状态和操作反馈
- Supabase RLS：公开只读作品，只有 `admin_users` 成员可写入
- 动态 Sitemap、Robots、Open Graph 和作品级 SEO
- React Hook Form + Zod 联系表单，数据真实写入 Supabase `contact_inquiries`
- 未配置 Supabase 或数据库为空时，前台自动展示本地示例作品

## 1. 本地运行

```bash
npm install
Copy-Item .env.example .env.local
npm run dev
```

访问 `http://localhost:3000`；后台登录页为 `http://localhost:3000/admin/login`。

## 2. 配置 Supabase

1. 在 Supabase 创建项目。
2. 打开 SQL Editor，按文件名顺序完整执行 `supabase/migrations/` 下的迁移：作品 / 管理员 / Storage 迁移和联系询盘迁移。
3. 在 Authentication → Users 创建管理员邮箱和密码账号。
4. 复制该用户 UUID，在 SQL Editor 执行：

```sql
insert into public.admin_users (user_id)
values ('替换为管理员用户 UUID')
on conflict (user_id) do nothing;
```

5. 将项目设置中的 URL 与 keys 写入 `.env.local`：

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`SUPABASE_SERVICE_ROLE_KEY` 只允许放在本地服务端环境与 Vercel Environment Variables，绝不能添加 `NEXT_PUBLIC_` 前缀或提交到 Git。作品 CRUD 仍使用管理员会话和 RLS；联系表单通过 Vercel Route Handler 使用该服务端密钥写入询盘，并在写入前执行限流、蜜罐和 Zod 校验，密钥不会发送到浏览器。

Storage bucket `project-assets` 由迁移自动创建。作品图片需要被前台公开读取，因此 bucket 为 public；写入、更新和删除仍受管理员 RLS 限制。上传先由受保护 API 签发一次性地址，再由浏览器直传 Storage，避免图片文件经过 Vercel Function。

## 3. 品牌内容替换

全局搜索并替换以下占位内容：

- `Yu Wang`
- `yuwang.design`
- 联系邮箱与微信号
- GitHub / LinkedIn 链接

默认案例位于 `lib/projects.ts`，默认图片位于 `public/projects`，原创人物视觉位于 `public/images/yu-wang-ai-designer.png`。Supabase 中存在作品后，后台数据会成为前台真实数据源。

## 4. 验证

```bash
npm run lint
npx tsc --noEmit
npm run build
```

`vercel.json` 已固定使用 Next.js 框架和 `npm run build:vercel`。项目不包含其他托管平台配置。

## 5. 仅部署到 Vercel

1. 将仓库导入 Vercel。
2. Root Directory 选择本项目目录。
3. 在 Production、Preview、Development 环境分别添加 `.env.example` 中的变量。
4. 将 `NEXT_PUBLIC_SITE_URL` 设为正式域名，例如 `https://portfolio.example.com`。
5. 部署后检查 `/admin/login`、图片上传、首页精选和 `/work/[slug]`。

也可以在已登录 Vercel CLI 的环境中执行：

```bash
vercel
vercel --prod
```

本项目的正式部署目标仅为 Vercel；Supabase 只承担认证、数据库与对象存储，不是网页托管平台。

## 目录

- `app/` — 前台、案例、后台、上传 API、SEO
- `components/` — 品牌前台与共享组件
- `components/admin/` — 后台布局、表单、表格、上传器
- `lib/supabase/` — Browser / Server Client、管理员校验、数据查询
- `lib/validation/` — Zod 表单验证
- `supabase/migrations/` — 数据表、RLS、Storage 策略
- `types/` — Project 数据类型
- `public/projects/` — 本地兜底案例图片

## Portfolio CMS 后台

最新迁移 `supabase/migrations/202608240001_full_cms.sql` 增加了角色、页面内容、媒体、导航、网站设置、SEO、主题和多语言数据结构。部署前需在 Supabase SQL Editor 按编号依次执行全部迁移。

首次管理员：

1. 在 Supabase Authentication 创建用户。
2. 将该用户 UUID 写入 `admin_users`（兼容旧后台）。
3. 执行最新迁移后，该账号会同步到 `profiles` 并获得 `admin` 角色。
4. 打开 `/admin/login` 登录。

权限：`admin` 可管理全部模块和用户；`editor` 可管理内容、作品、媒体、导航、SEO 与网站信息；`user` 不能进入后台。用户创建/删除依赖仅服务端可见的 `SUPABASE_SERVICE_ROLE_KEY`。

常用入口：

- `/admin/content`：修改 Hero、About、模块标题、Contact 与 Footer 双语内容。
- `/admin/projects/new`：上传封面与详情图并发布作品。
- `/admin/media`：拖拽上传图片、SVG 或 MP4，预览并复制链接。
- `/admin/navigation`：调整菜单名称、链接、排序与显示状态。
- `/admin/settings`：修改 Logo、联系方式、社交链接与版权。
- `/admin/seo`：修改主要页面的 SEO 与分享信息。
- `/admin/theme`：管理全局颜色和基础设计 Token。

前台读取 Supabase CMS 数据；表为空、请求失败或环境变量未配置时，会自动回退到 `lib/cms-defaults.ts`，避免公开页面失效。
