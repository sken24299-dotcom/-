'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import { AdminHeader } from '@/components/admin/admin-header';
import { AdminSidebar } from '@/components/admin/admin-sidebar';

export function AdminLayout({ children, email, role }: { children: React.ReactNode; email?: string; role?: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 border-r border-border bg-[var(--surface)] lg:block">
        <AdminSidebar email={email} role={role} />
      </aside>
      <AnimatePresence>
        {mobileOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="关闭侧边栏"
              className="fixed inset-0 z-40 bg-black/45 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-[min(288px,88vw)] border-r border-border bg-[var(--surface)] shadow-2xl lg:hidden"
              initial={reduceMotion ? false : { x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ duration: reduceMotion ? 0.01 : 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <AdminSidebar email={email} role={role} onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
      <div className="lg:pl-60">
        <AdminHeader onOpenMenu={() => setMobileOpen(true)} />
        <main className="mx-auto w-full max-w-[1120px] p-4 sm:p-5 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
