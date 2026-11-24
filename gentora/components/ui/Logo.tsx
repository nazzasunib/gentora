import Link from "next/link";
import { cn } from "@/lib/utils";

/** Vesture’s wordmark (public/brand/vestures-logo.png used as a mask → follows the text colour). */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("block aspect-[746/364] bg-current", className)}
      style={{
        WebkitMaskImage: "url(/brand/vestures-logo.png)",
        maskImage: "url(/brand/vestures-logo.png)",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "left center",
        maskPosition: "left center",
      }}
    />
  );
}

export default function Logo({ className, onClick }: { className?: string; onClick?: () => void }) {
  return (
    <Link href="/" onClick={onClick} aria-label="Vesture’s — home" className={cn("group inline-flex items-center leading-none text-white transition-colors duration-500 hover:text-gold", className)}>
      <LogoMark className="h-9 sm:h-11 lg:h-12" />
    </Link>
  );
}
