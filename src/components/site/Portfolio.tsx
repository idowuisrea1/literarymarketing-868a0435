import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Play, X, Clapperboard, ChevronLeft, ChevronRight, Orbit } from "lucide-react";
import { CATEGORIES, WORKS, type Work } from "@/data/site";
import { GlowButton, Reveal, SectionHead, Tilt } from "./primitives";
import { cn } from "@/lib/utils";
import { CinematicReel } from "./CinematicReel";

const PAGE = 9;

/** Remove marketing extras from a YouTube title so only the book name stays. */
export function cleanTitle(raw: string): string {
  let t = raw.split("|")[0]!;
  t = t.replace(/\b(official|cinematic|amazing|book|movie)?\s*(book\s*)?trailer(\s*(video|design))?\b/gi, "")
    .replace(/\b(a|an)\s+(?=for\b)/gi, "").replace(/^\s*for\s+(the\s+)?/i, (m) => (/the/i.test(m) ? "The " : ""))
    .replace(/\s+by\s+.+$/i, "").replace(/[-–:·]+\s*$/, "").replace(/\s+/g, " ").trim();
  if (!t) return "";
  return t === t.toUpperCase() ? t.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()) : t;
}

function useTrailerTitle(w: Work) {
  const [t, setT] = useState(w.title);
  useEffect(() => {
    if (!w.youtube || w.title) return;
    let live = true;
    fetch(`https://www.youtube.com/oembed?url=https://youtu.be/${w.youtube}&format=json`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { title?: string } | null) => { const c = d?.title ? cleanTitle(d.title) : ""; if (live) setT(c || "Book Trailer"); })
      .catch(() => live && setT("Book Trailer"));
    return () => { live = false; };
  }, [w.youtube, w.title]);
  return t || "Book Trailer";
}

function Card({ w, onOpen }: { w: Work; onOpen: () => void }) {
  const title = useTrailerTitle(w);
  const reduce = useReducedMotion();
  const [preview, setPreview] = useState(false);
  const thumb = w.youtube ? `https://i.ytimg.com/vi/${w.youtube}/hqdefault.jpg` : w.img;
  return (
    <Tilt>
      <button onClick={onOpen}
        onMouseEnter={() => { if (!reduce && window.matchMedia("(hover: hover) and (pointer: fine)").matches && w.youtube) setPreview(true); }}
        onMouseLeave={() => setPreview(false)}
        disabled={!thumb} className="group relative block w-full overflow-hidden rounded-2xl border bg-card text-left disabled:cursor-default">
        <div className={cn("relative w-full overflow-hidden", w.youtube ? "aspect-video" : "aspect-[4/5]")}>
          {thumb ? (
            <img src={thumb} alt={`${title} — ${w.cat}`} width={480} height={w.youtube ? 270 : 600} loading="lazy" decoding="async" className="lm-image-reveal h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          ) : (
            <div className="grid h-full w-full place-items-center bg-aurora"><Clapperboard className="h-10 w-10 text-gold/60" /></div>
          )}
          {w.youtube && preview && (
            <iframe
              className="pointer-events-none absolute inset-0 h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${w.youtube}?autoplay=1&mute=1&controls=0&loop=1&playlist=${w.youtube}&playsinline=1&rel=0`}
              title={`${title} video preview`}
              aria-hidden="true"
              tabIndex={-1}
              allow="autoplay; encrypted-media; picture-in-picture"
            />
          )}
          {w.youtube && (
            <span className="absolute inset-0 grid place-items-center bg-background/30">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-gold-gradient glow-gold"><Play className="ml-1 h-6 w-6 text-primary-foreground" /></span>
            </span>
          )}
        </div>
        <div className="flex items-center justify-between gap-2 p-3">
          <div className="min-w-0">
            <span className="block truncate font-serif text-lg">{title}</span>
            {w.youtube && <span className="block truncate text-xs text-muted-foreground">{w.author ? `by ${w.author}` : "Book trailer"}</span>}
          </div>
          <span className="shrink-0 font-mono text-[10px] uppercase text-cyan">{w.cat}</span>
        </div>
      </button>
    </Tilt>
  );
}

export function Portfolio() {
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("All");
  const [open, setOpen] = useState<Work | null>(null);
  const [shown, setShown] = useState(PAGE);
  const [orbitIndex, setOrbitIndex] = useState(0);
  const reduce = useReducedMotion();
  const orbitWorks = useMemo(() => WORKS.filter((w) => w.img || w.youtube).slice(0, 5), []);
  const all = useMemo(() => (cat === "All" ? WORKS : WORKS.filter((w) => w.cat === cat)), [cat]);
  const items = all.slice(0, shown);
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k);
  }, []);

  return (
    <section id="portfolio" className="px-5 py-24">
      <SectionHead kinetic eyebrow="Portfolio" title={<>Work We Made <span className="text-gold-gradient">for Authors</span></>} sub="Selected creative work for authors." />
      <CinematicReel onOpen={setOpen} />
      <Reveal className="mx-auto mb-10 flex max-w-5xl gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:justify-center">
        {CATEGORIES.map((c) => (
          <button key={c} onClick={() => { setCat(c); setShown(PAGE); }}
            className={cn("min-h-11 shrink-0 rounded-full px-5 text-sm transition-all", c === cat ? "bg-gold-gradient text-primary-foreground" : "glass text-muted-foreground hover:text-foreground")}>
            {c}
          </button>
        ))}
      </Reveal>
      <Reveal className="mx-auto mb-14 max-w-5xl">
        <div className="mb-4 flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-cyan">
          <Orbit className="h-4 w-4" /> Featured work · 3D orbit
        </div>
        <div className="relative mx-auto max-w-3xl">
          <div className="relative mx-auto h-[330px] w-full overflow-hidden rounded-3xl border border-violet-200/10 bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,.16),rgba(8,8,12,.05)_58%,transparent_75%)] sm:h-[390px]" style={{ perspective: "1100px" }}>
            <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
              {orbitWorks.map((w, i) => {
                const angle = (360 / orbitWorks.length) * (i - orbitIndex);
                const image = w.youtube ? `https://i.ytimg.com/vi/${w.youtube}/hqdefault.jpg` : w.img;
                const visible = !reduce || i === orbitIndex;
                return (
                  <button key={w.id} type="button" aria-label={`Open featured work: ${w.title || "Book trailer"}`}
                    onClick={() => setOpen(w)}
                    className="absolute left-1/2 top-1/2 w-36 overflow-hidden rounded-2xl border border-white/15 bg-card text-left shadow-2xl transition-[transform,opacity,filter] duration-700 ease-out sm:w-48"
                    style={{
                      transform: reduce ? "translate(-50%, -50%)" : `translate(-50%, -50%) rotateY(${angle}deg) translateZ(205px)`,
                      opacity: visible ? (i === orbitIndex ? 1 : .52) : 0,
                      filter: i === orbitIndex ? "none" : "brightness(.55) saturate(.75)",
                      pointerEvents: visible ? "auto" : "none",
                      zIndex: i === orbitIndex ? 2 : 1,
                    }}>
                    {image ? <img src={image} alt="" loading="lazy" decoding="async" className="aspect-[4/5] w-full object-cover" /> : <div className="grid aspect-[4/5] place-items-center bg-aurora"><Clapperboard className="h-8 w-8 text-cyan" /></div>}
                    <span className="block truncate px-3 py-2 text-xs font-medium">{w.title || "Book trailer"}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="mt-4 flex items-center justify-center gap-4">
            <button type="button" aria-label="Previous featured work" onClick={() => setOrbitIndex((i) => (i - 1 + orbitWorks.length) % orbitWorks.length)}
              className="grid h-11 w-11 place-items-center rounded-full glass transition-transform hover:scale-105"><ChevronLeft className="h-5 w-5" /></button>
            <span aria-live="polite" className="min-w-28 text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{orbitIndex + 1} / {orbitWorks.length}</span>
            <button type="button" aria-label="Next featured work" onClick={() => setOrbitIndex((i) => (i + 1) % orbitWorks.length)}
              className="grid h-11 w-11 place-items-center rounded-full glass transition-transform hover:scale-105"><ChevronRight className="h-5 w-5" /></button>
          </div>
        </div>
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
      {shown < all.length && (
        <div className="mt-10 text-center">
          <GlowButton onClick={() => setShown((n) => n + PAGE)}>Load More</GlowButton>
          <p className="mt-2 text-xs text-muted-foreground">Showing {items.length} of {all.length}</p>
        </div>
      )}

      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-[70] grid place-items-center bg-background/90 p-4 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(null)} role="dialog" aria-modal="true" aria-label={open.title}>
            <button className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full glass" aria-label="Close"><X className="h-5 w-5" /></button>
            <motion.div initial={{ scale: 0.92 }} animate={{ scale: 1 }} exit={{ scale: 0.92 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-4xl">
              {open.youtube ? (
                <div className="aspect-video w-full overflow-hidden rounded-2xl border glow-gold">
                  <iframe className="h-full w-full" src={`https://www.youtube-nocookie.com/embed/${open.youtube}?autoplay=1&rel=0`} title={open.title || "Book trailer"} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
                </div>
              ) : (
                <img src={open.img} alt={open.title} className="mx-auto max-h-[85vh] w-auto rounded-2xl border glow-gold" />
              )}
              {open.title && <p className="mt-4 text-center font-serif text-2xl">{open.title}</p>}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
