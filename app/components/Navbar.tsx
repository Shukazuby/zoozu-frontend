"use client";
import Link from "next/link";
import Image from "next/image";
import { ReactNode, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { tokenManager } from "@/lib/api";

const navLinks = [
  { href: "/collections", label: "Shop" },
  { href: "/collections/men", label: "Shop Men" },
  { href: "/collections/women", label: "Shop Women" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

type IconButtonProps = {
  label: string;
  href?: string;
  onClick?: () => void;
  children: ReactNode;
};

const IconButton = ({ label, href, onClick, children }: IconButtonProps) => {
  const classes =
    "grid h-9 w-9 place-items-center rounded-full border border-slate-200/70 bg-white/85 text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500/20";

  if (href) {
    return (
      <Link href={href} aria-label={label} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={classes}
    >
      {children}
    </button>
  );
};

const Logo = () => (
  <Link
    href="/"
    className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-900"
  >
    <div className="relative h-9 w-9 overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-100">
      <Image
        src="https://res.cloudinary.com/dkqtwvhq2/image/upload/v1765556450/zoozu_logo_lm422a.jpg"
        alt="ZOOZU_NG Logo"
        fill
        className="object-cover"
        priority
      />
    </div>
    <span className="hidden sm:inline">ZOOZU NG</span>
  </Link>
);

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  const handleProfileClick = () => {
    const target = "/profile";
    if (!tokenManager.isAuthenticated()) {
      router.push(`/auth/login?next=${encodeURIComponent(target)}`);
    } else {
      router.push(target);
    }
    setIsMobileMenuOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(
        `/collections?search=${encodeURIComponent(searchQuery.trim())}`,
      );
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const isActiveLink = (href: string) =>
    pathname === href || pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 bg-transparent shadow-none backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-3 py-2 md:px-5 lg:px-7">
        <Logo />

        {isSearchOpen ? (
          <form
            onSubmit={handleSearchSubmit}
            className="flex w-full max-w-2xl flex-1 items-center gap-2 rounded-full border border-slate-200/70 bg-slate-50/90 px-3 py-2 shadow-sm md:mx-4"
          >
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full rounded-full border border-slate-200 bg-white px-4 py-2 pl-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20"
              />
              <svg
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-4.35-4.35m0 0A7.5 7.5 0 1 0 6.75 6.75a7.5 7.5 0 0 0 9.9 9.9Z"
                />
              </svg>
            </div>
            <button
              type="submit"
              disabled={!searchQuery.trim()}
              className="rounded-full bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => {
                setIsSearchOpen(false);
                setSearchQuery("");
              }}
              className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 transition hover:border-yellow-500"
            >
              Cancel
            </button>
          </form>
        ) : (
          <>
            <div className="hidden md:block">
              <nav className="flex items-center gap-1.5 rounded-full bg-slate-50/90 px-2 py-1.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-100/80">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`rounded-full px-2.5 py-1 text-[0.82rem] transition ${
                      isActiveLink(link.href)
                        ? "bg-yellow-50 text-yellow-700"
                        : "text-slate-700 hover:bg-yellow-50 hover:text-yellow-700"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-2">
              <IconButton label="Search" onClick={() => setIsSearchOpen(true)}>
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
                    d="M21 21l-5.2-5.2m2.3-4.5A7.3 7.3 0 1110.5 3.7a7.3 7.3 0 017.6 7.6Z"
                  />
                </svg>
              </IconButton>

              <IconButton label="Account" onClick={handleProfileClick}>
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
              </IconButton>

              <IconButton label="Cart" href="/cart">
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
              </IconButton>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Menu"
                className="grid h-9 w-9 place-items-center rounded-full border border-slate-200/70 bg-white/90 text-slate-800 transition hover:border-slate-300 md:hidden"
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
            </div>
          </>
        )}
      </div>

      {isMobileMenuOpen && (
        <div className="border-t border-slate-200/70 bg-white/95 md:hidden">
          <nav className="mx-auto max-w-6xl space-y-2 px-4 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block rounded-2xl px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-yellow-50 hover:text-yellow-700"
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => {
                setIsSearchOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-semibold text-slate-800 transition hover:border-yellow-300 hover:bg-yellow-50"
            >
              Search Products
            </button>
            <button
              onClick={handleProfileClick}
              className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-semibold text-slate-800 transition hover:border-yellow-300 hover:bg-yellow-50"
            >
              {tokenManager.isAuthenticated() ? "My Account" : "Sign In"}
            </button>
            <Link
              href="/cart"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block rounded-2xl px-4 py-4 text-sm font-semibold text-slate-800 transition hover:bg-yellow-50 hover:text-yellow-700"
            >
              Cart
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
