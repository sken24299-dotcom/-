'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { AlertTriangle, LoaderCircle, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { deleteProjectAction } from '@/app/admin/actions';

function ConfirmSubmit() {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending} className="flex h-10 items-center justify-center gap-2 rounded-[10px] bg-red-600 px-5 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-50">{pending ? <LoaderCircle className="animate-spin" size={14} /> : <><Trash2 size={14} /> 确认删除</>}</button>;
}

export function DeleteProjectButton({ id, title }: { id: string; title: string }) {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const action = deleteProjectAction.bind(null, id);

  return (
    <>
      <button type="button" className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-red-500/25 hover:bg-red-500/[0.08] hover:text-red-500" onClick={() => setOpen(true)} aria-label={`删除 ${title}`}><Trash2 size={14} /></button>
      <AnimatePresence>
        {open ? (
          <motion.div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 p-4 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-labelledby="delete-title">
            <motion.div className="w-full max-w-md rounded-[18px] border border-border bg-card p-6 shadow-2xl" initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 6, scale: 0.99 }} transition={{ duration: reduceMotion ? 0.01 : 0.2 }}>
              <div className="flex items-start justify-between gap-4">
                <span className="flex size-11 items-center justify-center rounded-full bg-red-500/10 text-red-500"><AlertTriangle size={19} /></span>
                <button type="button" className="flex size-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground" onClick={() => setOpen(false)} aria-label="取消删除"><X size={16} /></button>
              </div>
              <h2 id="delete-title" className="mt-5 text-xl font-semibold tracking-[-0.035em]">确认删除这个作品？</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">“{title}”将从作品数据库中永久删除。Storage 中的原始图片会保留，避免误删被其他案例复用的资源。</p>
              <div className="mt-6 flex justify-end gap-2">
                <button type="button" className="h-10 rounded-[10px] px-5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground" onClick={() => setOpen(false)}>取消</button>
                <form action={action}><ConfirmSubmit /></form>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
