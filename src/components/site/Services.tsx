import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, Check, Globe, Mail, Megaphone, Timer, Users, Video } from "lucide-react";
import { GlowLink, Reveal, SectionHead } from "./primitives";
import { cn } from "@/lib/utils";

const TABS = [
  {
    id: "social", icon: Megaphone, label: "Social Media Domination",
    blurb: "We run your Instagram, TikTok and Facebook so readers find you daily.",
    bullets: ["A full content calendar planned around your book", "Reels & BookTok videos that stop the scroll", "We schedule and post for you, every week", "Community growth tracked and reported monthly"],
    preview: [{ i: CalendarDays, t: "30-day content calendar" }, { i: Video, t: "Reels / TikTok frames" }, { i: Users, t: "+ followers tracker" }],
  },
  {
    id: "email", icon: Mail, label: "High-Conversion Email Funnels",
    blurb: "Turn casual readers into loyal fans who buy every book.",
    bullets: ["Automatic welcome emails for new readers", "Beautiful newsletter templates in your brand", "Pre-order countdowns that drive launch-day sales", "ARC (Advance Review Copy) launch to get early reviews"],
    preview: [{ i: Mail, t: "Reader onboarding · 5 emails" }, { i: Timer, t: "Pre-order countdown" }, { i: Check, t: "ARC team sign-up" }],
  },
  {
    id: "web", icon: Globe, label: "Author Websites & Development",
    blurb: "A fast, stunning home for your books, your story and your readers.",
    bullets: ["Modern author website that loads in a blink", "Landing & pre-order pages for each book", "Newsletter sign-up built right in", "Works perfectly on every phone"],
    preview: [{ i: Globe, t: "yourname.com" }, { i: Timer, t: "Pre-order page" }, { i: Mail, t: "Newsletter sign-up" }],
  },
];

export function Services() {
  const [tab, setTab] = useState(0);
  const t = TABS[tab]!;
  return (
    <section id="services" className="relative px-5 py-24">
      <SectionHead eyebrow="Services" title={<>Three ways we <span className="text-gold-gradient">grow your readers</span></>} sub="Pick one service or combine them all. We handle the tech, you keep writing." />
      <Reveal className="mx-auto max-w-6xl">
        <div role="tablist" className="mx-auto mb-8 grid max-w-3xl gap-2 sm:grid-cols-3">
          {TABS.map((x, i) => (
            <button key={x.id} role="tab" aria-selected={i === tab} onClick={() => setTab(i)}
              className={cn("flex min-h-12 items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-medium transition-all",
                i === tab ? "bg-gold-gradient text-primary-foreground glow-gold" : "glass text-muted-foreground hover:text-foreground")}>
              <x.icon className="h-4 w-4 shrink-0" /> <span className="truncate">{x.label}</span>
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={t.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.35 }}
            className="glass grid gap-8 rounded-3xl p-6 sm:p-10 md:grid-cols-2">
            <div>
              <t.icon className="h-10 w-10 text-gold" />
              <h3 className="mt-4 text-3xl font-semibold sm:text-4xl">{t.label}</h3>
              <p className="mt-2 text-muted-foreground">{t.blurb}</p>
              <ul className="mt-6 space-y-3">
                {t.bullets.map((b) => (
                  <li key={b} className="flex gap-3"><Check className="mt-0.5 h-5 w-5 shrink-0 text-cyan" /> <span>{b}</span></li>
                ))}
              </ul>
              <GlowLink href="#contact" className="mt-8">Get This Service</GlowLink>
            </div>
            <div className="relative rounded-2xl border bg-background/60 p-5">
              <div className="mb-4 flex gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-destructive/70" /><span className="h-2.5 w-2.5 rounded-full bg-gold/70" /><span className="h-2.5 w-2.5 rounded-full bg-cyan/70" /></div>
              <div className="space-y-3">
                {t.preview.map((p, i) => (
                  <motion.div key={p.t} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.12 }}
                    className="flex items-center gap-3 rounded-xl border bg-card/70 p-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-gold/15"><p.i className="h-5 w-5 text-gold" /></span>
                    <span className="min-w-0 flex-1 truncate text-sm">{p.t}</span>
                    <span className="font-mono text-[10px] uppercase text-cyan">live</span>
                  </motion.div>
                ))}
                <div className="grid grid-cols-7 gap-1 pt-2">
                  {Array.from({ length: 28 }).map((_, i) => (
                    <div key={i} className={cn("aspect-square rounded", i % 3 === 0 ? "bg-gold/50" : i % 5 === 0 ? "bg-cyan/40" : "bg-foreground/5")} />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </Reveal>
    </section>
  );
}
