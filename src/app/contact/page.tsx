import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { getSiteUrl } from "@/lib/site-url";

const contactUrl = `${getSiteUrl()}/contact`;

export const metadata: Metadata = {
  title: "Contact | EnsieShop",
  description: "Contact EnsieShop for order support, product questions, and customer care.",
  alternates: { canonical: contactUrl },
  openGraph: {
    title: "Contact EnsieShop",
    description: "Contact EnsieShop for order support, product questions, and customer care.",
    url: contactUrl,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Contact EnsieShop",
    description: "Contact EnsieShop for order support, product questions, and customer care.",
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#f7fbfa] px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <section className="py-4">
          <p className="mb-4 text-xs font-semibold uppercase text-[var(--color-de-primary)]">
            Customer Care
          </p>
          <h1 className="mb-6 text-4xl font-semibold leading-tight text-[var(--color-de-ink)] sm:text-5xl">
            Contact
          </h1>
          <p className="max-w-xl text-base leading-7 text-[var(--color-de-muted)]">
            Send a note about an order, product, or store question and the message will go straight to the EnsieShop inbox.
          </p>
        </section>

        <section className="border border-[#dce9e5] bg-white p-5 shadow-sm sm:p-8">
          <ContactForm />
        </section>
      </div>
    </div>
  );
}
