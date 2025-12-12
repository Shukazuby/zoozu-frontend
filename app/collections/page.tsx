"use client";
import Image from "next/image";
import Link from "next/link";
import FilterDropdown from "../components/FilterDropdown";
import { useState, useEffect } from "react";
import { useProducts } from "@/lib/hooks";
import { type Product } from "@/lib/api";

const formatCurrency = (value: number) => `₦${value.toLocaleString()}`;

const categoryOptions = ["All", "Dress", "Jalabiya", "Agbada", "Kaftan", "Ankara", "Ready-to-Wear", "Two-Piece ", "Two-Piece ", "Bou-Bou"];
const priceOptions = ["All Prices", "Under ₦30,000", "₦30,000 - ₦60,000", "₦60,000 - ₦100,000", "Over ₦100,000"];
const availabilityOptions = ["All", "In Stock", "Pre-Order"];
const sortOptions = ["New Arrivals", "Price: Low to High", "Price: High to Low", "Most Popular", "Name: A-Z"];

export default function CollectionsPage() {
  const { products, loading, error, getProducts } = useProducts();
  const [selectedCategoryButton, setSelectedCategoryButton] = useState<string>("All Collections");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [selectedPrice, setSelectedPrice] = useState<string | undefined>();
  const [selectedAvailability, setSelectedAvailability] = useState<string | undefined>();
  const [selectedSort, setSelectedSort] = useState("New Arrivals");

  useEffect(() => {
    const filters: any = {
      page: 1,
      limit: 50,
    };

    // Apply category button filter (Men, Women, Ready-to-Wear, etc.)
    if (selectedCategoryButton === "Men") {
      filters.gender = "men";
    } else if (selectedCategoryButton === "Women") {
      filters.gender = "women";
    } else if (selectedCategoryButton === "Ready-to-Wear") {
      filters.category = "Ready-to-Wear";
    } else if (selectedCategoryButton === "Bridal") {
      filters.category = "Bridal";
    } else if (selectedCategoryButton === "Bespoke") {
      filters.availability = "bespoke";
    } else if (selectedCategoryButton === "Accessories") {
      filters.category = "Accessories";
    }

    // Apply category filter from dropdown
    if (selectedCategory && selectedCategory !== "All") {
      filters.category = selectedCategory;
    }

    // Apply price filter
    if (selectedPrice && selectedPrice !== "All Prices") {
      if (selectedPrice === "Under ₦30,000") {
        filters.maxPrice = 30000;
      } else if (selectedPrice === "₦30,000 - ₦60,000") {
        filters.minPrice = 30000;
        filters.maxPrice = 60000;
      } else if (selectedPrice === "₦60,000 - ₦100,000") {
        filters.minPrice = 60000;
        filters.maxPrice = 100000;
      } else if (selectedPrice === "Over ₦100,000") {
        filters.minPrice = 100000;
      }
    }

    // Apply availability filter
    if (selectedAvailability && selectedAvailability !== "All") {
      if (selectedAvailability === "In Stock") {
        filters.availability = "in-stock";
      } else if (selectedAvailability === "Pre-Order") {
        filters.availability = "pre-order";
      } else if (selectedAvailability === "Bespoke Only") {
        filters.availability = "bespoke";
      }
    }

    // Apply sort
    if (selectedSort) {
      if (selectedSort === "New Arrivals") {
        filters.sortBy = "new-arrivals";
      } else if (selectedSort === "Price: Low to High") {
        filters.sortBy = "price-low";
      } else if (selectedSort === "Price: High to Low") {
        filters.sortBy = "price-high";
      } else if (selectedSort === "Most Popular") {
        filters.sortBy = "popular";
      } else if (selectedSort === "Name: A-Z") {
        filters.sortBy = "name";
      }
    }

    getProducts(filters);
  }, [selectedCategoryButton, selectedCategory, selectedPrice, selectedAvailability, selectedSort, getProducts]);

  return (
    <div className="bg-white pb-16 pt-12">
      <div className="container space-y-10">
        <div className="text-center space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-yellow-700">Spring / Summer 2024</p>
          <h1 className="text-4xl font-semibold text-slate-900">The Lagos Essence Collection</h1>
          <p className="text-base text-slate-600 max-w-2xl mx-auto">
            Exploring the vibrancy of Nigerian heritage through modern cuts and premium fabrics.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-semibold text-slate-700">
          {["All Collections", "Men", "Women"].map((item) => (
            <button
              key={item}
              onClick={() => setSelectedCategoryButton(item)}
              className={`rounded-full border px-4 py-2 transition ${
                selectedCategoryButton === item
                  ? "border-yellow-600 text-yellow-700 bg-yellow-50"
                  : "border-transparent text-slate-600 hover:border-slate-200"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
          <div className="flex gap-2">
            <FilterDropdown label="Category" options={categoryOptions} selected={selectedCategory} onSelect={setSelectedCategory} />
            <FilterDropdown label="Price" options={priceOptions} selected={selectedPrice} onSelect={setSelectedPrice} />
            <FilterDropdown label="Availability" options={availabilityOptions} selected={selectedAvailability} onSelect={setSelectedAvailability} />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">Sort by:</span>
            <FilterDropdown label="New Arrivals" options={sortOptions} selected={selectedSort} onSelect={setSelectedSort} />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-600">Loading products...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600">No products found.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {products.map((product: Product) => (
                <Link
                  key={product._id}
                  href={`/product/${product._id}`}
                  className="overflow-hidden rounded-lg border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative h-72 w-full">
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
                      <span className="absolute left-3 top-3 rounded bg-yellow-600 px-3 py-1 text-xs font-semibold uppercase text-slate-900">
                        {product.badge}
                      </span>
                    )}
                    {product.tag && (
                      <span className="absolute right-3 top-3 rounded bg-slate-900 px-3 py-1 text-xs font-semibold uppercase text-white">
                        {product.tag}
                      </span>
                    )}
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-yellow-700">{product.tag || (product.categories && product.categories[0])}</p>
                      <p className="text-sm font-semibold text-slate-800">{formatCurrency(product.price)}</p>
                    </div>
                    <p className="text-lg font-semibold text-slate-900">{product.name}</p>
                    <p className="text-sm text-slate-600 line-clamp-2">{product.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

