"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminApi } from "@/lib/api";

const formatCurrency = (value: number) => `₦${value.toLocaleString()}`;
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const limit = 20;

  useEffect(() => {
    // Reset to page 1 when filter changes
    setPage(1);
  }, [statusFilter]);

  useEffect(() => {
    loadOrders();
  }, [page, statusFilter]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminApi.getAllOrders(page, limit, {
        status: statusFilter || undefined,
      });
      if (response.success && response.data) {
        setOrders(response.data.orders || []);
        setTotal(response.data.total || 0);
      } else {
        setError(response.message || "Failed to load orders");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to load orders");
      setOrders([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await adminApi.updateOrderStatus(orderId, newStatus);
      loadOrders();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update order status");
    }
  };

  if (loading && orders.length === 0 && page === 1) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">Orders Management</h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1">View and manage all orders</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-yellow-600 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">Orders Management</h1>
        <p className="text-sm sm:text-base text-slate-600 mt-1">View and manage all orders</p>
      </div>

      {/* Filter */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center">
        <label className="text-sm font-semibold text-slate-700 whitespace-nowrap">Filter by Status:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-yellow-600 min-w-[200px]"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-lg bg-white shadow-sm border border-slate-200 overflow-hidden">
        {loading && orders.length > 0 && (
          <div className="px-4 sm:px-6 py-3 bg-yellow-50 border-b border-yellow-200">
            <div className="flex items-center gap-2 text-sm text-yellow-700">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-yellow-600 border-t-transparent"></div>
              <span>Loading...</span>
            </div>
          </div>
        )}
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full min-w-[800px]">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Order #</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Customer</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Amount</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Status</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Payment</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Date</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {orders.length > 0 ? (
                orders.map((order) => (
                <tr key={order._id} className="hover:bg-slate-50">
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-slate-900">
                    {order.orderNumber}
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-700">
                    <div className="min-w-0">
                      <div className="truncate">{order.contactEmail || "N/A"}</div>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-slate-900">
                    {formatCurrency(order.totalAmount)}
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                      className="rounded border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-900 outline-none focus:border-yellow-600 w-full sm:w-auto"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        order.paymentStatus === "paid"
                          ? "bg-green-100 text-green-700"
                          : order.paymentStatus === "initiated"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs text-slate-600">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4">
                    <Link
                      href={`/admin/orders/${order._id}`}
                      className="text-xs sm:text-sm font-semibold text-yellow-700 hover:text-yellow-600"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-slate-500 font-medium">No orders found</p>
                      {statusFilter && (
                        <p className="text-xs text-slate-400">
                          Try selecting a different status or{" "}
                          <button
                            onClick={() => setStatusFilter("")}
                            className="text-yellow-600 hover:text-yellow-700 font-semibold underline"
                          >
                            clear the filter
                          </button>
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {total > limit && (
          <div className="px-4 sm:px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs sm:text-sm text-slate-600 text-center sm:text-left">
              Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} orders
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

