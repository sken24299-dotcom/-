import type { ReactNode } from 'react';

export function Localized({ zh, en }: { zh: ReactNode; en: ReactNode }) {
  return (
    <>
      <span data-lang="zh">{zh}</span>
      <span data-lang="en">{en}</span>
    </>
  );
}
