import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import logo from "@/assets/pf/logo.png.asset.json";
import { GlowLink } from "./primitives";
import { cn } from "@/lib/utils";

const NAV = [
  ["Services", "services"],
  ["Portfolio", "portfolio"],
  ["Process", "process"],
  ["Pricing", "pricing"],
  ["About", "about"],
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on(); window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; }, [open]);

  return (
    <header className={cn("fixed inset-x-0 top-0 z-50 transition-all duration-300", scrolled ? "py-2" : "py-4")}>
      <div className={cn("mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-full px-4 transition-all sm:px-6", scrolled ? "glass mx-3 py-2 sm:mx-6 xl:mx-auto" : "py-2")}>
        <a href="#top" className="flex shrink-0 items-center gap-2" aria-label="literarymarketing home">
          <img src={logo.url} alt="Literary Marketing logo" width={48} height={48} className={cn("drop-shadow-[0_0_12px_oklch(0.76_0.13_85/0.5)] transition-all", scrolled ? "h-10 w-10" : "h-12 w-12")} />
          <span className="hidden font-serif text-xl font-semibold sm:inline">literary<span className="text-gold">marketing</span></span>
        </a>
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main">
          {NAV.map(([l, id]) => (
            <a key={id} href={`#${id}`} className="text-sm text-muted-foreground transition-colors hover:text-gold">{l}</a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <GlowLink href="#contact" className="hidden sm:inline-flex">Contact Us</GlowLink>
          <button onClick={() => setOpen(true)} className="grid h-11 w-11 place-items-center rounded-full glass lg:hidden" aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-50 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <motion.aside
              className="glass absolute right-0 top-0 flex h-full w-[82%] max-w-sm flex-col gap-2 p-6"
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 28, stiffness: 260 }}
            >
              <button onClick={() => setOpen(false)} className="ml-auto grid h-11 w-11 place-items-center rounded-full glass" aria-label="Close menu"><X className="h-5 w-5" /></button>
              {NAV.map(([l, id], i) => (
                <motion.a key={id} href={`#${id}`} onClick={() => setOpen(false)} className="border-b py-4 font-serif text-3xl"
                  initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i + 0.1 }}>
                  {l}
                </motion.a>
              ))}
              <GlowLink href="#contact" onClick={() => setOpen(false)} className="mt-6">Contact Us</GlowLink>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
