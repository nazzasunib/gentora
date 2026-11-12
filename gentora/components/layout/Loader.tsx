"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

/** Brief branded intro on first visit of the session. */
export default function Loader() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem("gentora-intro") === "1"; sessionStorage.setItem("gentora-intro", "1"); } catch {}
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(() => setShow(false), seen || reduced ? 0 : 1500);
    return () => clearTimeout(t);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.div className="fixed inset-0 z-[200] flex items-center justify-center bg-ink" exit={{ clipPath: "inset(0 0 100% 0)" }} transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }} aria-hidden>
          <div className="text-center">
            <motion.p initial={{ opacity: 0, letterSpacing: "0.6em" }} animate={{ opacity: 1, letterSpacing: "0.38em" }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} className="font-display text-4xl text-white sm:text-5xl">
              GENTORA
            </motion.p>
            <motion.span className="mx-auto mt-4 block h-px bg-gold" initial={{ width: 0 }} animate={{ width: 120 }} transition={{ duration: 1.1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
