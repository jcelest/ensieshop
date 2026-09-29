import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Message Sent | EnsieShop",
  description: "Your EnsieShop contact message has been sent.",
  robots: { index: false, follow: false },
};

export default function ContactThanksPage() {
  return (
    <div className="flex min-h-[calc(100dvh-65px)] flex-col items-center justify-center bg-[#f7fbfa] px-4 py-12 text-center sm:px-6">
      <p className="mb-4 text-xs font-semibold uppercase text-[var(--color-de-primary)]">
        Message Sent
      </p>
      <h1 className="mb-4 text-3xl font-semibold text-[var(--color-de-ink)] sm:text-5xl">
        Thanks for reaching out
      </h1>
      <p className="mb-10 max-w-md text-sm leading-6 text-[var(--color-de-muted)]">
        Your message was submitted. We will get back to you as soon as possible.
      </p>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Link
          href="/shop"
          className="bg-[var(--color-de-primary)] px-8 py-3 text-sm font-semibold uppercase text-white transition hover:bg-[var(--color-de-accent-dark)]"
        >
          Shop
        </Link>
        <Link
          href="/contact"
          className="border border-[#dce9e5] bg-white px-8 py-3 text-sm font-semibold uppercase text-[var(--color-de-muted)] transition hover:text-[var(--color-de-primary)]"
        >
          Contact Again
        </Link>
      </div>
    </div>
  );
}
