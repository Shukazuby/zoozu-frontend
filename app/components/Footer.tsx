"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { newsletterApi } from "@/lib/api/newsletter";

const shopLinks = [
  { label: "Men", href: "/collections/men" },
  { label: "Women", href: "/collections/women" },
  { label: "Collections", href: "/collections" },
];

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Fitting", href: "/bespoke-fitting" },
  { label: "Terms", href: "/terms" },
];

const legalLinks = [
  { label: "Privacy", href: "/terms#privacy" },
  { label: "Shipping", href: "/terms#shipping" },
];

const socials = [
  { label: "X", href: "#" },
  { label: "IG", href: "#" },
  { label: "FB", href: "#" },
];

function LinkColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-white">
        {title}
      </p>
      <ul className="space-y-1 text-xs text-neutral-400">
        {links.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="transition hover:text-yellow-500"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!email.trim()) {
      setMessage({ type: "error", text: "Enter your email." });
      return;
    }

    if (!validateEmail(email)) {
      setMessage({ type: "error", text: "Invalid email address." });
      return;
    }

    setLoading(true);

    try {
      const response = await newsletterApi.subscribe({
        email: email.trim(),
      });

      if (response.success) {
        setMessage({
          type: "success",
          text: response.message || "You're in!",
        });
        setEmail("");
      } else {
        setMessage({
          type: "error",
          text: response.message || "Subscription failed.",
        });
      }
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Subscription failed.";
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-black text-neutral-400">
      <div className="mx-auto max-w-6xl px-4 py-5 md:px-6 md:py-6 lg:px-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between md:gap-8">
          {/* Brand */}
          <div className="flex shrink-0 items-center justify-between gap-4 md:flex-col md:items-start md:justify-start">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="https://res.cloudinary.com/dkqtwvhq2/image/upload/v1765556450/zoozu_logo_lm422a.jpg"
                alt="ZOOZU_NG Logo"
                width={24}
                height={24}
                className="h-6 w-6 rounded object-contain"
              />
              <span className="text-xs font-semibold tracking-wide text-white">
                ZOOZU_NG
              </span>
            </Link>
            <div className="flex gap-1.5">
              {socials.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="grid h-6 w-6 place-items-center rounded border border-neutral-800 text-[10px] font-medium text-neutral-500 transition hover:border-yellow-500 hover:text-yellow-500"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-6 sm:gap-10 md:gap-12">
            <LinkColumn title="Shop" links={shopLinks} />
            <LinkColumn title="Company" links={companyLinks} />
          </div>

          {/* Newsletter */}
          <div className="w-full md:max-w-xs">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-white">
              Newsletter
            </p>
            <form onSubmit={handleSubmit} className="space-y-1.5">
              <div className="flex gap-1.5">
                <label className="min-w-0 flex-1 rounded border border-neutral-800 bg-neutral-950">
                  <span className="sr-only">Email</span>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    required
                    disabled={loading}
                    className="w-full bg-transparent px-2.5 py-1.5 text-xs text-white placeholder:text-neutral-600 focus:outline-none disabled:opacity-50"
                  />
                </label>
                <button
                  type="submit"
                  disabled={loading}
                  className="shrink-0 rounded bg-yellow-500 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-black transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "…" : "Join"}
                </button>
              </div>
              {message && (
                <p
                  className={`text-[10px] leading-tight ${
                    message.type === "success"
                      ? "text-green-500"
                      : "text-red-400"
                  }`}
                >
                  {message.text}
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-5 flex flex-col gap-2 border-t border-neutral-900 pt-4 text-[10px] text-neutral-600 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Zoozu_ng Fashion Ltd.
          </p>
          <div className="flex gap-3">
            {legalLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition hover:text-yellow-500"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
