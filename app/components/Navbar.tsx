"use client";
import Link from "next/link";
import Image from "next/image";
import { ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import { tokenManager } from "@/lib/api";

const navLinks = [
  { href: "/collections/men", label: "Shop Men" },
  { href: "/collections/women", label: "Shop Women" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

type IconButtonProps = {
  label: string;
  children: ReactNode;
};

const IconButton = ({ label, children }: IconButtonProps) => (
  <button
    aria-label={label}
    className="grid h-10 w-10 place-items-center rounded-full border border-transparent text-slate-800 transition hover:border-slate-200"
  >
    {children}
  </button>
);

const Logo = () => (
  <Link href="/" className="flex items-center gap-2 font-semibold text-slate-900">
    <Image
      src="/logo.png"
      alt="ZOOZU_NG Logo"
      width={32}
      height={32}
      className="h-8 w-8 rounded-lg object-contain"
      priority
    />
    <span className="hidden sm:inline">ZOOZU_NG</span>
  </Link>
);

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleProfileClick = () => {
    const target = "/profile";
    if (!tokenManager.isAuthenticated()) {
      router.push(`/auth/login?next=${encodeURIComponent(target)}`);
    } else {
      router.push(target);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 shadow-sm shadow-slate-100 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6 lg:px-8">
        {!isSearchOpen && <Logo />}

        {isSearchOpen ? (
          <div className="flex-1 flex items-center gap-3 max-w-md mx-auto">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search products..."
                autoFocus
                className="w-full rounded-full border border-slate-300 bg-white px-4 py-2 pl-10 text-sm text-slate-900 outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20"
              />
              <svg
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-4.35-4.35m0 0A7.5 7.5 0 1 0 6.75 6.75a7.5 7.5 0 0 0 9.9 9.9Z"
                />
              </svg>
            </div>
            <button
              onClick={() => setIsSearchOpen(false)}
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-yellow-500"
            >
              Cancel
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Navigation */}
            <nav className="hidden gap-6 text-sm font-medium text-slate-800 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="transition hover:text-yellow-700"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2 text-slate-800">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Menu"
                className="grid h-10 w-10 place-items-center rounded-full border border-transparent text-slate-800 transition hover:border-slate-200 md:hidden"
              >
                {isMobileMenuOpen ? (
                  <svg
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    />
                  </svg>
                )}
              </button>

              {/* Desktop Icons */}
              <button
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search"
                className="hidden md:grid h-10 w-10 place-items-center rounded-full border border-transparent text-slate-800 transition hover:border-slate-200"
              >
                <svg
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-4.35-4.35m0 0A7.5 7.5 0 1 0 6.75 6.75a7.5 7.5 0 0 0 9.9 9.9Z"
                  />
                </svg>
              </button>
              <IconButton label="Account">
                <button
                  onClick={handleProfileClick}
                  aria-label="Profile"
                  className="grid h-10 w-10 place-items-center"
                >
                  <svg
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 7.5a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 19.5a7.5 7.5 0 0 1 15 0"
                    />
                  </svg>
                </button>
              </IconButton>
              <IconButton label="Cart">
                <Link href="/cart" aria-label="Cart" className="grid h-10 w-10 place-items-center">
                  <svg
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 5h2l1 12h12l1-9H7m0 0L6 7m1 0h13M9 19a1 1 0 1 1-2 0m10 0a1 1 0 1 1-2 0"
                    />
                  </svg>
                </Link>
              </IconButton>
            </div>
          </>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <nav className="mx-auto max-w-6xl px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block rounded-lg px-4 py-3 text-sm font-medium text-slate-800 transition hover:bg-yellow-50 hover:text-yellow-700"
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => {
                setIsSearchOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="block w-full rounded-lg px-4 py-3 text-left text-sm font-medium text-slate-800 transition hover:bg-yellow-50 hover:text-yellow-700"
            >
              Search
            </button>
            <button
              onClick={handleProfileClick}
              className="block w-full rounded-lg px-4 py-3 text-left text-sm font-medium text-slate-800 transition hover:bg-yellow-50 hover:text-yellow-700"
            >
              {tokenManager.isAuthenticated() ? "My Account" : "Sign In"}
            </button>
            <Link
              href="/cart"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block rounded-lg px-4 py-3 text-sm font-medium text-slate-800 transition hover:bg-yellow-50 hover:text-yellow-700"
            >
              Cart
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

