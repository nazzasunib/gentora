import type { Metadata } from "next";
import StudioRender from "./StudioRender";

export const metadata: Metadata = { title: "Studio renderer", robots: { index: false, follow: false } };

/** Internal tool: renders a single model for still-image generation (scripts/render-stills.mjs). */
export default async function StudioPage({ searchParams }: { searchParams: Promise<{ model?: string; variant?: string }> }) {
  const sp = await searchParams;
  return <StudioRender model={sp.model ?? "watch"} variant={sp.variant} />;
}
