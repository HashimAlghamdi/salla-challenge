"use client";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { CategoriesProvider } from "@/contexts/CategoriesContext";
import { ProductsProvider } from "@/contexts/ProductsContext";

export const ContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <AuthProvider>
      <CartProvider>
        <CategoriesProvider>
          <ProductsProvider>{children}</ProductsProvider>
        </CategoriesProvider>
      </CartProvider>
    </AuthProvider>
  );
};
