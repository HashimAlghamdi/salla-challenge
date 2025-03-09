'use client';

import { Product } from '@/interfaces/Product';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { useRouter } from 'next/navigation';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import ImagePlaceholderComponent from './ImagePlaceholderComponent';
import { useImageError } from '@/hooks/useImageError';

interface ProductCarouselProps {
  products: Product[];
  onSlideChange: (isEnd: boolean) => void;
}

const ProductCarousel = ({ products, onSlideChange }: ProductCarouselProps) => {
  const router = useRouter();
  const { hasImageError, handleImageError } = useImageError();
  const handleSlideChange = (swiper: SwiperType) => {
    onSlideChange(swiper.isEnd);
  };

  const handleProductClick = (productId: number) => {
    router.push(`/product/${productId}`);
  };

  return (
    <Swiper
      modules={[Navigation, Autoplay]}
      spaceBetween={30}
      slidesPerView={1}
      navigation
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
      }}
      onSlideChange={handleSlideChange}
      className="product-carousel [&_.swiper-button-next]:!text-darker-300 [&_.swiper-button-next]:!w-12 [&_.swiper-button-next]:!h-12 [&_.swiper-button-next]:hover:!bg-gray-100 [&_.swiper-button-next]:!rounded-lg [&_.swiper-button-next]:!transition-colors [&_.swiper-button-prev]:!text-darker-300 [&_.swiper-button-prev]:!w-12 [&_.swiper-button-prev]:!h-12 [&_.swiper-button-prev]:hover:!bg-gray-100 [&_.swiper-button-prev]:!rounded-lg [&_.swiper-button-prev]:!transition-colors [&_.swiper-button-next::after]:!text-2xl [&_.swiper-button-prev::after]:!text-2xl"
    >
      {products.map(product => (
        <SwiperSlide key={product.id} className="w-full rounded-lg">
          <div
            className="relative w-full pt-[56.25%] cursor-pointer"
            onClick={() => handleProductClick(product.id)}
          >
            {product.imageURL !== '' && !hasImageError(product.id) ? (
              <img
                src={product.imageURL}
                alt={product.name}
                loading="lazy"
                className="absolute top-0 left-0 w-full h-full object-cover rounded-lg transition-opacity duration-500"
                onError={() => handleImageError(product.id)}
              />
            ) : (
              <ImagePlaceholderComponent productTitle={product.name} showTitle />
            )}
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ProductCarousel;
