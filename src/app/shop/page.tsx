import type { Metadata } from "next";
import CampaignBanner from "@/components/CampaignBanner";
import ProductCard from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";
import { productListOrderBy } from "@/lib/product-order";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

const shopUrl = `${getSiteUrl()}/shop`;
const shopDescription =
  "Shop EnsieShop for the Ensie Hair Growth Accelerator with Lustriva, a mixed-berry hair support supplement for a simple daily routine.";

export const metadata: Metadata = {
  title: "Shop Ensie Hair Growth Accelerator | EnsieShop",
  description: shopDescription,
  alternates: { canonical: shopUrl },
  openGraph: {
    title: "Shop Ensie Hair Growth Accelerator | EnsieShop",
    description: shopDescription,
    url: shopUrl,
    type: "website",
    images: [
      {
        url: `${getSiteUrl()}/images/ensie-hair-growth-hero.png`,
        alt: "Ensie Hair Growth Accelerator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shop Ensie Hair Growth Accelerator | EnsieShop",
    description: shopDescription,
    images: [`${getSiteUrl()}/images/ensie-hair-growth-hero.png`],
  },
};

async function getProducts() {
  try {
    return await prisma.product.findMany({
      orderBy: productListOrderBy,
    });
  } catch {
    return [];
  }
}

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f7fbfa]">
      <div>
        <CampaignBanner
          src="/images/ensie-hair-growth-hero.png"
          alt="Ensie Hair Growth Accelerator with Lustriva"
          width={1120}
          height={1429}
        >
          <h1 className="text-3xl font-semibold text-white sm:text-4xl md:text-5xl">
            Shop
          </h1>
        </CampaignBanner>

        <div className="px-4 py-10 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 max-w-2xl">
              <p className="text-sm leading-6 text-[var(--color-de-muted)]">
                EnsieShop keeps the storefront simple with a focused selection of hair support
                products, including Ensie Hair Growth Accelerator with Lustriva.
              </p>
            </div>

            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <p className="mb-4 text-lg font-semibold text-[var(--color-de-muted)]">
                  NO LISTINGS YET
                </p>
                <p className="text-sm text-[var(--color-de-muted)]">
                  Check back soon for new product finds.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
