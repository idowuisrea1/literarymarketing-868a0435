import { lazy, Suspense, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Heart, Mail, Sparkles } from "lucide-react";
import a from "@/assets/pf";
import { GlowLink } from "./primitives";
import { CONTACT } from "@/data/site";

const Book3D = lazy(() => import("./Book3D"));

const LINE1 = "We Turn Stories into Social Movements.".split(" ");
const LINE2 = "We Turn Readers into Superfans.".split(" ");

function CssBook() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-sm animate-float">
      <div className="absolute inset-[15%] rounded-full bg-gold/20 blur-3xl" />
      <img src={a["cv-legends"]} alt="" className="absolute left-[18%] top-[14%] w-[42%] -rotate-12 rounded-md shadow-2xl" />
      <img src={a["cv-stardust"]} alt="" className="absolute right-[16%] top-[20%] w-[42%] rotate-6 rounded-md shadow-2xl glow-gold" />
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

export function Hero() {
  const reduce = useReducedMotion();
  const [show3D, setShow3D] = useState(false);
  useEffect(() => {
    const ok = window.matchMedia("(min-width: 1024px)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!ok) return;
    const id = setTimeout(() => setShow3D(true), 400);
    return () => clearTimeout(id);
  }, []);

  const word = (w: string, i: number, gold = false) => (
    <motion.span key={w + i} className={`inline-block pr-[0.25em] ${gold ? "text-gold-gradient" : ""}`}
      initial={reduce ? false : { opacity: 0, y: 30, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ delay: 0.15 + i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
      {w}
    </motion.span>
  );

  return (
    <section id="top" className="relative overflow-hidden bg-aurora pt-32 pb-16 sm:pt-40">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-[1.1fr_1fr]">
        <div className="min-w-0 text-center lg:text-left">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.25em] text-gold">
            <Sparkles className="h-3.5 w-3.5" /> Book marketing studio
          </p>
          <h1 className="text-[2.6rem] font-semibold leading-[1.02] sm:text-6xl xl:text-7xl">
            {LINE1.map((w, i) => word(w, i))}
            <br className="hidden sm:block" />
            {LINE2.map((w, i) => word(w, i + LINE1.length, i >= 3))}
          </h1>
          <motion.p initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
            className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground lg:mx-0">
            Social media management, automated email marketing and stunning websites, built exclusively for authors, novelists and publishers.
          </motion.p>
          <motion.div initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.35 }}
            className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <GlowLink href="#pricing">Launch Your Campaign</GlowLink>
            <GlowLink href={CONTACT.calendly} target="_blank" rel="noopener" variant="ghost">Book a Free Strategy Call</GlowLink>
          </motion.div>
        </div>

        <div className="relative mx-auto h-[380px] w-full max-w-xl sm:h-[460px]">
          <div className="absolute inset-0">
            {show3D ? <Suspense fallback={<CssBook />}><Book3D /></Suspense> : <CssBook />}
          </div>
          {/* Instagram grid mockup */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1 }}
            className="glass absolute left-0 top-6 w-36 rounded-2xl p-2 animate-float sm:w-44">
            <div className="mb-1.5 flex items-center gap-1.5 px-1 text-[10px] text-muted-foreground"><Heart className="h-3 w-3 text-gold" /> @yourbook</div>
            <div className="grid grid-cols-3 gap-1">
              {["sp-cloak", "cv-snow", "sp-treaty", "cv-curse", "sp-memoirs", "cv-mystical"].map((k) => (
                <img key={k} src={a[k]} alt="" loading="lazy" className="aspect-square w-full rounded-sm object-cover" />
              ))}
            </div>
          </motion.div>
          {/* Email mockup */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.15 }}
            className="glass glow-cyan absolute bottom-4 right-0 w-48 rounded-2xl p-4 [animation-delay:1.5s] animate-float sm:w-56">
            <div className="flex items-center gap-2 text-xs text-muted-foreground"><Mail className="h-4 w-4 text-cyan" /> Launch newsletter</div>
            <div className="mt-2 h-1.5 w-3/4 rounded bg-foreground/20" />
            <div className="mt-1.5 h-1.5 w-1/2 rounded bg-foreground/10" />
            <div className="mt-3 flex items-end justify-between">
              <Counter98 />
              <span className="font-mono text-[10px] uppercase text-muted-foreground">open rate · demo</span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="relative mt-16 overflow-hidden border-y py-4">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap font-mono text-sm uppercase tracking-[0.3em] text-muted-foreground">
          {Array.from({ length: 4 }).flatMap((_, k) =>
            ["Book Trailers", "BookTok", "Email Funnels", "Websites", "Cover Design"].map((t) => (
              <span key={t + k} className="flex items-center gap-10">{t}<span className="text-gold">✦</span></span>
            )),
          )}
        </div>
      </div>
    </section>
  );
}
