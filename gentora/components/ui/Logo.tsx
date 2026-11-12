import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Logo({ className, onClick }: { className?: string; onClick?: () => void }) {
  return (
    <Link href="/" onClick={onClick} aria-label="GENTORA — home" className={cn("group inline-flex flex-col items-start leading-none", className)}>
      <span className="font-display text-[19px] tracking-[0.28em] sm:text-[26px] sm:tracking-[0.34em] font-medium text-white transition-colors duration-500 group-hover:text-gold">
        GENTORA
      </span>
      <span className="mt-1 block h-px w-full origin-left scale-x-[0.25] bg-gold transition-transform duration-700 ease-luxe group-hover:scale-x-100" />
    </Link>
  );
}
