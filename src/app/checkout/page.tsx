import type { Metadata } from "next";
import CheckoutPageContent from "@/components/CheckoutPageContent";

export const metadata: Metadata = {
  title: "Checkout - EnsieShop",
  description: "Complete your EnsieShop order",
};

export default function CheckoutPage() {
  return <CheckoutPageContent />;
}
