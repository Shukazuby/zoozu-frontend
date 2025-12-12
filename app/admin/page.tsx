"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api";
import Link from "next/link";

const formatCurrency = (value: number) => `₦${value.toLocaleString()}`;

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getDashboardStats();
      if (response.success && response.data) {
        setStats(response.data);
      } else {
        setError("Failed to load dashboard stats");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-yellow-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error || "Failed to load dashboard"}</p>
        <button
          onClick={loadStats}
          className="mt-4 rounded bg-yellow-600 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-yellow-500"
        >
          Retry
        </button>
      </div>
    );
  }

  const { overview, growth, recentOrders } = stats;

  const statCards = [
    {
      label: "Total Revenue",
      value: formatCurrency(overview.totalRevenue),
      growth: growth.revenueGrowth,
      icon: "💰",
      color: "bg-green-100 text-green-700",
    },
    {
      label: "Total Orders",
      value: overview.totalOrders,
      growth: growth.ordersGrowth,
      icon: "📦",
      color: "bg-blue-100 text-blue-700",
    },
    {
      label: "Total Users",
      value: overview.totalUsers,
      icon: "👥",
      color: "bg-purple-100 text-purple-700",
    },
    {
      label: "Active Products",
      value: overview.totalProducts,
      icon: "👕",
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      label: "Pending Orders",
      value: overview.pendingOrders,
      icon: "⏳",
      color: "bg-orange-100 text-orange-700",
    },
    {
      label: "Newsletter Subscribers",
      value: overview.totalSubscribers,
      icon: "📧",
      color: "bg-pink-100 text-pink-700",
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">Dashboard Overview</h1>
        <p className="text-sm sm:text-base text-slate-600 mt-1">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat, idx) => (
          <div
            key={idx}
            className="rounded-lg bg-white p-6 shadow-sm border border-slate-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-slate-600">{stat.label}</p>
                <p className="text-xl sm:text-2xl font-semibold text-slate-900 mt-1">{stat.value}</p>
                {stat.growth !== undefined && (
                  <p
                    className={`text-xs mt-1 ${
                      stat.growth >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stat.growth >= 0 ? "↑" : "↓"} {Math.abs(stat.growth).toFixed(1)}% from last month
                  </p>
                )}
              </div>
              <div className={`text-3xl sm:text-4xl ${stat.color} p-2 sm:p-3 rounded-lg flex-shrink-0`}>{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="rounded-lg bg-white shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="text-sm font-semibold text-yellow-700 hover:text-yellow-600"
            >
              View All →
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full min-w-[640px]">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                  Order #
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                  Customer
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                  Amount
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                  Status
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                  Payment
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {recentOrders && recentOrders.length > 0 ? (
                recentOrders.map((order: any) => (
                  <tr key={order._id} className="hover:bg-slate-50">
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-slate-900">
                      {order.orderNumber}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-700">
                      {order.user?.fullName || "Guest"}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-slate-900">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          order.status === "delivered"
                            ? "bg-green-100 text-green-700"
                            : order.status === "shipped"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {order.status}
                      </span>
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
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-500">
                    No recent orders
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

