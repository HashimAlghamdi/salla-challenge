"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Category } from "@/interfaces/Category";
import { categoriesService } from "@/services/categories.service";

interface CategoriesContextType {
  categories: Category[];
  selectedCategory: number | null;
  setSelectedCategory: (id: number | null) => void;
}

const CategoriesContext = createContext<CategoriesContextType>({
  categories: [],
  selectedCategory: null,
  setSelectedCategory: () => {},
});

export const CategoriesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await categoriesService.getCategories();
      setCategories(data);
    };

    fetchCategories();
  }, []);

  return (
    <CategoriesContext.Provider
      value={{
        categories,
        selectedCategory,
        setSelectedCategory,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
};

export const useCategories = () => {
  const context = useContext(CategoriesContext);
  if (context === undefined) {
    throw new Error("useCategories must be used within a CategoriesProvider");
  }
  return context;
};
