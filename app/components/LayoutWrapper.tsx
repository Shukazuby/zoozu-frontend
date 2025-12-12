"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Exclude Navbar/Footer for all admin routes including login
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    // Admin routes (including login): no Navbar/Footer
    return <>{children}</>;
  }

  // Regular routes: show Navbar/Footer
  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

