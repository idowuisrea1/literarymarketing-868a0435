/**
 * Category 29 — Interactive sound design (opt-in, OFF by default).
 * All cues are synthesized with Web Audio — no audio files, no autoplay.
 * The AudioContext is created only after the user enables sound, and the
 * preference is stored only after that explicit opt-in.
 */

type Cue = "hover" | "select" | "confirm";

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let ambient: { osc: OscillatorNode; lfo: OscillatorNode; gain: GainNode } | null = null;
let enabled = false;
let volume = 0.5;
let lastHover = 0;

const KEY = "lm-sound";

export function soundEnabled() {
  return enabled;
}

export function soundVolume() {
  return volume;
}

export function storedSoundPref(): boolean {
  try {
    return localStorage.getItem(KEY) === "on";
  } catch {
    return false;
  }
}

function ensureCtx() {
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = volume;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export function setSoundEnabled(on: boolean) {
  enabled = on;
  try {
    if (on) localStorage.setItem(KEY, "on");
    else localStorage.removeItem(KEY);
  } catch {
    /* storage unavailable — sound still works for this session */
  }
  if (on) {
    ensureCtx();
    startAmbient();
  } else {
    stopAmbient();
  }
}

export function setSoundVolume(v: number) {
  volume = Math.min(1, Math.max(0, v));
  if (master && ctx) master.gain.setTargetAtTime(volume, ctx.currentTime, 0.05);
}

function blip(freq: number, dur: number, type: OscillatorType, gain: number, slideTo?: number) {
  if (!enabled) return;
  const c = ensureCtx();
  if (!c || !master) return;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, c.currentTime + dur);
  g.gain.setValueAtTime(0, c.currentTime);
  g.gain.linearRampToValueAtTime(gain, c.currentTime + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
  osc.connect(g).connect(master);
  osc.start();
  osc.stop(c.currentTime + dur + 0.02);
}

export function playCue(cue: Cue) {
  if (!enabled) return;
  if (cue === "hover") {
    const now = performance.now();
    if (now - lastHover < 110) return; // throttle hover ticks
    lastHover = now;
    blip(1180, 0.07, "sine", 0.05);
  } else if (cue === "select") {
    blip(660, 0.09, "triangle", 0.09, 990);
  } else {
    blip(523, 0.16, "sine", 0.08);
    blip(784, 0.22, "sine", 0.06);
  }
}

function startAmbient() {
  const c = ensureCtx();
  if (!c || !master || ambient) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  const lfo = c.createOscillator();
  const lfoGain = c.createGain();
  osc.type = "sine";
  osc.frequency.value = 110;
  gain.gain.value = 0.0;
  gain.gain.setTargetAtTime(0.018, c.currentTime, 1.2); // fade in, very soft
  lfo.frequency.value = 0.08;
  lfoGain.gain.value = 0.008;
  lfo.connect(lfoGain).connect(gain.gain);
  osc.connect(gain).connect(master);
  osc.start();
  lfo.start();
  ambient = { osc, lfo, gain };
}

function stopAmbient() {
  if (!ambient || !ctx) return;
  const a = ambient;
  ambient = null;
  a.gain.gain.setTargetAtTime(0, ctx.currentTime, 0.2);
  setTimeout(() => {
    try {
      a.osc.stop();
      a.lfo.stop();
      a.osc.disconnect();
      a.lfo.disconnect();
      a.gain.disconnect();
    } catch {
      /* already stopped */
    }
  }, 800);
}
