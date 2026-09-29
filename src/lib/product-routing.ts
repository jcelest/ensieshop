import type { Product } from "@prisma/client";

export function slugifyProductName(name: string): string {
  const normalized = name
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((part) => part && part !== "ensie" && part !== "with")
    .join("-");

  return normalized.replace(/-+/g, "-").replace(/^-|-$/g, "") || "product";
}

export function getProductPath(product: Pick<Product, "name">): string {
  return `/products/${slugifyProductName(product.name)}`;
}

export function productMatchesSlug(product: Pick<Product, "name">, slug: string): boolean {
  return slugifyProductName(product.name) === slug;
}
