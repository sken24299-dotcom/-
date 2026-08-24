import { redirect } from 'next/navigation';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { createClient } from '@/lib/supabase/server';

export type AdminSession = {
  configured: boolean;
  authenticated: boolean;
  isAdmin: boolean;
  userId?: string;
  email?: string;
  role?: 'admin' | 'editor' | 'user';
  status?: 'active' | 'disabled';
  error?: 'auth_lookup_failed' | 'membership_lookup_failed';
};

export async function getAdminSession(): Promise<AdminSession> {
  if (!isSupabaseConfigured) {
    return { configured: false, authenticated: false, isAdmin: false };
  }

  const supabase = await createClient();
  if (!supabase) return { configured: false, authenticated: false, isAdmin: false };

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError && authError.name !== 'AuthSessionMissingError') {
    console.error('Unable to verify the Supabase auth session:', authError.message);
  }
  if (!user) return { configured: true, authenticated: false, isAdmin: false };

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role,status')
    .eq('id', user.id)
    .maybeSingle();

  let role = profile?.role as AdminSession['role'] | undefined;
  let status = profile?.status as AdminSession['status'] | undefined;
  let error = profileError;
  if (profileError || !profile) {
    const legacy = await supabase.from('admin_users').select('user_id').eq('user_id', user.id).maybeSingle();
    if (legacy.data) { role = 'admin'; status = 'active'; error = null; }
    else error = legacy.error;
  }

  if (error) {
    console.error('Unable to verify administrator membership:', error.message);
    return {
      configured: true,
      authenticated: true,
      isAdmin: false,
      userId: user.id,
      email: user.email,
      error: 'membership_lookup_failed',
    };
  }

  return {
    configured: true,
    authenticated: true,
    isAdmin: role === 'admin' && status === 'active',
    userId: user.id,
    email: user.email,
    role,
    status,
  };
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session.configured || !session.authenticated || !session.isAdmin) {
    redirect('/admin/login');
  }
  return session;
}

export async function requireBackoffice() {
  const session = await getAdminSession();
  const canAccess = session.role === 'admin' || session.role === 'editor' || session.isAdmin;
  if (!session.configured || !session.authenticated || !canAccess || session.status === 'disabled') redirect('/admin/login');
  return session;
}

export async function requireEditor() {
  return requireBackoffice();
}
