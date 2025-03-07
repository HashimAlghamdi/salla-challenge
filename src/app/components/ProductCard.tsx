import Link from "next/link";
import React, { useState } from "react";
import { Product } from "@/interfaces/Product";
import { useImageError } from "@/hooks/useImageError";
import ImagePlaceholderComponent from "./ImagePlaceholderComponent";
import SaudiRiyal from "@/assets/images/saudi-riyal.svg";
import Image from "next/image";
import { useCategories } from "@/contexts/CategoriesContext";
import { useCart } from "@/contexts/CartContext";
import QuantityControls from "./QuantityControls";
import Loader from "./Loader";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const ProductCard = ({ product }: { product: Product }) => {
  const { handleImageError, hasImageError } = useImageError();
  const { categories } = useCategories();
  const { addToCart, cart, updateCartItem, deleteCartItem } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  const category = categories.find(
    (category) => category.id === product.categoryId
  );

  const cartItem = cart?.cartItems.find(
    (item) => item.product.id === product.id
  );

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      router.push(
        `/login?redirect=${encodeURIComponent("/")}&productId=${
          product.id
        }&quantity=1`
      );
      return;
    }

    setIsLoading(true);
    try {
      await addToCart(product.id, 1);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateQuantity = async (newQuantity: number) => {
    if (cartItem) {
      setIsLoading(true);
      try {
        await updateCartItem(cartItem.id, product.id, newQuantity);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDelete = async () => {
    if (cartItem) {
      setIsDeleting(true);
      try {
        await deleteCartItem(cartItem.id);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleCategoryClick = (e: React.MouseEvent, categoryId: number) => {
    e.preventDefault(); // Prevent link navigation
    router.push(`/?category=${categoryId}`);
  };

  return (
    <div className="rounded-lg border-2 border-gray-50 flex flex-col items-start justify-start md:p-3 p-2 relative">
      <Link
        href={`/product/${product.id}`}
        className="block w-full relative mb-4"
      >
        {product.imageURL !== "" && !hasImageError(product.id) ? (
          <img
            src={product.imageURL}
            alt={product.name}
            className="w-full h-48 object-cover rounded-lg"
            onError={() => handleImageError(product.id)}
          />
        ) : (
          <div className="w-full h-48 flex items-center justify-center">
            <ImagePlaceholderComponent
              productTitle={product.name}
              showTitle={false}
            />
          </div>
        )}
      </Link>
      <div className="w-full flex flex-col flex-1 items-center justify-start gap-4">
        <div className="flex items-center justify-center flex-col gap-1 w-full">
          <a href="#" className="block w-full text-primary text-center">
            <h2 className="text-sm">{product.name}</h2>
          </a>
          <small className="block text-xs w-full text-center">
            {product.description}
          </small>
        </div>
        <div className="flex items-center justify-center flex-wrap gap-2 text-gray-300 w-full">
          <span
            onClick={(e) => category && handleCategoryClick(e, category.id)}
            className="text-xs text-gray-500 underline cursor-pointer hover:text-primary transition-colors"
          >
            {category?.categoryName}
          </span>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-center w-full my-4 gap-1">
        <span className="font-medium text-md">
          {product.price.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{" "}
        </span>
        <Image src={SaudiRiyal} alt="Saudi Riyal" width={16} height={16} />
      </div>

      {cartItem ? (
        <div className="flex items-center justify-center gap-4 w-full">
          <QuantityControls
            quantity={cartItem.quantity}
            onUpdate={handleUpdateQuantity}
            isLoading={isLoading}
          />
          <button
            onClick={handleDelete}
            disabled={isDeleting || isLoading}
            className="w-[28px] h-[28px] flex items-center justify-center text-xs border border-red-500 text-red-500 rounded-full disabled:opacity-50"
          >
            {isDeleting ? (
              <Loader className="w-3 h-3" />
            ) : (
              <i className="sicon-trash"></i>
            )}
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isLoading}
          className="w-full bg-primary text-white p-2 text-md rounded-md disabled:opacity-50 flex items-center justify-center"
        >
          {isLoading ? <Loader /> : "إضافة للسلة"}
        </button>
      )}
    </div>
  );
};

export default ProductCard;
