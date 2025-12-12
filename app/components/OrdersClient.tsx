'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useOrders } from '@/lib/hooks/useOrders';
import { type Order } from '@/lib/api';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const formatCurrency = (value: number) => `₦${value.toLocaleString()}`;

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'delivered':
      return 'bg-green-100 text-green-700';
    case 'shipped':
      return 'bg-blue-100 text-blue-700';
    case 'processing':
    case 'pending':
      return 'bg-yellow-100 text-yellow-700';
    case 'cancelled':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-slate-100 text-slate-700';
  }
};

export default function OrdersClient() {
  const { orders, loading, error, getOrders } = useOrders();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getOrders({ page: currentPage, limit: 10 });
  }, [currentPage, getOrders]);

  if (loading) {
    return (
      <div className="bg-slate-50 pb-16 pt-12">
        <div className="container">
          <div className="text-center py-12">
            <p className="text-slate-600">Loading orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-50 pb-16 pt-12">
        <div className="container">
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => getOrders({ page: currentPage, limit: 10 })}
              className="mt-4 rounded bg-yellow-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-yellow-500"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 pb-16 pt-12">
      <div className="container space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-semibold text-slate-900">All Orders</h1>
          <p className="text-sm text-slate-600">Your complete order history.</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600 mb-4">You have no orders yet</p>
            <Link
              href="/collections"
              className="inline-block rounded bg-yellow-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-yellow-500"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="rounded-lg bg-white p-6 shadow-sm space-y-4">
            {orders.map((order: Order) => (
              <Link
                key={order._id}
                href={`/profile/orders/${order._id}`}
                className="block border border-slate-100 rounded-lg p-4 space-y-3 transition hover:border-yellow-500 hover:bg-yellow-50/30 cursor-pointer"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{order.orderNumber}</p>
                    <p className="text-xs text-slate-600">{formatDate(order.placedAt)}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-700">
                  <p>Items: {order.items.length}</p>
                  <p className="font-semibold text-slate-900">{formatCurrency(order.totalAmount)}</p>
                </div>
                {order.paymentStatus && (
                  <div className="text-xs text-slate-500">
                    Payment: {order.paymentStatus}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

