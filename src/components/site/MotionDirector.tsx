import { useEffect } from "react";

/**
 * A lightweight site-wide motion layer. It enhances existing sections without
 * taking over scrolling, changing routes, or blocking pointer/keyboard input.
 */
export function MotionDirector() {
  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let frame = 0;
    let lastY = window.scrollY;
    let lastTime = performance.now();

    const updateScroll = () => {
      const maxScroll = Math.max(1, root.scrollHeight - window.innerHeight);
      root.style.setProperty("--lm-scroll-progress", String(Math.min(1, window.scrollY / maxScroll)));
      const now = performance.now();
      const delta = Math.abs(window.scrollY - lastY);
      const velocity = reduced ? 0 : Math.min(1, delta / Math.max(16, now - lastTime) / 2.5);
      root.style.setProperty("--lm-scroll-velocity", String(velocity));
      lastY = window.scrollY;
      lastTime = now;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!finePointer || reduced || frame) return;
      frame = window.requestAnimationFrame(() => {
        root.style.setProperty("--lm-pointer-x", `${event.clientX}px`);
        root.style.setProperty("--lm-pointer-y", `${event.clientY}px`);
        frame = 0;
      });
    };

    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    if (finePointer && !reduced) window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("pointermove", onPointerMove);
      if (frame) window.cancelAnimationFrame(frame);
      root.style.removeProperty("--lm-scroll-progress");
      root.style.removeProperty("--lm-scroll-velocity");
      root.style.removeProperty("--lm-pointer-x");
      root.style.removeProperty("--lm-pointer-y");
    };
  }, []);

  return (
    <>
      <div aria-hidden="true" className="lm-scroll-progress" />
      <div aria-hidden="true" className="lm-pointer-atmosphere" />
    </>
  );
}
