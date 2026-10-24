import { lazy, Suspense, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Heart, Mail, Orbit, Sparkles, WandSparkles } from "lucide-react";
import a from "@/assets/pf";
import { GlowLink } from "./primitives";
import { BOOKING_URL } from "@/data/site";

const Book3D = lazy(() => import("./Book3D"));

const LINE1 = "We Turn Stories into".split(" ");
const LINE2 = "Cultural Gravity.".split(" ");

function CssBook() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-sm animate-float">
      <div className="absolute inset-[8%] rounded-full bg-violet-500/20 blur-3xl" />
      <div className="absolute inset-[15%] rounded-full border border-violet-300/20" />
      <img src={a["cv-legends"]} alt="" className="absolute left-[18%] top-[14%] w-[42%] -rotate-12 rounded-md shadow-2xl ring-1 ring-white/20" />
      <img src={a["cv-stardust"]} alt="" className="absolute right-[16%] top-[20%] w-[42%] rotate-6 rounded-md shadow-2xl ring-1 ring-cyan-200/30" />
    </div>
  );
}

function Counter98() {
  const [n, setN] = useState(72);
  useEffect(() => {
    const t = setInterval(() => setN((v) => (v >= 98 ? 98 : v + 1)), 60);
    return () => clearInterval(t);
  }, []);
  return <span className="font-mono text-2xl font-bold text-cyan">{n}%</span>;
}

const particles = [
  ["8%", "18%", "3px"], ["86%", "12%", "4px"], ["73%", "78%", "2px"],
  ["16%", "72%", "3px"], ["92%", "49%", "2px"], ["43%", "7%", "2px"],
  ["55%", "88%", "4px"], ["4%", "48%", "2px"], ["65%", "24%", "2px"],
];

export function Hero() {
  const reduce = useReducedMotion();
  const [show3D, setShow3D] = useState(false);
  useEffect(() => {
    const ok = window.matchMedia("(min-width: 1024px)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!ok) return;
    const id = setTimeout(() => setShow3D(true), 400);
    return () => clearTimeout(id);
  }, []);

  const word = (w: string, i: number, accent = false) => (
    <motion.span key={w + i} className={`inline-block pr-[0.22em] ${accent ? "text-iridescent" : ""}`}
      initial={reduce ? false : { opacity: 0, y: 28, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ delay: 0.18 + i * 0.075, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}>
      {w}
    </motion.span>
  );

  return (
    <section id="top" className="hero-2050 relative overflow-hidden pt-32 pb-12 sm:pt-40 lg:pb-16">
      <div aria-hidden="true" className="hero-grid absolute inset-0" />
      <div aria-hidden="true" className="hero-orb hero-orb-violet" />
      <div aria-hidden="true" className="hero-orb hero-orb-cyan" />
      {particles.map(([left, top, size], i) => (
        <span key={i} aria-hidden="true" className="hero-particle" style={{ left, top, width: size, height: size, animationDelay: `${i * -0.7}s` }} />
      ))}
      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 px-5 lg:grid-cols-[1.03fr_0.97fr] lg:gap-4">
        <div className="min-w-0 text-center lg:text-left">
          <motion.p initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
            className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-violet-300/25 bg-white/[0.045] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-violet-100 shadow-[0_0_35px_-18px_rgba(167,139,250,.9)] backdrop-blur-xl lg:mx-0">
            <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-300 opacity-60" /><span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-300" /></span>
            <Sparkles className="h-3.5 w-3.5 text-violet-200" /> Independent authors. Future-level impact.
          </motion.p>
          <h1 className="hero-title text-[2.75rem] font-semibold leading-[0.98] tracking-[-0.055em] sm:text-6xl xl:text-[5.5rem]">
            {LINE1.map((w, i) => word(w, i))}
            <br className="hidden sm:block" />
            {LINE2.map((w, i) => word(w, i + LINE1.length, true))}
          </h1>
          <motion.p initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.7 }}
            className="mx-auto mt-7 max-w-xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8 lg:mx-0">
            We engineer the worlds around your words — story-first marketing, immersive author websites and reader communities that keep growing long after the final page.
          </motion.p>
          <motion.div initial={reduce ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.95, duration: 0.7 }}
            className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <GlowLink href="#pricing">Build Your Book Universe <ArrowUpRight className="ml-2 inline h-4 w-4" /></GlowLink>
            <GlowLink href={BOOKING_URL} target="_blank" rel="noopener" variant="ghost">Enter the Strategy Room <ArrowUpRight className="ml-2 inline h-4 w-4" /></GlowLink>
          </motion.div>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] uppercase tracking-[0.16em] text-slate-400 lg:justify-start">
            <span className="inline-flex items-center gap-2"><Orbit className="h-3.5 w-3.5 text-violet-300" /> Story-led strategy</span>
            <span className="hidden h-1 w-1 rounded-full bg-cyan-300/70 sm:block" />
            <span className="inline-flex items-center gap-2"><WandSparkles className="h-3.5 w-3.5 text-cyan-200" /> Built for authors</span>
          </div>
        </div>

        <div className="hero-stage relative mx-auto h-[360px] w-full max-w-xl sm:h-[480px] lg:h-[570px]">
          <div className="hero-portal absolute left-1/2 top-1/2 h-[76%] w-[76%] -translate-x-1/2 -translate-y-1/2 rounded-full" />
          <div className="hero-orbit hero-orbit-one absolute left-1/2 top-1/2 h-[85%] w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-full" />
          <div className="hero-orbit hero-orbit-two absolute left-1/2 top-1/2 h-[66%] w-[96%] -translate-x-1/2 -translate-y-1/2 rounded-full" />
          <div className="absolute inset-[4%]">
            {show3D ? <Suspense fallback={<CssBook />}><Book3D /></Suspense> : <CssBook />}
          </div>
          <motion.div initial={reduce ? false : { opacity: 0, x: -24, y: 10 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ delay: 0.9, duration: 0.7 }}
            className="glass hero-float-card absolute left-0 top-[8%] w-36 rounded-2xl p-2.5 sm:left-1 sm:w-44 sm:p-3">
            <div className="mb-2 flex items-center gap-1.5 px-1 text-[10px] uppercase tracking-wider text-slate-300"><Heart className="h-3 w-3 text-fuchsia-300" /> Reader universe</div>
            <div className="grid grid-cols-3 gap-1">
              {["sp-cloak", "cv-snow", "sp-treaty", "cv-curse", "sp-memoirs", "cv-mystical"].map((k) => (
                <img key={k} src={a[k]} alt="" loading="lazy" className="aspect-square w-full rounded-sm object-cover" />
              ))}
            </div>
            <div className="mt-2 flex items-center justify-between font-mono text-[9px] text-slate-400"><span>COMMUNITY SIGNAL</span><span className="text-cyan-200">LIVE ↗</span></div>
          </motion.div>
          <motion.div initial={reduce ? false : { opacity: 0, x: 24, y: 10 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ delay: 1.05, duration: 0.7 }}
            className="glass hero-float-card absolute bottom-[7%] right-0 w-48 rounded-2xl p-3.5 sm:right-1 sm:w-56 sm:p-4">
            <div className="flex items-center gap-2 text-xs text-slate-300"><Mail className="h-4 w-4 text-cyan-200" /> The reader signal</div>
            <div className="mt-3 h-1.5 w-3/4 rounded bg-white/15" /><div className="mt-1.5 h-1.5 w-1/2 rounded bg-white/10" />
            <div className="mt-3 flex items-end justify-between"><Counter98 /><span className="font-mono text-[9px] uppercase tracking-wider text-slate-400">demo interface</span></div>
          </motion.div>
          <div className="absolute bottom-[1%] left-[8%] hidden items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-slate-500 sm:flex"><span className="h-px w-7 bg-violet-300/60" /> Narrative systems / 2050</div>
          <div className="absolute right-[5%] top-[2%] hidden rounded-full border border-white/10 bg-black/30 p-2 text-violet-200 backdrop-blur sm:block"><ArrowDownRight className="h-4 w-4" /></div>
        </div>
      </div>

      <div className="relative z-10 mx-auto mt-10 max-w-7xl px-5 sm:mt-14">
        <div className="flex items-center gap-4 border-y border-white/10 py-4">
          <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.24em] text-slate-500">The signal travels</span>
          <div className="h-px flex-1 bg-gradient-to-r from-violet-300/30 via-cyan-200/20 to-transparent" />
          <div className="overflow-hidden">
            <div className="flex w-max animate-marquee gap-7 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.2em] text-slate-300 sm:gap-10 sm:text-xs">
              {Array.from({ length: 4 }).flatMap((_, k) =>
                ["Book trailers", "Reader ecosystems", "Email intelligence", "Author websites", "BookTok worlds"].map((t) => (
                  <span key={t + k} className="flex items-center gap-7 sm:gap-10">{t}<span className="text-violet-300">✦</span></span>
                )),
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
