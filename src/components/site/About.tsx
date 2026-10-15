import { useState } from "react";
import { motion } from "framer-motion";
import { Award, BookOpen, Users, Plus } from "lucide-react";
import a from "@/assets/pf";
import { CONTACT, FAQS } from "@/data/site";
import { GlowLink, Reveal, SectionHead } from "./primitives";

export function About() {
  return (
    <section id="about" className="relative overflow-hidden px-5 py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        <Reveal className="relative mx-auto w-full max-w-md">
          <div className="absolute inset-[10%] rounded-full bg-gold/25 blur-3xl" />
          <div className="relative animate-float">
            <img src={a["founder"]} alt="Idowu Isreal Agboola, founder of literarymarketing, in a navy double-breasted suit" loading="lazy" width={900} height={1350}
              className="relative w-full [mask-image:radial-gradient(70%_65%_at_50%_42%,#000_55%,transparent_100%)]" />
          </div>
          {[{ i: BookOpen, t: "50+", l: "Books promoted" }, { i: Users, t: "30+", l: "Authors served" }, { i: Award, t: "5★", l: "Avg. rating" }].map((b, k) => (
            <motion.div key={b.l} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 + k * 0.15 }}
              className={`glass absolute flex items-center gap-2 rounded-2xl px-3 py-2 ${["left-0 top-[18%]", "right-0 top-[45%]", "left-[6%] bottom-[12%]"][k]}`}>
              <b.i className="h-5 w-5 text-gold" />
              <div><p className="font-mono text-lg font-bold leading-none">{b.t}</p><p className="text-[10px] text-muted-foreground">{b.l} · sample</p></div>
            </motion.div>
          ))}
        </Reveal>
        <Reveal delay={0.1}>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan">06 · Meet the founder</p>
          <h2 className="mt-3 text-5xl font-semibold leading-tight sm:text-6xl">Idowu Isreal <span className="text-gold-gradient">Agboola</span></h2>
          <p className="mt-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">Founder · Social Media & Email Marketer · Website Developer</p>
          <div className="hairline my-6 w-40" />
          <p className="text-lg leading-relaxed text-foreground/90">
            I help authors turn books into brands by combining storytelling, marketing and technology. Every book has readers waiting for it. My job is to make sure they find it, fall in love with it and come back for the next one.
          </p>
          <GlowLink href={CONTACT.calendly} target="_blank" rel="noopener" className="mt-8">Book a Call with Idowu</GlowLink>
        </Reveal>
      </div>
    </section>
  );
}

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="px-5 py-24">
      <SectionHead eyebrow="FAQ" title={<>Questions, <span className="text-gold-gradient">answered</span></>} sub="Everything authors usually ask before we start." />
      <div className="mx-auto max-w-3xl space-y-3">
        {FAQS.map((f, i) => (
          <Reveal key={f.q} delay={i * 0.04}>
            <div className="glass overflow-hidden rounded-2xl">
              <button onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} className="flex min-h-14 w-full items-center justify-between gap-4 px-5 py-4 text-left">
                <span className="font-serif text-xl">{f.q}</span>
                <Plus className={`h-5 w-5 shrink-0 text-gold transition-transform duration-300 ${open === i ? "rotate-45" : ""}`} />
              </button>
              <motion.div initial={false} animate={{ height: open === i ? "auto" : 0, opacity: open === i ? 1 : 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                <p className="px-5 pb-5 text-muted-foreground">{f.a}</p>
              </motion.div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
