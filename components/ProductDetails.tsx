"use client";
import React from "react";
import { Product, Review } from "@prisma/client";
import { BiArrowBack } from "react-icons/bi";
import EditProductForm from "./forms/EditProductForm";
import Modal from "./Modal";
import { useRouter } from "next/navigation";

interface ProductDetailsProps {
  product: Product & {
    reviews: Review[];
  };
}

const ProductDetails = ({ product }: ProductDetailsProps) => {
  const router = useRouter();
  return (
    <>
      <div className="flex items-center font-bold mb-5 ">
        <Modal
          title="Leave page with unsaved changes?"
          description="Leaving this page will delete all unsaved changes."
          icon={<BiArrowBack width={25} height={25} />}
          onConfirm={() => router.push(`/products`)}
          btnClasses="hover:bg-slate-300 rounded-md mr-1 p-1 cursor-pointer"
          btnTitle="Leave page"
        />
        <h1 className="mr-5">{product.title}</h1>
        <span
          className={`inline-flex items-center rounded-md  px-2 py-1 text-xs font-medium  ring-1 ring-inset 
        ${
          product.productStatus === "active"
            ? "bg-green-200 text-green-700 ring-green-600/20"
            : "bg-red-50 text-red-700 ring-red-600/10"
        }
        `}
        >
          {product.productStatus}
        </span>
      </div>
      <EditProductForm product={product} />
    </>
  );
};

export default ProductDetails;
