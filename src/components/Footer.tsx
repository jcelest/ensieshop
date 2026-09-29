import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-[#dce9e5] bg-white">
      <div>
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="grid gap-12 md:grid-cols-2">
            <div className="flex flex-col items-center md:items-start">
              <BrandLogo className="mb-4 text-lg" />
              <p className="text-sm text-[var(--color-de-muted)]">Useful products. Clean checkout. Easy operations.</p>
            </div>

            <div className="text-center md:text-left">
              <h3 className="mb-4 text-sm font-semibold text-[var(--color-de-primary)]">
                NAVIGATE
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/shop" className="text-sm text-[var(--color-de-muted)] transition-colors hover:text-[var(--color-de-ink)]">
                    Shop
                  </Link>
                </li>
                <li>
                  <Link href="/cart" className="text-sm text-[var(--color-de-muted)] transition-colors hover:text-[var(--color-de-ink)]">
                    Cart
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm text-[var(--color-de-muted)] transition-colors hover:text-[var(--color-de-ink)]">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="text-sm text-[var(--color-de-muted)] transition-colors hover:text-[var(--color-de-ink)]">
                    Admin Portal
                  </Link>
                </li>
              </ul>
            </div>

          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#dce9e5] pt-8 md:flex-row">
            <p className="text-xs text-[var(--color-de-muted)]" suppressHydrationWarning>
              &copy; {year} EnsieShop. All rights reserved.
            </p>
            <BrandLogo className="text-sm opacity-60" aria-hidden />
          </div>
        </div>
      </div>
    </footer>
  );
}
