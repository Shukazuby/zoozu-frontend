"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useOrders } from "@/lib/hooks/useOrders";
import { tokenManager } from "@/lib/api";

const formatCurrency = (value: number) => `₦${value.toLocaleString()}`;
const formatDate = (dateString?: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { order, loading, error, getOrderById } = useOrders();
  const showInitiatedWarning = order?.paymentStatus === 'initiated';

  useEffect(() => {
    if (!tokenManager.isAuthenticated()) {
      router.push(`/auth/login?next=${encodeURIComponent(`/profile/orders/${id}`)}`);
      return;
    }
    if (id) {
      getOrderById(id);
    }
  }, [id, getOrderById, router]);

  if (loading && !order) {
    return (
      <div className="bg-slate-50 pb-16 pt-12">
        <div className="container">
          <div className="text-center py-12 text-sm text-slate-600">Loading order...</div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="bg-slate-50 pb-16 pt-12">
        <div className="container">
          <div className="text-center py-12">
            <p className="text-red-600 text-sm">{error || "Order not found"}</p>
            <Link href="/profile/orders" className="mt-4 inline-block text-sm font-semibold text-slate-700 hover:text-yellow-700">
              ← Back to Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const initiatedBanner = showInitiatedWarning ? (
    <div className="rounded border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm text-yellow-800 flex items-center justify-between gap-3">
      <span>Payment was initiated but not completed. Please try again.</span>
      <button
        onClick={() => router.push(`/profile/orders/${order._id}`)}
        className="rounded border border-yellow-400 bg-yellow-500/90 px-3 py-1 text-xs font-semibold text-slate-900 transition hover:bg-yellow-500"
      >
        Try Again
      </button>
    </div>
  ) : null;

  return (
    <div className="bg-slate-50 pb-16 pt-12">
      <div className="container space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/profile/orders" className="text-sm font-semibold text-slate-600 hover:text-yellow-700 transition">
              ← Back to Orders
            </Link>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Order Details</h1>
            <p className="mt-1 text-sm text-slate-600">Order #{order.orderNumber || order._id}</p>
          </div>
          <span className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-800">{order.status}</span>
        </div>

        {initiatedBanner}

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-lg bg-white p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">Order Items</h2>
              <div className="divide-y divide-slate-100">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex gap-4 py-4">
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded border border-slate-200">
                      {item.imageUrl ? (
                        <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">No Image</div>
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                      <p className="text-xs text-slate-600">Quantity: {item.quantity}</p>
                      <p className="text-sm font-semibold text-slate-800">{formatCurrency(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">Shipping Information</h2>
              <div className="space-y-1 text-sm text-slate-700">
                <p className="font-semibold text-slate-900">{order.contactName || "—"}</p>
                <p>{order.shippingAddress || "—"}</p>
                <p className="mt-2">{order.contactEmail || "—"}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg bg-white p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-slate-700">
                  <span>Total Amount</span>
                  <span>{formatCurrency(order.totalAmount || 0)}</span>
                </div>
                {order.paymentStatus && (
                  <div className="flex justify-between text-slate-700">
                    <span>Payment Status</span>
                    <span className="font-semibold">{order.paymentStatus}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">Order Information</h2>
              <div className="space-y-2 text-sm text-slate-700">
                <div>
                  <p className="font-semibold text-slate-900">Order Date</p>
                  <p>{formatDate(order.placedAt)}</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Order Status</p>
                  <p>{order.status}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

