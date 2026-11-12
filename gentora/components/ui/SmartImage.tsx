"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Props = Omit<ImageProps, "src" | "alt"> & {
  src: string;
  alt: string;
  /** Local image to try if the remote one fails */
  fallbackSrc?: string;
  /** Text shown on the branded fallback panel */
  fallbackLabel?: string;
  wrapperClassName?: string;
};

/**
 * next/image with a fade-in, a local-file fallback and finally a branded,
 * on-palette panel — so a failed remote image never shows as broken.
 */
export default function SmartImage({ src, alt, fallbackSrc, fallbackLabel, className, wrapperClassName, ...rest }: Props) {
  const [current, setCurrent] = useState(src);
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn("img-fallback absolute inset-0 flex flex-col items-center justify-center gap-3 text-center", wrapperClassName)}
      >
        {fallbackLabel?.trim() !== "" && (
          <>
            <span className="font-display text-3xl tracking-[0.3em] text-gold/80">G</span>
            <span className="h-px w-10 bg-gold/40" />
            <span className="px-6 text-[10px] font-semibold uppercase tracking-luxe text-white/50">{fallbackLabel ?? "GENTORA"}</span>
          </>
        )}
      </div>
    );
  }

  return (
    <Image
      {...rest}
      src={current}
      alt={alt}
      onLoad={() => setLoaded(true)}
      onError={() => {
        if (fallbackSrc && current !== fallbackSrc) setCurrent(fallbackSrc);
        else setFailed(true);
      }}
      className={cn("transition-opacity duration-700 ease-luxe", loaded ? "opacity-100" : "opacity-0", className)}
    />
  );
}
