"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { cartTotals, useShop } from "@/lib/store";
import { useHydrated } from "@/hooks/useHydrated";
import { cn } from "@/lib/utils";

export const NAV = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Shirts", href: "/shop?category=shirts" },
  { label: "Pants", href: "/shop?category=pants" },
  { label: "Accessories", href: "/shop?group=accessories" },
  { label: "About", href: "/about" },
];

function NavLinks({ onNavigate, mobile }: { onNavigate?: () => void; mobile?: boolean }) {
  const pathname = usePathname();
  const params = useSearchParams();
  const isActive = (href: string) => {
    const [path, q] = href.split("?");
    if (path !== pathname) return false;
    if (!q) return pathname !== "/shop" || (!params.get("category") && !params.get("group"));
    const [k, v] = q.split("=");
    return params.get(k) === v;
  };
  return (
    <>
      {NAV.map((n, i) =>
        mobile ? (
          <motion.li key={n.href} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.06, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
            <Link href={n.href} onClick={onNavigate} className={cn("block py-2 font-display text-4xl font-light", isActive(n.href) ? "text-gold" : "text-white")}>
              {n.label}
            </Link>
          </motion.li>
        ) : (
          <li key={n.href}>
            <Link
              href={n.href}
              aria-current={isActive(n.href) ? "page" : undefined}
              className={cn("link-underline text-[11px] font-semibold uppercase tracking-wide2 transition-colors hover:text-gold", isActive(n.href) ? "text-gold" : "text-white/85")}
            >
              {n.label}
            </Link>
          </li>
        )
      )}
    </>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const overHero = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const hydrated = useHydrated();
  const { cart, wishlist, setCartOpen, setSearchOpen, cartPulse } = useShop();
  const count = hydrated ? cartTotals(cart).count : 0;
  const wishCount = hydrated ? wishlist.length : 0;

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > 400 && y > last + 4);
      if (y < last - 4) setHidden(false);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  const solid = scrolled || !overHero || menuOpen;

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-gold focus:px-4 focus:py-2 focus:text-ink">
        Skip to content
      </a>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-700 ease-luxe",
          solid ? "border-b border-line bg-ink/90 backdrop-blur-xl" : "border-b border-transparent bg-gradient-to-b from-black/50 to-transparent",
          hidden && !menuOpen ? "-translate-y-full" : "translate-y-0"
        )}
      >
        <nav className={cn("container-site flex items-center justify-between gap-2 lg:grid lg:grid-cols-[1fr_auto_1fr] transition-all duration-700 ease-luxe", solid ? "h-[72px]" : "h-[88px]")} aria-label="Main">
          <div className="flex items-center gap-3">
            <button className="-ml-2 p-2 lg:hidden" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen((v) => !v)}>
              {menuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
            </button>
            <Logo className="hidden lg:inline-flex" />
          </div>

          <ul className="hidden items-center gap-9 lg:flex">
            <Suspense fallback={null}>
              <NavLinks />
            </Suspense>
          </ul>
          <Logo className="lg:hidden" />

          <div className="flex items-center justify-end gap-0.5 sm:gap-1.5">
            <IconBtn label="Search" onClick={() => setSearchOpen(true)}>
              <Search size={19} strokeWidth={1.5} />
            </IconBtn>
            <IconBtn label="Account" href="/account" className="hidden sm:inline-flex">
              <User size={19} strokeWidth={1.5} />
            </IconBtn>
            <IconBtn label={`Wishlist, ${wishCount} items`} href="/wishlist" badge={wishCount}>
              <Heart size={19} strokeWidth={1.5} />
            </IconBtn>
            <IconBtn label={`Cart, ${count} items`} onClick={() => setCartOpen(true)} badge={count} pulseKey={cartPulse}>
              <ShoppingBag size={19} strokeWidth={1.5} />
            </IconBtn>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col bg-ink pt-[96px] lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <ul className="container-site flex flex-col gap-1">
              <Suspense fallback={null}>
                <NavLinks mobile onNavigate={() => setMenuOpen(false)} />
              </Suspense>
            </ul>
            <div className="container-site mt-auto flex items-center justify-between border-t border-line py-8 text-[11px] uppercase tracking-wide2 text-muted">
              <Link href="/account" onClick={() => setMenuOpen(false)} className="hover:text-gold">Account</Link>
              <Link href="/wishlist" onClick={() => setMenuOpen(false)} className="hover:text-gold">Wishlist</Link>
              <Link href="/help/contact" onClick={() => setMenuOpen(false)} className="hover:text-gold">Contact</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function IconBtn({
  children,
  label,
  onClick,
  href,
  badge,
  className,
  pulseKey,
}: {
  children: React.ReactNode;
  label: string;
  onClick?: () => void;
  href?: string;
  badge?: number;
  className?: string;
  pulseKey?: number;
}) {
  const inner = (
    <>
      {children}
      <AnimatePresence>
        {!!badge && (
          <motion.span
            key={pulseKey ?? badge}
            initial={{ scale: 0.4 }}
            animate={{ scale: [1.5, 1] }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.45 }}
            className="absolute -right-0.5 -top-0.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-ink"
          >
            {badge}
          </motion.span>
        )}
      </AnimatePresence>
    </>
  );
  const cls = cn("relative inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center text-white/90 transition-colors hover:text-gold focus-visible:outline focus-visible:outline-1 focus-visible:outline-gold", className);
  return href ? (
    <Link href={href} aria-label={label} className={cls}>
      {inner}
    </Link>
  ) : (
    <button type="button" aria-label={label} onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}
