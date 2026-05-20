"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useProducts } from "@/lib/hooks";
import { type Product } from "@/lib/api";

const heroSlides = [
  {
    src: "https://res.cloudinary.com/dkqtwvhq2/image/upload/v1779226768/Facetune_15-02-2026-21-23-17_nvg4cg.heic",
    alt: "zoozu_ng",
  },
  {
    src: "https://res.cloudinary.com/dkqtwvhq2/image/upload/v1779227322/IMG_3749_jqwsfc.jpg",
    alt: "zoozu_ng",
  },
  {
    src: "https://res.cloudinary.com/dkqtwvhq2/image/upload/v1779226776/Facetune_15-02-2026-21-08-43_osfvfc.heic",
    alt: "zoozu_ng",
  },
  {
    src: "https://res.cloudinary.com/dkqtwvhq2/image/upload/v1779227323/IMG_3725_vsaaqf.jpg",
    alt: "zoozu_ng",
  },
  {
    src: "https://res.cloudinary.com/dkqtwvhq2/image/upload/v1779226776/Facetune_15-02-2026-21-05-57_mvfna9.heic",
    alt: "zoozu_ng",
  },
  {
    src: "https://res.cloudinary.com/dkqtwvhq2/image/upload/v1779227322/IMG_3740_pgwtx6.jpg",
    alt: "zoozu_ng",
  },
];

const TAPE_SCROLL_SPEED = 1.25;

function HeroTapeRoll() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const pausedRef = useRef(false);
  const tapeSlides = [...heroSlides, ...heroSlides];

  useEffect(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || !viewport) return;

    const onEnter = () => {
      pausedRef.current = true;
    };
    const onLeave = () => {
      pausedRef.current = false;
    };

    viewport.addEventListener("mouseenter", onEnter);
    viewport.addEventListener("mouseleave", onLeave);

    let raf = 0;

    const tick = () => {
      if (!pausedRef.current) {
        const loopWidth = track.scrollWidth / 2;
        if (loopWidth > 0) {
          offsetRef.current += TAPE_SCROLL_SPEED;
          if (offsetRef.current >= loopWidth) {
            offsetRef.current -= loopWidth;
          }
          track.style.transform = `translate3d(-${offsetRef.current}px, 0, 0)`;
        }
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      viewport.removeEventListener("mouseenter", onEnter);
      viewport.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div className="absolute inset-0 bg-black">
      <div ref={viewportRef} className="h-full w-full overflow-hidden">
        <div className="flex h-full items-center">
          <div
            ref={trackRef}
            className="flex h-[88%] min-h-[520px] shrink-0 gap-4 py-6 pl-4"
            style={{ width: "max-content", willChange: "transform" }}
          >
            {tapeSlides.map((slide, index) => (
              <div
                key={`${slide.src}-${index}`}
                className="hero-tape-frame relative h-full w-[min(72vw,280px)] shrink-0 sm:w-[260px] md:w-[300px]"
              >
                <div className="relative h-full overflow-hidden bg-neutral-950 shadow-[0_8px_32px_rgba(0,0,0,0.6)] ring-1 ring-white/10">
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    className="object-cover"
                    priority={index < 2}
                    sizes="(max-width: 640px) 72vw, 300px"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const formatCurrency = (value: number) => `₦${value.toLocaleString()}`;

const testimonials = [
  {
    name: "Chinedu O.",
    location: "Lagos, Nigeria",
    quote:
      "The attention to detail is unmatched. I wore my Zoozu set to a wedding in Abuja and the compliments didn't stop. Truly premium.",
  },
  {
    name: "Amina B.",
    location: "Abuja, Nigeria",
    quote:
      "Ordering online was seamless. The sizing guide was accurate, and the fabric quality feels incredibly expensive. Will be back.",
  },
  {
    name: "Tunde A.",
    location: "London, UK",
    quote:
      "Finally, a brand that understands modern Nigerian style without being too loud. Sophisticated and sharp cuts.",
  },
];

export default function HomeClient() {
  const { featuredProducts, loading, error, getFeaturedProducts } =
    useProducts();

  useEffect(() => {
    getFeaturedProducts();
  }, [getFeaturedProducts]);

  return (
    <div className="bg-white text-slate-900">
      <section className="relative min-h-[720px] overflow-hidden bg-black">
        <HeroTapeRoll />
        <div className="pointer-events-none absolute inset-0 z-[1] bg-black/20" />
        <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-black/40 via-black/25 to-black/50" />
        <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_80%_60%_at_50%_45%,rgba(0,0,0,0.15)_0%,rgba(0,0,0,0.45)_100%)]" />

        <div className="container relative z-10 flex min-h-[720px] flex-col items-center justify-center gap-7 px-4 py-16 text-center text-white sm:gap-8">
          <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-yellow-400/90 sm:text-xs">
            Boost Your Confidence. <br /> Set Trend.
          </p>
          <h1 className="font-display max-w-4xl text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl lg:text-[5.25rem]">
            Shop Zoozu
          </h1>
          <p className="max-w-md text-base font-light leading-relaxed text-white/85 sm:max-w-lg sm:text-lg">
            Premium modern fashion designs crafted for confidence, worn with
            intention.
          </p>
          <div className="mt-1 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link href="/collections/men" className="hero-btn-primary">
              Explore Men
            </Link>
            <Link href="/collections/women" className="hero-btn-secondary">
              Explore Women
            </Link>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 items-center justify-center rounded-full border border-white/25 bg-black/30 p-3 text-white/80 backdrop-blur-sm">
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
              d="M19 9.5 12 16 5 9.5"
            />
          </svg>
        </div>
      </section>

      <section className="section" id="collection">
        <div className="container space-y-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                Curated Selection
              </p>
              <h2 className="text-3xl font-semibold text-slate-900">
                Featured Looks
              </h2>
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
              <p className="text-slate-600">
                No featured products available at the moment.
              </p>
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
                      <h3 className="text-lg font-semibold text-slate-900">
                        {product.name}
                      </h3>
                      {product.categories && product.categories.length > 0 && (
                        <p className="text-sm text-slate-500">
                          {product.categories[0]}
                        </p>
                      )}
                    </div>
                    <span className="text-sm font-semibold text-slate-800">
                      {formatCurrency(product.price)}
                    </span>
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
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
              Bespoke Services
            </p>
            <h2 className="text-3xl font-semibold text-slate-900 leading-tight">
              Experience Custom Luxury
            </h2>
            <p className="text-base text-slate-600">
              Schedule a private session with our expert tailors or browse our
              latest editorial curations for inspiration. We bring the studio to
              you.
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
                src="https://res.cloudinary.com/dkqtwvhq2/image/upload/v1779230069/IMG_6149_2_cdv6dt.jpg"
                alt="Zoozu_ng"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute left-4 -bottom-6 block h-[140px] w-[160px] overflow-hidden rounded-lg shadow-md md:-left-10 md:-bottom-12 md:h-[220px] md:w-[240px]">
              <Image
                src="https://res.cloudinary.com/dkqtwvhq2/image/upload/v1779229795/IMG_6148_lkiivc.jpg"
                alt="Zoozu_ng"
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
            MS
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-slate-900">
              Meet the Visionary
            </h3>
            <p className="max-w-3xl text-base text-slate-600">
              &quot;Fashion is not just about clothes; it&apos;s about the
              confidence to walk into any room and own it. Zoozu_ng is the armor
              for the modern African leader.&quot;
            </p>
            <span className="block text-sm font-medium text-slate-500">
              Marzooqa Shuka | Creative Director, Zoozu_ng
            </span>
          </div>
        </div>
      </section>

      <section className="section bg-slate-50" id="contact">
        <div className="container space-y-8">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-slate-900">
              Client Love
            </h3>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="rounded-lg border border-slate-100 bg-white p-6 shadow-sm"
              >
                <div className="mb-3 flex items-center gap-1 text-yellow-500">
                  {"★★★★★".split("").map((star, index) => (
                    <span key={`${testimonial.name}-star-${index}`} aria-hidden>
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-sm text-slate-600">{testimonial.quote}</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
                    {testimonial.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {testimonial.location}
                    </p>
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
