import { useState } from 'react';

export const useImageError = () => {
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>({});

  const handleImageError = (productId: number) => {
    setImageErrors((prev) => ({ ...prev, [productId]: true }));
  };

  const hasImageError = (productId: number) => {
    return imageErrors[productId];
  };

  return { handleImageError, hasImageError };
}; 