import type { Metadata } from "next";
import Link from "next/link";
import { getSiteUrl } from "@/lib/site-url";

const returnsUrl = `${getSiteUrl()}/returns`;

export const metadata: Metadata = {
  title: "Return Policy | EnsieShop",
  description:
    "Review the EnsieShop return policy, including the 14-day return window for defective products, exchanges, refunds, and damaged item support.",
  alternates: { canonical: returnsUrl },
  openGraph: {
    title: "EnsieShop Return Policy",
    description:
      "EnsieShop accepts returns for defective products within 14 days of delivery. Review return conditions, exchanges, refund timing, and support details.",
    url: returnsUrl,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "EnsieShop Return Policy",
    description:
      "EnsieShop accepts returns for defective products within 14 days of delivery. Review return conditions, exchanges, refund timing, and support details.",
  },
};

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-[#f7fbfa] px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-4xl">
        <p className="mb-4 text-xs font-semibold uppercase text-[var(--color-de-primary)]">
          Customer Care
        </p>
        <h1 className="mb-6 text-4xl font-semibold leading-tight text-[var(--color-de-ink)] sm:text-5xl">
          Return Policy
        </h1>
        <p className="mb-10 max-w-3xl text-base leading-7 text-[var(--color-de-muted)]">
          EnsieShop accepts returns for defective products within 14 days of delivery. Please review the details below before starting a return or exchange request.
        </p>

        <section className="space-y-8 border border-[#dce9e5] bg-white p-5 shadow-sm sm:p-8">
          <div>
            <h2 className="mb-3 text-xl font-semibold text-[var(--color-de-ink)]">
              14-Day Return Window
            </h2>
            <p className="leading-7 text-[var(--color-de-muted)]">
              You may request a return for a defective, damaged, or incorrect product within 14 days after your order is delivered. Return requests made after the 14-day window may not be accepted.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-xl font-semibold text-[var(--color-de-ink)]">
              Return Eligibility
            </h2>
            <p className="leading-7 text-[var(--color-de-muted)]">
              Returns are accepted for defective products only. We do not accept returns for change of mind, buyer&apos;s remorse, opened products without a defect, or items damaged after delivery. Please keep the item and original packaging when possible so we can review the issue.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-xl font-semibold text-[var(--color-de-ink)]">
              Damaged or Incorrect Items
            </h2>
            <p className="leading-7 text-[var(--color-de-muted)]">
              If your order arrives damaged, defective, or incorrect, contact us as soon as possible with your order details and photos of the issue so we can review it and help resolve the problem.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-xl font-semibold text-[var(--color-de-ink)]">
              Exchanges
            </h2>
            <p className="leading-7 text-[var(--color-de-muted)]">
              Exchanges are accepted for eligible defective, damaged, or incorrect products when a replacement is available. If a replacement is not available, we may issue an approved refund instead.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-xl font-semibold text-[var(--color-de-ink)]">
              Refunds
            </h2>
            <p className="leading-7 text-[var(--color-de-muted)]">
              Approved refunds are issued to the original payment method after the issue has been reviewed and, when required, the returned item has been received and inspected. Your bank or card provider may take additional time to post the refund.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-xl font-semibold text-[var(--color-de-ink)]">
              Return Shipping
            </h2>
            <p className="leading-7 text-[var(--color-de-muted)]">
              For approved defective, damaged, or incorrect product returns, we will provide return instructions. Please contact us before mailing any item back so we can confirm the return details.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-xl font-semibold text-[var(--color-de-ink)]">
              Start a Return
            </h2>
            <p className="leading-7 text-[var(--color-de-muted)]">
              To request a return, send us your order number, delivery date, and reason for return through the{" "}
              <Link href="/contact" className="font-semibold text-[var(--color-de-primary)] underline-offset-4 hover:underline">
                contact page
              </Link>
              .
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
