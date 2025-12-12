"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api";

const formatCurrency = (value: number) => `₦${value.toLocaleString()}`;

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    loadAnalytics();
  }, [startDate, endDate]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getSalesAnalytics(
        startDate || undefined,
        endDate || undefined,
      );
      if (response.success && response.data) {
        setAnalytics(response.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !analytics) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-yellow-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">Sales Analytics</h1>
        <p className="text-sm sm:text-base text-slate-600 mt-1">View sales trends and top products</p>
      </div>

      {/* Date Filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="flex-1">
          <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs sm:text-sm text-slate-900 outline-none focus:border-yellow-600"
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs sm:text-sm text-slate-900 outline-none focus:border-yellow-600"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={() => {
              setStartDate("");
              setEndDate("");
            }}
            className="w-full sm:w-auto rounded-lg border border-slate-300 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 transition hover:border-yellow-500"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {analytics && (
        <div className="space-y-4 sm:space-y-6">
          {/* Top Products */}
          <div className="rounded-lg bg-white shadow-sm border border-slate-200">
            <div className="p-4 sm:p-6 border-b border-slate-200">
              <h2 className="text-base sm:text-lg font-semibold text-slate-900">Top Selling Products</h2>
            </div>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="w-full min-w-[400px]">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Product</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Units Sold</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {analytics.topProducts && analytics.topProducts.length > 0 ? (
                    analytics.topProducts.map((product: any, idx: number) => (
                      <tr key={product._id || idx} className="hover:bg-slate-50">
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-slate-900 truncate max-w-[200px]">
                          {product.productName || "Unknown Product"}
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-700">{product.totalSold}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-slate-900">
                          {formatCurrency(product.totalRevenue)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-3 sm:px-6 py-8 text-center text-xs sm:text-sm text-slate-500">
                        No sales data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sales Data */}
          <div className="rounded-lg bg-white shadow-sm border border-slate-200">
            <div className="p-4 sm:p-6 border-b border-slate-200">
              <h2 className="text-base sm:text-lg font-semibold text-slate-900">Daily Sales</h2>
            </div>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="w-full min-w-[400px]">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Date</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Orders</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {analytics.salesData && analytics.salesData.length > 0 ? (
                    analytics.salesData.map((sale: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-700">
                          {sale._id.year}-{String(sale._id.month).padStart(2, "0")}-{String(sale._id.day).padStart(2, "0")}
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-700">{sale.orderCount}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-slate-900">
                          {formatCurrency(sale.totalRevenue)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-3 sm:px-6 py-8 text-center text-xs sm:text-sm text-slate-500">
                        No sales data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

