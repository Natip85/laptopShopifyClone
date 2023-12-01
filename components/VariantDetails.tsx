import { Product, Review } from "@prisma/client";
import Link from "next/link";
import React from "react";
import { BiArrowBack } from "react-icons/bi";
import EditVariantForm from "./forms/EditVariantForm";

interface ProductDetailsProps {
  product: Product & {
    reviews: Review[];
  };
}

const VariantDetails = ({ product }: ProductDetailsProps) => {
  return (
    <>
      <EditVariantForm product={product} />
    </>
  );
};

export default VariantDetails;
