import { motion, useInView, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { BookOpen, Compass, Infinity as Loop, Quote } from "lucide-react";
import { GlowLink, Reveal, SectionHead, Tilt } from "./primitives";
import { MorphRing } from "./MorphDivider";
import { BOOKING_URL, CONTACT } from "@/data/site";

const STEPS = [
  { icon: BookOpen, t: "The Manuscript Sync", d: "Connect your channels and tell us about your genre and book." },
  { icon: Compass, t: "The Blueprint Reveal", d: "We design your 30-day social and email plan for your readers." },
  { icon: Loop, t: "The Viral Loop", d: "We schedule, post, send and scale, while you write." },
];

export function Process() {
  return (
    <section id="process" className="px-5 py-24">
      <SectionHead kinetic eyebrow="How it works" title={<>Three steps. <span className="text-gold-gradient">Zero stress.</span></>} sub="From first chat to a growing readership in about a week." />
      <div className="relative mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
        <div className="absolute left-[16%] right-[16%] top-12 hidden h-px md:block">
          <motion.div className="h-full origin-left bg-gold-gradient" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.4, ease: "easeInOut" }} />
        </div>
        <div className="absolute bottom-10 left-12 top-10 w-px md:hidden">
          <motion.div className="h-full origin-top bg-gold-gradient" initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ duration: 1.4 }} />
        </div>
        {STEPS.map((s, i) => (
          <Reveal key={s.t} delay={i * 0.15}>
            <div className="group relative flex gap-5 md:flex-col md:items-center md:text-center">
              <span className="relative z-10 grid h-24 w-24 shrink-0 place-items-center rounded-full glass transition-all duration-300 group-hover:glow-gold group-hover:scale-105">
                <MorphRing delay={i * 0.2} className="absolute -inset-2 h-[7rem] w-[7rem] opacity-70" />
                <s.icon className="h-9 w-9 text-gold transition-colors group-hover:text-cyan" />
                <span className="absolute -right-1 -top-1 grid h-7 w-7 place-items-center rounded-full bg-gold-gradient font-mono text-xs text-primary-foreground">{i + 1}</span>
              </span>
              <div className="pt-4 md:pt-2">
                <h3 className="text-2xl font-semibold">{s.t}</h3>
                <p className="mt-2 text-muted-foreground">{s.d}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      <div className="mt-12 text-center"><GlowLink href={BOOKING_URL} target="_blank" rel="noopener">Start with a Free Call</GlowLink></div>
    </section>
  );
}

function Count({ to, suffix = "", decimals = 0 }: { to: number; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 2, ease: "easeOut", onUpdate: setV });
    return () => c.stop();
  }, [inView, to]);
  return <span ref={ref}>{v.toLocaleString(undefined, { maximumFractionDigits: decimals, minimumFractionDigits: decimals })}{suffix}</span>;
}

function Spark({ seed }: { seed: number }) {
  const pts = Array.from({ length: 12 }, (_, i) => 30 - (Math.sin(i * 0.9 + seed) * 6 + i * 2));
  const d = pts.map((y, i) => `${i === 0 ? "M" : "L"}${i * 10},${y}`).join(" ");
  return (
    <svg viewBox="0 0 110 36" className="mt-3 h-10 w-full" aria-hidden>
      <motion.path d={d} fill="none" stroke="var(--cyan)" strokeWidth="2" strokeLinecap="round" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.6 }} />
    </svg>
  );
}

const METRICS = [
  { l: "Followers gained", to: 12480, s: "+" },
  { l: "Emails delivered", to: 86200, s: "" },
  { l: "Open rate", to: 48.6, s: "%", d: 1 },
  { l: "Pre-orders", to: 1340, s: "" },
];

const TESTIMONIALS = [
  { q: "Placeholder testimonial — your client's words about their launch go here.", n: "Author Name", r: "Fantasy Novelist" },
  { q: "Placeholder testimonial — a short quote about growth and results.", n: "Author Name", r: "Romance Author" },
  { q: "Placeholder testimonial — what it felt like to work with literarymarketing.", n: "Publisher Name", r: "Indie Press" },
];

export function Results() {
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI((x) => (x + 1) % TESTIMONIALS.length), 5000); return () => clearInterval(t); }, []);
  const t = TESTIMONIALS[i]!;
  return (
    <section id="results" className="px-5 py-24">
      <SectionHead eyebrow="Results" title={<>What growth <span className="text-gold-gradient">looks like</span></>} sub="A sample campaign dashboard, so you can see what we track for you." />
      <div className="mx-auto max-w-6xl">
        <p className="mb-4 text-center font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">⚠ Sample campaign dashboard · illustrative numbers, not client results</p>
        <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-4">
          {METRICS.map((m, k) => (
            <Reveal key={m.l} delay={k * 0.08}>
              <Tilt max={6}>
                <div className="glass rounded-2xl p-5">
                  <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">{m.l}</p>
                  <p className="mt-2 font-mono text-3xl font-bold text-foreground"><Count to={m.to} suffix={m.s} decimals={m.d ?? 0} /></p>
                  <Spark seed={k * 2} />
                </div>
              </Tilt>
            </Reveal>
          ))}
        </div>
        <Reveal className="glass mx-auto mt-10 max-w-3xl rounded-3xl p-8 text-center">
          <Quote className="mx-auto h-8 w-8 text-gold" />
          <motion.blockquote key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 font-serif text-2xl leading-snug sm:text-3xl">"{t.q}"</motion.blockquote>
          <p className="mt-4 text-sm text-muted-foreground">{t.n} · {t.r} <span className="ml-2 font-mono text-[10px] uppercase text-cyan">placeholder</span></p>
          <div className="mt-5 flex justify-center gap-2">
            {TESTIMONIALS.map((_, k) => (
              <button key={k} onClick={() => setI(k)} aria-label={`Testimonial ${k + 1}`} className="grid h-11 w-11 place-items-center">
                <span className={`h-2 rounded-full transition-all ${k === i ? "w-6 bg-gold" : "w-2 bg-foreground/30"}`} />
              </button>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
