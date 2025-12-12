"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { newsletterApi } from "@/lib/api/newsletter";

const footerLinks = {
  shop: [
    { label: "Men's Collection", href: "/collections/men" },
    { label: "Women's Collection", href: "/collections/women" },
    { label: "All Collections", href: "/collections" },
    // { label: "Accessories", href: "/collections" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Book a Fitting", href: "/bespoke-fitting" },
    { label: "Terms & Conditions", href: "/terms" },
  ],
};

const socials = [
  { label: "X", href: "#" },
  { label: "IG", href: "#" },
  { label: "FB", href: "#" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Validate email format
    if (!email.trim()) {
      setMessage({ type: 'error', text: 'Please enter your email address.' });
      return;
    }

    if (!validateEmail(email)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }

    setLoading(true);

    try {
      const response = await newsletterApi.subscribe({
        email: email.trim(),
        name: name.trim() || undefined,
      });

      if (response.success) {
        setMessage({ type: 'success', text: response.message || 'Thank you for joining the Inner Circle!' });
        setEmail("");
        setName("");
      } else {
        setMessage({ type: 'error', text: response.message || 'Failed to subscribe. Please try again.' });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to subscribe. Please try again.';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-200">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-14 md:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="space-y-4 text-sm leading-relaxed text-slate-300">
            <div className="flex items-center gap-2 font-semibold text-white">
              <Image
                src="https://res.cloudinary.com/dkqtwvhq2/image/upload/v1765556450/zoozu_logo_lm422a.jpg"
                alt="ZOOZU_NG Logo"
                width={32}
                height={32}
                className="h-8 w-8 rounded-lg object-contain"
              />
              ZOOZU_NG
            </div>
            <p>
              Premium African fashion bridging the gap between tradition and
              modern luxury. Designed in Lagos, worn globally.
            </p>
            <div className="flex gap-2">
              {socials.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="grid h-8 w-8 place-items-center rounded-sm border border-slate-700 text-xs font-semibold transition hover:border-yellow-500 hover:text-yellow-400"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white">Shop</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              {footerLinks.shop.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="transition hover:text-yellow-400">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white">Company</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              {footerLinks.company.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="transition hover:text-yellow-400">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white">Join the Inner Circle</h4>
            <p className="text-sm text-slate-300">
              Subscribe for exclusive access to new drops and private sales.
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
              {message && (
                <div
                  className={`rounded-sm px-3 py-2 text-xs ${
                    message.type === 'success'
                      ? 'bg-green-900/50 text-green-300 border border-green-700'
                      : 'bg-red-900/50 text-red-300 border border-red-700'
                  }`}
                >
                  {message.text}
                </div>
              )}
              <div className="space-y-2">
                <label className="flex rounded-sm border border-slate-700 bg-slate-800/60">
                  <span className="sr-only">Email address</span>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    required
                    disabled={loading}
                    className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-yellow-500 disabled:opacity-50"
                  />
                </label>
                <label className="flex rounded-sm border border-slate-700 bg-slate-800/60">
                  <span className="sr-only">Name (optional)</span>
                  <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name (optional)"
                    disabled={loading}
                    className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-yellow-500 disabled:opacity-50"
                  />
                </label>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-sm bg-yellow-500 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'SUBSCRIBING...' : 'SUBSCRIBE'}
              </button>
            </form>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-slate-800 pt-6 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>© 2024 ZOOZU_ng Fashion Ltd. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/terms#privacy" className="transition hover:text-yellow-400">
              Privacy Policy
            </Link>
            <Link href="/terms#shipping" className="transition hover:text-yellow-400">
              Shipping Info
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

