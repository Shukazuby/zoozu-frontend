"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  useEffect(() => {
    loadSubscribers();
  }, [page]);

  const loadSubscribers = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getAllNewsletterSubscribers(page, limit);
      if (response.success && response.data) {
        setSubscribers(response.data.subscribers || []);
        setTotal(response.data.total || 0);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load subscribers");
    } finally {
      setLoading(false);
    }
  };

  if (loading && subscribers.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-yellow-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Newsletter Subscribers</h1>
        <p className="text-slate-600 mt-1">Manage newsletter subscribers</p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-lg bg-white shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600">
              Total Active Subscribers: <span className="font-semibold text-slate-900">{total}</span>
            </p>
            <button
              onClick={() => {
                const emails = subscribers.map((s) => s.email).join("\n");
                navigator.clipboard.writeText(emails);
                alert("Email addresses copied to clipboard!");
              }}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-yellow-500"
            >
              Copy Emails
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Subscribed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {subscribers.map((subscriber) => (
                <tr key={subscriber._id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{subscriber.email}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{subscriber.name || "—"}</td>
                  <td className="px-6 py-4 text-xs text-slate-600">
                    {subscriber.subscribedAt ? formatDate(subscriber.subscribedAt) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {subscribers.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-slate-500">No subscribers found</p>
          </div>
        )}

        {total > limit && (
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
            <p className="text-sm text-slate-600">
              Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} subscribers
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

