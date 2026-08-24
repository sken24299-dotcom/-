import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { contactSchema } from '@/lib/validation/contact';

type RateLimitEntry = { count: number; resetAt: number };

const rateLimitGlobal = globalThis as typeof globalThis & {
  portfolioContactRateLimit?: Map<string, RateLimitEntry>;
};
const rateLimitStore = rateLimitGlobal.portfolioContactRateLimit ?? new Map<string, RateLimitEntry>();
rateLimitGlobal.portfolioContactRateLimit = rateLimitStore;

const rateLimitWindowMs = 10 * 60 * 1000;
const rateLimitMaxRequests = 8;
const maxBodyBytes = 16 * 1024;

function clientAddress(request: Request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')?.trim()
    || 'unknown';
}

function consumeRateLimit(key: string) {
  const now = Date.now();
  if (rateLimitStore.size >= 5_000) {
    for (const [storedKey, entry] of rateLimitStore) {
      if (entry.resetAt <= now) rateLimitStore.delete(storedKey);
    }
    while (rateLimitStore.size >= 5_000) {
      const oldestKey = rateLimitStore.keys().next().value as string | undefined;
      if (!oldestKey) break;
      rateLimitStore.delete(oldestKey);
    }
  }

  const current = rateLimitStore.get(key);
  if (!current || current.resetAt <= now) {
    const entry = { count: 1, resetAt: now + rateLimitWindowMs };
    rateLimitStore.set(key, entry);
    return { allowed: true, remaining: rateLimitMaxRequests - 1, resetAt: entry.resetAt };
  }

  current.count += 1;
  return {
    allowed: current.count <= rateLimitMaxRequests,
    remaining: Math.max(0, rateLimitMaxRequests - current.count),
    resetAt: current.resetAt,
  };
}

export async function POST(request: Request) {
  const declaredLength = Number(request.headers.get('content-length') ?? 0);
  if (Number.isFinite(declaredLength) && declaredLength > maxBodyBytes) {
    return NextResponse.json({ error: '请求内容过大。' }, { status: 413 });
  }

  const rateLimit = consumeRateLimit(clientAddress(request));
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: '提交过于频繁，请稍后再试。' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.max(1, Math.ceil((rateLimit.resetAt - Date.now()) / 1000))),
          'X-RateLimit-Remaining': '0',
        },
      },
    );
  }

  const body = await request.text().catch(() => '');
  if (new TextEncoder().encode(body).byteLength > maxBodyBytes) {
    return NextResponse.json({ error: '请求内容过大。' }, { status: 413 });
  }

  let input: unknown = null;
  try {
    input = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: '请检查联系表单内容。' }, { status: 400 });
  }

  if (
    input
    && typeof input === 'object'
    && 'website' in input
    && typeof input.website === 'string'
    && input.website.trim()
  ) {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) return NextResponse.json({ error: '请检查联系表单内容。' }, { status: 400 });

  const supabase = createServiceClient();
  if (!supabase) return NextResponse.json({ error: '在线表单尚未连接，请直接发送邮件至 hello@yuwang.design。' }, { status: 503 });

  const { error } = await supabase.from('contact_inquiries').insert({
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone || null,
    service: parsed.data.service,
    budget: parsed.data.budget,
    description: parsed.data.description,
  });

  if (error) {
    console.error('Unable to store a contact inquiry:', error.code, error.message);
    return NextResponse.json({ error: '消息发送失败，请稍后重试或直接发送邮件。' }, { status: 500 });
  }
  return NextResponse.json(
    { ok: true },
    { status: 201, headers: { 'X-RateLimit-Remaining': String(rateLimit.remaining) } },
  );
}
