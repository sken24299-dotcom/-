import { ImageResponse } from 'next/og';

export const alt = 'Yu Wang — AI Designer & Creative Developer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ position: 'relative', display: 'flex', width: '100%', height: '100%', padding: 64, color: 'white', background: '#05010a', fontFamily: 'sans-serif', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', width: 650, height: 480, right: -120, top: 40, borderRadius: 999, background: 'rgba(135,80,247,.32)', filter: 'blur(90px)' }} />
      <div style={{ position: 'absolute', width: 420, height: 360, left: 180, bottom: -180, borderRadius: 999, background: 'rgba(37,99,235,.18)', filter: 'blur(80px)' }} />
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 20, fontWeight: 700, letterSpacing: '0.16em' }}><div style={{ width: 20, height: 20, borderRadius: 6, transform: 'rotate(14deg)', background: 'linear-gradient(135deg,#fff,#8750f7 55%,#2563eb)' }} />YU WANG</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}><div style={{ display: 'flex', fontSize: 78, lineHeight: 1.02, fontWeight: 750, letterSpacing: '-0.055em' }}>AI DESIGNER +<br />CREATIVE DEVELOPER</div><div style={{ display: 'flex', marginTop: 26, fontSize: 28, color: '#b8b4c2' }}>AI 产品设计 · 前端开发 · 电商视觉 · 数字品牌</div></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, color: '#8f8a9b', letterSpacing: '0.14em' }}><span>PORTFOLIO 2026</span><span>SHANGHAI · WORLDWIDE</span></div>
      </div>
    </div>,
    size,
  );
}
