import { z } from 'zod';

export const contactServices = [
  'AI 产品设计',
  '前端界面开发',
  '电商视觉设计',
  '品牌视觉系统',
  '作品集网站',
  '其他合作',
] as const;

export const contactBudgets = [
  '¥5,000 — ¥15,000',
  '¥15,000 — ¥30,000',
  '¥30,000 — ¥60,000',
  '¥60,000+',
  '先讨论范围',
] as const;

export const contactSchema = z.object({
  name: z.string().trim().min(2, '请填写至少 2 个字符').max(80, '姓名过长'),
  email: z.string().trim().email('请输入有效邮箱').max(160),
  phone: z.string().trim().max(40, '电话号码过长').optional(),
  service: z.string().trim().min(1, '请选择服务类型').refine(
    (value) => contactServices.includes(value as (typeof contactServices)[number]),
    '请选择有效的服务类型',
  ),
  budget: z.string().trim().min(1, '请选择预算范围').refine(
    (value) => contactBudgets.includes(value as (typeof contactBudgets)[number]),
    '请选择有效的预算范围',
  ),
  description: z.string().trim().min(20, '请至少用 20 个字符描述项目').max(2000, '项目描述不能超过 2000 个字符'),
});

export type ContactValues = z.infer<typeof contactSchema>;
