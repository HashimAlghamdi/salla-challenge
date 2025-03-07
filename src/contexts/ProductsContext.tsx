"use client";

import React, { createContext, useState, useEffect, useContext } from 'react';
import { Product } from "@/interfaces/Product";
import { productsService } from "@/services/products.service";

interface ProductsContextType {
  products: Product[];
  isLoading: boolean;
  error: string | null;
}

const ProductsContext = createContext<ProductsContextType>({
  products: [],
  isLoading: true,
  error: null,
});

export const ProductsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setError(null);
        const data = await productsService.getProducts();
        if (!data) {
          throw new Error('لا توجد منتجات متاحة');
        }
        setProducts(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'حدث خطأ أثناء تحميل المنتجات'
        );
        setProducts([]); // Reset products on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <ProductsContext.Provider value={{ products, isLoading, error }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};
