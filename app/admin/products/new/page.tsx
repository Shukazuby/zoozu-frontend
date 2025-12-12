"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { productsApi } from "@/lib/api";
import Link from "next/link";

const commonSizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
const commonColors = [
  { name: "Black", value: "#000000" },
  { name: "White", value: "#FFFFFF" },
  { name: "Navy", value: "#000080" },
  { name: "Gray", value: "#808080" },
  { name: "Brown", value: "#A52A2A" },
  { name: "Beige", value: "#F5F5DC" },
  { name: "Red", value: "#FF0000" },
  { name: "Blue", value: "#0000FF" },
  { name: "Green", value: "#008000" },
];

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    gender: "men",
    stock: "",
    badge: "",
    tag: "",
    isAvailable: true,
    isBespoke: false,
    isPreOrder: false,
    isNew: false,
    isFeatured: false,
  });

  const [images, setImages] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryInput, setCategoryInput] = useState("");
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [colorInput, setColorInput] = useState("");

  const handleAddCategory = () => {
    if (categoryInput.trim() && !categories.includes(categoryInput.trim())) {
      setCategories([...categories, categoryInput.trim()]);
      setCategoryInput("");
    }
  };

  const handleRemoveCategory = (category: string) => {
    setCategories(categories.filter((c) => c !== category));
  };

  const handleAddSize = (size: string) => {
    if (!sizes.includes(size)) {
      setSizes([...sizes, size]);
    } else {
      setSizes(sizes.filter((s) => s !== size));
    }
  };

  const handleAddColor = () => {
    if (colorInput.trim() && !colors.includes(colorInput.trim())) {
      setColors([...colors, colorInput.trim()]);
      setColorInput("");
    }
  };

  const handleRemoveColor = (color: string) => {
    setColors(colors.filter((c) => c !== color));
  };

  const handleImageUrlAdd = () => {
    const urlInput = (document.getElementById("image-url") as HTMLInputElement)?.value;
    if (urlInput?.trim() && !imageUrls.includes(urlInput.trim())) {
      setImageUrls([...imageUrls, urlInput.trim()]);
      (document.getElementById("image-url") as HTMLInputElement).value = "";
    }
  };

  const handleRemoveImageUrl = (url: string) => {
    setImageUrls(imageUrls.filter((u) => u !== url));
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles([...imageFiles, ...files]);
  };

  const handleRemoveImageFile = (index: number) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const formDataToSend = new FormData();

      // Add all form fields
      formDataToSend.append("name", formData.name);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("gender", formData.gender);
      formDataToSend.append("stock", formData.stock || "0");
      formDataToSend.append("isAvailable", String(formData.isAvailable));
      formDataToSend.append("isBespoke", String(formData.isBespoke));
      formDataToSend.append("isPreOrder", String(formData.isPreOrder));
      formDataToSend.append("isNew", String(formData.isNew));
      formDataToSend.append("isFeatured", String(formData.isFeatured));

      if (formData.badge) {
        formDataToSend.append("badge", formData.badge);
      }
      if (formData.tag) {
        formDataToSend.append("tag", formData.tag);
      }

      // Add arrays
      if (categories.length > 0) {
        formDataToSend.append("categories", JSON.stringify(categories));
      }
      if (sizes.length > 0) {
        formDataToSend.append("sizes", JSON.stringify(sizes));
      }
      if (colors.length > 0) {
        formDataToSend.append("colors", JSON.stringify(colors));
      }

      // Add image URLs
      if (imageUrls.length > 0) {
        formDataToSend.append("images", JSON.stringify(imageUrls));
      }

      // Add image files (only the first one as the endpoint accepts single file)
      if (imageFiles.length > 0) {
        formDataToSend.append("image", imageFiles[0]);
      }

      const response = await productsApi.createProduct(formDataToSend);

      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/admin/products");
        }, 2000);
      } else {
        setError(response.message || "Failed to create product");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">Add New Product</h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1">Create a new product for your catalog</p>
        </div>
        <Link
          href="/admin/products"
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-yellow-500"
        >
          ← Back to Products
        </Link>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
          Product created successfully! Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-lg bg-white shadow-sm border border-slate-200 p-4 sm:p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Basic Information</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-slate-800 mb-1">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-yellow-600 focus:ring-1 focus:ring-yellow-500"
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1">
                  Price (₦) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-yellow-600 focus:ring-1 focus:ring-yellow-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-yellow-600 focus:ring-1 focus:ring-yellow-500"
                  placeholder="0"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-slate-800 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-yellow-600 focus:ring-1 focus:ring-yellow-500"
                  placeholder="Enter product description"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-yellow-600 focus:ring-1 focus:ring-yellow-500"
                >
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="unisex">Unisex</option>
                </select>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Categories</h2>
            <div className="flex flex-col sm:flex-row gap-2 mb-3">
              <input
                type="text"
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCategory();
                  }
                }}
                className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-yellow-600 focus:ring-1 focus:ring-yellow-500"
                placeholder="Enter category name"
              />
              <button
                type="button"
                onClick={handleAddCategory}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-yellow-500 whitespace-nowrap"
              >
                Add Category
              </button>
            </div>
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-2 rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-slate-900"
                  >
                    {cat}
                    <button
                      type="button"
                      onClick={() => handleRemoveCategory(cat)}
                      className="text-slate-600 hover:text-slate-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Sizes */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Sizes</h2>
            <div className="flex flex-wrap gap-2">
              {commonSizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleAddSize(size)}
                  className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                    sizes.includes(size)
                      ? "border-yellow-600 bg-yellow-600 text-slate-900"
                      : "border-slate-300 text-slate-700 hover:border-yellow-500"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            {sizes.length > 0 && (
              <p className="mt-2 text-xs text-slate-600">Selected: {sizes.join(", ")}</p>
            )}
          </div>

          {/* Colors */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Colors</h2>
            <div className="flex flex-col sm:flex-row gap-2 mb-3">
              <input
                type="text"
                value={colorInput}
                onChange={(e) => setColorInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddColor();
                  }
                }}
                className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-yellow-600 focus:ring-1 focus:ring-yellow-500"
                placeholder="Enter color code (e.g., #000000) or name"
              />
              <button
                type="button"
                onClick={handleAddColor}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-yellow-500 whitespace-nowrap"
              >
                Add Color
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {commonColors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => {
                    if (!colors.includes(color.value)) {
                      setColors([...colors, color.value]);
                    } else {
                      setColors(colors.filter((c) => c !== color.value));
                    }
                  }}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                    colors.includes(color.value)
                      ? "border-yellow-600 bg-yellow-100 text-slate-900"
                      : "border-slate-300 text-slate-700 hover:border-yellow-500"
                  }`}
                >
                  <div
                    className="h-4 w-4 rounded border border-slate-300"
                    style={{ backgroundColor: color.value }}
                  />
                  {color.name}
                </button>
              ))}
            </div>
            {colors.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <span
                    key={color}
                    className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-900"
                  >
                    <div
                      className="h-3 w-3 rounded border border-slate-300"
                      style={{ backgroundColor: color }}
                    />
                    {color}
                    <button
                      type="button"
                      onClick={() => handleRemoveColor(color)}
                      className="text-slate-600 hover:text-slate-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Images */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Product Images</h2>
            
            {/* Image URLs */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-800 mb-2">Image URLs</label>
              <div className="flex flex-col sm:flex-row gap-2 mb-3">
                <input
                  id="image-url"
                  type="url"
                  className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-yellow-600 focus:ring-1 focus:ring-yellow-500"
                  placeholder="https://example.com/image.jpg"
                />
                <button
                  type="button"
                  onClick={handleImageUrlAdd}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-yellow-500 whitespace-nowrap"
                >
                  Add URL
                </button>
              </div>
              {imageUrls.length > 0 && (
                <div className="space-y-2">
                  {imageUrls.map((url, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-lg border border-slate-200 p-2"
                    >
                      <span className="text-xs text-slate-600 truncate flex-1">{url}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveImageUrl(url)}
                        className="ml-2 text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Image File Upload */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">Upload Image File</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-yellow-600 focus:ring-1 focus:ring-yellow-500"
              />
              {imageFiles.length > 0 && (
                <div className="mt-3 space-y-2">
                  {imageFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-lg border border-slate-200 p-2"
                    >
                      <span className="text-xs text-slate-600 truncate flex-1">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveImageFile(idx)}
                        className="ml-2 text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p className="mt-2 text-xs text-slate-500">
                Note: Only one file can be uploaded at a time. You can add multiple image URLs instead.
              </p>
            </div>
          </div>

          {/* Product Options */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Product Options</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1">Badge</label>
                <input
                  type="text"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-yellow-600 focus:ring-1 focus:ring-yellow-500"
                  placeholder="e.g., New Season, Limited Edition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1">Tag</label>
                <input
                  type="text"
                  value={formData.tag}
                  onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-yellow-600 focus:ring-1 focus:ring-yellow-500"
                  placeholder="e.g., Bespoke, Premium"
                />
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isAvailable}
                  onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-yellow-600 focus:ring-yellow-500"
                />
                <span className="text-sm font-semibold text-slate-800">Available for purchase</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isBespoke}
                  onChange={(e) => setFormData({ ...formData, isBespoke: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-yellow-600 focus:ring-yellow-500"
                />
                <span className="text-sm font-semibold text-slate-800">Bespoke/Custom Order</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isPreOrder}
                  onChange={(e) => setFormData({ ...formData, isPreOrder: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-yellow-600 focus:ring-yellow-500"
                />
                <span className="text-sm font-semibold text-slate-800">Pre-Order</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isNew}
                  onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-yellow-600 focus:ring-yellow-500"
                />
                <span className="text-sm font-semibold text-slate-800">New Arrival</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-yellow-600 focus:ring-yellow-500"
                />
                <span className="text-sm font-semibold text-slate-800">Featured Product</span>
              </label>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3">
          <Link
            href="/admin/products"
            className="w-full sm:w-auto rounded-lg border border-slate-300 px-6 py-2 text-sm font-semibold text-slate-700 transition hover:border-yellow-500 text-center"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto rounded-lg bg-yellow-600 px-6 py-2 text-sm font-semibold text-slate-900 transition hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Creating Product..." : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
}

