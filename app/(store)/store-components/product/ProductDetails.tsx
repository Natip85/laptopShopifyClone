"use client";

import { Rating } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { MdCheckCircle } from "react-icons/md";
import { useRouter } from "next/navigation";
import Button from "@/components/buttons/Button";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import SetQuantity from "./SetQuantity";
import SetVariant from "./SetVariant";
import ProductImage from "./ProductImage";
import ImageSlider from "@/components/ImageSlider";

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
  variants?: any[];
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
  console.log("PRODVAR>>", product.variants);

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

  const handleVariantSelect = useCallback(
    (value: any) => {
      console.log("VARIANT-VALUE>>>", value);
      const newVariant = value.images[0];
      setCartProduct((prev) => {
        return { ...prev, selectedImg: newVariant };
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
      <ProductImage
        cartProduct={cartProduct}
        product={product}
        handleColorSelect={handleVariantSelect}
      />
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
            <SetVariant
              cartProduct={cartProduct}
              variants={product.variants}
              handleVariantSelect={handleVariantSelect}
            />
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
      <div>variants</div>
      <div>
      <ImageSlider/>

      </div>
    </div>
  );
};

export default ProductDetails;
