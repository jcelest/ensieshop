"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { groupCartByProduct } from "@/lib/cart";
import {
  ShippingRate,
  ShippingSettings,
  calculateShippingCost,
  formatShippingPrice,
} from "@/lib/shipping";

type CheckoutShippingSettings = Pick<
  ShippingSettings,
  "freeShippingThreshold" | "defaultMethodId"
> & {
  rates: ShippingRate[];
};

const inputClass =
  "min-h-12 w-full border border-[#dce9e5] bg-white px-4 py-3 text-base text-[var(--color-de-ink)] outline-none transition placeholder:text-[#8ba09c] focus:border-[var(--color-de-primary)] focus:ring-2 focus:ring-[rgba(var(--color-de-primary-rgb),0.16)] sm:text-sm";

const sectionTitleClass =
  "text-xs font-semibold uppercase text-[var(--color-de-primary)]";

export default function CheckoutPageContent() {
  const { items, total } = useCart();
  const groupedItems = useMemo(() => groupCartByProduct(items), [items]);

  const [shippingSettings, setShippingSettings] = useState<CheckoutShippingSettings | null>(null);
  const [shippingMethod, setShippingMethod] = useState("");
  const [smsOptIn, setSmsOptIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadShippingSettings() {
      try {
        const res = await fetch("/api/shipping");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load shipping options");
        }

        if (cancelled) return;

        setShippingSettings(data);
        setShippingMethod(data.defaultMethodId || data.rates[0]?.id || "");
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load shipping options");
        }
      } finally {
        if (!cancelled) setSettingsLoading(false);
      }
    }

    loadShippingSettings();

    return () => {
      cancelled = true;
    };
  }, []);

  const activeSettings: ShippingSettings | null = shippingSettings
    ? {
        freeShippingThreshold: shippingSettings.freeShippingThreshold,
        defaultMethodId: shippingSettings.defaultMethodId,
        rates: shippingSettings.rates,
      }
    : null;

  const shippingCost =
    activeSettings && shippingMethod
      ? calculateShippingCost(total, shippingMethod, activeSettings)
      : 0;
  const orderTotal = total + shippingCost;
  const qualifiesForFreeShipping =
    activeSettings ? total >= activeSettings.freeShippingThreshold : false;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (!shippingMethod) {
      setError("Select a shipping method");
      return;
    }

    setLoading(true);

    const form = new FormData(event.currentTarget);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
            imageUrl: item.imageUrl,
          })),
          customer: {
            customerName: form.get("customerName"),
            email: form.get("email"),
            phone: form.get("phone") || undefined,
            smsOptIn,
            addressLine1: form.get("addressLine1"),
            addressLine2: form.get("addressLine2") || undefined,
            city: form.get("city"),
            state: form.get("state"),
            postalCode: form.get("postalCode"),
            country: form.get("country") || "US",
            shippingMethod,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Checkout failed. Please try again.");
        setLoading(false);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      setError("No checkout URL returned. Please try again.");
      setLoading(false);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#f7fbfa]">
        <div className="mx-auto flex min-h-[calc(100dvh-65px)] max-w-3xl flex-col items-center justify-center px-4 py-12 text-center sm:px-6">
          <p className="mb-4 text-xs font-semibold uppercase text-[var(--color-de-primary)]">
            Checkout
          </p>
          <h1 className="mb-4 text-3xl font-semibold text-[var(--color-de-ink)] sm:text-5xl">
            Nothing to check out
          </h1>
          <p className="mb-8 max-w-md text-sm leading-6 text-[var(--color-de-muted)]">
            Your cart is empty. Add a product from the shop before checking out.
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
    <div className="light-form min-h-screen bg-[#f7fbfa] px-4 py-10 sm:px-6 sm:py-16">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase text-[var(--color-de-primary)]">
              Secure Payment
            </p>
            <h1 className="text-3xl font-semibold text-[var(--color-de-ink)] sm:text-5xl">
              Checkout
            </h1>
            <p className="mt-2 text-sm text-[var(--color-de-muted)]">
              Enter your details, choose shipping, then continue to Stripe.
            </p>
          </div>

          <section className="border border-[#dce9e5] bg-white p-5 shadow-sm sm:p-6">
            <h2 className={sectionTitleClass}>Contact</h2>
            <div className="mt-4 grid gap-4">
              <input
                name="customerName"
                required
                placeholder="Full name"
                className={inputClass}
              />
              <input
                name="email"
                type="email"
                required
                placeholder="Email"
                className={inputClass}
              />
              <input
                name="phone"
                type="tel"
                placeholder="Phone (optional)"
                className={inputClass}
              />
              <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-[var(--color-de-muted)]">
                <input
                  type="checkbox"
                  checked={smsOptIn}
                  onChange={(e) => setSmsOptIn(e.target.checked)}
                  className="mt-1"
                />
                <span>Text me when my order ships (US numbers only)</span>
              </label>
            </div>
          </section>

          <section className="border border-[#dce9e5] bg-white p-5 shadow-sm sm:p-6">
            <h2 className={sectionTitleClass}>Shipping Address</h2>
            <div className="mt-4 grid gap-4">
              <input
                name="addressLine1"
                required
                placeholder="Address line 1"
                className={inputClass}
              />
              <input
                name="addressLine2"
                placeholder="Address line 2 (optional)"
                className={inputClass}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <input name="city" required placeholder="City" className={inputClass} />
                <input name="state" required placeholder="State" className={inputClass} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  name="postalCode"
                  required
                  placeholder="ZIP code"
                  className={inputClass}
                />
                <input
                  name="country"
                  defaultValue="US"
                  placeholder="Country"
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          <section className="border border-[#dce9e5] bg-white p-5 shadow-sm sm:p-6">
            <h2 className={sectionTitleClass}>Shipping Method</h2>
            <div className="mt-4 space-y-3">
              {settingsLoading && (
                <p className="text-sm text-[var(--color-de-muted)]">Loading shipping options...</p>
              )}
              {!settingsLoading && activeSettings && qualifiesForFreeShipping && (
                <p className="border border-[rgba(var(--color-de-primary-rgb),0.22)] bg-[rgba(var(--color-de-primary-rgb),0.08)] px-4 py-3 text-xs font-medium text-[var(--color-de-primary)]">
                  Free shipping unlocked on orders over ${activeSettings.freeShippingThreshold}.
                </p>
              )}
              {!settingsLoading &&
                activeSettings?.rates.map((rate) => (
                  <label
                    key={rate.id}
                    className={`flex cursor-pointer flex-col gap-3 border p-4 transition-colors sm:flex-row sm:items-center sm:justify-between sm:gap-4 ${
                      shippingMethod === rate.id
                        ? "border-[var(--color-de-primary)] bg-[rgba(var(--color-de-primary-rgb),0.08)]"
                        : "border-[#dce9e5] bg-[#f7fbfa]"
                    }`}
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      <input
                        type="radio"
                        name="shippingMethod"
                        value={rate.id}
                        checked={shippingMethod === rate.id}
                        onChange={() => setShippingMethod(rate.id)}
                        className="mt-0.5"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[var(--color-de-ink)]">
                          {rate.name}
                        </p>
                        <p className="break-words text-xs leading-5 text-[var(--color-de-muted)]">
                          {rate.description} - {rate.estimatedDays}
                        </p>
                      </div>
                    </div>
                    <span className="self-start text-sm font-semibold text-[var(--color-de-ink)] sm:self-auto">
                      {activeSettings ? formatShippingPrice(rate, total, activeSettings) : "--"}
                    </span>
                  </label>
                ))}
            </div>
          </section>

          {error && (
            <p className="border border-[#e56d46]/30 bg-[#e56d46]/10 px-4 py-3 text-sm text-[#9a3f24]">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || settingsLoading || !shippingMethod}
            className="w-full bg-[var(--color-de-primary)] py-4 text-sm font-semibold uppercase text-white transition hover:bg-[var(--color-de-accent-dark)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Redirecting to Stripe..." : `Pay $${orderTotal.toFixed(2)}`}
          </button>

          <Link
            href="/cart"
            className="block text-center text-sm font-semibold uppercase text-[var(--color-de-muted)] transition-colors hover:text-[var(--color-de-primary)]"
          >
            Back to Cart
          </Link>
        </form>

        <aside className="h-fit border border-[#dce9e5] bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-28">
          <h2 className={sectionTitleClass}>Order Summary</h2>
          <div className="mt-5 space-y-4">
            {groupedItems.map((group) => (
              <div key={group.productId} className="flex gap-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden border border-[#dce9e5] bg-[#f7fbfa]">
                  <Image
                    src={group.imageUrl}
                    alt={group.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="break-words text-sm font-semibold leading-snug text-[var(--color-de-ink)]">
                    {group.name}
                  </p>
                  {group.lines.map((line) => (
                    <p key={line.lineId} className="text-xs text-[var(--color-de-muted)]">
                      {[line.color, line.size ? `Option ${line.size}` : ""]
                        .filter(Boolean)
                        .join(" / ") || "Item"}{" "}
                      x {line.quantity}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-3 border-t border-[#dce9e5] pt-6 text-sm">
            <div className="flex justify-between text-[var(--color-de-muted)]">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[var(--color-de-muted)]">
              <span>Shipping</span>
              <span>{shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between border-t border-[#dce9e5] pt-4 text-lg font-semibold text-[var(--color-de-ink)]">
              <span>Total</span>
              <span>${orderTotal.toFixed(2)}</span>
            </div>
          </div>

          <p className="mt-6 text-xs leading-5 text-[var(--color-de-muted)]">
            Payment details are completed securely through Stripe after this step.
          </p>
        </aside>
      </div>
    </div>
  );
}
