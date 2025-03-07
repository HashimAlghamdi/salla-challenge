import Image from "next/image";
import ImagePlaceholder from "@/assets/images/image-placeholder.svg";

interface ImagePlaceholderProps {
  productTitle?: string;
  showTitle?: boolean;
}

const ImagePlaceholderComponent = ({ productTitle, showTitle = false }: ImagePlaceholderProps) => {
  return (
    <div className="absolute top-0 left-0 w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="flex flex-col items-center justify-center p-4 text-center">
        <div className="w-16 h-16 bg-gray-200 rounded-full mb-4 flex items-center justify-center">
          <Image
            src={ImagePlaceholder}
            alt="placeholder"
            width={32}
            height={32}
          />
        </div>
        {showTitle && productTitle && (
          <h3 className="text-primary text-sm font-medium">
            {productTitle}
          </h3>
        )}
      </div>
    </div>
  );
};

export default ImagePlaceholderComponent; 