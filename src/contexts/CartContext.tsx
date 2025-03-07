"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { Cart, CartContextType } from "@/interfaces/Cart";

import { useAuth } from "./AuthContext";
import { cartService } from "@/services/cart.service";
import { ApiError } from "@/interfaces/ApiError";

const CartContext = createContext<CartContextType>({
  cart: null,
  isLoading: false,
  error: null,
  addToCart: async () => {},
  updateCartItem: async () => {},
  deleteCartItem: async () => {},
  fetchCart: async () => {},
  resetCart: () => {},
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      fetchCart();
    }
  }, [isLoggedIn]);

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await cartService.getCart();
      setCart(data);
    } catch (err) {
      setError(
        err instanceof Error && "response" in err
          ? (err as ApiError).response.data
          : "حدث خطأ أثناء تحميل السلة"
      );
      setCart(null);
    } finally {
      setIsLoading(false);
    }
  };

  const resetCart = () => {
    setCart(null);
    setError(null);
    setIsLoading(false);
  };

  const addToCart = async (productId: number, quantity: number) => {
    try {
      setIsLoading(true);
      setError(null);
      await cartService.addToCart({ productId, quantity });
      await fetchCart();
    } catch (err) {
      setError(
        err instanceof Error && "response" in err
          ? (err as ApiError).response.data
          : "حدث خطأ أثناء الإضافة إلى السلة"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const updateCartItem = async (
    itemId: number,
    productId: number,
    quantity: number
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      await cartService.updateCartItem(itemId, {
        id: itemId,
        productId,
        quantity,
      });
      await fetchCart();
    } catch (err) {
      setError(
        err instanceof Error && "response" in err
          ? (err as ApiError).response.data
          : "حدث خطأ أثناء تحديث السلة"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCartItem = async (itemId: number) => {
    try {
      setIsLoading(true);
      setError(null);
      await cartService.deleteCartItem(itemId);
      await fetchCart(); // Refresh cart after deletion
    } catch (err) {
      setError(
        err instanceof Error && "response" in err
          ? (err as ApiError).response.data
          : "حدث خطأ أثناء حذف المنتج"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        error,
        addToCart,
        updateCartItem,
        deleteCartItem,
        fetchCart,
        resetCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
