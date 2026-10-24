import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, CheckCircle2, Clock, FileBarChart, Gift, KeyRound, Target, Wrench, Trophy } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import a from "@/assets/pf";
import logo from "@/assets/pf/logo.png.asset.json";
import { CASE_STUDY_RESULT } from "@/config/site";
import { GlowButton, Reveal, SectionHead, openQuote } from "./primitives";
import { fieldCls } from "./Pricing";

const REASONS = [
  { i: BookOpen, t: "We only work with authors", d: "Books are all we do." },
  { i: Clock, t: "Fast start", d: "Live in 5 to 7 days." },
  { i: KeyRound, t: "You own your designs", d: "Every file is yours." },
  { i: FileBarChart, t: "Clear monthly reports", d: "Plain numbers, no jargon." },
];

export function WhyUs() {
  return (
    <section aria-label="Why authors choose us" className="px-5 py-16">
      <Reveal className="mx-auto max-w-6xl">
        <h2 className="mb-8 text-center text-3xl font-semibold sm:text-4xl">Why Authors <span className="text-gold-gradient">Choose Us</span></h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {REASONS.map((r) => (
            <div key={r.t} className="glass rounded-2xl p-5 transition-shadow hover:glow-gold">
              <r.i className="h-7 w-7 text-gold" />
              <p className="mt-3 font-semibold leading-snug">{r.t}</p>
              <p className="mt-1 text-sm text-muted-foreground">{r.d}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

const STORY = [
  { i: Target, h: "Challenge", t: "A time-travel sci-fi romance with a huge hook (a baseball signed in 1908 with ink that shouldn't exist) had to explain itself in seconds on a crowded Amazon page and social feed." },
  { i: Wrench, h: "What we did", t: "We designed a one-glance book spotlight that turns the story's hook into five scannable moments, with the 3D book and e-reader mockups and a clear 'Available on Amazon' call to action." },
  { i: Trophy, h: "Result", t: CASE_STUDY_RESULT },
];

export function CaseStudy() {
  return (
    <section id="proof" className="px-5 py-24">
      <SectionHead eyebrow="Proof story" title={<>How We Make a Book <span className="text-gold-gradient">Impossible to Scroll Past</span></>} sub="One real project, start to finish." />
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <img src={a["sp-memoirs"]} alt="Book spotlight graphic for Memoirs of a Time Traveler" loading="lazy" decoding="async" width={600} height={750}
            className="mx-auto w-full max-w-md rounded-2xl border glow-gold animate-float" />
        </Reveal>
        <div>
          <div className="grid gap-4 md:grid-cols-3">
            {STORY.map((s, i) => (
              <Reveal key={s.h} delay={i * 0.12} className="glass rounded-2xl p-5">
                <s.i className="h-6 w-6 text-cyan" />
                <p className="mt-3 font-mono text-xs uppercase tracking-widest text-gold">{s.h}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.t}</p>
              </Reveal>
            ))}
          </div>
          <GlowButton className="mt-8" onClick={() => openQuote("Graphic & Cover Design")}>Get a Spotlight Like This</GlowButton>
        </div>
      </div>
    </section>
  );
}

export const CHECKLIST = [
  "Set up your Amazon Author Central page",
  "Optimize your book description and 7 keywords",
  "Build your Goodreads author profile",
  "Start an email list with a free reader gift",
  "Plan a 30-day launch calendar",
  "Prepare a team of ARC readers for early reviews",
  "Create 10 scroll-stopping graphics and short videos",
  "Pick 2 social platforms and post consistently",
  "Get a simple author website with a sign-up form",
  "Track clicks, sign-ups and sales every month",
];

export function LeadMagnet() {
  const [s, setS] = useState<"idle" | "sending" | "done" | "error">("idle");
  async function sub(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (fd.get("website")) return setS("done");
    const r = z.string().trim().email().max(255).safeParse(fd.get("email"));
    if (!r.success) return setS("error");
    setS("sending");
    const { error } = await supabase.from("newsletter_subscribers").insert({ email: r.data });
    setS(!error || error.code === "23505" ? "done" : "error");
  }
  return (
    <section id="checklist" className="px-5 py-24">
      <Reveal className="glass relative mx-auto max-w-4xl overflow-hidden rounded-3xl p-6 sm:p-10">
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-gold/10 blur-3xl" />
        <AnimatePresence mode="wait">
          {s !== "done" ? (
            <motion.div key="f" exit={{ opacity: 0 }} className="relative grid gap-8 md:grid-cols-2">
              <div>
                <Gift className="h-9 w-9 text-gold" />
                <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Free Author Marketing <span className="text-gold-gradient">Checklist</span></h2>
                <p className="mt-2 text-muted-foreground">The 10 steps every author should take. Free.</p>
              </div>
              <div>
                <ul className="space-y-2 text-sm">
                  {["Know exactly what to do first", "Avoid the most common launch mistakes", "Takes 5 minutes to read"].map((b) => (
                    <li key={b} className="flex gap-2"><CheckCircle2 className="h-5 w-5 shrink-0 text-cyan" />{b}</li>
                  ))}
                </ul>
                <form onSubmit={sub} noValidate className="mt-5 grid gap-2">
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
                  <input name="email" type="email" required placeholder="Your email" aria-label="Email for checklist" className={fieldCls} />
                  {s === "error" && <p className="text-xs text-destructive">Please enter a valid email and try again.</p>}
                  <GlowButton type="submit" disabled={s === "sending"}>{s === "sending" ? "Sending…" : "Send Me the Checklist"}</GlowButton>
                </form>
              </div>
            </motion.div>
          ) : (
            <motion.div key="t" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative">
              <CheckCircle2 className="h-12 w-12 text-gold" />
              <h2 className="mt-3 text-3xl font-semibold">Thank you! Here is your checklist.</h2>
              <p className="mt-1 text-sm text-muted-foreground">Save this page or take a screenshot.</p>
              <ol className="mt-6 grid gap-2 sm:grid-cols-2">
                {CHECKLIST.map((c, i) => (
                  <motion.li key={c} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex gap-3 rounded-xl border bg-background/50 p-3 text-sm">
                    <span className="font-mono text-gold">{String(i + 1).padStart(2, "0")}</span>{c}
                  </motion.li>
                ))}
              </ol>
            </motion.div>
          )}
        </AnimatePresence>
      </Reveal>
    </section>
  );
}

export function LogoLoader() {
  const [show, setShow] = useState(true);
  useEffect(() => { const t = setTimeout(() => setShow(false), 700); return () => clearTimeout(t); }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.div className="pointer-events-none fixed inset-0 z-[100] grid place-items-center bg-background" exit={{ opacity: 0 }} transition={{ duration: 0.4 }} aria-hidden>
          <motion.img src={logo.url} alt="" width={96} height={96} className="h-24 w-24" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
