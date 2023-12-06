"use client";

import { Rating } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
// import SetColor from "./SetColor";
import { MdCheckCircle } from "react-icons/md";
import { useRouter } from "next/navigation";
import Button from "@/components/buttons/Button";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import SetQuantity from "./SetQuantity";
import { Product } from "@prisma/client";

interface ProductDetailsProps {
  product: any;
}

export type CartProductType = {
  id: string;
  title: string;
  decription: string;
  category: string;
  brand?: string;
  selectedImg: any;
  quantity: number;
  price: number;
  variants?: any[]
};

const Horizontal = () => {
  return <hr className="w-[30%] my-2" />;
};

const ProductDetails = ({ product }: ProductDetailsProps) => {
  const router = useRouter();
  const { handleAddProductToCart, cartProducts } = useCart();
  const [cartProduct, setCartProduct] = useState<CartProductType>({
    id: product.id,
    title: product.title,
    decription: product.description,
    category: product.category,
    brand: product.brand,
    selectedImg: { ...product.images[0] },
    quantity: 1,
    price: product.price,
    variants: product.variants,
  });
  const [isProductInCart, setIsProductInCart] = useState(false);
console.log("PRODUCT>>>", product);
console.log("CART-PRODUCT>>>", cartProduct);
console.log("CART-PRODUCTSSSS>>>", cartProducts);

  const productRating =
    product.reviews.reduce((acc: number, item: any) => item.rating + acc, 0) /
    product.reviews.length;

  useEffect(() => {
    setIsProductInCart(false);
    if (cartProducts) {
      const existingIndex = cartProducts.findIndex(
        (item) => item.id === product.id
      );
      if (existingIndex > -1) {
        setIsProductInCart(true);
      }
    }
  }, [cartProducts]);

  const handleColorSelect = useCallback(
    (value: any) => {
      setCartProduct((prev) => {
        return { ...prev, selectedImg: value };
      });
    },
    [cartProduct.selectedImg]
  );

  const handleQtyIncrease = useCallback(() => {
    if (cartProduct.quantity === 99) {
      return;
    }
    setCartProduct((prev) => {
      return { ...prev, quantity: ++prev.quantity };
    });
  }, [cartProduct]);

  const handleQtyDecrease = useCallback(() => {
    if (cartProduct.quantity === 1) {
      return;
    }
    setCartProduct((prev) => {
      return { ...prev, quantity: --prev.quantity };
    });
  }, [cartProduct]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 ">
      <div className="grid grid-cols-6 gap-2 max-h-[500px] min-h-[300px] sm:min-h-[400px]">
        <div className="flex flex-col items-center justify-center gap-4 cursor-pointer border h-full max-h-[500px] min-h-[300px] sm:min-h-[400px]">
          {product.images.map((image: any, index: any) => (
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
                src={image.image}
                alt={image.color || "prod color"}
                fill
                priority
                sizes="20"
                className="object-contain"
              />
            </div>
          ))}
        </div>

        <div className="col-span-5 relative aspect-square">
          <Image
            fill
            priority
            sizes="20"
            src={cartProduct.selectedImg.image}
            alt={cartProduct.title || "product image"}
            className="w-full h-full object-contain max-h-[500px] min-h-[300px] sm:min-h-[400px]"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1 text-slate-500 text-sm">
        <h2 className="text-3xl font-medium text-slate-700">{product.title}</h2>
        <div className="flex items-center gap-2">
          <Rating value={productRating} readOnly />
          <div>{product.reviews.length} reviews</div>
        </div>
        <Horizontal />
        <div className="text-justify">{product.description}</div>
        <Horizontal />
        <div>
          <span className="font-semibold">CATEGORY: </span> {product.category}
        </div>
        <div>
          <span className="font-semibold">BRAND: </span> {product.brand}
        </div>
        <div
          className={product.quantity > 0 ? "text-teal-400" : "text-rose-400"}
        >
          {product.quantity > 0 ? "In stock" : "Out of stock"}
        </div>
        <Horizontal />
        {isProductInCart ? (
          <>
            <p className="mb-2 text-slate-500 flex items-center gap-1">
              <MdCheckCircle size={20} className="text-teal-400" />
              <span>Product added to cart</span>
            </p>
            <div className="max-w-[300px]">
              <Button onClick={() => router.push("/cart")} fullWidth secondary>
                View Cart
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* <SetColor
              cartProduct={cartProduct}
              images={product.images}
              handleColorSelect={handleColorSelect}
            /> */}
            setcolor
            <Horizontal />
            <SetQuantity
              cartProduct={cartProduct}
              handleQtyIncrease={handleQtyIncrease}
              handleQtyDecrease={handleQtyDecrease}
            />
            <Horizontal />
            <div className="max-w-[300px]">
              <Button
                fullWidth
                onClick={() => handleAddProductToCart(cartProduct)}
              >
                Add To Cart
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
