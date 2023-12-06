"use client";

import Button from "@/components/buttons/Button";
import CustomInput from "@/components/inputs/CustomInput";
import { SafeUser } from "@/types";
import { Rating } from "@mui/material";
import { Order, Product, Review } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

interface AddRatingProps {
  product: Product & {
    reviews: Review[];
  };
  user:
    | (SafeUser & {
        orders: Order[];
      })
    | null;
}

const AddRating: React.FC<AddRatingProps> = ({ product, user }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      comment: "",
      rating: 0,
    },
  });

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    if (data.rating === 0) {
      setIsLoading(false);
      return toast.error("No rating selected");
    }
    const ratingData = { ...data, userId: user?.id, product: product };

    axios
      .post("/api/rating", ratingData)
      .then(() => {
        toast.success("Rating submitted");
        router.refresh();
        reset();
      })
      .catch((error) => {
        toast.error("Something went wrong when rating the product");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  if (!user || !product) return null;

//   const deliveredOrder = user?.orders.some(
//     (order) =>
//       order.products.find((item) => item.id === product.id) &&
//       order.deliveryStatus === "delivered"
//   );

//   const userReview = product?.reviews.find((review) => {
//     return review.userId === user.id;
//   });

//   if (userReview || !deliveredOrder) return null;

  return (
    <div className="flex flex-col gap-2 max-w-[500px]">
       <h2>Rate this product</h2>
      <Rating
      className="w-fit"
        onChange={(event, newValue) => {
          setCustomValue("rating", newValue);
        }}
      />
      <CustomInput
        id="comment"
        label="Comment"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Button
        onClick={handleSubmit(onSubmit)}
      >{isLoading ? "Loading..." : "Rate Product"}</Button>
    </div>
  );
};

export default AddRating;
