"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authApi, tokenManager } from "@/lib/api";
import { verifyAdminStatus, isTokenValid } from "@/lib/utils/adminAuth";
import Image from "next/image";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if already authenticated as admin
    const checkExistingAuth = async () => {
      if (isTokenValid()) {
        const status = await verifyAdminStatus();
        if (status.isAdmin && status.isValid) {
          // Already authenticated as admin, redirect to dashboard
          router.replace("/admin");
          return;
        }
      }
      // Not authenticated or not admin, show login form
      setChecking(false);
    };

    checkExistingAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Step 1: Login
      const response = await authApi.login({ email, password });
      if (!response.success || !response.data?.token) {
        setError(response.message || "Invalid credentials");
        setLoading(false);
        return;
      }

      // Step 2: Save token
      tokenManager.setToken(response.data.token);

      // Step 3: Verify admin status
      const adminStatus = await verifyAdminStatus();
      if (!adminStatus.isAdmin || !adminStatus.isValid) {
        // Not an admin user, clear token and show error
        tokenManager.removeToken();
        setError(adminStatus.error || "Access denied. Admin privileges required.");
        setLoading(false);
        return;
      }

      // Step 4: Admin verified, redirect to dashboard
      router.replace("/admin");
    } catch (err: any) {
      // Handle login errors
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError("Invalid email or password. Please try again.");
      } else if (err.response?.status === 403) {
        setError("Access denied. Admin privileges required.");
      } else {
        setError(err.response?.data?.message || err.message || "Login failed. Please try again.");
      }
      tokenManager.removeToken();
      setLoading(false);
    }
  };

  // Show loading while checking existing auth
  if (checking) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-yellow-600 border-t-transparent mx-auto"></div>
          <p className="text-sm text-slate-300">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <Image
                src="https://res.cloudinary.com/dkqtwvhq2/image/upload/v1765556450/zoozu_logo_lm422a.jpg"
                alt="ZOOZU_NG Admin"
                width={64}
                height={64}
                className="h-16 w-16 rounded-lg object-contain"
              />
            </div>
            <h1 className="text-3xl font-semibold text-slate-900">Admin Login</h1>
            <p className="text-sm text-slate-600">Sign in to access the admin dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-200">
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-800">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-yellow-600 focus:ring-1 focus:ring-yellow-500"
                placeholder="admin@zoozu.ng"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-yellow-600 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

