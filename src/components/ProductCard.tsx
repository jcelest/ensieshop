"use client";

import Link from "next/link";
import Image from "next/image";
import { getCurrentTheme } from "@/lib/theme";
import { shouldUseNativeImage } from "@/lib/image-display";
import { getShopCoverImage } from "@/lib/product-images";
import { getProductPath } from "@/lib/product-routing";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrls: string;
  colorImages?: string;
  inStock: boolean;
}

export default function ProductCard({ product }: { product: Product }) {
  const coverImage = getShopCoverImage(product.imageUrls, product.colorImages);

  return (
    <Link
      href={getProductPath(product)}
      className="group relative overflow-hidden rounded-lg border border-[#dce9e5] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-de-primary)]/40 hover:shadow-[0_22px_50px_rgba(23,53,51,0.12)]"
    >
      <div className="relative aspect-square overflow-hidden bg-[#eef5f2]">
        {shouldUseNativeImage(coverImage) ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverImage}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = getCurrentTheme().logo;
            }}
          />
        ) : (
          <Image
            src={coverImage}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = getCurrentTheme().logo;
            }}
          />
        )}
        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <span className="text-sm tracking-widest text-white/80">SOLD OUT</span>
          </div>
        )}
      </div>
      <div className="p-4 sm:p-5">
        <p className="mb-1 text-xs font-semibold text-[var(--color-de-primary)] uppercase">
          {product.category}
        </p>
        <h3 className="mb-2 text-base font-semibold leading-snug text-[var(--color-de-ink)] sm:text-lg">
          {product.name}
        </h3>
        <p className="text-sm text-[var(--color-de-muted)]">${product.price.toFixed(2)}</p>
      </div>
    </Link>
  );
}
