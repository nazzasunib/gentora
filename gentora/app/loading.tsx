export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink" role="status" aria-label="Loading">
      <div className="text-center">
        <p className="font-display text-2xl tracking-[0.38em] text-white/80">GENTORA</p>
        <span className="mx-auto mt-4 block h-px w-24 animate-shimmer bg-[linear-gradient(90deg,transparent,#C6A46A,transparent)] bg-[length:200%_100%]" />
      </div>
    </div>
  );
}
