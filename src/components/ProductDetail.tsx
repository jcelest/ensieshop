"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import ProductGallery from "@/components/ProductGallery";
import { useCart } from "@/context/CartContext";
import {
  getCoverImage,
  getGalleryColorCount,
  getGalleryImages,
  getShopCoverImage,
} from "@/lib/product-images";

interface ProductDetailProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    sizes: string;
    inStock: boolean;
    imageUrls: string;
    colorImages: string;
  };
  images: string[];
  colors: string[];
  colorImages: Record<string, string>;
  sizes: string[];
}

export default function ProductDetail({
  product,
  images,
  colors,
  colorImages,
  sizes,
}: ProductDetailProps) {
  const { addItem, getQuantity } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(colors[0] || null);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");
  const addedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasOptions = sizes.length > 0;

  const galleryImages = useMemo(
    () => getGalleryImages(images, colorImages, colors),
    [images, colorImages, colors]
  );

  const colorThumbCount = useMemo(
    () => getGalleryColorCount(colors, colorImages),
    [colors, colorImages]
  );

  const warmCache = useMemo(
    () => [...new Set([...images, ...galleryImages, ...Object.values(colorImages)])],
    [images, galleryImages, colorImages]
  );

  const activeImage =
    getCoverImage(images, colorImages, selectedColor) ||
    getShopCoverImage(product.imageUrls, product.colorImages);

  const selectedOption = hasOptions ? selectedSize : "";
  const inCartQty =
    !hasOptions || selectedSize
      ? getQuantity(product.id, selectedOption || "", selectedColor || "")
      : 0;

  useEffect(() => {
    setQuantity(1);
  }, [selectedSize, selectedColor]);

  useEffect(() => {
    return () => {
      if (addedTimer.current) clearTimeout(addedTimer.current);
    };
  }, []);

  useEffect(() => {
    if (colors.length > 0 && selectedColor) {
      const index = colors.indexOf(selectedColor);
      if (index >= 0 && index < colorThumbCount) setGalleryIndex(index);
      return;
    }

    setGalleryIndex(0);
  }, [selectedColor, colors, colorThumbCount]);

  const handleGalleryIndexChange = (index: number) => {
    setGalleryIndex(index);
    if (index < colorThumbCount && colors[index]) {
      setSelectedColor(colors[index]);
      setError("");
    }
  };

  const handleAddToCart = () => {
    if (!product.inStock) return;

    if (colors.length > 0 && !selectedColor) {
      setError("Select a finish before adding to cart");
      return;
    }

    if (hasOptions && !selectedSize) {
      setError("Select an option before adding to cart");
      return;
    }

    if (quantity < 1) {
      setError("Quantity must be at least 1");
      return;
    }

    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      size: selectedOption || "",
      color: selectedColor || "",
      imageUrl: activeImage,
      quantity,
    });

    setError("");
    setAdded(true);
    if (addedTimer.current) clearTimeout(addedTimer.current);
    addedTimer.current = setTimeout(() => setAdded(false), 7000);
  };

  return (
    <div className="min-h-screen bg-[#f7fbfa] px-4 py-10 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/shop"
          className="listing-fade-item mb-8 inline-block text-sm font-semibold text-[var(--color-de-muted)] transition-colors hover:text-[var(--color-de-primary)]"
          style={{ animationDelay: "0ms" }}
        >
          Back to shop
        </Link>

        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          <div className="listing-fade-item" style={{ animationDelay: "80ms" }}>
            <ProductGallery
              images={galleryImages}
              warmCache={warmCache}
              activeIndex={galleryIndex}
              onActiveIndexChange={handleGalleryIndexChange}
              name={product.name}
            />
          </div>

          <div className="flex flex-col justify-center">
            <p
              className="listing-fade-item mb-2 text-xs font-semibold text-[var(--color-de-primary)] uppercase"
              style={{ animationDelay: "160ms" }}
            >
              {product.category}
            </p>

            <h1
              className="listing-fade-item mb-4 text-2xl font-semibold text-[var(--color-de-ink)] sm:text-3xl md:text-4xl"
              style={{ animationDelay: "240ms" }}
            >
              {product.name}
            </h1>

            <p
              className="listing-fade-item mb-6 text-2xl font-semibold text-[var(--color-de-ink)]"
              style={{ animationDelay: "320ms" }}
            >
              ${product.price.toFixed(2)}
            </p>

            <p
              className="listing-fade-item mb-8 whitespace-pre-line leading-relaxed text-[var(--color-de-muted)]"
              style={{ animationDelay: "400ms" }}
            >
              {product.description}
            </p>

            {colors.length > 0 && (
              <div className="listing-fade-item mb-6" style={{ animationDelay: "440ms" }}>
                <p className="mb-3 text-xs font-semibold text-[var(--color-de-muted)]">FINISH</p>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => {
                        setSelectedColor(color);
                        setError("");
                      }}
                      className={`listing-visual-glow touch-target rounded-full border px-4 py-2.5 text-sm transition-colors ${
                        selectedColor === color
                          ? "border-[var(--color-de-primary)] bg-[var(--color-de-primary)]/10 text-[var(--color-de-ink)]"
                          : "border-[#dce9e5] bg-white text-[var(--color-de-muted)]"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {hasOptions && (
            <div className="listing-fade-item mb-6" style={{ animationDelay: "480ms" }}>
              <p className="mb-3 text-xs font-semibold text-[var(--color-de-muted)]">OPTION</p>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => {
                  const sizeInCart = getQuantity(product.id, size, selectedColor || "");

                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => {
                        setSelectedSize(size);
                        setError("");
                      }}
                      className={`listing-visual-glow touch-target rounded-full border px-4 py-2.5 text-sm transition-colors ${
                        selectedSize === size
                          ? "border-[var(--color-de-primary)] bg-[var(--color-de-primary)]/10 text-[var(--color-de-ink)]"
                          : "border-[#dce9e5] bg-white text-[var(--color-de-muted)]"
                      }`}
                    >
                      {size}
                      {sizeInCart > 0 && (
                        <span className="mt-1 block text-[10px] text-[var(--color-de-primary)] sm:ml-2 sm:mt-0 sm:inline">
                          ({sizeInCart} in cart)
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
            )}

            <div className="listing-fade-item mb-8" style={{ animationDelay: "520ms" }}>
              <p className="mb-3 text-xs font-semibold text-[var(--color-de-muted)]">QUANTITY</p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="touch-target h-11 w-11 rounded-full border border-[#dce9e5] bg-white text-[var(--color-de-muted)] transition-colors hover:border-[var(--color-de-primary)] hover:text-[var(--color-de-ink)]"
                >
                  -
                </button>
                <span className="w-10 text-center text-lg font-semibold text-[var(--color-de-ink)]">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                  className="touch-target h-11 w-11 rounded-full border border-[#dce9e5] bg-white text-[var(--color-de-muted)] transition-colors hover:border-[var(--color-de-primary)] hover:text-[var(--color-de-ink)]"
                >
                  +
                </button>
              </div>
              {(!hasOptions || selectedSize) && inCartQty > 0 && (
                <p className="mt-2 text-xs text-[var(--color-de-muted)]">
                  {selectedColor ? `${selectedColor} / ` : ""}
                  {hasOptions ? `${selectedSize} already has` : "This item already has"} {inCartQty} in your cart
                </p>
              )}
            </div>

            {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
            {added && (
              <p className="mb-4 text-sm text-[var(--color-de-primary)]">
                Added {quantity} to cart.
              </p>
            )}

            {added ? (
              <Link
                href="/cart"
                className="listing-fade-item add-to-cart-btn block w-full rounded-full border border-[var(--color-de-primary)] bg-[var(--color-de-primary)] py-4 text-center text-sm font-semibold text-white shadow-[0_14px_32px_rgba(15,143,131,0.22)] transition-transform hover:-translate-y-0.5"
                style={{ animationDelay: "600ms" }}
              >
                VIEW CART
              </Link>
            ) : (
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="listing-fade-item add-to-cart-btn w-full rounded-full border py-4 text-sm font-semibold text-[var(--color-de-ink)] disabled:cursor-not-allowed disabled:opacity-40"
                style={{ animationDelay: "600ms" }}
              >
                {product.inStock ? "ADD TO CART" : "SOLD OUT"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
