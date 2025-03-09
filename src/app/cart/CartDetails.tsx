'use client';

import React, { useState } from 'react';
import { Cart } from '@/interfaces/Cart';
import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import SaudiRiyal from '@/assets/images/saudi-riyal.svg';
import QuantityControls from '@/app/components/QuantityControls';
import { useImageError } from '@/hooks/useImageError';
import ImagePlaceholderComponent from '@/app/components/ImagePlaceholderComponent';

interface CartDetailsProps {
  initialData: Cart | null;
}

const CartDetails = ({ initialData }: CartDetailsProps) => {
  const { cart, updateCartItem, deleteCartItem } = useCart();
  const [loadingItemId, setLoadingItemId] = useState<number | null>(null);
  const { handleImageError, hasImageError } = useImageError();

  // Use cart from context instead of initialData for real-time updates
  const currentCart = cart || initialData;
  const cartItems = currentCart?.cartItems ?? [];

  if (!currentCart || cartItems.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl mb-4">السلة فارغة</h2>
        <Link href="/" className="text-primary hover:underline">
          تصفح المنتجات
        </Link>
      </div>
    );
  }

  const handleUpdateQuantity = async (itemId: number, productId: number, quantity: number) => {
    setLoadingItemId(itemId);
    try {
      await updateCartItem(itemId, productId, quantity);
    } finally {
      setLoadingItemId(null);
    }
  };

  const handleDelete = async (itemId: number) => {
    setLoadingItemId(itemId);
    try {
      await deleteCartItem(itemId);
    } finally {
      setLoadingItemId(null);
    }
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">سلة المشتريات</h1>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-2/3">
          {cartItems.map(item => (
            <div key={item.id} className="flex items-center gap-4 border-b py-4 last:border-0">
              <div className="w-24 h-24 relative">
                {hasImageError(item.product.id) ? (
                  <ImagePlaceholderComponent />
                ) : (
                  <img
                    src={item.product.imageURL}
                    alt={item.product.name}
                    className="object-cover rounded-lg"
                    onError={() => handleImageError(item.product.id)}
                  />
                )}
              </div>

              <div className="flex-1">
                <Link
                  href={`/product/${item.product.id}`}
                  className="text-lg font-semibold hover:text-primary"
                >
                  {item.product.name}
                </Link>

                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xl">{item.product.price}</span>
                  <Image src={SaudiRiyal} alt="SAR" width={16} height={16} />
                </div>
              </div>

              <div className="flex items-center gap-4">
                {loadingItemId === item.id ? (
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                ) : (
                  <QuantityControls
                    quantity={item.quantity}
                    onUpdate={quantity => handleUpdateQuantity(item.id, item.product.id, quantity)}
                    onDelete={() => handleDelete(item.id)}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="md:w-1/3 bg-gray-50 p-6 rounded-lg h-fit">
          <h2 className="text-xl font-semibold mb-4">ملخص الطلب</h2>

          <div className="flex justify-between items-center mb-4">
            <span>عدد المنتجات</span>
            <span>{cartItems.length}</span>
          </div>

          <div className="flex justify-between items-center text-lg font-bold">
            <span>المجموع</span>
            <div className="flex items-center gap-2">
              <span>{totalPrice}</span>
              <Image src={SaudiRiyal} alt="SAR" width={16} height={16} />
            </div>
          </div>

          <button className="w-full bg-primary text-white py-3 rounded-lg mt-6 hover:bg-primary-dark transition-colors">
            إتمام الطلب
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartDetails;
