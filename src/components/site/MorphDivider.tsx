import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Category 17 — Morphing SVG.
 * Blob paths with an identical command structure (M + 4 cubic curves + Z),
 * so framer-motion can interpolate `d` number-by-number. Used as a decorative
 * morphing ring behind the Process step icons, plus a line that draws itself
 * on scroll. Purely decorative (aria-hidden); the brand logo is untouched.
 */

// 100x100 viewBox, 4 cubic segments each — same point count, safe to morph.
const BLOBS = [
  "M50 6 C74 6 94 26 94 50 C94 74 74 94 50 94 C26 94 6 74 6 50 C6 26 26 6 50 6 Z",
  "M50 4 C80 10 92 30 90 54 C88 78 70 96 46 92 C22 88 4 70 10 46 C16 22 20 -2 50 4 Z",
  "M50 10 C68 2 96 22 92 48 C88 74 78 92 52 90 C26 88 8 78 8 52 C8 26 32 18 50 10 Z",
];

export function MorphRing({ delay = 0, className }: { delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setI((x) => (x + 1) % BLOBS.length), 2600);
    return () => clearInterval(t);
  }, [reduce]);
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className={className}>
      <motion.path
        d={BLOBS[i]!}
        fill="none"
        stroke="var(--cyan)"
        strokeWidth="1.4"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 0.8 }}
        viewport={{ once: true }}
        animate={{ d: BLOBS[i]! }}
        transition={{
          d: { duration: 2.2, ease: "easeInOut" },
          pathLength: { duration: 1.6, delay, ease: "easeInOut" },
          opacity: { duration: 0.6, delay },
        }}
      />
    </svg>
  );
}

/** Decorative section divider: a gold line that draws itself on scroll. */
export function DrawnDivider({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 12" aria-hidden="true" className={className} preserveAspectRatio="none">
      <motion.path
        d="M4 6 C100 2 300 10 396 6"
        fill="none"
        stroke="url(#lm-divider-g)"
        strokeWidth="1.6"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      />
      <defs>
        <linearGradient id="lm-divider-g" x1="0" y1="0" x2="400" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#8b5cf6" stopOpacity="0" />
          <stop offset="0.5" stopColor="#67e8f9" />
          <stop offset="1" stopColor="#8b5cf6" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}
