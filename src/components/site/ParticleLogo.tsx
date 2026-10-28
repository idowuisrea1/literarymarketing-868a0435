import { useEffect, useRef, useState } from "react";

/**
 * Category 8 — Particle transformations.
 * Samples the logo's opaque pixels and rebuilds it from drifting particles.
 * Particles scatter away from the pointer and spring back into place.
 * Falls back to a static <img> for reduced motion, coarse pointers or
 * any canvas/image failure, so the logo is never hidden.
 */
type P = { x: number; y: number; tx: number; ty: number; vx: number; vy: number; r: number; c: string };

export function ParticleLogo({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setFailed(true);
    const ctx = canvas.getContext("2d");
    if (!ctx) return setFailed(true);

    let raf = 0;
    let particles: P[] = [];
    let alive = true;
    const pointer = { x: -9999, y: -9999 };
    const SIZE = 220;
    const DPR = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = SIZE * DPR;
    canvas.height = SIZE * DPR;
    ctx.scale(DPR, DPR);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => {
      if (!alive) return;
      const off = document.createElement("canvas");
      const SAMPLE = 72; // sample grid resolution
      off.width = SAMPLE;
      off.height = SAMPLE;
      const octx = off.getContext("2d");
      if (!octx) return setFailed(true);
      octx.drawImage(img, 0, 0, SAMPLE, SAMPLE);
      let data: Uint8ClampedArray;
      try {
        data = octx.getImageData(0, 0, SAMPLE, SAMPLE).data;
      } catch {
        return setFailed(true);
      }
      const scale = SIZE / SAMPLE;
      for (let gy = 0; gy < SAMPLE; gy++) {
        for (let gx = 0; gx < SAMPLE; gx++) {
          const idx = (gy * SAMPLE + gx) * 4;
          const alpha = data[idx + 3]!;
          if (alpha < 90) continue;
          const r = data[idx]!, g = data[idx + 1]!, b = data[idx + 2]!;
          const lum = (r + g + b) / 3;
          particles.push({
            x: Math.random() * SIZE,
            y: Math.random() * SIZE,
            tx: gx * scale + scale / 2,
            ty: gy * scale + scale / 2,
            vx: 0,
            vy: 0,
            r: 0.9 + Math.random() * 0.9,
            c: lum > 150 ? "#e9d5ff" : lum > 90 ? "#c4b5fd" : "#67e8f9",
          });
        }
      }
      if (particles.length > 4200) {
        const keep = 4200 / particles.length;
        particles = particles.filter(() => Math.random() < keep);
      }
      tick();
    };
    img.onerror = () => alive && setFailed(true);

    const REPEL = 46;
    const tick = () => {
      if (!alive) return;
      ctx.clearRect(0, 0, SIZE, SIZE);
      for (const p of particles) {
        // spring toward target
        p.vx += (p.tx - p.x) * 0.012;
        p.vy += (p.ty - p.y) * 0.012;
        // pointer repulsion
        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < REPEL * REPEL && d2 > 0.01) {
          const d = Math.sqrt(d2);
          const f = ((REPEL - d) / REPEL) * 2.2;
          p.vx += (dx / d) * f;
          p.vy += (dy / d) * f;
        }
        p.vx *= 0.86;
        p.vy *= 0.86;
        p.x += p.vx;
        p.y += p.vy;
        ctx.fillStyle = p.c;
        ctx.fillRect(p.x, p.y, p.r, p.r);
      }
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * SIZE;
      pointer.y = ((e.clientY - rect.top) / rect.height) * SIZE;
    };
    const onLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };
    // Listen on window so the loader overlay (pointer-events-none) still reacts.
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      particles = [];
    };
  }, [src]);

  if (failed) {
    return <img src={src} alt={alt} width={96} height={96} className={className} />;
  }
  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={alt}
      className={className}
      style={{ width: 220, height: 220, maxWidth: "60vw" }}
    />
  );
}
