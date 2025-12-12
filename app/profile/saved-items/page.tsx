/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { savedItemsApi, tokenManager, type Product } from "@/lib/api";
import { useRouter } from "next/navigation";

type SavedItem = {
  _id: string;
  productId: Product;
};

export default function SavedItemsPage() {
  const router = useRouter();
  const [items, setItems] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const savedCount = useMemo(() => items.length, [items]);

  useEffect(() => {
    const load = async () => {
      if (!tokenManager.isAuthenticated()) {
        router.push(`/auth/login?next=${encodeURIComponent("/profile/saved-items")}`);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const resp = await savedItemsApi.list(1, 30);
        if (resp.success && resp.data && Array.isArray(resp.data)) {
          setItems(resp.data as SavedItem[]);
        } else {
          setItems([]);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load saved items");
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [router]);

  return (
    <div className="bg-slate-50 pb-16 pt-12">
      <div className="container space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-semibold text-slate-900">Saved Items</h1>
          <p className="text-sm text-slate-600">
            {loading ? "Loading your saved items..." : `You have ${savedCount} saved item${savedCount === 1 ? "" : "s"}.`}
          </p>
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>

        {loading ? (
          <div className="text-center py-12 text-sm text-slate-600">Loading...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-slate-600">You have no saved items yet.</p>
            <Link href="/collections" className="mt-3 inline-block rounded bg-yellow-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-yellow-500">
              Browse Collections
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => {
              const product = item.productId;
              return (
                <div key={item._id} className="overflow-hidden rounded-lg border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <Link href={`/product/${product?._id || ""}`} className="block">
                    <div className="relative h-64 w-full overflow-hidden bg-slate-100">
                      {product?.images && product.images.length > 0 ? (
                        <Image src={product.images[0]} alt={product?.name || "Saved item"} fill className="object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm text-slate-500">No Image</div>
                      )}
                    </div>
                  </Link>
                  <div className="p-4 space-y-2">
                    <p className="text-sm font-semibold text-slate-900 line-clamp-2">{product?.name || "Unnamed product"}</p>
                    <p className="text-sm font-semibold text-yellow-700">
                      {product?.price ? `₦${Number(product.price).toLocaleString()}` : "—"}
                    </p>
                    <div className="flex gap-2">
                      <Link
                        href={`/product/${product?._id || ""}`}
                        className="rounded bg-yellow-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-yellow-500"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

