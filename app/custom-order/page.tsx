"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { customOrdersApi, tokenManager, type CreateCustomOrderDto } from "@/lib/api";

const garmentTypes = ["Senator Set", "Agbada", "Ankara Dress", "Kaftan Tunic", "Other (Specify below)"];
const colors = ["#1f2937", "#0f766e", "#dc2626", "#b58f2a", "#7f1d1d", "#b58f2a"];

function CustomOrderForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<CreateCustomOrderDto>({
    productId: "",
    occasion: "",
    deliveryWindow: "",
    budgetRange: "",
    garmentType: "",
    measurements: {},
    preferredFabric: "",
    preferredColors: [],
    designRequests: "",
  });
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Prefill productId from query if present
    const pid = searchParams.get("productId");
    if (pid) {
      setFormData((prev) => ({ ...prev, productId: pid }));
    }
    // Check if user is authenticated
    if (!tokenManager.isAuthenticated()) {
      router.push(`/auth/login?next=${encodeURIComponent("/custom-order")}`);
    }
  }, [router, searchParams]);

  const handleInputChange = (field: keyof CreateCustomOrderDto, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleMeasurementChange = (field: string, value: string) => {
    const numValue = value ? parseFloat(value) : undefined;
    setFormData((prev) => ({
      ...prev,
      measurements: {
        ...prev.measurements,
        [field]: numValue,
      },
    }));
  };

  const handleColorToggle = (color: string) => {
    setSelectedColors((prev) => {
      const isSelected = prev.includes(color);
      if (isSelected) {
        return prev.filter((c) => c !== color);
      } else {
        return [...prev, color];
      }
    });
  };

  useEffect(() => {
    handleInputChange("preferredColors", selectedColors);
  }, [selectedColors]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tokenManager.isAuthenticated()) {
      router.push(`/auth/login?next=${encodeURIComponent("/custom-order")}`);
      return;
    }

    // Validation
    if (!formData.occasion || !formData.deliveryWindow || !formData.garmentType) {
      setError("Please fill in all required fields (Occasion, Delivery Window, and Garment Type)");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const payload: CreateCustomOrderDto = {
        occasion: formData.occasion,
        deliveryWindow: formData.deliveryWindow,
        garmentType: formData.garmentType,
        budgetRange: formData.budgetRange || undefined,
        measurements: Object.keys(formData.measurements || {}).length > 0 ? formData.measurements : undefined,
        preferredFabric: formData.preferredFabric || undefined,
        preferredColors: selectedColors.length > 0 ? selectedColors : undefined,
        designRequests: formData.designRequests || undefined,
        productId: formData.productId || undefined,
      };

      const response = await customOrdersApi.create(payload);
      
      if (response.success) {
        setSuccess(true);
        // Reset form
        setFormData({
          productId: formData.productId || "",
          occasion: "",
          deliveryWindow: "",
          budgetRange: "",
          garmentType: "",
          measurements: {},
          preferredFabric: "",
          preferredColors: [],
          designRequests: "",
        });
        setSelectedColors([]);
        
        // Redirect after 3 seconds or show success message
        setTimeout(() => {
          router.push("/profile");
        }, 3000);
      } else {
        setError(response.message || "Failed to submit custom order request");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to submit custom order request. Please try again.");
      console.error("Custom order submission error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-slate-50 pb-16 pt-12">
        <div className="container">
          <div className="rounded-lg bg-white p-8 shadow-sm text-center">
            <div className="mb-4 text-4xl">✓</div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">Order Request Submitted!</h2>
            <p className="text-slate-600 mb-4">
              Our team will contact you within 24 hours to confirm details and provide a quote.
            </p>
            <Link href="/profile" className="text-yellow-700 hover:text-yellow-600 font-semibold">
              View your orders →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 pb-16 pt-12">
      <div className="container space-y-10">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-semibold text-slate-900">Book Your Custom Order</h1>
          <p className="text-base text-slate-600 max-w-2xl mx-auto">
            Craft your unique style with our custom order service. Fill out the form below to bring
            your vision to life, and our expert team will get in touch to refine the details.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-lg bg-white p-8 shadow-sm">
          {error && (
            <div className="mb-6 rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">Project Details</h2>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 required">Occasion / Use Case</label>
                  <input
                    required
                    value={formData.occasion}
                    onChange={(e) => handleInputChange("occasion", e.target.value)}
                    className="w-full rounded border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-yellow-500"
                    placeholder="Wedding guest, business event, casual, etc."
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 required">Preferred Delivery Window</label>
                  <select
                    required
                    value={formData.deliveryWindow}
                    onChange={(e) => handleInputChange("deliveryWindow", e.target.value)}
                    className="w-full rounded border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-yellow-500"
                  >
                    <option value="">Select a timeline</option>
                    <option value="2 weeks">2 weeks</option>
                    <option value="3-4 weeks">3-4 weeks</option>
                    <option value="5-6 weeks">5-6 weeks</option>
                    <option value="Flexible">Flexible</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Budget Range (Optional)</label>
                  <input
                    value={formData.budgetRange}
                    onChange={(e) => handleInputChange("budgetRange", e.target.value)}
                    className="w-full rounded border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-yellow-500"
                    placeholder="e.g., ₦80,000 - ₦150,000"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-1">
                Desired Garment Type <span className="text-red-600" aria-hidden="true">*</span>
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {garmentTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleInputChange("garmentType", type === "Other (Specify below)" ? "Other" : type)}
                    className={`rounded border px-4 py-3 text-left text-sm font-semibold transition ${
                      formData.garmentType === (type === "Other (Specify below)" ? "Other" : type)
                        ? "border-yellow-500 bg-yellow-50 text-yellow-700"
                        : "border-slate-200 text-slate-800 hover:border-yellow-500"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">Custom Measurements (in inches)</h2>
            <div className="grid gap-3 md:grid-cols-3">
              {[
                { key: "chest", label: "Chest" },
                { key: "waist", label: "Waist" },
                { key: "hip", label: "Hip" },
                { key: "shoulder", label: "Shoulder" },
                { key: "sleeveLength", label: "Sleeve Length" },
                { key: "garmentLength", label: "Garment Length" },
              ].map(({ key, label }) => (
                <div key={key} className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">{label}</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.measurements?.[key as keyof typeof formData.measurements] || ""}
                    onChange={(e) => handleMeasurementChange(key, e.target.value)}
                    className="w-full rounded border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-yellow-500"
                    placeholder="e.g., 40"
                  />
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500">
              Please provide as many measurements as possible. If unsure, leave blank.
            </p>
          </div>

          <div className="mt-6 space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">Fabric &amp; Color Preferences</h2>
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700">Preferred Fabric Type</label>
              <div className="relative">
                <select
                  value={formData.preferredFabric || ""}
                  onChange={(e) => handleInputChange("preferredFabric", e.target.value)}
                  className="w-full rounded border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-yellow-500"
                >
                  <option value="">Select a fabric type</option>
                  <option value="Silk">Silk</option>
                  <option value="Linen">Linen</option>
                  <option value="Cashmere">Cashmere</option>
                  <option value="Ankara">Ankara</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-700">Preferred Colors</p>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleColorToggle(color)}
                    style={{ backgroundColor: color }}
                    className={`h-8 w-8 rounded-full border shadow-sm transition hover:scale-105 ${
                      selectedColors.includes(color) ? "ring-2 ring-yellow-500 ring-offset-2" : "border-slate-200"
                    }`}
                    aria-label={`Color ${color}`}
                  />
                ))}
              </div>
              <p className="text-xs text-slate-500">
                Click to select colors. You can specify more details below.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">Detailed Design Requests</h2>
            <textarea
              value={formData.designRequests}
              onChange={(e) => handleInputChange("designRequests", e.target.value)}
              className="min-h-[160px] w-full rounded border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-yellow-500"
              placeholder="Describe your ideal design, specific embroidery, fit preferences, desired occasion, or any reference images you might have."
            />
          </div>

          <div className="mt-8 flex items-center justify-center">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 rounded bg-yellow-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span aria-hidden>➜</span> {submitting ? "Submitting..." : "Submit Custom Order Request"}
            </button>
          </div>
        </form>

        <p className="text-center text-xs text-slate-500">
          Our team will contact you within 24 hours to confirm details and provide a quote.{" "}
          <Link href="/contact" className="font-semibold text-slate-700 underline">
            Need help?
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function CustomOrderPage() {
  return (
    <Suspense fallback={
      <div className="bg-slate-50 min-h-screen pb-16 pt-12">
        <div className="container">
          <div className="flex flex-col items-center justify-center py-16">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-yellow-600"></div>
            <p className="mt-4 text-sm text-slate-600">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <CustomOrderForm />
    </Suspense>
  );
}
