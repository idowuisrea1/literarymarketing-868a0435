import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, MessageCircle, Phone, Camera as Instagram, Briefcase as Linkedin, PlayCircle as Youtube, AtSign as Twitter, Music2 } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/pf/logo.png.asset.json";
import { CONTACT, GENRES, SERVICES_LIST } from "@/data/site";
import { GlowButton, GlowLink, Reveal, SectionHead } from "./primitives";
import { fieldCls } from "./Pricing";

const leadSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(120),
  email: z.string().trim().email("Please enter a valid email").max(255),
  genre: z.string().max(100).optional(),
  service: z.string().max(100).optional(),
  details: z.string().trim().max(3000).optional(),
});

export function Contact() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    if (fd["website"]) return setState("done");
    const r = leadSchema.safeParse(fd);
    if (!r.success) { setErrors(Object.fromEntries(r.error.issues.map((i) => [String(i.path[0]), i.message]))); return; }
    setErrors({}); setState("sending");
    const { error } = await supabase.from("leads").insert({ name: r.data.name, email: r.data.email, genre: r.data.genre ?? null, service: r.data.service ?? null, details: r.data.details ?? null });
    setState(error ? "error" : "done");
  }

  return (
    <section id="contact" className="relative px-5 py-24">
      <SectionHead eyebrow="08 · Contact" title={<>Let's launch <span className="text-gold-gradient">your book</span></>} sub="Tell us about your book. We reply within 24 hours." />
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_1.2fr]">
        <Reveal className="glass relative overflow-hidden rounded-3xl p-8">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan/10 blur-3xl" />
          <img src={logo.url} alt="" className="h-24 w-24 drop-shadow-[0_0_20px_oklch(0.76_0.13_85/0.5)]" loading="lazy" />
          <h3 className="mt-4 text-3xl font-semibold">Prefer to talk first?</h3>
          <p className="mt-2 text-muted-foreground">Book a free 20-minute strategy call. We'll map out what your book needs, no pressure.</p>
          <div className="mt-6 flex flex-col gap-3">
            <GlowLink href={CONTACT.calendly} target="_blank" rel="noopener"><Phone className="h-4 w-4" /> Book a Free Strategy Call</GlowLink>
            <GlowLink href={CONTACT.whatsapp} target="_blank" rel="noopener" variant="ghost"><MessageCircle className="h-4 w-4 text-whatsapp" /> Chat on WhatsApp</GlowLink>
          </div>
        </Reveal>
        <Reveal delay={0.1} className="glass rounded-3xl p-6 sm:p-8">
          {state === "done" ? (
            <div className="py-16 text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}><CheckCircle2 className="mx-auto h-20 w-20 text-gold" /></motion.div>
              <h3 className="mt-4 text-3xl font-semibold">Message sent!</h3>
              <p className="mt-2 text-muted-foreground">Thank you. We'll be in touch within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="grid gap-3 sm:grid-cols-2">
              <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
              <div><input name="name" placeholder="Your name" aria-label="Your name" maxLength={120} className={fieldCls} />{errors["name"] && <p className="mt-1 text-xs text-destructive">{errors["name"]}</p>}</div>
              <div><input name="email" type="email" placeholder="Email address" aria-label="Email" maxLength={255} className={fieldCls} />{errors["email"] && <p className="mt-1 text-xs text-destructive">{errors["email"]}</p>}</div>
              <select name="genre" defaultValue="" aria-label="Book genre" className={fieldCls}><option value="" disabled>Book genre</option>{GENRES.map((g) => <option key={g}>{g}</option>)}</select>
              <select name="service" defaultValue="" aria-label="Service needed" className={fieldCls}><option value="" disabled>Service needed</option>{SERVICES_LIST.map((g) => <option key={g}>{g}</option>)}</select>
              <textarea name="details" rows={5} placeholder="Tell us about your book and goals" aria-label="Project details" maxLength={3000} className={`${fieldCls} sm:col-span-2`} />
              {state === "error" && <p className="text-sm text-destructive sm:col-span-2">Something went wrong. Please try again in a few minutes.</p>}
              <GlowButton type="submit" disabled={state === "sending"} className="sm:col-span-2">{state === "sending" ? "Sending…" : "Send Message"}</GlowButton>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}

function Newsletter() {
  const [s, setS] = useState<"idle" | "done" | "error">("idle");
  async function sub(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (fd.get("website")) return setS("done");
    const r = z.string().trim().email().max(255).safeParse(fd.get("email"));
    if (!r.success) return setS("error");
    const { error } = await supabase.from("newsletter_subscribers").insert({ email: r.data });
    setS(!error || error.code === "23505" ? "done" : "error");
  }
  if (s === "done") return <p className="text-sm text-gold">You're on the list ✦</p>;
  return (
    <form onSubmit={sub} className="flex gap-2">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <input name="email" type="email" required placeholder="Your email" aria-label="Newsletter email" className={fieldCls} />
      <GlowButton type="submit" className="shrink-0 px-5">Join</GlowButton>
    </form>
  );
}

export function Footer() {
  const S = CONTACT.socials;
  const icons = [[Instagram, S.instagram, "Instagram"], [Music2, S.tiktok, "TikTok"], [Twitter, S.x, "X"], [Linkedin, S.linkedin, "LinkedIn"], [Youtube, S.youtube, "YouTube"]] as const;
  return (
    <footer className="border-t px-5 pb-28 pt-16 md:pb-12">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.2fr_1fr_1.2fr]">
        <div>
          <img src={logo.url} alt="Literary Marketing logo" className="h-20 w-20 drop-shadow-[0_0_14px_oklch(0.76_0.13_85/0.45)]" loading="lazy" />
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">Turning stories into social movements for authors, novelists and publishers.</p>
          <div className="mt-4 flex gap-1">
            {icons.map(([I, href, l]) => <a key={l} href={href} target="_blank" rel="noopener" aria-label={l} className="grid h-11 w-11 place-items-center rounded-full transition-colors hover:text-gold"><I className="h-5 w-5" /></a>)}
          </div>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-2 text-sm">
          {["services", "portfolio", "process", "pricing", "about", "faq", "contact"].map((id) => (
            <a key={id} href={`#${id}`} className="py-2 capitalize text-muted-foreground hover:text-gold">{id}</a>
          ))}
        </nav>
        <div>
          <p className="font-serif text-2xl">Reader-growth tips, monthly</p>
          <p className="mb-3 text-sm text-muted-foreground">One short email. No spam.</p>
          <Newsletter />
        </div>
      </div>
      <div className="hairline mx-auto my-8 max-w-6xl" />
      <p className="text-center font-mono text-xs text-muted-foreground">© {new Date().getFullYear()} literarymarketing · Founded by Idowu Isreal Agboola</p>
    </footer>
  );
}

export function FloatingBars() {
  return (
    <>
      <a href={CONTACT.whatsapp} target="_blank" rel="noopener" aria-label="Chat on WhatsApp"
        className="fixed bottom-24 right-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-whatsapp text-background shadow-lg transition-transform hover:scale-110 md:bottom-6">
        <MessageCircle className="h-7 w-7" />
      </a>
      <div className="glass fixed inset-x-3 bottom-3 z-40 grid grid-cols-2 gap-2 rounded-full p-2 md:hidden">
        <a href={CONTACT.calendly} target="_blank" rel="noopener" className="grid min-h-11 place-items-center rounded-full bg-gold-gradient text-sm font-semibold text-primary-foreground">Book a Call</a>
        <a href={CONTACT.whatsapp} target="_blank" rel="noopener" className="grid min-h-11 place-items-center rounded-full border text-sm font-semibold">WhatsApp</a>
      </div>
    </>
  );
}
