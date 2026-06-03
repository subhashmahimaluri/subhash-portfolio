import { ImageResponse } from 'next/og';

export const alt = 'Subhash Mahimaluri — Solution Architect, Cloud & AI Systems';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: 'linear-gradient(135deg, #0a0f1e 0%, #102648 55%, #1a3a6e 100%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 30, color: '#9cc4ec', fontWeight: 700 }}>
          subhashai<span style={{ color: '#ff6b35' }}>.cloud</span>
        </div>
        <div style={{ fontSize: 76, fontWeight: 800, marginTop: 24, letterSpacing: '-2px' }}>
          Subhash Mahimaluri
        </div>
        <div style={{ fontSize: 38, fontWeight: 700, color: '#4fc4e4', marginTop: 12 }}>
          Solution Architect · Cloud Architect · AI Systems
        </div>
        <div style={{ fontSize: 26, color: '#9aa7bd', marginTop: 28, maxWidth: 900 }}>
          15+ years building scalable platforms for Fortune 500 enterprises — React, Next.js,
          AI/LLM, agentic architecture, and cloud.
        </div>
      </div>
    ),
    { ...size },
  );
}
