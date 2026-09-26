"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { useCart } from "@/context/CartContext";
import { groupCartByProduct } from "@/lib/cart";

export default function CartPageContent() {
  const { items, itemCount, total, updateQuantity, removeItem, clearCart } = useCart();

  const groupedItems = useMemo(() => groupCartByProduct(items), [items]);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#f7fbfa]">
        <div className="mx-auto flex min-h-[calc(100dvh-65px)] max-w-3xl flex-col items-center justify-center px-4 py-12 text-center sm:px-6">
          <p className="mb-4 text-xs font-semibold uppercase text-[var(--color-de-primary)]">
            Cart
          </p>
          <h1 className="mb-4 text-3xl font-semibold text-[var(--color-de-ink)] sm:text-5xl">
            Your cart is empty
          </h1>
          <p className="mb-8 max-w-md text-sm leading-6 text-[var(--color-de-muted)]">
            Add your favorite hair care picks from the shop to get started.
          </p>
          <Link
            href="/shop"
            className="w-full max-w-xs bg-[var(--color-de-primary)] px-8 py-3.5 text-sm font-semibold uppercase text-white transition hover:bg-[var(--color-de-accent-dark)] sm:w-auto"
          >
            Browse Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7fbfa] px-4 py-10 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase text-[var(--color-de-primary)]">
              Review
            </p>
            <h1 className="text-3xl font-semibold text-[var(--color-de-ink)] sm:text-5xl">
              Cart
            </h1>
            <p className="mt-2 text-sm text-[var(--color-de-muted)]">
              {itemCount} piece{itemCount !== 1 ? "s" : ""} across {groupedItems.length} listing
              {groupedItems.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={clearCart}
            className="self-start text-xs font-semibold uppercase text-[var(--color-de-muted)] transition-colors hover:text-[#9a3f24] sm:self-auto"
          >
            Clear Cart
          </button>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {groupedItems.map((group) => {
            const groupTotal = group.lines.reduce(
              (sum, line) => sum + line.price * line.quantity,
              0
            );

            return (
              <div key={group.productId} className="border border-[#dce9e5] bg-white shadow-sm">
                <div className="flex flex-col gap-4 border-b border-[#dce9e5] p-4 sm:flex-row sm:items-center">
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden border border-[#dce9e5] bg-[#f7fbfa] sm:h-20 sm:w-20">
                      <Image
                        src={group.imageUrl}
                        alt={group.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/shop/${group.productId}`}
                        className="block font-semibold text-[var(--color-de-ink)] transition-colors hover:text-[var(--color-de-primary)]"
                      >
                        {group.name}
                      </Link>
                      <p className="text-sm text-[var(--color-de-muted)]">
                        ${group.price.toFixed(2)} each
                      </p>
                    </div>
                  </div>

                  <p className="text-sm font-semibold text-[var(--color-de-ink)] sm:ml-auto">
                    ${groupTotal.toFixed(2)}
                  </p>
                </div>

                <div className="divide-y divide-[#dce9e5]">
                  {group.lines.map((item) => (
                    <div
                      key={item.lineId}
                      className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:gap-4"
                    >
                      <p className="text-sm text-[var(--color-de-muted)]">
                        {item.color ? `${item.color} / ` : ""}Option {item.size}
                      </p>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.lineId, item.quantity - 1)}
                          className="touch-target h-11 w-11 border border-[#dce9e5] bg-[#f7fbfa] text-[var(--color-de-muted)] transition-colors hover:border-[var(--color-de-primary)] hover:text-[var(--color-de-primary)]"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-sm font-semibold text-[var(--color-de-ink)]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.lineId, item.quantity + 1)}
                          className="touch-target h-11 w-11 border border-[#dce9e5] bg-[#f7fbfa] text-[var(--color-de-muted)] transition-colors hover:border-[var(--color-de-primary)] hover:text-[var(--color-de-primary)]"
                        >
                          +
                        </button>
                      </div>

                      <p className="text-sm font-medium text-[var(--color-de-muted)] sm:ml-auto">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>

                      <button
                        type="button"
                        onClick={() => removeItem(item.lineId)}
                        className="self-start text-xs font-semibold uppercase text-[var(--color-de-muted)] transition-colors hover:text-[#9a3f24] sm:self-auto"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 border-t border-[#dce9e5] pt-6 sm:mt-10 sm:pt-8">
          <div className="mb-6 flex items-center justify-between">
            <span className="text-sm font-semibold uppercase text-[var(--color-de-muted)]">
              Subtotal
            </span>
            <span className="text-xl font-semibold text-[var(--color-de-ink)] sm:text-2xl">
              ${total.toFixed(2)}
            </span>
          </div>
          <Link
            href="/checkout"
            className="mb-4 block w-full bg-[var(--color-de-primary)] py-4 text-center text-sm font-semibold uppercase text-white transition hover:bg-[var(--color-de-accent-dark)]"
          >
            Checkout
          </Link>
          <Link
            href="/shop"
            className="block text-center text-sm font-semibold uppercase text-[var(--color-de-muted)] transition-colors hover:text-[var(--color-de-primary)]"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
