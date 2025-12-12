import Image from "next/image";
import Link from "next/link";

const sizes = ["S", "M", "L", "XL", "XXL"];
const colors = ["#115e2a", "#0c4cb0", "#8b1e1e", "#1f2937", "#5a1a1a"];
const gallery = [
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80&sat=-20",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80&blend=222&sat=-40",
];

const recommendations = [
  { title: "Classic Agbada", price: "₦75,000", image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80" },
  { title: "Kaftan Tunic Set", price: "₦60,000", image: "https://images.unsplash.com/photo-1542293787938-4d273c37f3e4?auto=format&fit=crop&w=800&q=80" },
  { title: "Adire Print Shirt", price: "₦45,000", image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80" },
  { title: "Ankara Maxi Dress", price: "₦95,000", image: "https://images.unsplash.com/photo-1506863530036-1efeddceb993?auto=format&fit=crop&w=800&q=80" },
];

export default function LagosEditProductPage() {
  return (
    <div className="bg-white pb-24 pt-10">
      <div className="container space-y-14">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
          <div className="lg:w-[40%] space-y-5">
            <div className="relative h-[560px] w-full overflow-hidden rounded-lg bg-slate-50">
              <Image src={gallery[0]} alt="The Lagos Edit Senator Set" fill className="object-cover" priority />
            </div>
            <div className="grid grid-cols-4 gap-3">
              {gallery.slice(1).map((thumb, idx) => (
                <div
                  key={thumb}
                  className={`relative h-24 w-full overflow-hidden rounded border ${idx === 0 ? "border-yellow-500" : "border-slate-200"}`}
                >
                  <Image src={thumb} alt="Gallery thumbnail" fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>

          <div className="lg:w-[60%] space-y-6">
            <div className="space-y-3">
              <h1 className="text-4xl font-semibold text-slate-900 leading-tight">The Lagos Edit Senator Set</h1>
              <p className="text-lg font-semibold text-yellow-700">₦85,000</p>
              <p className="max-w-xl text-sm text-slate-700 leading-relaxed">
                Experience refined elegance with “The Lagos Edit Senator Set.” Crafted from premium, breathable fabric, this traditional attire
                features intricate, subtle embroidery along the placket and cuffs, showcasing a blend of classic Nigerian heritage and
                contemporary design. Perfect for formal events, cultural celebrations, or a distinguished everyday look.
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-800">Size</p>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    className={`h-9 min-w-[38px] rounded border px-3 text-sm font-semibold transition ${
                      size === "L" ? "border-yellow-500 bg-yellow-500 text-white" : "border-slate-200 hover:border-yellow-500"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-800">Color</p>
              <div className="flex gap-2">
                {colors.map((color, idx) => (
                  <button
                    key={color}
                    style={{ backgroundColor: color }}
                    className={`h-8 w-8 rounded-full border ${
                      idx === 0 ? "border-yellow-500 ring-2 ring-yellow-300" : "border-slate-200"
                    } shadow-sm`}
                    aria-label={`Color ${color}`}
                  />
                ))}
              </div>
            </div>

            <div className="max-w-lg">
              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded bg-yellow-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-yellow-500"
              >
                Add to Cart
              </button>
            </div>

            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h11l1 4h4l1 5H7l-1-4" />
                  <circle cx="8.5" cy="17.5" r="1.25" />
                  <circle cx="17.5" cy="17.5" r="1.25" />
                </svg>
                Free shipping on orders over ₦100,000
              </li>
              <li className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
                </svg>
                Authentic premium fabric
              </li>
              <li className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h7v4H5v8h6v4H4zm10 0h6v16h-6v-4h5V8h-5z" />
                </svg>
                Easy returns &amp; exchanges
              </li>
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">You May Also Like</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {recommendations.map((item) => (
              <Link
                key={item.title}
                href="/product/lagos-edit-senator-set"
                className="rounded-lg border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                </div>
                <div className="p-4 space-y-1">
                  <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                  <p className="text-sm font-semibold text-yellow-700">{item.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

