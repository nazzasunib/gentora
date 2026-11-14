"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Heart } from "lucide-react";
import { useShop } from "@/lib/store";

export default function Toasts() {
  const toasts = useShop((s) => s.toasts);
  return (
    <div className="pointer-events-none fixed bottom-5 left-1/2 z-[90] flex w-[min(92vw,420px)] -translate-x-1/2 flex-col gap-2" aria-live="polite" role="status">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div key={t.id} layout initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} className="flex items-center gap-3 border border-gold/30 bg-surface/95 px-5 py-4 text-sm shadow-2xl backdrop-blur">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold text-on-gold">
              {t.kind === "info" ? <Heart size={12} /> : <Check size={13} />}
            </span>
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
