"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authApi, tokenManager } from "@/lib/api";
import { syncGuestDataToAccount } from "@/lib/utils/syncGuestData";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  useEffect(() => {
    if (tokenManager.isAuthenticated()) {
      router.replace(next);
    }
  }, [router, next]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSyncMessage(null);
    setLoading(true);
    try {
      const response = await authApi.register({ fullName, email, password, phone });
      if (response.success && response.data?.token) {
        tokenManager.setToken(response.data.token);
        
        // Sync guest cart, saved items, and order details
        const syncResult = await syncGuestDataToAccount();
        const hasSynced = syncResult.cartSynced || syncResult.savedItemsSynced || syncResult.orderDetailsSynced;
        
        if (hasSynced) {
          const messages: string[] = [];
          if (syncResult.cartSynced && syncResult.cartItemsCount > 0) {
            messages.push(`${syncResult.cartItemsCount} item${syncResult.cartItemsCount > 1 ? 's' : ''} added to your cart`);
          }
          if (syncResult.savedItemsSynced && syncResult.savedItemsCount > 0) {
            messages.push(`${syncResult.savedItemsCount} item${syncResult.savedItemsCount > 1 ? 's' : ''} added to your saved items`);
          }
          if (syncResult.orderDetailsSynced) {
            messages.push('Your order details have been saved');
          }
          if (messages.length > 0) {
            setSyncMessage(messages.join(', ') + '.');
            // Redirect after showing sync message
            setTimeout(() => {
              // Add synced parameter if redirecting to cart
              const redirectUrl = next === '/cart' ? '/cart?synced=true' : next;
              router.replace(redirectUrl);
            }, 2500);
          } else {
            router.replace(next);
          }
        } else {
          router.replace(next);
        }
      } else {
        setError(response.message || "Unable to sign up. Please try again.");
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Unable to sign up. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Join us</p>
          <h1 className="text-3xl font-semibold text-slate-900">Create Account</h1>
          <p className="text-sm text-slate-600">Sign up to start shopping.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
          {error && <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
          {syncMessage && <div className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">{syncMessage}</div>}

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-800">Full Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-yellow-600 focus:ring-1 focus:ring-yellow-500"
              placeholder="John Doe"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-800">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-yellow-600 focus:ring-1 focus:ring-yellow-500"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-800">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-yellow-600 focus:ring-1 focus:ring-yellow-500"
              placeholder="••••••••"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-800">Phone (optional)</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-yellow-600 focus:ring-1 focus:ring-yellow-500"
              placeholder="+234..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-yellow-600 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>

          <p className="text-sm text-slate-600 text-center">
            Already have an account?{" "}
            <Link href={`/auth/login?next=${encodeURIComponent(next)}`} className="font-semibold text-yellow-700 hover:text-yellow-600">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-yellow-600 border-t-transparent"></div>
          <p className="mt-4 text-sm text-slate-600">Loading...</p>
        </div>
      </div>
    }>
      <SignupForm />
    </Suspense>
  );
}

