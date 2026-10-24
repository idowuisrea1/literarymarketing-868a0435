import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, CheckCircle2, X } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { GENRES, ONE_TIME, ORDER_OPTIONS, PACKAGES } from "@/data/site";
import { PackageQuiz } from "./Quiz";
import { GlowButton, Reveal, SectionHead, Tilt } from "./primitives";
import { cn } from "@/lib/utils";

export const fieldCls = "w-full min-h-11 rounded-xl border bg-background/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold";

const orderSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(120),
  email: z.string().trim().email("Please enter a valid email").max(255),
  package: z.string().min(1).max(100),
  book_title: z.string().trim().max(200).optional(),
  genre: z.string().max(100).optional(),
  message: z.string().trim().max(3000).optional(),
});

function OrderModal({ pkg, onClose }: { pkg: string; onClose: () => void }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    if (fd["website"]) return setState("done"); // honeypot
    const r = orderSchema.safeParse(fd);
    if (!r.success) {
      setErrors(Object.fromEntries(r.error.issues.map((i) => [String(i.path[0]), i.message])));
      return;
    }
    setErrors({}); setState("sending");
    const { error } = await supabase.from("orders").insert({ name: r.data.name, email: r.data.email, package: r.data.package, book_title: r.data.book_title ?? null, genre: r.data.genre ?? null, message: r.data.message ?? null });
    if (error) { setState("error"); setMsg(error.message.includes("Too many") ? "Too many requests. Please wait a few minutes." : "Something went wrong. Please try again."); }
    else setState("done");
  }

  return (
    <motion.div className="fixed inset-0 z-[80] grid place-items-center overflow-y-auto bg-background/85 p-4 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} role="dialog" aria-modal="true" aria-label="Order package">
      <motion.div onClick={(e) => e.stopPropagation()} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} className="glass relative w-full max-w-lg rounded-3xl p-6 sm:p-8">
        <button onClick={onClose} className="absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-full" aria-label="Close"><X className="h-5 w-5" /></button>
        {state === "done" ? (
          <div className="py-10 text-center">
            <motion.div initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 200 }}>
              <CheckCircle2 className="mx-auto h-20 w-20 text-gold drop-shadow-[0_0_20px_oklch(0.76_0.13_85/0.6)]" />
            </motion.div>
            <h3 className="mt-5 text-3xl font-semibold">Order received!</h3>
            <p className="mt-2 text-muted-foreground">We'll email you within 24 hours with next steps.</p>
            <GlowButton className="mt-6" onClick={onClose}>Done</GlowButton>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="space-y-3">
            <h3 className="text-3xl font-semibold">Order your package</h3>
            <p className="text-sm text-muted-foreground">No payment now. We confirm details first.</p>
            <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
            {([["name", "Your name"], ["email", "Email address"], ["book_title", "Book title (optional)"]] as const).map(([n, p]) => (
              <div key={n}>
                <input name={n} type={n === "email" ? "email" : "text"} placeholder={p} aria-label={p} className={fieldCls} maxLength={n === "email" ? 255 : 200} />
                {errors[n] && <p className="mt-1 text-xs text-destructive">{errors[n]}</p>}
              </div>
            ))}
            <select name="package" defaultValue={pkg} aria-label="Package" className={fieldCls}>
              {(ORDER_OPTIONS.includes(pkg) ? ORDER_OPTIONS : [pkg, ...ORDER_OPTIONS]).map((o) => <option key={o}>{o}</option>)}
            </select>
            <select name="genre" defaultValue="" aria-label="Genre" className={fieldCls}>
              <option value="" disabled>Book genre</option>
              {GENRES.map((g) => <option key={g}>{g}</option>)}
            </select>
            <textarea name="message" rows={3} placeholder="Anything we should know?" aria-label="Message" maxLength={3000} className={fieldCls} />
            {state === "error" && <p className="text-sm text-destructive">{msg}</p>}
            <GlowButton type="submit" disabled={state === "sending"} className="w-full">{state === "sending" ? "Sending…" : "Place Order"}</GlowButton>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}

export function Pricing() {
  const [pkg, setPkg] = useState<string | null>(null);
  return (
    <section id="pricing" className="px-5 py-24">
      <SectionHead eyebrow="Pricing" title={<>Simple, <span className="text-gold-gradient">transparent</span> plans</>} sub="Pick a monthly plan, or pay once for a single project." />
      <div className="mx-auto grid max-w-6xl items-stretch gap-6 lg:grid-cols-3">
        {PACKAGES.map((p, i) => (
          <Reveal key={p.id} delay={i * 0.1} className="h-full">
            <Tilt max={6} className="h-full">
              <div className={cn("glass relative flex h-full flex-col rounded-3xl p-7", p.popular && "border-animated glow-gold lg:-my-4 lg:py-11")}>
                {p.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold-gradient px-4 py-1 font-mono text-[11px] uppercase tracking-widest text-primary-foreground">Most Popular</span>}
                <h3 className="text-2xl font-semibold">{p.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.tagline}</p>
                <p className="mt-6"><span className="font-serif text-5xl font-semibold text-gold-gradient">{p.price}</span><span className="text-muted-foreground">{p.period}</span></p>
                <div className="hairline my-6" />
                <ul className="flex-1 space-y-3 text-sm">
                  {p.features.map((f) => <li key={f} className="flex gap-3"><Check className="h-5 w-5 shrink-0 text-cyan" />{f}</li>)}
                </ul>
                <GlowButton variant={p.popular ? "gold" : "ghost"} className="relative z-10 mt-8 w-full" onClick={() => setPkg(p.name)}>Order Package</GlowButton>
              </div>
            </Tilt>
          </Reveal>
        ))}
      </div>
      <Reveal className="mx-auto mt-24 max-w-6xl">
        <div className="mb-8 text-center">
          <h3 className="text-3xl font-semibold sm:text-4xl">One-Time <span className="text-gold-gradient">Projects</span></h3>
          <p className="mt-2 text-muted-foreground">Pay once, own it forever.</p>
        </div>
        <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-4">
          {ONE_TIME.map((o) => (
            <Tilt key={o.id} max={6}>
              <div className="glass flex h-full flex-col rounded-2xl p-5 transition-shadow hover:glow-gold">
                <p className="font-semibold">{o.name}</p>
                <p className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">Starting from</p>
                <p className="font-serif text-3xl font-semibold text-gold-gradient">{o.from}</p>
                <GlowButton variant="ghost" className="mt-4 w-full" onClick={() => setPkg(o.name)}>Get a Quote</GlowButton>
              </div>
            </Tilt>
          ))}
        </div>
      </Reveal>
      <p className="mt-10 text-center text-sm text-muted-foreground">
        Need something custom?{" "}
        <button className="min-h-11 text-gold underline-offset-4 hover:underline" onClick={() => setPkg("Custom quote: Other")}>Tell us what you need →</button>
      </p>
      <PackageQuiz onPick={(name) => setPkg(name)} />
      <AnimatePresence>{pkg && <OrderModal pkg={pkg} onClose={() => setPkg(null)} />}</AnimatePresence>
    </section>
  );
}
