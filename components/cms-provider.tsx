'use client';

import { createContext, useContext } from 'react';
import { defaultCmsConfig } from '@/lib/cms-defaults';
import type { CmsConfig } from '@/types/cms';

const CmsContext = createContext<CmsConfig>(defaultCmsConfig);

export function CmsProvider({ config, children }: { config: CmsConfig; children: React.ReactNode }) {
  return <CmsContext.Provider value={config}>{children}</CmsContext.Provider>;
}

export function useCms() {
  return useContext(CmsContext);
}

function safeHex(value: string, fallback: string) {
  return /^#[0-9a-f]{6}$/i.test(value) ? value : fallback;
}

export function CmsThemeStyle({ config }: { config: CmsConfig }) {
  const theme = config.theme;
  const shadow = theme.shadow === 'none' ? 'none' : theme.shadow === 'medium' ? '0 18px 52px rgba(9,9,11,.12)' : '0 14px 40px rgba(9,9,11,.06)';
  const css = `:root{--primary:${safeHex(theme.primary, '#8750F7')};--secondary:${safeHex(theme.secondary, '#2563EB')};--background:${safeHex(theme.lightBackground, '#F8FAFC')};--foreground:${safeHex(theme.lightForeground, '#09090B')};--container:${Math.min(1280, Math.max(960, theme.containerWidth))}px;--radius-card:${Math.min(24, Math.max(6, theme.radius))}px;--shadow-card:${shadow};font-size:${Math.min(18, Math.max(13, theme.baseFontSize))}px}.dark{--background:${safeHex(theme.darkBackground, '#05010A')};--foreground:${safeHex(theme.darkForeground, '#FFFFFF')}}`;
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
