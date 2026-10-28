import { useEffect, useRef, type ReactNode } from "react";
import { animate, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Categories 26 + 18 — Interactive typography tracking + liquid typography.
 * Real text stays in the DOM. Pointer proximity widens letter-spacing and
 * adds a gentle skew; hovering triggers a brief feTurbulence/feDisplacementMap
 * "liquid" wobble that always settles back to scale 0 (fully readable).
 * Disabled entirely for reduced motion and coarse pointers.
 */
export function KineticHeading({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const dispRef = useRef<SVGFEDisplacementMapElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let raf = 0;
    const onMove = (e: PointerEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
        const near = Math.max(0, 1 - dist / 420); // 1 when pointer is on the heading
        el.style.letterSpacing = `${-0.01 + near * 0.045}em`;
        el.style.transform = `skewX(${((e.clientX - cx) / Math.max(1, r.width)) * -4 * near}deg)`;
      });
    };

    let settle: { stop: () => void } | null = null;
    const liquid = (on: boolean) => {
      const disp = dispRef.current;
      if (!disp) return;
      settle?.stop();
      if (on) {
        el.style.filter = "url(#lm-liquid)";
        settle = animate(0, 14, {
          duration: 0.5,
          ease: "easeOut",
          onUpdate: (v) => disp.scale.baseVal = v,
          onComplete: () => {
            settle = animate(14, 0, {
              duration: 1.1,
              ease: "easeInOut",
              onUpdate: (v) => disp.scale.baseVal = v,
              onComplete: () => { el.style.filter = ""; },
            });
          },
        });
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerenter", () => liquid(true));
    const enter = () => liquid(true);
    el.addEventListener("pointerenter", enter);
    return () => {
      window.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerenter", enter);
      settle?.stop();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduce]);

  return (
    <>
      <svg aria-hidden="true" width="0" height="0" className="absolute">
        <filter id="lm-liquid">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.05" numOctaves="2" result="noise" />
          <feDisplacementMap ref={dispRef} in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <span ref={ref} className={cn("inline-block will-change-transform", className)}>
        {children}
      </span>
    </>
  );
}
