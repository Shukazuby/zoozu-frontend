"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { tokenManager, usersApi } from "@/lib/api";
import { decodeToken } from "@/lib/utils/adminAuth";
import Image from "next/image";
import type { User } from "@/lib/api/types";

const menuItems = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/products", label: "Products", icon: "👕" },
  { href: "/admin/orders", label: "Orders", icon: "📦" },
  { href: "/admin/users", label: "Users", icon: "👥" },
  { href: "/admin/bookings", label: "Bookings", icon: "📅" },
  { href: "/admin/newsletter", label: "Newsletter", icon: "📧" },
  { href: "/admin/analytics", label: "Analytics", icon: "📈" },
];

export default function AdminSidebar({ isOpen = false, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (onClose) {
      onClose();
    }
  }, [pathname]);

  useEffect(() => {
    const loadAdminProfile = async () => {
      try {
        const response = await usersApi.getProfile();
        if (response.success && response.data) {
          setAdminUser(response.data as User);
        }
      } catch (error) {
        console.error("Failed to load admin profile:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAdminProfile();
  }, []);

  const handleLogout = () => {
    // Clear token
    tokenManager.removeToken();
    // Redirect to login page
    router.replace("/admin/login");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAdminName = () => {
    if (adminUser?.fullName) return adminUser.fullName;
    const token = tokenManager.getToken();
    if (token) {
      const decoded = decodeToken(token);
      return decoded?.email || "Admin";
    }
    return "Admin";
  };

  const getAdminEmail = () => {
    if (adminUser?.email) return adminUser.email;
    const token = tokenManager.getToken();
    if (token) {
      const decoded = decodeToken(token);
      return decoded?.email || "";
    }
    return "";
  };

  return (
    <aside
      className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white min-h-screen flex flex-col transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
    >
      {/* Close button for mobile */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-800">
        <span className="font-semibold text-lg">Menu</span>
        <button
          onClick={onClose}
          className="p-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white"
          aria-label="Close menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="hidden lg:block p-6 border-b border-slate-800">
        <Link href="/admin" className="flex items-center gap-2">
          <Image
            src="https://res.cloudinary.com/dkqtwvhq2/image/upload/v1765556450/zoozu_logo_lm422a.jpg"
            alt="ZOOZU_NG Admin"
            width={32}
            height={32}
            className="h-8 w-8 rounded-lg object-contain"
          />
          <span className="font-semibold text-lg">Admin Panel</span>
        </Link>
      </div>

      {/* Admin Profile Section */}
      <div className="p-4 border-b border-slate-800">
        {loading ? (
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="h-10 w-10 rounded-full bg-slate-700 animate-pulse"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-700 rounded animate-pulse"></div>
              <div className="h-3 bg-slate-700 rounded animate-pulse w-3/4"></div>
            </div>
          </div>
        ) : (
          <Link
            href="/admin/settings"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-800/50 transition hover:bg-slate-800 ${
              pathname === "/admin/settings" ? "ring-2 ring-yellow-600" : ""
            }`}
          >
            {adminUser?.profilePicture ? (
              <Image
                src={adminUser.profilePicture}
                alt={getAdminName()}
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-yellow-600 flex items-center justify-center text-slate-900 font-semibold text-sm">
                {getInitials(getAdminName())}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{getAdminName()}</p>
              <p className="text-xs text-slate-400 truncate">{getAdminEmail()}</p>
            </div>
            <span className="text-slate-400 text-xs">⚙️</span>
          </Link>
        )}
      </div>

      <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
          // Only Dashboard should have yellow background by default
          const isDashboard = item.href === "/admin";
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive && isDashboard
                  ? "bg-yellow-600 text-slate-900 font-semibold"
                  : isActive
                  ? "bg-transparent text-white font-semibold border-l-2 border-yellow-600"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition"
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

