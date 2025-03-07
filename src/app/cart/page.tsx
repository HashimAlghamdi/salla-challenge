"use client";
import React from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import Link from "next/link";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import SaudiRiyal from "@/assets/images/saudi-riyal.svg";

import QuantityControls from "../components/QuantityControls";

const Cart = () => {
  const { cart, isLoading, error, updateCartItem, deleteCartItem } = useCart();
  const { isLoggedIn } = useAuth();

  if (isLoading) {
    return <Loader className="w-1/4 h-[60vh]" />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  if (!isLoggedIn) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl mb-4">يرجى تسجيل الدخول لعرض السلة</h2>
        <Link
          href={`/login?redirect=${encodeURIComponent("/cart")}`}
          className="text-primary hover:underline"
        >
          تسجيل الدخول
        </Link>
      </div>
    );
  }

  if (!cart || cart.cartItems.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl mb-4">السلة فارغة</h2>
        <Link href="/" className="text-primary hover:underline">
          تصفح المنتجات
        </Link>
      </div>
    );
  }
console.log();

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg">سلة المشتريات</h2>
      <ul className="flex flex-col gap-4">
        {cart.cartItems.map((item) => (
          <li
            key={item.id}
            className="flex items-start sm:items-center flex-col sm:flex-row justify-between gap-4 w-full p-4 rounded-md hover:bg-gray-50"
          >
            <Link
              href={`/product/${item.product.id}`}
              className="flex items-start justify-center gap-4 flex-1"
            >
              <img
                src={item.product.imageURL}
                alt={item.product.name}
                className="rounded-md w-[80px] h-[80px] object-cover"
              />
              <div className="flex flex-col flex-1 gap-1">
                <h4>{item.product.name}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">
                    {item.product.price.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                    <Image
                      src={SaudiRiyal}
                      alt="Saudi Riyal"
                      width={12}
                      height={12}
                      className="inline mx-1"
                    />
                  </span>
                </div>
              </div>
            </Link>
            <div className="flex items-center justify-center gap-4">
              <QuantityControls
                quantity={item.quantity}
                onUpdate={(value) =>
                  updateCartItem(item.id, item.product.id, value)
                }
                isLoading={isLoading}
              />
              <button
                onClick={() => deleteCartItem(item.id)}
                className="w-[28px] h-[28px] flex items-center justify-center text-xs border border-red-500 text-red-500 rounded-full"
              >
                <i className="sicon-trash"></i>
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="flex justify-between items-center p-4 border-t">
        <span className="text-lg font-medium">المجموع:</span>
        <span className="text-lg">
          {cart.totalCost.toLocaleString("en-US", {
            minimumFractionDigits: 2,
          })}
          <Image
            src={SaudiRiyal}
            alt="Saudi Riyal"
            width={16}
            height={16}
            className="inline mx-1"
          />
        </span>
      </div>
    </div>
  );
};

export default Cart;
