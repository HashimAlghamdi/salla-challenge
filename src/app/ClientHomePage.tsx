'use client';

import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Product } from '@/interfaces/Product';
import { Category } from '@/interfaces/Category';
import Loader from './components/Loader';
import ProductCarousel from './components/ProductsCarousel';
import CatalogToolbar from './components/CatalogToolbar';
import ProductCard from './components/ProductCard';

const ClientHomePage = ({
  initialData,
}: {
  initialData: { products: Product[]; categories: Category[] };
}) => {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | number>('all');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 8;
  const catalogRef = useRef<HTMLDivElement>(null);
  const [carouselProducts, setCarouselProducts] = useState<Product[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Read URL params when component mounts or URL changes
  useEffect(() => {
    setIsLoading(true);
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
    setIsLoading(false);
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    return initialData.products.filter(product => {
      const matchesSearch =
        !searchQuery.trim() || product.name?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.categoryId === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [initialData.products, searchQuery, selectedCategory]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    return filteredProducts.slice(0, startIndex + itemsPerPage);
  }, [filteredProducts, page, itemsPerPage]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setPage(1);
  }, []);

  const handleCategoryChange = useCallback((categoryId: number | string) => {
    setSelectedCategory(categoryId);
    setPage(1);
  }, []);

  const loadMore = useCallback(() => {
    if (paginatedProducts.length < filteredProducts.length) {
      setPage(prevPage => prevPage + 1);
    }
  }, [paginatedProducts.length, filteredProducts.length]);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 1000) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore]);

  // Load first 5 products
  useEffect(() => {
    const initial = initialData.products.slice(0, 5);
    setCarouselProducts(initial);
  }, [initialData.products]);

  // Load next 5 products
  const loadNextProducts = () => {
    const nextProducts = initialData.products.slice(currentIndex + 5, currentIndex + 10);
    if (nextProducts.length > 0) {
      setCarouselProducts(prev => [...prev, ...nextProducts]);
      setCurrentIndex(prev => prev + 5);
    }
  };

  // Handle when carousel reaches end
  const handleSlideChange = (isEnd: boolean) => {
    if (isEnd && currentIndex + 5 < initialData.products.length) {
      loadNextProducts();
    }
  };

  if (isLoading) {
    return <Loader className="w-1/3 h-[60vh]" />;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Featured Products Carousel */}
      <section className="featured-products">
        <ProductCarousel onSlideChange={handleSlideChange} products={carouselProducts} />
      </section>
      {/* Catalog Section */}
      <section ref={catalogRef} className="catalog">
        <CatalogToolbar onSearch={handleSearch} onCategoryChange={handleCategoryChange} />

        {filteredProducts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">لا توجد منتجات متطابقة مع بحثك</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {paginatedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {paginatedProducts.length < filteredProducts.length && (
          <div className="text-center py-8">
            <button
              onClick={loadMore}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-d transition-colors"
            >
              تحميل المزيد
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default ClientHomePage;
