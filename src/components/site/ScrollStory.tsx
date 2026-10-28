import { useEffect, useRef, useState } from "react";
import { useReducedMotion, useScroll, useMotionValueEvent } from "framer-motion";
import a from "@/assets/pf";

/**
 * Category 4 — Scroll-scrubbed image-sequence storytelling.
 * No owned video exists, so instead of faking scroll-video this draws existing
 * portfolio images to a canvas and crossfades between chapters as scroll
 * progress advances through a tall sticky track. Copy reuses the existing
 * case-study text — no new claims. Reduced-motion and small/coarse-pointer
 * screens get the same chapters as simple stacked blocks.
 */

const CHAPTERS: { img: string; h: string; t: string }[] = [
  {
    img: a["sp-memoirs"]!,
    h: "The hook",
    t: "A baseball signed in 1908 with ink that shouldn't exist — the story had to explain itself in seconds.",
  },
  {
    img: a["sp-cloak"]!,
    h: "The design",
    t: "One-glance spotlight graphics turn the hook into five scannable moments.",
  },
  {
    img: a["sp-treaty"]!,
    h: "The launch",
    t: "3D book and e-reader mockups with a clear 'Available on Amazon' call to action.",
  },
];

function StaticChapters() {
  return (
    <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
      {CHAPTERS.map((c) => (
        <figure key={c.h} className="glass overflow-hidden rounded-2xl">
          <img src={c.img} alt="" loading="lazy" decoding="async" className="aspect-[4/5] w-full object-cover" />
          <figcaption className="p-4">
            <p className="font-mono text-xs uppercase tracking-widest text-gold">{c.h}</p>
            <p className="mt-1 text-sm text-muted-foreground">{c.t}</p>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

export function ScrollStory() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [chapter, setChapter] = useState(0);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });

  useEffect(() => {
    const ok =
      !reduce &&
      window.matchMedia("(min-width: 768px)").matches &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    setEnabled(ok);
  }, [reduce]);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let alive = true;
    const imgs: HTMLImageElement[] = [];
    let loaded = 0;
    CHAPTERS.forEach((c, i) => {
      const img = new Image();
      img.src = c.img;
      img.onload = () => {
        loaded++;
        if (alive && loaded === CHAPTERS.length) draw(latest.current);
      };
      imgs[i] = img;
    });

    const W = 1280;
    const H = 800;
    const DPR = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    ctx.scale(DPR, DPR);

    const cover = (img: HTMLImageElement, alpha: number, scale: number) => {
      const ir = img.width / img.height;
      const cr = W / H;
      let dw = W, dh = H;
      if (ir > cr) dw = H * ir;
      else dh = W / ir;
      dw *= scale;
      dh *= scale;
      ctx.globalAlpha = alpha;
      ctx.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh);
      ctx.globalAlpha = 1;
    };

    const draw = (p: number) => {
      const n = CHAPTERS.length;
      const pos = p * (n - 1);
      const i = Math.min(n - 1, Math.floor(pos));
      const f = pos - i;
      ctx.clearRect(0, 0, W, H);
      const a1 = imgs[i];
      const a2 = imgs[Math.min(n - 1, i + 1)];
      if (a1) cover(a1, 1, 1.08 - 0.08 * f);
      if (a2 && f > 0) cover(a2, f, 1.0 + 0.08 * f);
      // cinematic vignette
      const g = ctx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H);
      g.addColorStop(0, "rgba(8,8,12,0)");
      g.addColorStop(1, "rgba(8,8,12,0.55)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    };

    const latest = { current: 0 };
    const unsub = scrollYProgress.on("change", (p) => {
      latest.current = p;
      if (loaded === CHAPTERS.length) draw(p);
      setChapter(Math.min(CHAPTERS.length - 1, Math.round(p * (CHAPTERS.length - 1))));
    });

    return () => {
      alive = false;
      unsub();
    };
  }, [enabled, scrollYProgress]);

  if (!enabled) return <StaticChapters />;

  return (
    <div ref={trackRef} className="relative" style={{ height: `${CHAPTERS.length * 110}vh` }}>
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center px-5">
        <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl border glow-gold">
          <canvas ref={canvasRef} className="block aspect-[8/5] w-full" aria-hidden="true" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 to-transparent p-6">
            <p className="font-mono text-xs uppercase tracking-widest text-gold" aria-live="polite">
              {CHAPTERS[chapter]!.h}
            </p>
            <p className="mt-1 max-w-xl text-sm text-foreground/90 sm:text-base">{CHAPTERS[chapter]!.t}</p>
          </div>
        </div>
        <div className="mt-4 flex gap-2" aria-hidden="true">
          {CHAPTERS.map((c, i) => (
            <span key={c.h} className={`h-1.5 rounded-full transition-all ${i === chapter ? "w-8 bg-gold" : "w-3 bg-foreground/25"}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
