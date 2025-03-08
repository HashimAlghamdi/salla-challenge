import Link from 'next/link';
import React, { useState } from 'react';
import { Product } from '@/interfaces/Product';
import { useImageError } from '@/hooks/useImageError';
import ImagePlaceholderComponent from './ImagePlaceholderComponent';
import SaudiRiyal from '@/assets/images/saudi-riyal.svg';
import Image from 'next/image';
import { useCategories } from '@/contexts/CategoriesContext';
import { useCart } from '@/contexts/CartContext';
import QuantityControls from './QuantityControls';
import { useRouter } from 'next/navigation';

const ProductCard = ({ product }: { product: Product }) => {
  const { handleImageError, hasImageError } = useImageError();
  const { categories } = useCategories();
  const { cart, updateCartItem, deleteCartItem } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const category = categories.find(category => category.id === product.categoryId);

  const cartItem = cart?.cartItems.find(item => item.product.id === product.id);

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
      setIsLoading(true);
      try {
        await deleteCartItem(cartItem.id);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCategoryClick = (e: React.MouseEvent, categoryId: number) => {
    e.preventDefault(); // Prevent link navigation
    router.push(`/?category=${categoryId}`);
  };

  return (
    <div className="rounded-lg border-2 border-gray-50 flex flex-col items-start justify-start md:p-3 p-2 relative">
      <Link href={`/product/${product.id}`} className="block w-full relative mb-4">
        {product.imageURL !== '' && !hasImageError(product.id) ? (
          <img
            src={product.imageURL}
            alt={product.name}
            className="w-full h-48 object-cover rounded-lg"
            onError={() => handleImageError(product.id)}
          />
        ) : (
          <div className="w-full h-48 flex items-center justify-center">
            <ImagePlaceholderComponent productTitle={product.name} showTitle={false} />
          </div>
        )}
      </Link>
      <div className="w-full flex flex-col flex-1 items-center justify-start gap-4">
        <div className="flex items-center justify-center flex-col gap-1 w-full">
          <a href="#" className="block w-full text-primary text-center">
            <h2 className="text-sm">{product.name}</h2>
          </a>
          <small className="block text-xs w-full text-center">{product.description}</small>
        </div>
        <div className="flex items-center justify-center flex-wrap gap-2 text-gray-300 w-full">
          <span
            onClick={e => category && handleCategoryClick(e, category.id)}
            className="text-xs text-gray-500 underline cursor-pointer hover:text-primary transition-colors"
          >
            {category?.categoryName}
          </span>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-center w-full my-4 gap-1">
        <span className="font-medium text-md">
          {product.price.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{' '}
        </span>
        <Image src={SaudiRiyal} alt="Saudi Riyal" width={16} height={16} />
      </div>

      <div className="w-full flex justify-center">
        <QuantityControls
          quantity={cartItem?.quantity || 0}
          onUpdate={handleUpdateQuantity}
          onDelete={handleDelete}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default ProductCard;
