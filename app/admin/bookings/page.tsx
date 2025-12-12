"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

export default function AdminBookingsPage() {
  const [activeTab, setActiveTab] = useState<"fittings" | "custom">("fittings");
  const [fittings, setFittings] = useState<any[]>([]);
  const [customOrders, setCustomOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  useEffect(() => {
    if (activeTab === "fittings") {
      loadFittings();
    } else {
      loadCustomOrders();
    }
  }, [activeTab, page]);

  const loadFittings = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getAllFittings(page, limit);
      if (response.success && response.data) {
        setFittings(response.data.bookings || []);
        setTotal(response.data.total || 0);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const loadCustomOrders = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getAllCustomOrders(page, limit);
      if (response.success && response.data) {
        setCustomOrders(response.data.customOrders || []);
        setTotal(response.data.total || 0);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load custom orders");
    } finally {
      setLoading(false);
    }
  };

  if (loading && fittings.length === 0 && customOrders.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-yellow-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">Bookings Management</h1>
        <p className="text-sm sm:text-base text-slate-600 mt-1">Manage bespoke fittings and custom orders</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto">
        <button
          onClick={() => {
            setActiveTab("fittings");
            setPage(1);
          }}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition ${
            activeTab === "fittings"
              ? "border-yellow-600 text-yellow-700"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          Bespoke Fittings
        </button>
        <button
          onClick={() => {
            setActiveTab("custom");
            setPage(1);
          }}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition ${
            activeTab === "custom"
              ? "border-yellow-600 text-yellow-700"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          Custom Orders
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {activeTab === "fittings" ? (
        <div className="rounded-lg bg-white shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full min-w-[640px]">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Customer</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Date</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Time Slot</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Phone</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Requests</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {fittings.map((fitting: any) => (
                  <tr key={fitting._id} className="hover:bg-slate-50">
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                          {fitting.userId?.fullName || fitting.fullName || "—"}
                        </p>
                        <p className="text-xs text-slate-500 truncate">{fitting.userId?.email || fitting.email || ""}</p>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-700">
                      {fitting.date ? formatDate(fitting.date) : "—"}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-700">{fitting.timeSlot || "—"}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-700">
                      {fitting.userId?.phone || fitting.phone || "—"}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-700 truncate max-w-[150px]">
                      {fitting.specificRequests || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {fittings.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-slate-500">No bookings found</p>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-lg bg-white shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full min-w-[640px]">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Customer</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Occasion</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Delivery Window</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Budget</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {customOrders.map((order: any) => (
                  <tr key={order._id} className="hover:bg-slate-50">
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                          {order.userId?.fullName || "—"}
                        </p>
                        <p className="text-xs text-slate-500 truncate">{order.userId?.email || ""}</p>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-700">{order.occasion || "—"}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-700">{order.deliveryWindow || "—"}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-700">{order.budgetRange || "—"}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs text-slate-600">
                      {order.createdAt ? formatDate(order.createdAt) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {customOrders.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-slate-500">No custom orders found</p>
            </div>
          )}
        </div>
      )}

      {total > limit && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-0">
          <p className="text-xs sm:text-sm text-slate-600 text-center sm:text-left">
            Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} items
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
  );
}

