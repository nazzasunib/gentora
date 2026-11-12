import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { RevealText } from "./Reveal";

export default function PageHeader({ eyebrow, title, intro, crumbs = [] }: { eyebrow?: string; title: string; intro?: string; crumbs?: { label: string; href?: string }[] }) {
  return (
    <header className="relative overflow-hidden border-b border-line bg-ink pb-14 pt-36 lg:pb-20 lg:pt-44">
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(50% 80% at 85% 0%, rgba(198,164,106,0.12), transparent 70%)" }} />
      <div className="container-site relative">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-wide2 text-muted">
            <li><Link href="/" className="hover:text-gold">Home</Link></li>
            {crumbs.map((c) => (
              <li key={c.label} className="flex items-center gap-2">
                <ChevronRight size={12} />
                {c.href ? <Link href={c.href} className="hover:text-gold">{c.label}</Link> : <span className="text-white/80" aria-current="page">{c.label}</span>}
              </li>
            ))}
          </ol>
        </nav>
        {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
        <h1 className="h-display text-5xl sm:text-7xl lg:text-8xl"><RevealText text={title} /></h1>
        {intro && <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-muted">{intro}</p>}
      </div>
    </header>
  );
}
