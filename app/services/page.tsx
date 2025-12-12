import Image from "next/image";
import Link from "next/link";

const services = [
  {
    title: "Bespoke Tailoring",
    description:
      "Custom-made garments cut to your exact measurements, fusing fine hand-finish with modern silhouettes. We ensure every stitch complements your unique physique while selecting only the finest fabrics sourced globally.",
    bullets: ["Precise measurements & fittings", "Premium material curation", "Hand-finished details"],
    image: "https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&w=800&q=80",
    cta: "Book Consultation",
  },
  {
    title: "Bridal Services",
    description:
      "Exquisite gowns for your special day. From initial consult to the final fitting, we create timeless designs tailored to your story and crafted to match your aura and style.",
    bullets: ["Personalized design sessions", "Luxury fabric selection", "On-site wedding styling"],
    image: "https://images.unsplash.com/photo-1529634895638-1678f0d1f4d9?auto=format&fit=crop&w=800&q=80",
    cta: "Inquire Now",
  },
  {
    title: "Personal Styling",
    description:
      "Curating your wardrobe to reflect your personal brand and lifestyle. We help you define your look with expert advice on fits, color, and seasonal trends.",
    bullets: ["Wardrobe audit & organization", "Lookbook-based styling", "Seasonal capsules"],
    image: "https://images.unsplash.com/photo-1475180098004-ca77a66827be?auto=format&fit=crop&w=800&q=80",
    cta: "Start Styling",
  },
  {
    title: "Luxury Alterations",
    description:
      "Refining the fit of your existing wardrobe or finer tux. Whether it’s a vintage find or a designer piece, our master tailors rework every garment with meticulous care to ensure it fits as second-skin.",
    bullets: ["Hemming", "Resizing", "Bespoke repair & finishes"],
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80",
    cta: "Book Alteration",
  },
];

export default function ServicesPage() {
  return (
    <div className="bg-white pb-16 pt-10">
      <div className="container space-y-12">
        <div className="rounded-xl bg-[url('https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center p-10 text-white shadow-lg">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-200">Excellence in every stitch</p>
            <h1 className="text-4xl font-semibold">Our Craft & Services</h1>
            <p className="text-base text-slate-100">
              Elevating Nigerian fashion through bespoke tailoring, intricate design, and an unwavering commitment to the perfect fit.
            </p>
            <div className="flex gap-3">
              <Link href="/collections" className="rounded bg-yellow-600 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-yellow-500">
                View Collections
              </Link>
              <Link
                href="/bespoke-fitting"
                className="rounded border border-white/70 px-4 py-3 text-sm font-semibold text-white transition hover:border-yellow-300"
              >
                Book Appointment
              </Link>
            </div>
          </div>
        </div>

        <div className="space-y-4 text-center">
          <h2 className="text-2xl font-semibold text-slate-900">We blend traditional tailoring with contemporary aesthetics</h2>
          <p className="text-base text-slate-600 max-w-3xl mx-auto">
            We craft pieces that speak volumes—meticulous construction and Nigerian heritage in every detail.
          </p>
        </div>

        <div className="space-y-10">
          {services.map((service, idx) => (
            <div
              key={service.title}
              className={`grid gap-8 rounded-lg bg-slate-50 p-6 shadow-sm lg:grid-cols-2 lg:items-center ${
                idx % 2 === 1 ? "lg:grid-flow-dense" : ""
              }`}
            >
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-yellow-700">Service 0{idx + 1}</p>
                <h3 className="text-xl font-semibold text-slate-900">{service.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{service.description}</p>
                <ul className="space-y-2 text-sm text-slate-700">
                  {service.bullets.map((point) => (
                    <li key={point} className="flex items-center gap-2">
                      <span aria-hidden>•</span>
                      {point}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded border border-yellow-600 px-4 py-2 text-sm font-semibold text-yellow-700 transition hover:bg-yellow-50"
                >
                  {service.cta}
                </Link>
              </div>
              <div className="relative h-64 w-full overflow-hidden rounded-lg">
                <Image src={service.image} alt={service.title} fill className="object-cover" />
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-lg bg-slate-50 p-8 text-center shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900">Ready to transform your look?</h3>
          <p className="mt-2 text-sm text-slate-600 max-w-2xl mx-auto">
            Schedule a consultation with our style strategists and experience the difference of true craftsmanship.
          </p>
          <div className="mt-4 flex justify-center">
            <Link href="/bespoke-fitting" className="rounded bg-yellow-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-yellow-500">
              Book Appointment Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

