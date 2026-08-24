const rawSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? '';
const rawSupabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? '';

function isValidHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return (url.protocol === 'http:' || url.protocol === 'https:') && Boolean(url.hostname);
  } catch {
    return false;
  }
}

export const supabaseUrl = isValidHttpUrl(rawSupabaseUrl) ? rawSupabaseUrl.replace(/\/$/, '') : '';
export const supabaseAnonKey = rawSupabaseAnonKey;

export const supabaseConfigurationError = !rawSupabaseUrl || !rawSupabaseAnonKey
  ? 'Supabase 环境变量不完整。'
  : !supabaseUrl
    ? 'NEXT_PUBLIC_SUPABASE_URL 必须是有效的 http(s) URL。'
    : undefined;

export const isSupabaseConfigured = !supabaseConfigurationError;
