"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { tokenManager } from "@/lib/api";
import { verifyAdminStatus, isTokenValid } from "@/lib/utils/adminAuth";
import AdminSidebar from "../components/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLoginPage, setIsLoginPage] = useState(pathname === "/admin/login");

  useEffect(() => {
    const checkAdminAuth = async () => {
      setLoading(true);
      setIsLoginPage(pathname === "/admin/login");

      // If on login page, check if already authenticated
      if (pathname === "/admin/login") {
        // Quick check: if token exists and is not expired
        if (isTokenValid()) {
          // Verify admin status
          const status = await verifyAdminStatus();
          if (status.isAdmin && status.isValid) {
            // Already authenticated as admin, redirect to dashboard
            router.replace("/admin");
            return;
          }
        }
        // Not authenticated or not admin, show login page
        setLoading(false);
        return;
      }

      // For all other admin pages, verify admin status
      const token = tokenManager.getToken();
      
      // No token or token expired
      if (!token || !isTokenValid()) {
        tokenManager.removeToken();
        router.replace("/admin/login");
        return;
      }

      // Verify admin status with API call
      const status = await verifyAdminStatus();
      
      if (!status.isAdmin || !status.isValid) {
        // Not admin or token invalid, redirect to login
        tokenManager.removeToken();
        router.replace("/admin/login");
        return;
      }

      // Valid admin, allow access
      setIsAdmin(true);
      setLoading(false);
    };

    checkAdminAuth();
  }, [pathname, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-yellow-600 border-t-transparent mx-auto"></div>
          <p className="text-sm text-slate-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Don't show sidebar on login page
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Only render dashboard if admin is verified
  if (!isAdmin) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="flex-1 overflow-x-hidden">
        <div className="container mx-auto px-4 py-8">{children}</div>
      </main>
    </div>
  );
}

