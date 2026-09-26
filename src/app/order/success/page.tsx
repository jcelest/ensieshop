import type { Metadata } from "next";
import OrderSuccessContent from "@/components/OrderSuccessContent";

export const metadata: Metadata = {
  title: "Order Confirmed - EnsieShop",
};

export default function OrderSuccessPage() {
  return <OrderSuccessContent />;
}
