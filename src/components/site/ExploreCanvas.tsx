import { useCallback, useRef, useState } from "react";
import { Maximize, Minus, Plus } from "lucide-react";
import { WORKS, type Work } from "@/data/site";

/**
 * Category 24 — Optional "Explore canvas" view of the existing portfolio.
 * A draggable, zoomable freeform board of the same works shown in the
 * filterable gallery (which stays the default and primary experience).
 * Fully keyboard-operable: arrows pan, +/- zoom, 0 resets, Tab reaches
 * every work and Enter opens it.
 */

type Pt = { x: number; y: number };

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2.2;

/** Deterministic scattered layout so the board looks organic but stable. */
function layout(items: Work[]): (Pt & { w: Work })[] {
  return items.map((w, i) => {
    const col = i % 5;
    const row = Math.floor(i / 5);
    const jx = ((i * 137) % 60) - 30;
    const jy = ((i * 211) % 70) - 35;
    return { w, x: col * 300 + jx, y: row * 380 + jy };
  });
}

export function ExploreCanvas({ onOpen, onExit }: { onOpen: (w: Work) => void; onExit: () => void }) {
  const items = layout(WORKS.filter((w) => w.img || w.youtube));
  const [offset, setOffset] = useState<Pt>({ x: 40, y: 40 });
  const [zoom, setZoom] = useState(1);
  const drag = useRef<{ id: number; start: Pt; origin: Pt } | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  const clampZoom = (z: number) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z));
  const reset = useCallback(() => {
    setOffset({ x: 40, y: 40 });
    setZoom(1);
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button")) return; // let item buttons work
    drag.current = { id: e.pointerId, start: { x: e.clientX, y: e.clientY }, origin: offset };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    setOffset({ x: d.origin.x + (e.clientX - d.start.x), y: d.origin.y + (e.clientY - d.start.y) });
  };
  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (drag.current?.id === e.pointerId) drag.current = null;
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const step = 60;
    const pan: Record<string, Pt> = {
      ArrowLeft: { x: step, y: 0 },
      ArrowRight: { x: -step, y: 0 },
      ArrowUp: { x: 0, y: step },
      ArrowDown: { x: 0, y: -step },
    };
    if (pan[e.key]) {
      e.preventDefault();
      const p = pan[e.key]!;
      setOffset((o) => ({ x: o.x + p.x, y: o.y + p.y }));
    } else if (e.key === "+" || e.key === "=") {
      e.preventDefault();
      setZoom((z) => clampZoom(z + 0.15));
    } else if (e.key === "-" || e.key === "_") {
      e.preventDefault();
      setZoom((z) => clampZoom(z - 0.15));
    } else if (e.key === "0" || e.key === "Home") {
      e.preventDefault();
      reset();
    } else if (e.key === "Escape") {
      e.preventDefault();
      onExit();
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-3 flex flex-wrap items-center justify-center gap-2">
        <button type="button" onClick={() => setZoom((z) => clampZoom(z + 0.2))} aria-label="Zoom in"
          className="grid h-11 w-11 place-items-center rounded-full glass transition-transform hover:scale-105">
          <Plus className="h-5 w-5" />
        </button>
        <button type="button" onClick={() => setZoom((z) => clampZoom(z - 0.2))} aria-label="Zoom out"
          className="grid h-11 w-11 place-items-center rounded-full glass transition-transform hover:scale-105">
          <Minus className="h-5 w-5" />
        </button>
        <button type="button" onClick={reset} aria-label="Reset canvas view"
          className="grid h-11 w-11 place-items-center rounded-full glass transition-transform hover:scale-105">
          <Maximize className="h-5 w-5" />
        </button>
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Drag to pan · arrow keys move · +/− zoom · 0 resets · Esc exits
        </span>
      </div>
      <div
        ref={boardRef}
        role="application"
        aria-label="Freeform portfolio canvas. Use arrow keys to pan, plus and minus to zoom, zero to reset."
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={onKeyDown}
        className="relative h-[70vh] cursor-grab touch-none select-none overflow-hidden rounded-3xl border bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,.10),transparent_70%)] focus:cursor-grab active:cursor-grabbing"
      >
        <div
          className="absolute left-0 top-0"
          style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`, transformOrigin: "0 0" }}
        >
          {items.map(({ w, x, y }) => {
            const thumb = w.youtube ? `https://i.ytimg.com/vi/${w.youtube}/hqdefault.jpg` : w.img;
            return (
              <button
                key={w.id}
                type="button"
                onClick={() => onOpen(w)}
                className="group absolute w-44 overflow-hidden rounded-2xl border bg-card text-left shadow-2xl transition-transform hover:scale-105 focus-visible:scale-105 sm:w-52"
                style={{ left: x, top: y }}
              >
                {thumb ? (
                  <img src={thumb} alt="" loading="lazy" decoding="async" draggable={false}
                    className="aspect-[4/5] w-full object-cover" />
                ) : (
                  <div className="grid aspect-[4/5] place-items-center bg-aurora" />
                )}
                <span className="block truncate px-3 py-2 text-xs font-medium">{w.title || "Book trailer"}</span>
                <span className="block px-3 pb-2 font-mono text-[9px] uppercase text-cyan">{w.cat}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
