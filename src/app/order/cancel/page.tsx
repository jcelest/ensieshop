import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Checkout Cancelled - EnsieShop",
};

export default function OrderCancelPage() {
  return (
    <div className="flex min-h-[calc(100dvh-65px)] flex-col items-center justify-center bg-[#f7fbfa] px-4 py-10 text-center">
      <h1 className="mb-4 text-2xl font-semibold text-[var(--color-de-ink)] sm:text-4xl">
        Checkout Cancelled
      </h1>
      <p className="mb-10 max-w-md text-sm text-[var(--color-de-muted)]">
        No payment was taken. Your cart is still saved - pick up where you left off.
      </p>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Link
          href="/checkout"
          className="rounded-full bg-[var(--color-de-primary)] px-8 py-3 text-sm font-semibold text-white"
        >
          Try Again
        </Link>
        <Link
          href="/cart"
          className="rounded-full border border-[#dce9e5] bg-white px-8 py-3 text-sm font-semibold text-[var(--color-de-muted)] hover:text-[var(--color-de-ink)]"
        >
          View Cart
        </Link>
      </div>
    </div>
  );
}
