import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Play, X, Clapperboard } from "lucide-react";
import { CATEGORIES, WORKS, type Work } from "@/data/site";
import { Reveal, SectionHead, Tilt } from "./primitives";
import { cn } from "@/lib/utils";

function Card({ w, onOpen }: { w: Work; onOpen: () => void }) {
  const thumb = w.youtube ? `https://i.ytimg.com/vi/${w.youtube}/hqdefault.jpg` : w.img;
  return (
    <Tilt>
      <button onClick={onOpen} disabled={!thumb} className="group relative block w-full overflow-hidden rounded-2xl border bg-card text-left disabled:cursor-default">
        <div className={cn("relative w-full overflow-hidden", w.youtube ? "aspect-video" : "aspect-[4/5]")}>
          {thumb ? (
            <img src={thumb} alt={`${w.title} — ${w.cat}`} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          ) : (
            <div className="grid h-full w-full place-items-center bg-aurora"><Clapperboard className="h-10 w-10 text-gold/60" /></div>
          )}
          {w.youtube && (
            <span className="absolute inset-0 grid place-items-center bg-background/30">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-gold-gradient glow-gold"><Play className="ml-1 h-6 w-6 text-primary-foreground" /></span>
            </span>
          )}
        </div>
        <div className="flex items-center justify-between gap-2 p-3">
          <span className="min-w-0 truncate font-serif text-lg">{w.title}</span>
          <span className="shrink-0 font-mono text-[10px] uppercase text-cyan">{w.cat}</span>
        </div>
      </button>
    </Tilt>
  );
}

export function Portfolio() {
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("All");
  const [open, setOpen] = useState<Work | null>(null);
  const items = useMemo(() => (cat === "All" ? WORKS : WORKS.filter((w) => w.cat === cat)), [cat]);
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k);
  }, []);

  return (
    <section id="portfolio" className="px-5 py-24">
      <SectionHead eyebrow="02 · Portfolio" title={<>Work That <span className="text-gold-gradient">Sells Books</span></>} sub="Real trailers, spotlights, mockups and covers we made for authors." />
      <Reveal className="mx-auto mb-10 flex max-w-5xl gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:justify-center">
        {CATEGORIES.map((c) => (
          <button key={c} onClick={() => setCat(c)}
            className={cn("min-h-11 shrink-0 rounded-full px-5 text-sm transition-all", c === cat ? "bg-gold-gradient text-primary-foreground" : "glass text-muted-foreground hover:text-foreground")}>
            {c}
          </button>
        ))}
      </Reveal>
      <motion.div layout className="mx-auto grid max-w-7xl grid-cols-1 gap-5 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {items.map((w) => (
            <motion.div key={w.id} layout initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.94 }} transition={{ duration: 0.3 }}>
              <Card w={w} onOpen={() => setOpen(w)} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-[70] grid place-items-center bg-background/90 p-4 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(null)} role="dialog" aria-modal="true" aria-label={open.title}>
            <button className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full glass" aria-label="Close"><X className="h-5 w-5" /></button>
            <motion.div initial={{ scale: 0.92 }} animate={{ scale: 1 }} exit={{ scale: 0.92 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-4xl">
              {open.youtube ? (
                <div className="aspect-video w-full overflow-hidden rounded-2xl border glow-gold">
                  <iframe className="h-full w-full" src={`https://www.youtube-nocookie.com/embed/${open.youtube}?autoplay=1&rel=0`} title={open.title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
                </div>
              ) : (
                <img src={open.img} alt={open.title} className="mx-auto max-h-[85vh] w-auto rounded-2xl border glow-gold" />
              )}
              <p className="mt-4 text-center font-serif text-2xl">{open.title}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
