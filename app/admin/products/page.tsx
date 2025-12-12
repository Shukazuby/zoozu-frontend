"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { productsApi, type Product } from "@/lib/api";

const formatCurrency = (value: number) => `₦${value.toLocaleString()}`;

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  useEffect(() => {
    loadProducts();
  }, [page]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productsApi.getProducts({ page, limit });
      if (response.success && response.data) {
        // Handle nested response structure: { data: { totalCount, data: Product[] } }
        let productsArray: Product[] = [];
        let totalCount = 0;

        if (Array.isArray(response.data)) {
          // If data is directly an array
          productsArray = response.data;
          totalCount = response.totalCount || productsArray.length;
        } else if (response.data && typeof response.data === 'object' && 'data' in response.data) {
          // If data is nested: { totalCount, data: Product[] }
          const nestedData = response.data as { totalCount?: number; data?: Product[] };
          productsArray = Array.isArray(nestedData.data) ? nestedData.data : [];
          totalCount = nestedData.totalCount || response.totalCount || productsArray.length;
        }

        setProducts(productsArray);
        setTotal(totalCount);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const toggleProductStatus = async (productId: string, isActive: boolean) => {
    try {
      await productsApi.updateProduct(productId, { isActive: !isActive });
      loadProducts();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update product");
    }
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-yellow-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">Products Management</h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1">Manage your product catalog</p>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-lg bg-yellow-600 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-yellow-500 whitespace-nowrap self-start sm:self-auto"
        >
          + Add Product
        </Link>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-lg bg-white shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full min-w-[640px]">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Product</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Price</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Stock</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Status</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-slate-50">
                  <td className="px-3 sm:px-6 py-3 sm:py-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="relative h-10 w-10 sm:h-12 sm:w-12 rounded border border-slate-200 overflow-hidden flex-shrink-0">
                        {product.images && product.images.length > 0 ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-semibold text-slate-900 truncate">{product.name}</p>
                        <p className="text-xs text-slate-500 truncate">{product.categories?.[0] || "—"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-slate-900">
                    {formatCurrency(product.price)}
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-700">{product.stock || 0}</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        product.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
                      <Link
                        href={`/admin/products/${product._id}`}
                        className="text-xs sm:text-sm font-semibold text-yellow-700 hover:text-yellow-600"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => toggleProductStatus(product._id, product.isActive || false)}
                        className={`text-xs sm:text-sm font-semibold ${
                          product.isActive
                            ? "text-red-600 hover:text-red-700"
                            : "text-green-600 hover:text-green-700"
                        }`}
                      >
                        {product.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {products.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-slate-500">No products found</p>
          </div>
        )}

        {total > limit && (
          <div className="px-4 sm:px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs sm:text-sm text-slate-600 text-center sm:text-left">
              Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} products
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded border border-slate-300 px-3 py-1 text-xs sm:text-sm font-semibold text-slate-700 transition hover:border-yellow-500 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page * limit >= total}
                className="rounded border border-slate-300 px-3 py-1 text-xs sm:text-sm font-semibold text-slate-700 transition hover:border-yellow-500 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

