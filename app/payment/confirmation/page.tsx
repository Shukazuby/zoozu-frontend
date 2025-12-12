"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useOrders } from "@/lib/hooks/useOrders";
import { tokenManager } from "@/lib/api";

const formatCurrency = (value: number) => `₦${value.toLocaleString()}`;
const formatDate = (dateString?: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

function PaymentConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { order, loading, error, getOrderById } = useOrders();
  
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'failed' | 'pending' | null>(null);
  const [verifying, setVerifying] = useState(true);
  
  const reference = searchParams?.get('reference');
  const orderId = searchParams?.get('orderId');
  const status = searchParams?.get('status');

  useEffect(() => {
    // Check authentication
    if (!tokenManager.isAuthenticated()) {
      router.push(`/auth/login?next=${encodeURIComponent('/payment/confirmation' + (searchParams?.toString() ? '?' + searchParams.toString() : ''))}`);
      return;
    }

    // Determine payment status from URL params
    if (status === 'success' || status === 'successful') {
      setPaymentStatus('success');
    } else if (status === 'failed' || status === 'failure') {
      setPaymentStatus('failed');
    } else {
      setPaymentStatus('pending');
    }

    // Load order details if orderId is provided
    if (orderId) {
      getOrderById(orderId).then(() => {
        setVerifying(false);
      });
    } else {
      setVerifying(false);
    }
  }, [orderId, status, reference, router, searchParams, getOrderById]);

  // Show loading state
  if (verifying || (loading && !order)) {
    return (
      <div className="bg-slate-50 min-h-screen pb-16 pt-12">
        <div className="container">
          <div className="flex flex-col items-center justify-center py-16">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-yellow-600"></div>
            <p className="mt-4 text-sm text-slate-600">Verifying payment...</p>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (paymentStatus === 'success') {
    return (
      <div className="bg-slate-50 min-h-screen pb-16 pt-12">
        <div className="container max-w-4xl">
          <div className="mx-auto space-y-8">
            {/* Success Header */}
            <div className="rounded-lg bg-white p-8 shadow-sm text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="mb-2 text-3xl font-semibold text-slate-900">Payment Successful</h1>
              <p className="text-lg font-medium text-slate-700 mb-4">
                Thank you for your purchase. Your payment has been confirmed.
              </p>
              {order && (
                <p className="mt-2 text-sm font-semibold text-slate-700">
                  Order #{order.orderNumber || order._id}
                </p>
              )}
              {reference && (
                <p className="mt-1 text-xs text-slate-500">Reference: {reference}</p>
              )}
              <div className="mt-6">
                <Link
                  href="/profile/orders"
                  className="inline-block rounded bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  View All Orders
                </Link>
              </div>
            </div>

            {/* Order Details */}
            {order && (
              <div className="space-y-6">
                <div className="rounded-lg bg-white p-6 shadow-sm">
                  <h2 className="mb-4 text-lg font-semibold text-slate-900">Order Summary</h2>
                  <div className="space-y-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex gap-4 border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded border border-slate-200">
                          {item.imageUrl ? (
                            <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">No Image</div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                          <p className="mt-1 text-xs text-slate-600">Quantity: {item.quantity}</p>
                          <p className="mt-2 text-sm font-semibold text-slate-800">
                            {formatCurrency(item.price)} × {item.quantity} = {formatCurrency(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 space-y-2 border-t border-slate-200 pt-4 text-sm">
                    <div className="flex justify-between text-slate-700">
                      <span>Subtotal</span>
                      <span>{formatCurrency(order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0))}</span>
                    </div>
                    <div className="flex justify-between text-slate-700">
                      <span>Shipping</span>
                      <span>{formatCurrency((order.totalAmount || 0) - order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0))}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-semibold text-slate-900">
                      <span>Total Paid</span>
                      <span>{formatCurrency(order.totalAmount || 0)}</span>
                    </div>
                  </div>
                </div>

                {/* Shipping Information */}
                <div className="rounded-lg bg-white p-6 shadow-sm">
                  <h2 className="mb-4 text-lg font-semibold text-slate-900">Shipping Information</h2>
                  <div className="space-y-1 text-sm text-slate-700">
                    <p className="font-semibold text-slate-900">{order.contactName || "—"}</p>
                    <p>{order.shippingAddress || "—"}</p>
                    <p className="mt-2">{order.contactEmail || "—"}</p>
                  </div>
                </div>

                {/* Order Information */}
                <div className="rounded-lg bg-white p-6 shadow-sm">
                  <h2 className="mb-4 text-lg font-semibold text-slate-900">Order Information</h2>
                  <div className="grid gap-4 text-sm sm:grid-cols-2">
                    <div>
                      <p className="font-semibold text-slate-900">Order Date</p>
                      <p className="text-slate-700">{formatDate(order.placedAt)}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Order Status</p>
                      <p className="text-slate-700">{order.status}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Payment Status</p>
                      <p className="text-green-600 font-semibold capitalize">{order.paymentStatus || 'Paid'}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Expected Delivery</p>
                      <p className="text-slate-700">5-7 business days</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              {order && (
                <Link
                  href={`/profile/orders/${order._id}`}
                  className="rounded bg-slate-900 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  View Order Details
                </Link>
              )}
              <Link
                href="/collections"
                className="rounded border border-slate-300 bg-white px-6 py-3 text-center text-sm font-semibold text-slate-800 transition hover:border-yellow-500 hover:bg-yellow-50"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Failed state
  if (paymentStatus === 'failed') {
    return (
      <div className="bg-slate-50 min-h-screen pb-16 pt-12">
        <div className="container max-w-2xl">
          <div className="mx-auto space-y-8">
            {/* Failure Header */}
            <div className="rounded-lg bg-white p-8 shadow-sm text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="mb-2 text-3xl font-semibold text-slate-900">Payment Failed</h1>
              <p className="text-slate-600">
                We were unable to process your payment. Please try again or contact support if the problem persists.
              </p>
              {reference && (
                <p className="mt-2 text-xs text-slate-500">Reference: {reference}</p>
              )}
            </div>

            {/* Error Details */}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/cart"
                className="rounded bg-slate-900 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Return to Cart
              </Link>
              <Link
                href="/collections"
                className="rounded border border-slate-300 bg-white px-6 py-3 text-center text-sm font-semibold text-slate-800 transition hover:border-yellow-500 hover:bg-yellow-50"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Pending/Unknown state
  return (
    <div className="bg-slate-50 min-h-screen pb-16 pt-12">
      <div className="container max-w-2xl">
        <div className="mx-auto space-y-8">
          {/* Pending Header */}
          <div className="rounded-lg bg-white p-8 shadow-sm text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
              <svg className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="mb-2 text-3xl font-semibold text-slate-900">Payment Processing</h1>
            <p className="text-slate-600">
              Your payment is being processed. Please check your order status in your profile or contact support if you have any questions.
            </p>
            {order && (
              <p className="mt-2 text-sm font-semibold text-slate-700">
                Order #{order.orderNumber || order._id}
              </p>
            )}
            {reference && (
              <p className="mt-1 text-xs text-slate-500">Reference: {reference}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            {order && (
              <Link
                href={`/profile/orders/${order._id}`}
                className="rounded bg-slate-900 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                View Order Status
              </Link>
            )}
            <Link
              href="/profile/orders"
              className="rounded border border-slate-300 bg-white px-6 py-3 text-center text-sm font-semibold text-slate-800 transition hover:border-yellow-500 hover:bg-yellow-50"
            >
              View All Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="bg-slate-50 min-h-screen pb-16 pt-12">
        <div className="container">
          <div className="flex flex-col items-center justify-center py-16">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-yellow-600"></div>
            <p className="mt-4 text-sm text-slate-600">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <PaymentConfirmationContent />
    </Suspense>
  );
}

