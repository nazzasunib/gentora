"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { RevealText } from "@/components/ui/Reveal";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "error" | "loading" | "done">("idle");
  const [msg, setMsg] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { setState("error"); setMsg("Please enter your email address."); return; }
    if (!EMAIL_RE.test(email.trim())) { setState("error"); setMsg("That email doesn't look right — please check it."); return; }
    setState("loading");
    setTimeout(() => { setState("done"); setMsg(""); }, 900);
  };

  return (
    <section className="relative overflow-hidden border-t border-line bg-surface py-28 lg:py-32" aria-labelledby="nl-title">
      <div className="container-site grid items-end gap-12 lg:grid-cols-2">
        <div>
          <p className="eyebrow mb-5">The GENTORA Letter</p>
          <h2 id="nl-title" className="h-display text-5xl sm:text-7xl"><RevealText text="STAY IN STYLE" /></h2>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-muted">Get updates on new collections, exclusive offers and style inspiration.</p>
        </div>
        <div>
          <AnimatePresence mode="wait">
            {state === "done" ? (
              <motion.div key="done" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-4 border border-gold/40 p-6" role="status">
                <CheckCircle2 className="mt-0.5 shrink-0 text-gold" />
                <div>
                  <p className="font-display text-2xl">Welcome to the list.</p>
                  <p className="mt-1 text-sm text-muted">Demo only — this frontend preview does not store your address or send any email.</p>
                  <button onClick={() => { setState("idle"); setEmail(""); }} className="mt-3 text-[11px] uppercase tracking-wide2 text-gold hover:underline">Subscribe another email</button>
                </div>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={submit} noValidate initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <label htmlFor="nl-email" className="sr-only">Email address</label>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input id="nl-email" type="email" inputMode="email" autoComplete="email" placeholder="Your email address" value={email}
                    onChange={(e) => { setEmail(e.target.value); if (state === "error") setState("idle"); }}
                    aria-invalid={state === "error"} aria-describedby="nl-msg" className="input h-14 flex-1" />
                  <button type="submit" className="btn-gold h-14 py-0" disabled={state === "loading"}>
                    {state === "loading" ? "Subscribing…" : <>Subscribe <ArrowRight size={15} /></>}
                  </button>
                </div>
                <p id="nl-msg" className={state === "error" ? "mt-3 text-sm text-[#B4533A]" : "mt-3 text-xs text-white/40"} role={state === "error" ? "alert" : undefined}>
                  {state === "error" ? msg : "Demo form — no email is actually sent. Unsubscribe anytime."}
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
