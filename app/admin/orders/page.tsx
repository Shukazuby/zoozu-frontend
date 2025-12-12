"use client";

import { useEffect, useState } from "react";
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
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>("");
  const limit = 20;

  useEffect(() => {
    loadOrders();
  }, [page, statusFilter, paymentStatusFilter]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getAllOrders(page, limit, {
        status: statusFilter || undefined,
        paymentStatus: paymentStatusFilter || undefined,
      });
      if (response.success && response.data) {
        setOrders(response.data.orders || []);
        setTotal(response.data.total || 0);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load orders");
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

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-yellow-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Orders Management</h1>
        <p className="text-slate-600 mt-1">View and manage all orders</p>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-yellow-600"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select
          value={paymentStatusFilter}
          onChange={(e) => setPaymentStatusFilter(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-yellow-600"
        >
          <option value="">All Payment Statuses</option>
          <option value="pending">Pending</option>
          <option value="initiated">Initiated</option>
          <option value="paid">Paid</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-lg bg-white shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Order #</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">
                    {order.orderNumber}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">
                    {order.userId?.fullName || "Guest"}
                    <br />
                    <span className="text-xs text-slate-500">{order.userId?.email || ""}</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                    {formatCurrency(order.totalAmount)}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                      className="rounded border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-900 outline-none focus:border-yellow-600"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
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
                  <td className="px-6 py-4 text-xs text-slate-600">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <a
                      href={`/admin/orders/${order._id}`}
                      className="text-sm font-semibold text-yellow-700 hover:text-yellow-600"
                    >
                      View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {orders.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-slate-500">No orders found</p>
          </div>
        )}

        {total > limit && (
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
            <p className="text-sm text-slate-600">
              Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} orders
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded border border-slate-300 px-3 py-1 text-sm font-semibold text-slate-700 transition hover:border-yellow-500 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page * limit >= total}
                className="rounded border border-slate-300 px-3 py-1 text-sm font-semibold text-slate-700 transition hover:border-yellow-500 disabled:opacity-50"
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

