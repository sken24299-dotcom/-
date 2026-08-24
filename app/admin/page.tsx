import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const session = await getAdminSession();
  redirect(session.isAdmin ? '/admin/dashboard' : '/admin/login');
}

