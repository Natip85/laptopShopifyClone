"use client";

import { CartProductType } from "@/app/(store)/store-components/product/ProductDetails"

interface SetVariantProps {
  variants: any[];
  cartProduct: CartProductType;
  handleVariantSelect: (value: any) => void;
}
const SetVariant = ({
  variants,
  cartProduct,
  handleVariantSelect,
}: SetVariantProps) => {
  return (
    <div>
      <div className="flex gap-4 items-center">
        <span className="font-semibold">VARIANTS:</span>
        <div className="flex gap-1">
          {variants.map((variant, index) => {
            return (
              <div
                onClick={() => handleVariantSelect(variant)}
                key={index}
                className={`h-7 w-7 rounded-full border-teal-300 flex items-center justify-center ${
                  cartProduct.selectedImg.color === variant.color
                    ? "border-[1.5px]"
                    : "border-none"
                }`}
              >
                <div
                  style={{ background: variant.color }}
                  className="h-5 w-5 rounded-full border-[1.2px] border-slate-300 cursor-pointer"
                ></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SetVariant;
