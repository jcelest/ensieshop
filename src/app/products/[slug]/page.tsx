import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  getProductMetaDescription,
  getProductSeoImage,
  renderProductPage,
} from "@/lib/product-page";
import { getProductPath, productMatchesSlug } from "@/lib/product-routing";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

async function getProductBySlug(slug: string) {
  try {
    const products = await prisma.product.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });

    return products.find((product) => productMatchesSlug(product, slug)) || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | EnsieShop",
      robots: { index: false, follow: false },
    };
  }

  const url = `${getSiteUrl()}${getProductPath(product)}`;
  const title = /hair growth accelerator/i.test(product.name)
    ? "Ensie Hair Growth Accelerator with Lustriva | Hair Support Supplement"
    : `${product.name} | EnsieShop`;
  const description = getProductMetaDescription(product);
  const image = getProductSeoImage(product);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: [{ url: image, alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function ProductSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const canonicalPath = getProductPath(product);
  if (`/products/${slug}` !== canonicalPath) {
    permanentRedirect(canonicalPath);
  }

  return renderProductPage(product);
}
