import type { MetadataRoute } from "next";
import { getPublishedLearnPages } from "@/lib/learn-pages";
import { prisma } from "@/lib/prisma";
import { getProductPath } from "@/lib/product-routing";
import { getSiteUrl } from "@/lib/site-url";

const baseUrl = getSiteUrl();

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/returns`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  let productPages: MetadataRoute.Sitemap = [];

  try {
    const products = await prisma.product.findMany({
      select: { name: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    });

    productPages = products.map((product) => ({
      url: `${baseUrl}${getProductPath(product)}`,
      lastModified: product.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {
    // Database may be unavailable during build; static routes still publish.
  }

  const learnPages = getPublishedLearnPages().map((page) => ({
    url: `${baseUrl}/learn/${page.slug}`,
    lastModified: page.updatedAt ? new Date(page.updatedAt) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticPages, ...productPages, ...learnPages];
}
