"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useProducts, useCart } from "@/lib/hooks";
import { useSavedItems } from "@/lib/hooks/useSavedItems";
import { tokenManager, type Product } from "@/lib/api";

const formatCurrency = (value: number) => `₦${value.toLocaleString()}`;

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;
  const { product, loading, error, getProductById, featuredProducts, getFeaturedProducts } = useProducts();
  const { addToCart } = useCart();
  const { isSaved, add: saveItem, remove: removeItem, loading: saveLoading } = useSavedItems(productId);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string }>({ show: false, message: "" });
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);

  useEffect(() => {
    if (productId) {
      // Reset UI state when productId changes
      setSelectedImageIndex(0);
      setSelectedSize("");
      setSelectedColor("");
      // Mark that we're attempting to fetch
      setHasAttemptedFetch(true);
      getProductById(productId).catch(() => {
        // Error is handled by the hook
      });
    } else {
      // Reset if no productId
      setHasAttemptedFetch(false);
    }
  }, [productId, getProductById]);

  useEffect(() => {
    if (product) {
      // Set default size and color
      if (product.sizes && product.sizes.length > 0 && !selectedSize) {
        setSelectedSize(product.sizes[0]);
      }
      if (product.colors && product.colors.length > 0 && !selectedColor) {
        setSelectedColor(product.colors[0]);
      }

    }
  }, [product, productId]);

  // Load featured products for "You May Also Like"
  useEffect(() => {
    getFeaturedProducts();
  }, [getFeaturedProducts]);

  const handleAddToCart = async () => {
    if (!product) return;
    setAddingToCart(true);
    const success = await addToCart(product._id, 1);
    if (success) {
      setToast({ show: true, message: "Added to cart" });
      setTimeout(() => setToast({ show: false, message: "" }), 3000);
    }
    setAddingToCart(false);
  };

  // Show loading state while fetching
  // Show loading if: currently loading OR we haven't attempted fetch yet OR we're waiting for product after fetch started
  if (loading || !hasAttemptedFetch || (hasAttemptedFetch && !product && !error)) {
    return (
      <div className="bg-white pb-24 pt-10">
        <div className="container">
          <div className="text-center py-12 space-y-4">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-yellow-600 border-t-transparent"></div>
            <p className="text-slate-600">Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Only show error if we've attempted to fetch, loading is complete, and we have an error or no product
  if (hasAttemptedFetch && !loading && (error || !product)) {
    // Check if it's a 404 or "not found" error
    const isNotFound = error?.toLowerCase().includes('not found') || 
                      error?.toLowerCase().includes('404') ||
                      (!error && !product);
    
    return (
      <div className="bg-white pb-24 pt-10">
        <div className="container">
          <div className="text-center py-12 space-y-4">
            <p className="text-red-600">
              {isNotFound 
                ? "Product not found" 
                : error || "Failed to load product. Please try again."}
            </p>
            {error && !isNotFound && (
              <p className="text-sm text-slate-600 mt-2">
                {error}
              </p>
            )}
            <div className="flex gap-4 justify-center mt-6">
              <Link 
                href="/collections" 
                className="inline-block rounded bg-yellow-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-yellow-500"
              >
                ← Back to Collections
              </Link>
              <button
                onClick={() => {
                  if (productId) {
                    setHasAttemptedFetch(false);
                    getProductById(productId);
                  }
                }}
                className="inline-block rounded border border-slate-300 px-6 py-2 text-sm font-semibold text-slate-800 transition hover:border-yellow-500"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Ensure product exists before rendering
  if (!product) {
    return null;
  }

  const images = product.images && product.images.length > 0 ? product.images : [];
  const displayImage = images[selectedImageIndex] || (images.length > 0 ? images[0] : null);

  return (
    <div className="bg-white pb-24 pt-10">
      <div className="container space-y-14">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
          {/* Left Section - Image Gallery (40%) */}
          <div className="lg:w-[40%] space-y-5">
            {displayImage ? (
              <div className="relative h-[560px] w-full overflow-hidden rounded-lg bg-slate-50">
                <Image
                  src={displayImage}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(min-width: 1024px) 40vw, 100vw"
                />
              </div>
            ) : (
              <div className="relative h-[560px] w-full overflow-hidden rounded-lg bg-slate-100 flex items-center justify-center">
                <span className="text-slate-400">No Image Available</span>
              </div>
            )}

            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.slice(0, 4).map((thumb, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative h-24 w-full overflow-hidden rounded border transition ${
                      selectedImageIndex === idx ? "border-yellow-500 ring-2 ring-yellow-300" : "border-slate-200 hover:border-yellow-500"
                    }`}
                  >
                    <Image src={thumb} alt={`${product.name} - Image ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Section - Product Details (60%) */}
          <div className="lg:w-[60%] space-y-6">
            {toast.show && (
              <div className="rounded border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 flex items-center justify-between">
                <span>{toast.message}</span>
                <button
                  onClick={() => setToast({ show: false, message: "" })}
                  className="text-xs font-semibold text-green-800 hover:text-green-900"
                  aria-label="Dismiss notification"
                >
                  ✕
                </button>
              </div>
            )}

            <div className="space-y-3">
              <h1 className="text-4xl font-semibold text-slate-900 leading-tight">{product.name}</h1>
              <p className="text-lg font-semibold text-yellow-700">{formatCurrency(product.price)}</p>
              {product.description && (
                <p className="max-w-xl text-sm text-slate-700 leading-relaxed">{product.description}</p>
              )}
              {product.badge && (
                <span className="inline-block rounded-sm bg-yellow-500 px-3 py-1 text-xs font-semibold text-slate-900">
                  {product.badge}
                </span>
              )}
              {product.tag && (
                <span className="ml-2 inline-block rounded-sm bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                  {product.tag}
                </span>
              )}
            </div>

            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-slate-800">Size</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`h-9 min-w-[38px] rounded border px-3 text-sm font-semibold transition ${
                        selectedSize === size
                          ? "border-yellow-500 bg-yellow-500 text-white"
                          : "border-slate-200 hover:border-yellow-500"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.colors && product.colors.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-slate-800">Color</p>
                <div className="flex gap-2">
                  {product.colors.map((color, idx) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      style={{ backgroundColor: color }}
                      className={`h-8 w-8 rounded-full border shadow-sm transition ${
                        selectedColor === color ? "border-yellow-500 ring-2 ring-yellow-300" : "border-slate-200 hover:border-yellow-500"
                      }`}
                      aria-label={`Color ${color}`}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="max-w-lg space-y-3">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="flex w-full items-center justify-center gap-2 rounded bg-yellow-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addingToCart ? "Adding..." : "Add to Cart"}
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (!productId) return;
                  if (!tokenManager.isAuthenticated()) {
                    router.push(`/auth/login?next=${encodeURIComponent(`/product/${productId}`)}`);
                    return;
                  }
                  const ok = isSaved ? await removeItem() : await saveItem();
                  if (!ok) return;
                }}
                disabled={saveLoading}
                className={`flex w-full items-center justify-center gap-2 rounded px-4 py-3 text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed ${
                  isSaved
                    ? "bg-slate-900 text-white hover:bg-slate-800"
                    : "border border-slate-300 text-slate-800 hover:border-yellow-500"
                }`}
              >
                {saveLoading ? "Saving..." : isSaved ? "Saved" : "Save Item"}
              </button>
            </div>

            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h11l1 4h4l1 5H7l-1-4" />
                  <circle cx="8.5" cy="17.5" r="1.25" />
                  <circle cx="17.5" cy="17.5" r="1.25" />
                </svg>
                Free shipping on orders over ₦100,000
              </li>
              <li className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
                </svg>
                Authentic premium fabric
              </li>
              <li className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h7v4H5v8h6v4H4zm10 0h6v16h-6v-4h5V8h-5z" />
                </svg>
                Easy returns &amp; exchanges
              </li>
            </ul>
          </div>
        </div>

        {/* You May Also Like Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">You May Also Like</h2>
          {!featuredProducts || featuredProducts.length === 0 ? (
            <p className="text-sm text-slate-600">No featured products available at the moment.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.slice(0, 4).map((item: Product) => (
                <Link
                  key={item._id}
                  href={`/product/${item._id}`}
                  className="rounded-lg border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                    {item.images && item.images.length > 0 ? (
                      <Image
                        src={item.images[0]}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 25vw, 50vw"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-slate-100">
                        <span className="text-slate-400 text-sm">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4 space-y-1">
                    <p className="text-sm font-semibold text-slate-800">{item.name}</p>
                    <p className="text-sm font-semibold text-yellow-700">{formatCurrency(item.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

