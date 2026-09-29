import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLearnPage, getPublishedLearnPages } from "@/lib/learn-pages";
import { getSiteUrl } from "@/lib/site-url";

export function generateStaticParams() {
  return getPublishedLearnPages().map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getLearnPage(slug);

  if (!page) {
    return {
      title: "Page Not Found | EnsieShop",
      robots: { index: false, follow: false },
    };
  }

  const url = `${getSiteUrl()}/learn/${page.slug}`;

  return {
    title: `${page.title} | EnsieShop`,
    description: page.description,
    alternates: { canonical: url },
    openGraph: {
      title: page.title,
      description: page.description,
      url,
      type: "article",
    },
    twitter: {
      card: "summary",
      title: page.title,
      description: page.description,
    },
  };
}

export default async function LearnPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getLearnPage(slug);

  if (!page) notFound();

  return (
    <article className="min-h-screen bg-[#f7fbfa] px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <p className="mb-4 text-xs font-semibold uppercase text-[var(--color-de-primary)]">
          Learn
        </p>
        <h1 className="mb-6 text-3xl font-semibold leading-tight text-[var(--color-de-ink)] sm:text-5xl">
          {page.title}
        </h1>
        <div className="space-y-5 text-base leading-8 text-[var(--color-de-muted)]">
          {page.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </article>
  );
}
