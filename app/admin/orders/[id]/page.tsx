"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { adminApi } from "@/lib/api";

const formatCurrency = (value: number) => `₦${value.toLocaleString()}`;
const formatDate = (dateString?: string) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function AdminOrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminApi.getOrderById(orderId);
      if (response.success && response.data) {
        setOrder(response.data);
      } else {
        setError(response.message || "Failed to load order");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      setUpdating(true);
      await adminApi.updateOrderStatus(orderId, newStatus);
      await loadOrder(); // Reload order to get updated status
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update order status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-yellow-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
        <Link
          href="/admin/orders"
          className="inline-block rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-yellow-500"
        >
          ← Back to Orders
        </Link>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const subtotal = order.items?.reduce(
    (sum: number, item: any) => sum + (item.price * item.quantity),
    0
  ) || 0;
  const shipping = (order.totalAmount || 0) - subtotal;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">Order Details</h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1">Order #{order.orderNumber}</p>
        </div>
        <Link
          href="/admin/orders"
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-yellow-500 whitespace-nowrap self-start sm:self-auto"
        >
          ← Back to Orders
        </Link>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-4 text-red-700 hover:text-red-900"
          >
            ×
          </button>
        </div>
      )}

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Order Items */}
          <div className="rounded-lg bg-white shadow-sm border border-slate-200 p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items && order.items.length > 0 ? (
                order.items.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex gap-4 border-b border-slate-100 pb-4 last:border-0 last:pb-0"
                  >
                    <div className="relative h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0 overflow-hidden rounded border border-slate-200">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm sm:text-base font-semibold text-slate-900">{item.name}</p>
                      {item.category && (
                        <p className="mt-1 text-xs text-slate-600">{item.category}</p>
                      )}
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-600">
                        <span>Quantity: {item.quantity}</span>
                        {item.size && <span>• Size: {item.size}</span>}
                        {item.color && (
                          <span className="flex items-center gap-1">
                            • Color:{" "}
                            <span
                              className="inline-block h-3 w-3 rounded border border-slate-300"
                              style={{ backgroundColor: item.color }}
                            />
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-sm sm:text-base font-semibold text-slate-800">
                        {formatCurrency(item.price)} × {item.quantity} = {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No items found</p>
              )}
            </div>
          </div>

          {/* Shipping Information */}
          <div className="rounded-lg bg-white shadow-sm border border-slate-200 p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Shipping Information</h2>
            <div className="space-y-2 text-sm text-slate-700">
              {order.contactName && (
                <p>
                  <span className="font-semibold text-slate-900">Name:</span> {order.contactName}
                </p>
              )}
              {order.contactEmail && (
                <p>
                  <span className="font-semibold text-slate-900">Email:</span> {order.contactEmail}
                </p>
              )}
              {order.shippingAddress ? (
                <div>
                  <span className="font-semibold text-slate-900">Address:</span>
                  <p className="mt-1 text-slate-700 whitespace-pre-line">{order.shippingAddress}</p>
                </div>
              ) : (
                <p className="text-slate-500">No shipping address provided</p>
              )}
            </div>
          </div>

          {/* Order Notes */}
          {order.notes && (
            <div className="rounded-lg bg-white shadow-sm border border-slate-200 p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-2">Order Notes</h2>
              <p className="text-sm text-slate-700 whitespace-pre-line">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4 sm:space-y-6">
          {/* Order Summary */}
          <div className="rounded-lg bg-white shadow-sm border border-slate-200 p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-700">
                <span>Subtotal</span>
                <span className="font-semibold">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Shipping</span>
                <span className="font-semibold">{formatCurrency(shipping)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-semibold text-slate-900">
                <span>Total</span>
                <span>{formatCurrency(order.totalAmount || 0)}</span>
              </div>
            </div>
          </div>

          {/* Order Information */}
          <div className="rounded-lg bg-white shadow-sm border border-slate-200 p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Order Information</h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-semibold text-slate-900">Order Date</p>
                <p className="text-slate-700">{formatDate(order.placedAt || order.createdAt)}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">Order Status</p>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusUpdate(e.target.value)}
                  disabled={updating}
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-900 outline-none focus:border-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <p className="font-semibold text-slate-900">Payment Status</p>
                <span
                  className={`mt-1 inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                    order.paymentStatus === "paid"
                      ? "bg-green-100 text-green-700"
                      : order.paymentStatus === "initiated"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </div>
              {order.paymentReference && (
                <div>
                  <p className="font-semibold text-slate-900">Payment Reference</p>
                  <p className="text-slate-700 text-xs break-all">{order.paymentReference}</p>
                </div>
              )}
              {order.paymentProvider && (
                <div>
                  <p className="font-semibold text-slate-900">Payment Provider</p>
                  <p className="text-slate-700">{order.paymentProvider}</p>
                </div>
              )}
            </div>
          </div>

          {/* Customer Information */}
          {order.userId && (
            <div className="rounded-lg bg-white shadow-sm border border-slate-200 p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Customer Information</h2>
              <div className="space-y-2 text-sm text-slate-700">
                {order.userId.fullName && (
                  <p>
                    <span className="font-semibold text-slate-900">Name:</span> {order.userId.fullName}
                  </p>
                )}
                {order.userId.email && (
                  <p>
                    <span className="font-semibold text-slate-900">Email:</span> {order.userId.email}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

