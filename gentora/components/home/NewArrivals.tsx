import Link from "next/link";
import ProductCard from "@/components/products/ProductCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { newArrivals } from "@/data/products";

export default function NewArrivals() {
  return (
    <section className="bg-ink py-28 lg:py-36" aria-label="New arrivals">
      <div className="container-site">
        <SectionHeading eyebrow="New Arrivals" title="Fresh from the atelier" intro="New-season essentials, cut sharper and finished better." action={<Link href="/shop?filter=new" className="btn-ghost">Shop New In</Link>} />
        <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
          {newArrivals.slice(0, 8).map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
