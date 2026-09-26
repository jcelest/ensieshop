import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";
import { productListOrderBy } from "@/lib/product-order";

export const dynamic = "force-dynamic";

async function getFeaturedProducts() {
  try {
    return await prisma.product.findMany({
      where: { featured: true },
      take: 3,
      orderBy: productListOrderBy,
    });
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const featured = await getFeaturedProducts();

  return (
    <>
      <section className="relative isolate min-h-[86dvh] overflow-hidden bg-[#edf7f4]">
        <Image
          src="/images/organizer-hero.png"
          alt="Compact organizer product arranged on a bright desk"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/72 to-white/10" />

        <div className="relative z-10 mx-auto flex min-h-[86dvh] max-w-7xl items-center px-4 py-16 sm:px-6 lg:py-20">
          <div className="max-w-xl">
            <div className="mb-5 flex flex-wrap gap-2 text-xs font-semibold text-[var(--color-de-primary)]">
              <span className="rounded-full bg-white/85 px-3 py-2 shadow-sm">Ships from US partners</span>
              <span className="rounded-full bg-white/85 px-3 py-2 shadow-sm">30 day returns</span>
            </div>

            <h1 className="mb-5 text-4xl font-semibold leading-tight text-[var(--color-de-ink)] sm:text-5xl lg:text-6xl">
              Everyday products that clean up the little hassles.
            </h1>

            <p className="mb-8 max-w-lg text-base leading-7 text-[var(--color-de-muted)] sm:text-lg">
              Launch-ready dropshipping storefront for practical finds, built around a polished hero product, smooth checkout, and a complete admin portal.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/shop"
                className="rounded-full bg-[var(--color-de-primary)] px-7 py-3 text-center text-sm font-semibold text-white shadow-[0_18px_40px_rgba(var(--color-de-primary-rgb),0.28)] transition hover:bg-[#0a746b]"
              >
                Shop Product
              </Link>
              <Link
                href="/shop"
                className="rounded-full border border-[var(--color-de-primary)]/30 bg-white/80 px-7 py-3 text-center text-sm font-semibold text-[var(--color-de-ink)] transition hover:border-[var(--color-de-primary)] hover:bg-white"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-14 sm:px-6 sm:py-18">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
          {[
            ["Curated For Utility", "Practical products with clear benefits, clean photography, and variant support."],
            ["Checkout Ready", "Cart, shipping rates, Stripe checkout, order confirmation, and fulfillment status are included."],
            ["Admin Operated", "Manage listings, product images, sort order, shipping settings, and orders from the portal."],
          ].map(([title, copy]) => (
            <div key={title} className="rounded-lg border border-[#dce9e5] bg-[#f7fbfa] p-6">
              <h2 className="mb-3 text-lg font-semibold text-[var(--color-de-ink)]">{title}</h2>
              <p className="text-sm leading-6 text-[var(--color-de-muted)]">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="bg-[#f7fbfa] px-4 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="mb-2 text-sm font-semibold text-[var(--color-de-primary)]">
                  Featured Find
                </p>
                <h2 className="text-2xl font-semibold text-[var(--color-de-ink)]">
                  Built for everyday use
                </h2>
              </div>
              <Link
                href="/shop"
                className="text-sm font-semibold text-[var(--color-de-primary)] transition-colors hover:text-[var(--color-de-ink)]"
              >
                View all
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
