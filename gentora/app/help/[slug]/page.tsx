import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/components/ui/PageHeader";
import { HELP_PAGES } from "@/data/help";

export function generateStaticParams() {
  return Object.keys(HELP_PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = HELP_PAGES[slug];
  return p ? { title: p.title, description: p.intro } : { title: "Not found" };
}

export default async function HelpPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = HELP_PAGES[slug];
  if (!page) notFound();
  return (
    <>
      <PageHeader eyebrow="Customer Care" title={page.title} intro={page.intro} crumbs={[{ label: "Help" }, { label: page.title }]} />
      <section className="bg-ink pb-32 pt-16">
        <div className="container-site grid gap-16 lg:grid-cols-12">
          <nav aria-label="Help topics" className="lg:col-span-3">
            <ul className="space-y-3 lg:sticky lg:top-28">
              {Object.entries(HELP_PAGES).map(([k, v]) => (
                <li key={k}><Link href={`/help/${k}`} aria-current={k === slug ? "page" : undefined} className={k === slug ? "text-gold" : "text-white/60 hover:text-white"}>{v.title}</Link></li>
              ))}
            </ul>
          </nav>
          <div className="max-w-2xl space-y-12 lg:col-span-8 lg:col-start-5">
            {page.sections.map((s) => (
              <article key={s.h} id={s.id} className="scroll-mt-32 border-t border-line pt-8">
                <h2 className="font-display text-3xl">{s.h}</h2>
                <div className="mt-4 space-y-2 text-[15px] leading-relaxed text-white/70">{s.p.map((t) => <p key={t}>{t}</p>)}</div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
