import Image from "next/image";
import Link from "next/link";

const pillars = [
  {
    title: "Mission",
    description:
      "To redefine African luxury by delivering impeccable tailoring and unique silhouettes to the world, creating a legacy of excellence.",
  },
  {
    title: "Vision",
    description:
      "To become a globally recognized beacon of Nigerian craftsmanship and sartorial excellence, inspiring confidence in every wearer.",
  },
  {
    title: "Values",
    description:
      "Sustainability, precision, heritage, and an unwavering commitment to quality in every fabric sourced and stitch sewn.",
  },
];

const milestones = [
  { year: "2018", title: "Inception", detail: "Founded in Lagos with a single sewing machine and a grand vision to reshape African fashion." },
  { year: "2020", title: "First Collection", detail: "Launched “The Genesis” to critical acclaim for bold use of indigenous fabrics." },
  { year: "2022", title: "The Flagship", detail: "Opened our flagship atelier in Victoria Island to immerse clients in bespoke luxury." },
  { year: "2024", title: "Going Global", detail: "Featured in international fashion weeks, bringing the Zoozu aesthetic to a global audience." },
];

export default function AboutPage() {
  return (
    <div className="bg-white pb-16 pt-12">
      <div className="container space-y-14">
        <div className="grid gap-10 lg:grid-cols-[1fr,1.1fr] lg:items-center">
          <div className="relative h-[420px] w-full overflow-hidden rounded-lg bg-slate-100">
            <Image
              src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80"
              alt="Designer in a tailored suit"
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-yellow-700">The Designer</p>
            <h1 className="text-4xl font-semibold text-slate-900">The Soul of Zoozu</h1>
            <p className="text-base text-slate-700 leading-relaxed">
              Merging Nigerian heritage with modern tailoring, Zoozu_ng stands at the intersection of tradition and contemporary luxury.
              We craft pieces that tell a story of elegance, precision, and timeless style.
            </p>
            <p className="text-sm text-slate-600">
              “Fashion is not just about clothing; it is about identity. Every stitch we make is a dialogue between the rich history of
              African craftsmanship and the bold future of global fashion.”
            </p>
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 rounded border border-yellow-600 px-4 py-2 text-sm font-semibold text-yellow-700 transition hover:bg-yellow-50"
            >
              Read Full Bio
            </Link>
          </div>
        </div>

        <div className="space-y-6 text-center">
          <h2 className="text-2xl font-semibold text-slate-900">Our Philosophy</h2>
          <p className="text-base text-slate-600 max-w-3xl mx-auto">
            We believe in fashion that transcends trends, rooted in deep values and a clear vision for the future of African luxury.
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {pillars.map((pillar) => (
              <div key={pillar.title} className="rounded-lg bg-slate-50 p-6 text-left shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-wide text-yellow-700">{pillar.title}</p>
                <p className="mt-2 text-sm text-slate-700 leading-relaxed">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <h3 className="text-center text-xl font-semibold text-slate-900">The Process</h3>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Sketching & Ideation",
                description: "We translate visions into detailed sketches and technical drawings that map every contour.",
                image: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=800&q=80",
              },
              {
                title: "Sourcing Fabrics",
                description: "We source ethically produced fabrics for comfort, durability, and unparalleled hand feel.",
                image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80",
              },
              {
                title: "Bespoke Tailoring",
                description: "Our master tailors craft each piece with precision, ensuring perfect fit and exquisite details.",
                image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80",
              },
            ].map((step) => (
              <div key={step.title} className="rounded-lg overflow-hidden bg-white shadow-sm">
                <div className="relative h-44 w-full">
                  <Image src={step.image} alt={step.title} fill className="object-cover" />
                </div>
                <div className="space-y-2 p-4">
                  <p className="text-sm font-semibold text-slate-900">{step.title}</p>
                  <p className="text-sm text-slate-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-center text-xl font-semibold text-slate-900">Milestones</h3>
          <div className="mx-auto max-w-3xl space-y-4">
            {milestones.map((item) => (
              <div key={item.year} className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-yellow-700">{item.year}</p>
                <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                <p className="text-sm text-slate-600">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg bg-slate-50 p-8 text-center space-y-4">
          <h3 className="text-xl font-semibold text-slate-900">Experience the Elegance</h3>
          <p className="text-base text-slate-600 max-w-2xl mx-auto">
            Join us on our journey of redefining luxury. Explore our latest collections or book a private consultation at our atelier.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/collections"
              className="rounded bg-yellow-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-yellow-500"
            >
              View Collections
            </Link>
            <Link
              href="/contact"
              className="rounded border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-yellow-500"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

