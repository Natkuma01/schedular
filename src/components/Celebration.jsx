import { useEffect, useRef, useState } from 'react';
import { COLORS } from '../lib/config.js';
import { Crown } from './Icons.jsx';

function Confetti() {
  const ref = useRef(null);
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const cv = ref.current;
    const ctx = cv.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const resize = () => { cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    resize();
    addEventListener('resize', resize);

    const colors = [...COLORS.slice(0, 6).map(c => c.color), '#FFC800', '#FFC800'];
    const parts = Array.from({ length: 220 }, () => ({
      x: innerWidth / 2 + (Math.random() - 0.5) * 120, y: innerHeight * 0.45,
      vx: (Math.random() - 0.5) * 18, vy: -Math.random() * 18 - 6,
      w: 6 + Math.random() * 8, h: 8 + Math.random() * 10, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4,
      c: colors[(Math.random() * colors.length) | 0], round: Math.random() < 0.3,
    }));

    const DURATION = 4200;
    const t0 = performance.now();
    let raf;
    const tick = now => {
      const t = now - t0;
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      parts.forEach(p => {
        p.vy += 0.45; p.vx *= 0.985; p.x += p.vx; p.y += p.vy; p.r += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y); ctx.rotate(p.r);
        ctx.fillStyle = p.c; ctx.globalAlpha = Math.max(0, 1 - t / DURATION);
        if (p.round) { ctx.beginPath(); ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2); ctx.fill(); }
        else ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.r * 2)) + 2);
        ctx.restore();
      });
      if (t < DURATION) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={ref} className="confetti" aria-hidden="true" />;
}

const CHEERS = ['You ruled this week!', 'Royal week unlocked!', 'Five crowns, all yours!'];

export default function Celebration({ count, name, onClose }) {
  const [msg] = useState(() => CHEERS[(Math.random() * CHEERS.length) | 0]);
  useEffect(() => {
    const k = e => e.key === 'Escape' && onClose();
    addEventListener('keydown', k);
    return () => removeEventListener('keydown', k);
  }, [onClose]);

  return (
    <>
      <div className="scrim" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
        <div className="modal party" role="dialog" aria-modal="true" aria-labelledby="ct">
          <Crown className="big" />
          <h3 id="ct">{msg}</h3>
          <p className="sub" style={{ margin: 0 }}>{count} successful days this week. Keep the streak going, {name}.</p>
          <div className="slots">
            {Array.from({ length: count }, (_, i) => <span key={i} style={{ animationDelay: `${i * 90}ms` }}><Crown /></span>)}
          </div>
          <button type="button" className="btn gold" onClick={onClose} autoFocus>Keep going</button>
        </div>
      </div>
      <Confetti />
    </>
  );
}
