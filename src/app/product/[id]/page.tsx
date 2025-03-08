"use client";
import { useCategories } from "@/contexts/CategoriesContext";
import { useProducts } from "@/contexts/ProductsContext";
import { useCart } from "@/contexts/CartContext";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import SaudiRiyal from "@/assets/images/saudi-riyal.svg";
import Image from "next/image";
import QuantityControls from "@/app/components/QuantityControls";
import Loader from "@/app/components/Loader";
import { useAuth } from "@/contexts/AuthContext";

const Product = () => {
  const { products } = useProducts();
  const { categories } = useCategories();
  const { addToCart, cart, updateCartItem, deleteCartItem } = useCart();
  const { id } = useParams();
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const product = products.find((product) => product.id === Number(id));
  const cartItem = cart?.cartItems.find(item => item.product.id === Number(id));

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      router.push(`/login?redirect=${encodeURIComponent(`/product/${id}`)}&productId=${id}&quantity=1`);
      return;
    }

    setIsLoading(true);
    try {
      await addToCart(Number(id), 1);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateQuantity = async (newQuantity: number) => {
    if (cartItem) {
      setIsLoading(true);
      try {
        await updateCartItem(cartItem.id, Number(id), newQuantity);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDelete = async () => {
    if (cartItem) {
      setIsLoading(true);
      try {
        await deleteCartItem(cartItem.id);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 sm:gap-4">
      <img
        src={product?.imageURL}
        className="w-full aspect-4/3 object-cover rounded-lg mb-8 sm:mb-0"
        alt={product?.name}
      />
      <div className="flex flex-col gap-4 col-span-2">
        <article className="text-sm text-darker-300 leading-[1.8]">
          <div className="flex flex-col mb-6 gap-2">
            <h1 className="text-xl md:text-3xl">{product?.name}</h1>
            <small className="text-xs text-gray-500">
              {categories.find((category) => category.id === product?.categoryId)?.categoryName}
            </small>
          </div>
          <div className="flex flex-col sm:flex-row w-full my-4 gap-0 sm:gap-2">
            <span className="font-medium text-md">
              {product?.price.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
            </span>
            <Image src={SaudiRiyal} alt="Saudi Riyal" width={16} height={16} />
          </div>
          <p>{product?.description}</p>
        </article>
        <div className="flex items-center justify-start gap-4">
          {cartItem ? (
            <QuantityControls
              quantity={cartItem.quantity}
              onUpdate={handleUpdateQuantity}
              onDelete={handleDelete}
              isLoading={isLoading}
            />
          ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isLoading}
              className="w-full h-[42px] bg-primary text-white p-2 text-md rounded-md disabled:opacity-50 flex items-center justify-center"
            >
              {isLoading ? <Loader /> : "إضافة للسلة"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;
