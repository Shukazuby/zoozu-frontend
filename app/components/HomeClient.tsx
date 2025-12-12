'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useProducts } from '@/lib/hooks';
import { type Product } from '@/lib/api';

const formatCurrency = (value: number) => `₦${value.toLocaleString()}`;

const testimonials = [
  {
    name: 'Chinedu O.',
    location: 'Lagos, Nigeria',
    quote:
      "The attention to detail is unmatched. I wore my Zoozu set to a wedding in Abuja and the compliments didn't stop. Truly premium.",
  },
  {
    name: 'Amina B.',
    location: 'Abuja, Nigeria',
    quote:
      'Ordering online was seamless. The sizing guide was accurate, and the fabric quality feels incredibly expensive. Will be back.',
  },
  {
    name: 'Tunde A.',
    location: 'London, UK',
    quote:
      'Finally, a brand that understands modern Nigerian style without being too loud. Sophisticated and sharp cuts.',
  },
];

export default function HomeClient() {
  const { featuredProducts, loading, error, getFeaturedProducts } = useProducts();

  useEffect(() => {
    getFeaturedProducts();
  }, [getFeaturedProducts]);

  return (
    <div className="bg-white text-slate-900">
      <section className="relative min-h-[720px] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=1600&q=80"
            alt="Three models wearing modern African attire"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/45" />
        </div>

        <div className="container relative z-10 flex min-h-[720px] flex-col items-center justify-center gap-6 text-center text-white">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-200">New Collection 2024</p>
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl">
            Zoozu_ng: Premium Modern Fashion
          </h1>
          <p className="max-w-2xl text-base text-slate-100 sm:text-lg">
            Redefining Nigerian elegance. Clean lines, premium fabrics, and timeless style crafted for the modern
            individual.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/collections/men" className="btn-primary">
              Explore Men
            </Link>
            <Link href="/collections/women" className="btn-secondary bg-white text-slate-900">
              Explore Women
            </Link>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 items-center justify-center rounded-full border border-white/30 bg-white/10 p-3 text-white">
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9.5 12 16 5 9.5" />
          </svg>
        </div>
      </section>

      <section className="section" id="collection">
        <div className="container space-y-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Curated Selection</p>
              <h2 className="text-3xl font-semibold text-slate-900">Featured Looks</h2>
            </div>
            <Link
              href="/collections"
              className="flex items-center gap-2 text-sm font-semibold text-slate-900 transition hover:text-yellow-700"
            >
              View All Collection
              <span aria-hidden>→</span>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-slate-600">Loading featured products...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
              <button
                onClick={() => getFeaturedProducts()}
                className="mt-4 rounded bg-yellow-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-yellow-500"
              >
                Retry
              </button>
            </div>
          ) : !featuredProducts || featuredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-600">No featured products available at the moment.</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-3">
              {featuredProducts.slice(0, 3).map((product: Product) => (
                <Link
                  href={`/product/${product._id}`}
                  key={product._id}
                  className="overflow-hidden rounded-md border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative h-80 w-full">
                    {product.images && product.images.length > 0 ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 33vw, 100vw"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-slate-100">
                        <span className="text-slate-400">No Image</span>
                      </div>
                    )}
                    {product.badge && (
                      <span className="absolute left-3 top-3 rounded-sm bg-yellow-500 px-3 py-1 text-xs font-semibold text-slate-900">
                        {product.badge}
                      </span>
                    )}
                    {product.tag && (
                      <span className="absolute right-3 top-3 rounded-sm bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                        {product.tag}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between px-4 py-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{product.name}</h3>
                      {product.categories && product.categories.length > 0 && (
                        <p className="text-sm text-slate-500">{product.categories[0]}</p>
                      )}
                    </div>
                    <span className="text-sm font-semibold text-slate-800">{formatCurrency(product.price)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section bg-slate-50" id="bespoke">
        <div className="container grid gap-10 lg:grid-cols-[1fr,1.1fr] lg:items-center">
          <div className="space-y-5">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Bespoke Services</p>
            <h2 className="text-3xl font-semibold text-slate-900 leading-tight">Experience Custom Luxury</h2>
            <p className="text-base text-slate-600">
              Schedule a private session with our expert tailors or browse our latest editorial curations for
              inspiration. We bring the studio to you.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/bespoke-fitting" className="btn-primary">
                Book a Fitting
              </Link>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="relative h-[320px] w-full max-w-xl overflow-hidden rounded-lg shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1200&q=80"
                alt="Tailor adjusting a suit"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -left-10 -bottom-12 hidden h-[220px] w-[240px] overflow-hidden rounded-lg shadow-md md:block">
              <Image
                src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80"
                alt="Premium fabrics neatly stacked"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="about">
        <div className="container flex flex-col items-center gap-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500 text-2xl font-semibold text-slate-900 shadow-md">
            BK
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-slate-900">Meet the Visionary</h3>
            <p className="max-w-3xl text-base text-slate-600">
              &quot;Fashion is not just about clothes; it&apos;s about the confidence to walk into any room and own it.
              Zoozu_ng is the armor for the modern African leader.&quot;
            </p>
            <span className="block text-sm font-medium text-slate-500">Buki King | Creative Director, ZOOZU_ng</span>
          </div>
        </div>
      </section>

      <section className="section bg-slate-50" id="contact">
        <div className="container space-y-8">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-slate-900">Client Love</h3>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div key={testimonial.name} className="rounded-lg border border-slate-100 bg-white p-6 shadow-sm">
                <div className="mb-3 flex items-center gap-1 text-yellow-500">
                  {'★★★★★'.split('').map((star, index) => (
                    <span key={`${testimonial.name}-star-${index}`} aria-hidden>
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-sm text-slate-600">{testimonial.quote}</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
                    {testimonial.name
                      .split(' ')
                      .map((part) => part[0])
                      .join('')}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{testimonial.name}</p>
                    <p className="text-xs text-slate-500">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

