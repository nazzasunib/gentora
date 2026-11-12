import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-screen items-center bg-ink pt-24">
      <div className="container-site text-center">
        <p className="eyebrow">Error 404</p>
        <h1 className="h-display mt-6 text-6xl sm:text-8xl">Page not found</h1>
        <p className="mx-auto mt-6 max-w-md text-muted">The page you are looking for has moved or no longer exists.</p>
        <div className="mt-10 flex justify-center gap-3"><Link href="/" className="btn-gold">Back to Home</Link><Link href="/shop" className="btn-ghost">Shop</Link></div>
      </div>
    </section>
  );
}
