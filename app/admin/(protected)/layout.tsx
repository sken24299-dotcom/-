import { AdminLayout } from '@/components/admin/admin-layout';
import { requireBackoffice } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireBackoffice();
  return <AdminLayout email={session.email} role={session.role}>{children}</AdminLayout>;
}
