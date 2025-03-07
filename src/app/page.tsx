"use client";

import { useProducts } from "@/contexts/ProductsContext";
import { useEffect, useState, useMemo, useCallback, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductCarousel from "./components/ProductsCarousel";
import ProductCard from "./components/ProductCard";
import Loader from "./components/Loader";
import CatalogToolbar from "./components/CatalogToolbar";
import ErrorMessage from "./components/ErrorMessage";
import Link from "next/link";

export default function Home() {
  const { products, isLoading, error } = useProducts();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | number>("all");
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;
  const catalogRef = useRef<HTMLDivElement>(null);

  // Read URL params when component mounts or URL changes
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    const searchFromUrl = searchParams.get('search');

    if (categoryFromUrl) {
      setSelectedCategory(Number(categoryFromUrl));
      setPage(1);
    }

    if (searchFromUrl) {
      setSearchQuery(searchFromUrl);
      setPage(1);
    }

    // Scroll to catalog if either param exists
    if (categoryFromUrl || searchFromUrl) {
      catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        !searchQuery.trim() ||
        product.name?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || product.categoryId === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, page * itemsPerPage);
  }, [filteredProducts, page]);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 100
    ) {
      if (displayedProducts.length < filteredProducts.length) {
        setPage((prev) => prev + 1);
      }
    }
  }, [displayedProducts.length, filteredProducts.length]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  if (isLoading) {
    return <Loader className="w-1/3 h-[60vh]" />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleCategoryChange = (categoryId: number | string) => {
    setSelectedCategory(categoryId);
    setPage(1);
  };

  const renderProducts = () => {
    if (displayedProducts.length === 0) {
      return (
        <div className="col-span-full text-center py-8">
          <h2 className="text-xl mb-4">لا توجد منتجات متطابقة مع البحث</h2>
          <Link 
            href="/"
            className="text-primary hover:underline"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
          >
            عرض جميع المنتجات
          </Link>
        </div>
      );
    }

    return displayedProducts.map((product) => (
      <ProductCard key={product.id} product={product} />
    ));
  };

  return (
    <Suspense fallback={<Loader className="w-1/4 h-[60vh]" />}>
      <div className="w-full bg-gray-100 rounded-lg mb-8">
        <ProductCarousel products={products} />
      </div>

      <div ref={catalogRef}>
        <CatalogToolbar
          onSearch={handleSearch}
          onCategoryChange={handleCategoryChange}
        />

        <div className="grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-2 sm:gap-4">
          {renderProducts()}
        </div>

        {displayedProducts.length > 0 && displayedProducts.length < filteredProducts.length && (
          <div className="w-full py-4">
            <Loader className="w-8 h-8" />
          </div>
        )}
      </div>
    </Suspense>
  );
}
