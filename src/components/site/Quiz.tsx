import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { PACKAGES } from "@/data/site";
import { GlowButton } from "./primitives";
import { cn } from "@/lib/utils";

const QUESTIONS = [
  { q: "Where is your book right now?", a: ["Just launched or my first book", "Out for a while, sales are slow", "Several books or a series"] },
  { q: "How much do you want us to handle?", a: ["A steady social presence", "Social, video and email", "Everything, on every platform"] },
  { q: "What is your next big goal?", a: ["Get my book seen", "Build a loyal reader base", "A big launch or a publishing brand"] },
];

/** Each answer scores 0, 1 or 2. Total 0–1 → Debut, 2–4 → Bestseller, 5–6 → Empire. */
export function recommendTier(answers: number[]): number {
  const sum = answers.reduce((a, b) => a + b, 0);
  return sum <= 1 ? 0 : sum <= 4 ? 1 : 2;
}

export function PackageQuiz({ onPick }: { onPick: (name: string) => void }) {
  const [answers, setAnswers] = useState<number[]>([]);
  const step = answers.length;
  const done = step === QUESTIONS.length;
  const rec = done ? PACKAGES[recommendTier(answers)]! : null;

  return (
    <div className="glass mx-auto mt-16 max-w-2xl rounded-3xl p-6 sm:p-8">
      <div className="flex items-center gap-2 text-gold"><Sparkles className="h-5 w-5" /><span className="font-mono text-xs uppercase tracking-widest">Quick quiz</span></div>
      <h3 className="mt-2 text-2xl font-semibold sm:text-3xl">Which package is right for me?</h3>
      <p className="mt-1 text-sm text-muted-foreground">Answer 3 quick questions.</p>
      <div className="mt-4 flex gap-1.5">{QUESTIONS.map((_, i) => <span key={i} className={cn("h-1 flex-1 rounded-full", i < step ? "bg-gold" : "bg-foreground/10")} />)}</div>
      <AnimatePresence mode="wait">
        {!done ? (
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="mt-6">
            <p className="font-medium">{QUESTIONS[step]!.q}</p>
            <div className="mt-3 grid gap-2">
              {QUESTIONS[step]!.a.map((a, i) => (
                <button key={a} onClick={() => setAnswers([...answers, i])} className="min-h-11 rounded-xl border bg-background/50 px-4 py-3 text-left text-sm transition-colors hover:border-gold hover:text-gold">{a}</button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key="r" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">We recommend</p>
            <p className="mt-1 font-serif text-3xl text-gold-gradient">{rec!.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">{rec!.price}{rec!.period} · {rec!.tagline}</p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <GlowButton onClick={() => onPick(rec!.name)}>Order Package</GlowButton>
              <GlowButton variant="ghost" onClick={() => setAnswers([])}>Start again</GlowButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
