import type { Product } from "@prisma/client";
import ProductDetail from "@/components/ProductDetail";
import { getSiteUrl } from "@/lib/site-url";
import {
  getGalleryImages,
  getPrimaryImageUrl,
  parseColorImages,
  parseColors,
  parseImageUrls,
} from "@/lib/product-images";
import { getProductPath } from "@/lib/product-routing";

export function getProductMetaDescription(product: Pick<Product, "name" | "description">): string {
  if (/hair growth accelerator/i.test(product.name)) {
    return "Shop Ensie Hair Growth Accelerator with Lustriva, a mixed-berry dietary supplement with biotin, vitamin C, vitamin E, and Lustriva for healthy-looking hair support.";
  }

  const plain = product.description.replace(/\s+/g, " ").trim();
  return plain.length > 158 ? `${plain.slice(0, 155).trim()}...` : plain;
}

export function getAbsoluteUrl(pathOrUrl: string): string {
  if (!pathOrUrl) return getSiteUrl();
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${getSiteUrl()}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

export function getProductSeoImage(product: Pick<Product, "imageUrls" | "colorImages">): string {
  return getAbsoluteUrl(getPrimaryImageUrl(product.imageUrls, product.colorImages));
}

export function getProductStructuredData(product: Product) {
  const url = `${getSiteUrl()}${getProductPath(product)}`;
  const images = getGalleryImages(
    parseImageUrls(product.imageUrls),
    parseColorImages(product.colorImages),
    parseColors(product.colors)
  ).map(getAbsoluteUrl);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: getProductMetaDescription(product),
    image: images.length ? images : [getProductSeoImage(product)],
    brand: {
      "@type": "Brand",
      name: "Ensie",
    },
    sku: product.id,
    offers: {
      "@type": "Offer",
      price: product.price.toFixed(2),
      priceCurrency: "USD",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url,
    },
  };
}

export function renderProductPage(product: Product) {
  const sizes = product.sizes
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const colors = parseColors(product.colors);
  const colorImages = parseColorImages(product.colorImages);
  const images = parseImageUrls(product.imageUrls);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getProductStructuredData(product)).replace(/</g, "\\u003c"),
        }}
      />
      <ProductDetail
        product={{
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          sizes: product.sizes,
          inStock: product.inStock,
          imageUrls: product.imageUrls,
          colorImages: product.colorImages,
        }}
        images={images}
        colors={colors}
        colorImages={colorImages}
        sizes={sizes}
      />
    </>
  );
}
