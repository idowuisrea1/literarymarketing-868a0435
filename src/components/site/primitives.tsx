import { motion, useReducedMotion } from "framer-motion";
import { useRef, type ReactNode, type MouseEvent, type ButtonHTMLAttributes, type AnchorHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHead({ eyebrow, title, sub }: { eyebrow: string; title: ReactNode; sub: string }) {
  return (
    <Reveal className="mx-auto mb-12 max-w-2xl text-center">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan">{eyebrow}</p>
      <h2 className="mt-3 text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl">{title}</h2>
      <p className="mt-4 text-base text-muted-foreground sm:text-lg">{sub}</p>
      <motion.div className="hairline mx-auto mt-6 w-40 origin-center" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }} />
    </Reveal>
  );
}

const track = (e: MouseEvent<HTMLElement>) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
};

const base =
  "btn-glow inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-transform duration-200 hover:scale-[1.03] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
const variants = {
  gold: "bg-gold-gradient text-primary-foreground glow-gold",
  ghost: "glass text-foreground",
};
type V = keyof typeof variants;

function magneticMove(e: MouseEvent<HTMLElement>, reduced: boolean) {
  track(e);
  if (reduced || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  const rect = e.currentTarget.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width - 0.5;
  const y = (e.clientY - rect.top) / rect.height - 0.5;
  e.currentTarget.style.transform = `translate3d(${x * 7}px, ${y * 5}px, 0)`;
}

export function GlowButton({ variant = "gold", className, onMouseMove, onMouseLeave, ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: V }) {
  const reduced = useReducedMotion();
  return <button
    {...p}
    onMouseMove={(e) => { magneticMove(e, !!reduced); onMouseMove?.(e); }}
    onMouseLeave={(e) => { e.currentTarget.style.transform = ""; onMouseLeave?.(e); }}
    className={cn(base, variants[variant], className)}
  />;
}
export function GlowLink({ variant = "gold", className, onMouseMove, onMouseLeave, ...p }: AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: V }) {
  const reduced = useReducedMotion();
  return <a
    {...p}
    onMouseMove={(e) => { magneticMove(e, !!reduced); onMouseMove?.(e); }}
    onMouseLeave={(e) => { e.currentTarget.style.transform = ""; onMouseLeave?.(e); }}
    className={cn(base, variants[variant], className)}
  />;
}

export function Tilt({ children, className, max = 10 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const move = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current; if (!el || reduced || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${-y * max}deg) rotateY(${x * max}deg) translateZ(0)`;
  };
  const leave = () => { if (ref.current) ref.current.style.transform = ""; };
  return (
    <div ref={ref} onMouseMove={move} onMouseLeave={leave} className={cn("transition-transform duration-300 ease-out will-change-transform", className)}>
      {children}
    </div>
  );
}

export function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

/** Scroll to the contact form and pre-select a service. */
export function openQuote(service: string) {
  window.dispatchEvent(new CustomEvent("lm:service", { detail: service }));
  scrollToId("contact");
}
