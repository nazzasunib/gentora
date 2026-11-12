import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import SmartImage from "@/components/ui/SmartImage";
import Reveal from "@/components/ui/Reveal";
import BrandValues from "@/components/home/BrandValues";
import { IMG } from "@/data/images";

export const metadata: Metadata = {
  title: "About GENTORA",
  description: "GENTORA is a premium men's fashion and lifestyle brand for the modern professional — tailored shirts, trousers and refined accessories.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader eyebrow="Our Story" title="Made for the modern professional" crumbs={[{ label: "About" }]} />
      <section className="bg-ink py-24 lg:py-32">
        <div className="container-site grid items-center gap-16 lg:grid-cols-2">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden bg-surface">
              <SmartImage src={IMG.about} fallbackSrc={IMG.lookbook} alt="Portrait of a professional man in a tailored look" fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" fallbackLabel="GENTORA" />
            </div>
          </Reveal>
          <div className="space-y-6 text-[17px] leading-[1.85] text-white/70">
            <Reveal><p className="font-display text-3xl leading-snug text-white">GENTORA began with a simple belief: dressing well is a form of respect — for the work, for the people across the table, and for yourself.</p></Reveal>
            <Reveal delay={0.1}><p>We focus on five essentials every professional reaches for: the formal shirt, the tailored trouser, the leather belt, the wristwatch and the office bag. Fewer pieces, chosen with more care.</p></Reveal>
            <Reveal delay={0.2}><p>Every item is selected for fabric, fit and finishing — so you can stop thinking about what to wear and start focusing on what you do.</p></Reveal>
            <Reveal delay={0.3}><Link href="/shop" className="btn-gold mt-4">Explore the Collection</Link></Reveal>
          </div>
        </div>
      </section>
      <BrandValues />
    </>
  );
}
