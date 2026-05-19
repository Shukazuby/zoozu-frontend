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
  {
    year: "2018",
    title: "Inception",
    detail:
      "Founded in Lagos with a single sewing machine and a grand vision to reshape African fashion.",
  },
  {
    year: "2020",
    title: "First Collection",
    detail:
      "Launched “The Genesis” to critical acclaim for bold use of indigenous fabrics.",
  },
  {
    year: "2022",
    title: "The Flagship",
    detail:
      "Opened our flagship atelier in Victoria Island to immerse clients in bespoke luxury.",
  },
  {
    year: "2024",
    title: "Going Global",
    detail:
      "Featured in international fashion weeks, bringing the Zoozu aesthetic to a global audience.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-white pb-16 pt-12">
      <div className="container space-y-14">
        <div className="relative overflow-hidden rounded-[2rem] bg-slate-950/95 p-10 text-center text-white shadow-2xl shadow-slate-900/10 sm:p-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(249,204,74,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(148,163,184,0.14),transparent_30%)]" />
          <div className="relative mx-auto flex max-w-3xl flex-col items-center justify-center gap-4">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/95 shadow-lg shadow-slate-900/10">
              <Image
                src="https://res.cloudinary.com/dkqtwvhq2/image/upload/v1765556450/zoozu_logo_lm422a.jpg"
                alt="Zoozu logo"
                width={96}
                height={96}
                className="h-16 w-16 object-contain"
                priority
              />
            </div>
            <span className="text-xs font-semibold uppercase tracking-[0.35em] text-yellow-400">
              Zoozu_ng
            </span>
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
              The Collection I wore when I finally felt seen.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-300">
              “I stepped into my first Zoozu piece and the room changed around
              me. This is the brand for people who want their clothes to speak
              confidence, heritage, and real modern style.
            </p>
            <p className="max-w-2xl text-base leading-7 text-slate-300 italic">
              A brand built from the voices of people who live boldly and dress
              with intention.
            </p>
            <Link
              href="/collections"
              className="inline-flex items-center justify-center rounded-full bg-yellow-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-yellow-400"
            >
              Browse the Story
            </Link>
          </div>
        </div>

        <div className="space-y-6 text-center">
          <h2 className="text-2xl font-semibold text-slate-900">
            Our Philosophy
          </h2>
          <p className="text-base text-slate-600 max-w-3xl mx-auto">
            We believe in fashion that transcends trends, rooted in deep values
            and a clear vision for the future of African luxury.
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="rounded-lg bg-slate-50 p-6 text-left shadow-sm"
              >
                <p className="text-sm font-semibold uppercase tracking-wide text-yellow-700">
                  {pillar.title}
                </p>
                <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <h3 className="text-center text-xl font-semibold text-slate-900">
            The Process
          </h3>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Ideation",
                description:
                  "We translate visions into detailed designs that reflect our values.",
                image:
                  "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=800&q=80",
              },
              {
                title: "Sourcing Fabrics",
                description:
                  "We source ethically produced fabrics for comfort, durability, and unparalleled hand feel.",
                image:
                  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80",
              },
              {
                title: "Bespoke Tailoring",
                description:
                  "Our master tailors craft each piece with precision, ensuring perfect fit and exquisite details.",
                image:
                  "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80",
              },
            ].map((step) => (
              <div
                key={step.title}
                className="rounded-lg overflow-hidden bg-white shadow-sm"
              >
                <div className="relative h-44 w-full">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-2 p-4">
                  <p className="text-sm font-semibold text-slate-900">
                    {step.title}
                  </p>
                  <p className="text-sm text-slate-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-center text-xl font-semibold text-slate-900">
            Milestones
          </h3>
          <div className="mx-auto max-w-3xl space-y-4">
            {milestones.map((item) => (
              <div
                key={item.year}
                className="rounded-lg border border-slate-100 bg-slate-50 p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-yellow-700">
                  {item.year}
                </p>
                <p className="text-sm font-semibold text-slate-900">
                  {item.title}
                </p>
                <p className="text-sm text-slate-600">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg bg-slate-50 p-8 text-center space-y-4">
          <h3 className="text-xl font-semibold text-slate-900">
            Experience the Elegance
          </h3>
          <p className="text-base text-slate-600 max-w-2xl mx-auto">
            Join us on our journey of redefining luxury. Explore our latest
            collections or book a private consultation at our atelier.
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
