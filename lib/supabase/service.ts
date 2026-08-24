import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabaseUrl } from '@/lib/supabase/config';

export function createServiceClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? '';
  if (!isSupabaseConfigured || !serviceRoleKey) return null;

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
