import React, { useState, useCallback, Suspense, lazy } from "react";
import { useCategories } from "@/contexts/CategoriesContext";
import { useRouter, useSearchParams } from "next/navigation";
import debounce from "lodash/debounce";
import { CategoryOption } from "@/interfaces/Cart";
import Loader from "./Loader";

// Lazy load the Select component
const Select = lazy(() => import("react-select"));

const CatalogToolbar = ({
  onSearch,
  onCategoryChange,
}: {
  onSearch: (query: string) => void;
  onCategoryChange: (categoryId: number | string) => void;
}) => {
  const { categories } = useCategories();
  const router = useRouter();
  const searchParams = useSearchParams();

  const categoryOptions: CategoryOption[] = [
    { value: "all", label: "الكل" },
    ...categories.map((category) => ({
      value: category.id,
      label: category.categoryName,
    })),
  ];

  // Get the current selected option based on URL
  const getCurrentOption = () => {
    const categoryFromUrl = searchParams.get('category');
    if (!categoryFromUrl) return categoryOptions[0];
    
    return categoryOptions.find(
      option => option.value === Number(categoryFromUrl)
    ) || categoryOptions[0];
  };

  // Get current search query from URL
  const getCurrentSearch = () => {
    return searchParams.get('search') || '';
  };

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (query) {
        router.push(`/?search=${encodeURIComponent(query)}${searchParams.get('category') ? `&category=${searchParams.get('category')}` : ''}`);
      } else {
        const categoryParam = searchParams.get('category');
        router.push(categoryParam ? `/?category=${categoryParam}` : '/');
      }
      onSearch(query.toLowerCase());
    }, 300),
    [searchParams]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  const handleCategoryChange = (option: CategoryOption | null) => {
    if (option) {
      const searchQuery = searchParams.get('search');
      if (option.value === "all") {
        router.push(searchQuery ? `/?search=${searchQuery}` : '/');
      } else {
        router.push(`/?category=${option.value}${searchQuery ? `&search=${searchQuery}` : ''}`);
      }
      onCategoryChange(option.value);
    }
  };

  return (
    <div className="flex items-center justify-between gap-4 mb-4">
      <div className="flex flex-col gap-1 flex-1">
        <label htmlFor="product_query" className="hidden">
          ابحث عن منتج
        </label>
        <input
          type="text"
          id="product_query"
          name="product_query"
          defaultValue={getCurrentSearch()}
          className="w-full p-2 bg-white appearance-none rounded-md border text-md"
          placeholder="ادخل اسم المنتج..."
          onChange={(e) => debouncedSearch(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1 shrink-0 sm:min-w-[180px]">
        <label htmlFor="categories" className="hidden">
          اختر تصنيف
        </label>
        <Suspense fallback={
          <div className="p-2 bg-white border rounded-md text-md h-[38px] flex items-center justify-center">
            <Loader className="w-5 h-5" />
          </div>
        }>
          <Select
            options={categoryOptions}
            value={getCurrentOption()}
            isRtl={true}
            placeholder="اختر تصنيف..."
            noOptionsMessage={() => "لا توجد نتائج"}
            classNames={{
              control: () => "p-1 bg-white border rounded-md text-md",
              option: () => "p-2 hover:bg-gray-100 cursor-pointer",
              menu: () => "mt-1 bg-white border rounded-md shadow-lg",
            }}
            theme={(theme) => ({
              ...theme,
              colors: {
                ...theme.colors,
                primary: "#004956",
                primary25: "#BAF3E6",
                primary50: "#76E8CD",
              },
            })}
            onChange={(option) => handleCategoryChange(option as CategoryOption)}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default CatalogToolbar;
