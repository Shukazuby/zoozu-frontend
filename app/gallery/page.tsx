import Image from "next/image";
import Link from "next/link";
import GalleryCard from "../components/GalleryCard";
import { gallerySlides } from "@/lib/gallery";

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-white py-16">
      <div className="container">
        <div className="mb-8 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
            Gallery
          </p>
          <h1 className="text-3xl font-semibold text-slate-900">Gallery</h1>
          <p className="max-w-2xl mx-auto mt-2 text-sm text-slate-600">
            A curated roll of looks and moments — real people, real style.
          </p>
        </div>

        <div className="grid gap-6 grid-cols-2">
          {gallerySlides.map((slide, i) => (
            <div key={`${slide.src}-${i}`}>
              <GalleryCard src={slide.src} alt={slide.alt} />
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-sm font-semibold text-slate-700">
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
