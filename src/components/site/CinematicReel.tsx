import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowLeft, ArrowRight, MoveHorizontal } from "lucide-react";
import { WORKS } from "@/data/site";

const cardWidth = 560;
const gap = 24;

/**
 * A real scroll-linked gallery built from the site's existing portfolio assets.
 * Desktop uses a pinned chapter sequence; touch/reduced-motion users get a
 * native horizontal scroll-snap gallery instead of scroll hijacking.
 */
export function CinematicReel({ onOpen }: { onOpen: (work: (typeof WORKS)[number]) => void }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [compact, setCompact] = useState(true);
  const [travel, setTravel] = useState(0);
  const reduce = useReducedMotion();

  const works = useMemo(
    () => WORKS.filter((work) => work.img || work.youtube).slice(0, 8),
    [],
  );

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px), (prefers-reduced-motion: reduce), (pointer: coarse)");
    const updateMode = () => setCompact(query.matches);
    const measure = () => {
      const track = trackRef.current;
      setTravel(track ? Math.max(0, track.scrollWidth - window.innerWidth + 40) : 0);
    };
    updateMode();
    measure();
    query.addEventListener("change", updateMode);
    window.addEventListener("resize", measure, { passive: true });
    const observer = trackRef.current ? new ResizeObserver(measure) : null;
    if (trackRef.current && observer) observer.observe(trackRef.current);
    return () => {
      query.removeEventListener("change", updateMode);
      window.removeEventListener("resize", measure);
      observer?.disconnect();
    };
  }, [works.length]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -travel]);
  const tint = useTransform(scrollYProgress, [0, 0.5, 1], [
    "rgba(139,92,246,0.04)",
    "rgba(34,211,238,0.09)",
    "rgba(139,92,246,0.12)",
  ]);

  if (!works.length) return null;

  const content = (
    <motion.div
      ref={trackRef}
      style={!compact && !reduce ? { x, backgroundColor: tint } : undefined}
      className={compact
        ? "flex w-full snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-5"
        : "flex w-max gap-6 px-[8vw] will-change-transform"}
    >
      {works.map((work, index) => {
        const image = work.youtube
          ? `https://i.ytimg.com/vi/${work.youtube}/hqdefault.jpg`
          : work.img;
        return (
          <motion.button
            key={work.id}
            type="button"
            onClick={() => onOpen(work)}
            whileHover={reduce || compact ? undefined : { y: -8, rotateY: -2, scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
            className={compact
              ? "lm-fluid-hover group relative w-[78vw] max-w-[420px] shrink-0 snap-center overflow-hidden rounded-3xl border border-white/15 bg-card text-left"
              : "lm-fluid-hover group relative w-[min(68vw,560px)] shrink-0 overflow-hidden rounded-3xl border border-white/15 bg-card text-left"}
            aria-label={`View ${work.title || "featured book project"} in portfolio`}
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              {image ? (
                <motion.img
                  src={image}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="lm-cinematic-image h-full w-full object-cover"
                  initial={reduce ? false : { scale: 1.08, filter: "saturate(.72)" }}
                  whileInView={{ scale: 1, filter: "saturate(1)" }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                />
              ) : (
                <div className="grid h-full place-items-center bg-aurora" />
              )}
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-90" />
              <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/35 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/80 backdrop-blur-md">
                Chapter {String(index + 1).padStart(2, "0")}
              </span>
              {work.youtube && <span className="absolute right-4 top-4 rounded-full bg-cyan/90 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-black">Film</span>}
              <span className="absolute bottom-4 left-5 right-5 font-serif text-2xl text-white sm:text-3xl">
                {work.title || "Book project"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 px-5 py-4">
              <span className="text-xs text-muted-foreground">{work.author ? `by ${work.author}` : work.cat}</span>
              <span className="inline-flex items-center gap-2 text-xs text-cyan">Explore project <ArrowRight className="h-3.5 w-3.5" /></span>
            </div>
          </motion.button>
        );
      })}
    </motion.div>
  );

  return (
    <section
      ref={sectionRef}
      aria-label="Cinematic portfolio story"
      className={compact || reduce ? "relative py-10" : "relative h-[280vh]"}
    >
      <div className={compact || reduce ? "relative" : "sticky top-0 flex h-screen flex-col justify-center overflow-hidden"}>
        <div className="relative z-10 mx-auto mb-8 flex w-full max-w-7xl items-end justify-between gap-5 px-5">
          <div>
            <p className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-cyan">
              <MoveHorizontal className="h-4 w-4" /> A living portfolio · 01—08
            </p>
            <h3 className="max-w-2xl font-serif text-3xl font-semibold leading-tight sm:text-5xl">
              Stories, in <span className="text-iridescent">motion.</span>
            </h3>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
              Explore selected book campaigns and visual identities from the existing portfolio.
            </p>
          </div>
          <div className="hidden shrink-0 items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground md:flex">
            <ArrowLeft className="h-4 w-4" /> Scroll to explore <ArrowDown className="h-4 w-4" />
          </div>
        </div>
        <div className={compact || reduce ? "relative" : "relative overflow-hidden"}>
          {content}
        </div>
        {compact || reduce ? (
          <p className="mt-3 px-5 text-xs text-muted-foreground">Swipe to explore the gallery. Select any project to open it.</p>
        ) : (
          <div className="mx-auto mt-5 h-px w-[min(84vw,900px)] overflow-hidden bg-white/10">
            <motion.div className="h-full origin-left bg-gradient-to-r from-violet-400 via-cyan to-white" style={{ scaleX: scrollYProgress }} />
          </div>
        )}
      </div>
    </section>
  );
}
