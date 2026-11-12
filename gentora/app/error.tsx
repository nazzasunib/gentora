"use client";

import Link from "next/link";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="flex min-h-screen items-center bg-ink pt-24">
      <div className="container-site text-center">
        <p className="eyebrow">Something went wrong</p>
        <h1 className="h-display mt-6 text-5xl sm:text-7xl">A small wrinkle.</h1>
        <p className="mx-auto mt-6 max-w-md text-muted">We couldn&apos;t load this page. Please try again.</p>
        <div className="mt-10 flex justify-center gap-3"><button onClick={reset} className="btn-gold">Try again</button><Link href="/" className="btn-ghost">Home</Link></div>
      </div>
    </section>
  );
}
