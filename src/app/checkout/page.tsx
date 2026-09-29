import type { Metadata } from "next";
import CheckoutPageContent from "@/components/CheckoutPageContent";

export const metadata: Metadata = {
  title: "Checkout - EnsieShop",
  description: "Complete your EnsieShop order",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return <CheckoutPageContent />;
}
