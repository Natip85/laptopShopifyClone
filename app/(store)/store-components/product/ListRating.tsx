"use client";

// import moment from "moment";
import { Rating } from "@mui/material";
import Avatar from "../Avatar";

interface ListRatingProps {
  product: any;
}

const ListRating = ({ product }: ListRatingProps) => {
  if (product.reviews.length === 0) return null;
  return (
    <div>
      <h2>Product Reviews</h2>
      <div className="text-sm mt-2">
        {product.reviews &&
          product.reviews.map((review: any) => {
            return (
              <div key={review.id} className="max-w-[300px]">
                <div className="flex gap-2 items-center">
                    avatar
                  <Avatar src={review.user.image} />
                  <div className="font-semibold">{review?.user.name}</div>
                  <div className="font-light">
                    {/* {moment(review.createdDate).fromNow()} */}
                    {review.createdDate}
                    time here
                  </div>
                </div>
                <div className="mt-2">
                  <Rating value={review.rating} readOnly />
                  <div className="ml-2">{review.comment}</div>
                  <hr className="mt-4 mb-4" />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default ListRating;
