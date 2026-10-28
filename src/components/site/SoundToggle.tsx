import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { playCue, setSoundEnabled, setSoundVolume, soundEnabled, soundVolume, storedSoundPref } from "./sound";

/**
 * Category 29 — Sound toggle for the header. OFF by default; the preference
 * is remembered only after the user opts in. Wires global hover/select cues
 * onto links and buttons via event delegation while enabled.
 */
export function SoundToggle() {
  const [on, setOn] = useState(false);
  const [vol, setVol] = useState(0.5);

  useEffect(() => {
    if (storedSoundPref()) {
      setOn(true);
      setSoundEnabled(true);
      setVol(soundVolume());
    }
  }, []);

  useEffect(() => {
    if (!on) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const over = (e: Event) => {
      if (!fine) return;
      const t = e.target as HTMLElement | null;
      if (t?.closest("a, button")) playCue("hover");
    };
    const click = (e: Event) => {
      const t = e.target as HTMLElement | null;
      if (t?.closest('a, button, [role="button"]')) playCue("select");
    };
    document.addEventListener("pointerover", over, { passive: true });
    document.addEventListener("click", click, { passive: true });
    return () => {
      document.removeEventListener("pointerover", over);
      document.removeEventListener("click", click);
    };
  }, [on]);

  const toggle = () => {
    const next = !on;
    setOn(next);
    setSoundEnabled(next);
    if (next) playCue("confirm");
  };

  return (
    <div className="flex items-center gap-2">
      {on && (
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={vol}
          aria-label="Sound volume"
          onChange={(e) => {
            const v = Number(e.target.value);
            setVol(v);
            setSoundVolume(v);
          }}
          className="hidden h-1 w-16 accent-cyan sm:block"
        />
      )}
      <button
        type="button"
        onClick={toggle}
        aria-pressed={on}
        aria-label={on ? "Turn sound effects off" : "Turn sound effects on"}
        className="grid h-11 w-11 place-items-center rounded-full glass transition-transform hover:scale-105"
      >
        {on ? <Volume2 className="h-4 w-4 text-cyan" /> : <VolumeX className="h-4 w-4 text-muted-foreground" />}
      </button>
    </div>
  );
}
