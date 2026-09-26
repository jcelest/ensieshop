interface BrandLogoProps {
  className?: string;
  priority?: boolean;
  quality?: number | `${number}` | "high";
  "aria-hidden"?: boolean;
}

export default function BrandLogo({
  className = "",
  "aria-hidden": ariaHidden,
}: BrandLogoProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-[var(--color-de-ink)] ${className}`}
      aria-hidden={ariaHidden}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-de-primary)] text-sm font-bold text-white shadow-[0_12px_28px_rgba(var(--color-de-primary-rgb),0.28)]">
        E
      </span>
      <span className="font-semibold leading-none">EnsieShop</span>
    </span>
  );
}
