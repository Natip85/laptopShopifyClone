"use client";

import Image from "next/image";
import { CartProductType } from "./ProductDetails";

interface ProductImageProps {
  cartProduct: CartProductType;
  product: any;
  handleColorSelect: (value: any) => void;
}
const ProductImage = ({
  cartProduct,
  product,
  handleColorSelect,
}: ProductImageProps) => {
    console.log("IMGPROD>>>", product);
    

  const imageUrls = [];
  for (const variant of product.variants) {
    for (const image of variant.images) {
      const imageUrl = image.image;
      imageUrls.push(imageUrl);
    }
  }
  console.log("IMGURLs", imageUrls);

  return (
    <div className="grid grid-cols-6 gap-2 max-h-[500px] min-h-[300px] sm:min-h-[400px]">
      <div className="flex flex-col items-center justify-center gap-4 cursor-pointer border h-full max-h-[500px] min-h-[300px] sm:min-h-[400px]">
        {imageUrls.map((image: any, index:any) => {
          return (
            <div
              onClick={() => handleColorSelect(image)}
              key={index}
              className={`relative w-[80%] aspect-square rounded border-teal-300 ${
                cartProduct.selectedImg.color === image.color
                  ? "border-[1.5px]"
                  : "border-none"
              }`}
            >
              <Image
                src={image}
                alt={image.color||"prodImg"}
                fill
                priority
                sizes="20"
                className="object-contain"
              />
            </div>
          );
        })}
      </div>

      <div className="col-span-5 relative aspect-square">
        <Image
          fill
          priority
          sizes="20"
          src={cartProduct.selectedImg.image}
          alt={cartProduct.title}
          className="w-full h-full object-contain max-h-[500px] min-h-[300px] sm:min-h-[400px]"
        />
      </div>
    </div>
  );
};

export default ProductImage;
