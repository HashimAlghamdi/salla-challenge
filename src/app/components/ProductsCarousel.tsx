import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { Product } from "@/interfaces/Product";
import { Navigation, Autoplay, EffectFade } from "swiper/modules";
import ImagePlaceholderComponent from "./ImagePlaceholderComponent";
import { useImageError } from "@/hooks/useImageError";
import { useState, useEffect } from "react";
import { Swiper as SwiperType } from "swiper";

const INITIAL_LOAD = 3;
const LOAD_MORE = 2;

const ProductCarousel = ({ products }: { products: Product[] }) => {
  const { handleImageError, hasImageError } = useImageError();
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Load initial set of products
    setVisibleProducts(products.slice(0, INITIAL_LOAD));
  }, [products]);

  const handleSlideChange = (swiper: SwiperType) => {
    if (swiper.activeIndex >= visibleProducts.length - 2) {
      const nextIndex = visibleProducts.length;
      const nextProducts = products.slice(nextIndex, nextIndex + LOAD_MORE);

      if (nextProducts.length > 0) {
        setVisibleProducts((prev) => [...prev, ...nextProducts]);
      }
    }
  };

  return (
    <div className="relative">
      <Swiper
        spaceBetween={30}
        effect="fade"
        fadeEffect={{
          crossFade: true,
        }}
        speed={800}
        navigation={true}
        modules={[EffectFade, Navigation, Autoplay]}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        onSlideChange={handleSlideChange}
        className="product-carousel [&_.swiper-button-next]:!text-darker-300 [&_.swiper-button-next]:!w-12 [&_.swiper-button-next]:!h-12 [&_.swiper-button-next]:hover:!bg-gray-100 [&_.swiper-button-next]:!rounded-lg [&_.swiper-button-next]:!transition-colors [&_.swiper-button-prev]:!text-darker-300 [&_.swiper-button-prev]:!w-12 [&_.swiper-button-prev]:!h-12 [&_.swiper-button-prev]:hover:!bg-gray-100 [&_.swiper-button-prev]:!rounded-lg [&_.swiper-button-prev]:!transition-colors [&_.swiper-button-next::after]:!text-2xl [&_.swiper-button-prev::after]:!text-2xl"
      >
        {visibleProducts.map((product) => (
          <SwiperSlide key={product.id} className="w-full rounded-lg">
            <div className="relative w-full pt-[56.25%]">
              {product.imageURL !== "" && !hasImageError(product.id) ? (
                <img
                  src={product.imageURL}
                  alt={product.name}
                  loading="lazy"
                  className="absolute top-0 left-0 w-full h-full object-cover rounded-lg transition-opacity duration-500"
                  onError={() => handleImageError(product.id)}
                />
              ) : (
                <ImagePlaceholderComponent
                  productTitle={product.name}
                  showTitle
                />
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductCarousel;
