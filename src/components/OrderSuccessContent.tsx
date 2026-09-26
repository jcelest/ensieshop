"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function OrderSuccessContent() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="flex min-h-[calc(100dvh-65px)] flex-col items-center justify-center bg-[#f7fbfa] px-4 py-12 text-center sm:px-6">
      <p className="mb-4 text-xs font-semibold uppercase text-[var(--color-de-primary)]">
        Payment Received
      </p>
      <h1 className="mb-4 text-3xl font-semibold text-[var(--color-de-ink)] sm:text-5xl">
        Order Confirmed
      </h1>
      <p className="mb-2 max-w-md text-sm leading-6 text-[var(--color-de-muted)]">
        Thank you for your order. You&apos;ll receive a confirmation email shortly.
      </p>
      <p className="mb-10 max-w-md text-xs leading-5 text-[var(--color-de-muted)]">
        Your cart has been cleared. If you don&apos;t see the email, check spam or contact support.
      </p>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Link
          href="/shop"
          className="bg-[var(--color-de-primary)] px-8 py-3 text-sm font-semibold uppercase text-white transition hover:bg-[var(--color-de-accent-dark)]"
        >
          Continue Shopping
        </Link>
        <Link
          href="/contact"
          className="border border-[#dce9e5] bg-white px-8 py-3 text-sm font-semibold uppercase text-[var(--color-de-muted)] transition hover:text-[var(--color-de-primary)]"
        >
          Contact
        </Link>
      </div>
    </div>
  );
}
