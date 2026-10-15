import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, Check, Globe, Mail, Megaphone, Timer, Users, Video, ShoppingCart, Share2, Clapperboard, Gauge, Palette, Rocket } from "lucide-react";
import { SERVICE_CATEGORIES } from "@/data/site";
import { GlowButton, GlowLink, Reveal, SectionHead, openQuote } from "./primitives";
import { cn } from "@/lib/utils";

const TABS = [
  {
    id: "social", cat: "Social Media Management & Content", icon: Megaphone, label: "Social Media Domination",
    blurb: "We run your Instagram, TikTok and Facebook so readers find you daily.",
    bullets: ["A full content calendar planned around your book", "Reels & BookTok videos that stop the scroll", "We schedule and post for you, every week", "Community growth tracked and reported monthly"],
    preview: [{ i: CalendarDays, t: "30-day content calendar" }, { i: Video, t: "Reels / TikTok frames" }, { i: Users, t: "+ followers tracker" }],
  },
  {
    id: "email", cat: "Email Marketing", icon: Mail, label: "High-Conversion Email Funnels",
    blurb: "Turn casual readers into loyal fans who buy every book.",
    bullets: ["Automatic welcome emails for new readers", "Beautiful newsletter templates in your brand", "Pre-order countdowns that drive launch-day sales", "ARC (Advance Review Copy) launch to get early reviews"],
    preview: [{ i: Mail, t: "Reader onboarding · 5 emails" }, { i: Timer, t: "Pre-order countdown" }, { i: Check, t: "ARC team sign-up" }],
  },
  {
    id: "web", cat: "Author Websites & Landing Pages", icon: Globe, label: "Author Websites & Development",
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
      <SectionHead eyebrow="Services" title={<>Three ways we <span className="text-gold-gradient">grow your readers</span></>} sub="Pick one, or combine them. We handle the tech. You keep writing." />
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
              <GlowButton className="mt-8" onClick={() => openQuote(t.cat)}>Get This Service</GlowButton>
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

const ALL = [
  { i: ShoppingCart, b: "Get found and chosen on Amazon and Goodreads.", chips: ["Amazon Optimization", "Amazon A+ Content", "Amazon Marketing", "Goodreads Optimization", "Goodreads Listopia"] },
  { i: Share2, b: "Show up every week where readers scroll.", chips: ["Social Media Management", "Content Creation", "Content Calendars", "Community Growth"] },
  { i: Clapperboard, b: "Short videos that make readers want your book.", chips: ["Book Trailers", "BookTok Videos", "UGC Video", "AI UGC Video", "Slideshow Video", "Product Video"] },
  { i: Mail, b: "Turn readers into fans who buy every book.", chips: ["Email Newsletters", "Email Automation", "Email Campaigns", "Reader Funnels", "ARC Launches"] },
  { i: Globe, b: "A beautiful home online for you and your books.", chips: ["Website Design", "Landing & Squeeze Pages", "Website Integration"] },
  { i: Gauge, b: "Make your site faster and easier to find.", chips: ["Website Audit", "Website SEO", "Speed & Optimization", "Website Promotion"] },
  { i: Palette, b: "Covers and graphics that look like a bestseller.", chips: ["Book Covers", "Book Mockups", "Book Spotlight Graphics", "Content Design"] },
  { i: Rocket, b: "Put your book in front of more readers.", chips: ["Ads Promotion", "Book Launch Promotion", "SEO"] },
];

export function AllServices() {
  return (
    <section aria-labelledby="all-services" className="px-5 pb-24">
      <Reveal className="mx-auto mb-10 max-w-2xl text-center">
        <h2 id="all-services" className="text-3xl font-semibold sm:text-4xl">Everything <span className="text-gold-gradient">We Do</span></h2>
        <p className="mt-2 text-muted-foreground">Eight ways we help your book reach readers.</p>
      </Reveal>
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ALL.map((c, i) => {
          const name = SERVICE_CATEGORIES[i]!;
          return (
            <Reveal key={name} delay={(i % 4) * 0.06} className="h-full">
              <div className="glass flex h-full flex-col rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:glow-gold">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-gold/15"><c.i className="h-5 w-5 text-gold" /></span>
                <h3 className="mt-4 text-xl font-semibold leading-tight">{name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{c.b}</p>
                <div className="mt-4 flex flex-1 flex-wrap content-start gap-1.5">
                  {c.chips.map((x) => <span key={x} className="rounded-full border px-2.5 py-1 text-[11px] text-foreground/80">{x}</span>)}
                </div>
                <GlowButton variant="ghost" className="mt-5 w-full" onClick={() => openQuote(name)}>Get a Quote</GlowButton>
              </div>
            </Reveal>
          );
        })}
      </div>
      <Reveal className="mt-10 text-center">
        <p className="text-muted-foreground">Need something else? We do more. Tell us what your book needs.</p>
        <GlowButton className="mt-4" onClick={() => openQuote("")}>Message Us</GlowButton>
      </Reveal>
    </section>
  );
}
