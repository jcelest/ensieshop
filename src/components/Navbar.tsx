import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import CartLink from "@/components/CartLink";
import MobileNav from "@/components/MobileNav";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#dce9e5] bg-white/88 shadow-sm backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <Link href="/shop" className="group flex min-w-0 items-center gap-2 sm:gap-3">
          <BrandLogo className="text-base transition-transform duration-300 group-hover:scale-[1.02] sm:text-lg" />
        </Link>

        <div className="hidden items-center gap-6 md:flex md:gap-10">
          <Link
            href="/shop"
            className="text-sm font-medium text-[var(--color-de-muted)] transition-colors hover:text-[var(--color-de-primary)]"
          >
            SHOP
          </Link>
          <CartLink />
        </div>

        <MobileNav />
      </nav>
    </header>
  );
}
