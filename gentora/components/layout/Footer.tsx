import Link from "next/link";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { SITE } from "@/lib/utils";

const cols = [
  {
    title: "Quick Links",
    links: [
      ["Home", "/"], ["Shop", "/shop"], ["About", "/about"], ["Contact", "/help/contact"], ["Privacy Policy", "/help/privacy"], ["Terms & Conditions", "/help/terms"],
    ],
  },
  {
    title: "Categories",
    links: [
      ["Formal Shirts", "/shop?category=shirts"], ["Formal Pants", "/shop?category=pants"], ["Leather Belts", "/shop?category=belts"], ["Wrist Watches", "/shop?category=watches"], ["Office Bags", "/shop?category=bags"],
    ],
  },
  {
    title: "Customer Support",
    links: [
      ["Contact Us", "/help/contact"], ["Shipping Information", "/help/shipping"], ["Return Policy", "/help/returns"], ["FAQs", "/help/faq"],
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-ink pt-20">
      <div className="container-site grid gap-14 pb-16 lg:grid-cols-[1.3fr_2fr]">
        <div>
          <p className="font-display text-4xl tracking-[0.3em]">GENTORA</p>
          <p className="mt-4 font-display text-xl italic text-gold">{SITE.tagline}</p>
          <ul className="mt-8 space-y-3 text-sm text-muted">
            <li className="flex items-center gap-3"><Mail size={15} className="text-gold" /> {SITE.contact.email}</li>
            <li className="flex items-center gap-3"><Phone size={15} className="text-gold" /> {SITE.contact.phone}</li>
            <li className="flex items-center gap-3"><MapPin size={15} className="text-gold" /> {SITE.contact.address}</li>
          </ul>
          <p className="mt-3 text-[11px] text-white/35">Demo contact details — edit in lib/utils.ts</p>
          <div className="mt-8 flex gap-3">
            {[
              { Icon: Facebook, label: "Facebook", href: "https://www.facebook.com/" },
              { Icon: Instagram, label: "Instagram", href: "https://www.instagram.com/" },
              { Icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/" },
            ].map(({ Icon, label, href }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={`GENTORA on ${label} (opens in new tab)`} className="flex h-11 w-11 items-center justify-center border border-white/15 text-white/70 transition-colors hover:border-gold hover:text-gold">
                <Icon size={17} strokeWidth={1.5} />
              </a>
            ))}
          </div>
        </div>
        <div className="grid gap-10 sm:grid-cols-3">
          {cols.map((c) => (
            <nav key={c.title} aria-label={c.title}>
              <h3 className="eyebrow mb-6">{c.title}</h3>
              <ul className="space-y-3.5">
                {c.links.map(([label, href]) => (
                  <li key={label}><Link href={href} className="link-underline text-sm text-white/70 hover:text-white">{label}</Link></li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>
      <div className="pointer-events-none select-none overflow-hidden" aria-hidden>
        <p className="whitespace-nowrap text-center font-display text-[22vw] font-light leading-[0.8] tracking-[0.08em] text-white/[0.035]">GENTORA</p>
      </div>
      <div className="border-t border-line">
        <div className="container-site flex flex-col items-center justify-between gap-3 py-6 text-xs text-muted sm:flex-row">
          <p>© 2026 GENTORA. All Rights Reserved.</p>
          <p>Demo storefront · Prices in BDT (৳) · No real payments are processed</p>
        </div>
      </div>
    </footer>
  );
}
