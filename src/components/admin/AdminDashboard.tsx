"use client";

import { useCallback, useEffect, useState } from "react";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminOrders from "@/components/admin/AdminOrders";
import AdminShipping from "@/components/admin/AdminShipping";
import ListingsOrder from "@/components/admin/ListingsOrder";
import ProductForm from "@/components/admin/ProductForm";
import BrandLogo from "@/components/BrandLogo";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  sizes: string;
  colors: string;
  colorImages: string;
  imageUrls: string;
  featured: boolean;
  inStock: boolean;
}

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<"listings" | "orders" | "shipping">("listings");

  const fetchProducts = useCallback(async () => {
    const res = await fetch("/api/products");
    if (res.ok) {
      setProducts(await res.json());
    }
  }, []);

  const checkAuth = useCallback(async () => {
    const res = await fetch("/api/auth/session");
    if (res.ok) {
      const data = await res.json();
      setAuthenticated(data.authenticated);
    } else {
      setAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (authenticated) fetchProducts();
  }, [authenticated, fetchProducts]);

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    setAuthenticated(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this listing?")) return;

    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (res.ok) fetchProducts();
  };

  if (authenticated === null) {
    return (
      <div className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-[#f7fbfa]">
        <p className="text-sm text-[var(--color-de-muted)]">Loading...</p>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <AdminLogin
        onLogin={() => {
          setAuthenticated(true);
          fetchProducts();
        }}
      />
    );
  }

  return (
    <div className="admin-surface light-form min-h-[calc(100vh-72px)] bg-[#f7fbfa] px-4 py-10 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 border border-[#dce9e5] bg-white p-5 shadow-sm sm:mb-10 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <BrandLogo className="text-lg" />
            <div>
              <p className="mb-1 text-xs font-semibold uppercase text-[var(--color-de-primary)]">
                Operations
              </p>
              <h1 className="text-2xl font-semibold text-[var(--color-de-ink)]">
                Admin Portal
              </h1>
              <p className="text-xs text-[var(--color-de-muted)]">
                Upload products, manage listings, orders, and shipping.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                setEditing(null);
                setShowForm(true);
              }}
              className="bg-[var(--color-de-primary)] px-5 py-2.5 text-xs font-semibold uppercase text-white transition hover:bg-[var(--color-de-accent-dark)]"
            >
              + New Listing
            </button>
            <button
              onClick={handleLogout}
              className="border border-[#dce9e5] bg-white px-5 py-2.5 text-xs font-semibold uppercase text-[var(--color-de-muted)] transition hover:text-[var(--color-de-primary)]"
            >
              Logout
            </button>
          </div>
          </div>
        </div>

        <div className="mb-8 flex gap-2 border-b border-[#dce9e5]">
          <button
            type="button"
            onClick={() => setActiveTab("listings")}
            className={`px-4 py-3 text-xs font-semibold uppercase transition-colors ${
              activeTab === "listings"
                ? "border-b-2 border-[var(--color-de-primary)] text-[var(--color-de-primary)]"
                : "text-[var(--color-de-muted)] hover:text-[var(--color-de-primary)]"
            }`}
          >
            Listings
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-3 text-xs font-semibold uppercase transition-colors ${
              activeTab === "orders"
                ? "border-b-2 border-[var(--color-de-primary)] text-[var(--color-de-primary)]"
                : "text-[var(--color-de-muted)] hover:text-[var(--color-de-primary)]"
            }`}
          >
            Orders
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("shipping")}
            className={`px-4 py-3 text-xs font-semibold uppercase transition-colors ${
              activeTab === "shipping"
                ? "border-b-2 border-[var(--color-de-primary)] text-[var(--color-de-primary)]"
                : "text-[var(--color-de-muted)] hover:text-[var(--color-de-primary)]"
            }`}
          >
            Shipping
          </button>
        </div>

        {activeTab === "orders" ? (
          <AdminOrders />
        ) : activeTab === "shipping" ? (
          <AdminShipping />
        ) : (
        <>
        {showForm && (
          <div className="mb-10">
            <ProductForm
              product={editing || undefined}
              onSuccess={() => {
                setShowForm(false);
                setEditing(null);
                fetchProducts();
              }}
              onCancel={() => {
                setShowForm(false);
                setEditing(null);
              }}
            />
          </div>
        )}

        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase text-[var(--color-de-primary)]">
            All Listings ({products.length})
          </h2>

          <ListingsOrder
            products={products}
            onEdit={(product) => {
              setEditing(product);
              setShowForm(true);
            }}
            onDelete={handleDelete}
            onReorder={setProducts}
          />
        </div>
        </>
        )}
      </div>
    </div>
  );
}
