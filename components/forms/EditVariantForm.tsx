"use client";

import Modal from "../Modal";
import { BiArrowBack } from "react-icons/bi";
import { Input } from "../ui/input";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { Product } from "@prisma/client";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import SelectImage from "../inputs/SelectImage";
import { Button } from "../ui/button";
import CustomSelect from "../inputs/CustomSelect";
import { weightOptions } from "@/lib/utils";
import AddProductVariant from "./AddProductVariant";
import firebaseApp from "@/lib/firebase";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import toast from "react-hot-toast";
import axios from "axios";
import Image from "next/image";
interface EditVariantFormProps {
  product: Product;
}

const EditVariantForm = ({ product }: EditVariantFormProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<any[]>([]);
  const [shipping, setShipping] = useState(product.shipping);
  const [shippingCheckbox, setShippingCheckbox] = useState(product.shipping);
  const [addVariantCheckbox, setAddVariantCheckbox] = useState(false);

  const id = pathname?.split("/").pop() || "";

  useEffect(() => {
    if (!id) return;
  }, [pathname, id]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
    control,
  } = useForm<FieldValues>({
    defaultValues: {
      weightMeasurement: product.weightMeasurement,
      price: product.variants[parseInt(id)]?.price || "",
      quantity: product.variants[parseInt(id)]?.quantity || "",
      weight: product.variants[parseInt(id)]?.weight || "",
    },
  });

  useEffect(() => {
    setValue("images", images);
  }, [images, setValue]);

  const addImageToState = useCallback((value: string[]) => {
    setImages(value);
  }, []);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    let uploadedImages: any[] = [];

    const varProduct = product.variants[parseInt(id)];

    const newVariantData = {
      ...varProduct,
      images: images,
      price: parseFloat(data.price),
      quantity: parseInt(data.quantity),
      weight: data.weight,
      weightMeasurement: data.weightMeasurement,
    };

    const handleImageUploads = async () => {
      toast("Editing product. This might take a while...", {
        icon: "🔃",
      });
      try {
        for (const item of newVariantData.images) {
          if (item) {
            const fileName = new Date().getTime() + "-" + item.name;
            const storage = getStorage(firebaseApp);
            const storageRef = ref(storage, `products/${fileName}`);
            const uploadTask = uploadBytesResumable(storageRef, item);

            await new Promise<void>((resolve, reject) => {
              uploadTask.on(
                "state_changed",
                (snapshot) => {
                  const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                  console.log("Upload is " + progress + "% done");
                  switch (snapshot.state) {
                    case "paused":
                      break;
                    case "running":
                      break;
                  }
                },
                (error) => {
                  console.log("Error uploading image", error);
                  reject(error);
                },
                () => {
                  getDownloadURL(uploadTask.snapshot.ref)
                    .then((downloadURL) => {
                      uploadedImages.push({
                        ...item,
                        image: downloadURL,
                      });

                      console.log("File available at", downloadURL);
                      resolve();
                    })
                    .catch((error) => {
                      console.log("Error getting download URL", error);
                      reject(error);
                    });
                }
              );
            });
          }
        }
      } catch (error) {
        setIsLoading(false);
        console.log("Error handling image uploads", error);
        return toast.error("An error occurred while handling image uploads");
      }
    };
    await handleImageUploads();

    const variantWithImg = {
      ...newVariantData,
      images:
        uploadedImages.length > 0 ? [...uploadedImages] : varProduct.images,
    };

    let newArray = [
      ...product.variants.slice(0, parseInt(id)),
      variantWithImg,
      ...product.variants.slice(parseInt(id) + 1),
    ];

    const finalVariantData = { ...product, variants: newArray };

    axios
      .put("/api/product", finalVariantData)
      .then(() => {
        toast.success("Product variant edited");
        router.refresh();
      })
      .catch((error) => {
        console.log("Error updating product variant", error);

        toast.error("Something went wrong when editing the product variant");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  return (
    <>
      <div className="flex items-center font-bold mb-5 ">
        <Modal
          title="Leave page with unsaved changes?"
          description="Leaving this page will delete all unsaved changes."
          icon={<BiArrowBack width={25} height={25} />}
          onConfirm={() => router.push(`/products/${product.id}`)}
          btnClasses="hover:bg-slate-300 rounded-md mr-1 p-1 cursor-pointer"
          btnTitle="Leave page"
        />
        Edit variant
      </div>
      <div className="flex">
        <div className="bg-white p-3 rounded-md flex flex-col w-[30%] h-fit shadow-lg mb-5 mr-5 border border-stone-300">
          <span className="mb-3">Variants</span>
          <ul>
            {product.variants.map((item, index) => (
              <Link
                key={index}
                href={`/products/${product.id}/${item?.variantID}`}
              >
                <li
                  key={index}
                  className="hover:bg-slate-100 cursor-pointer p-2"
                >
                  <div className="flex items-center">
                    <div className="w-[50px] h-[55px] relative mr-3">
                      <Image
                        src={
                          item.images[0]?.image ||
                          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0jO6VB6deX0RjnlXlOPaZJT07OdYkrqdCKQ&usqp=CAU"
                        }
                        alt="prod img"
                        priority
                        fill
                        sizes="20"
                        className="object-fit w-[100%]"
                      />
                    </div>
                    <div>
                      {item.color || item.material || item.size || item.style}
                    </div>
                  </div>
                </li>
              </Link>
            ))}
          </ul>
        </div>
        <div className="w-full">
          <div className="bg-white p-3 rounded-md flex flex-col w-full shadow-lg mb-5 border border-stone-300">
            <label
              htmlFor="options"
              className="text-sm text-black cursor-pointer"
            >
              Options
            </label>
            <Input
              id="options"
              defaultValue={
                product.variants[parseInt(id)]?.color ||
                product.variants[parseInt(id)]?.material ||
                product.variants[parseInt(id)]?.size ||
                product.variants[parseInt(id)]?.style ||
                ""
              }
              className="my-2 rounded-md text-sm hover:bg-slate-100 bg-white"
            />

            {addVariantCheckbox ? (
              <AddProductVariant closeVariants={() => {}} variant={() => {}} />
            ) : (
              <div>
                <button
                  onClick={() => {
                    setAddVariantCheckbox(true);
                  }}
                  className="w-fit bg-transparent text-sky-700 text-sm hover:underline hover:text-sky-900"
                >
                  + Add more product options
                </button>
              </div>
            )}
{product.variants[parseInt(id)]?.images.map((item, index)=>(
 <div key={index} className="w-[50px] h-[55px] relative mr-3">
                      <Image
                        src={
                          item?.image ||
                          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0jO6VB6deX0RjnlXlOPaZJT07OdYkrqdCKQ&usqp=CAU"
                        }
                        alt="prod img"
                        priority
                        fill
                        sizes="20"
                        className="object-fit w-[100%]"
                      />
                    </div>
))}
            <SelectImage handleFileChange={addImageToState} />
          </div>
          <div className="bg-white p-3 rounded-md flex flex-col w-full shadow-lg mb-5 border border-stone-300">
            <span className="text-sm mb-5 text-black">Pricing</span>
            <label
              htmlFor="price"
              className="text-xs text-black cursor-pointer"
            >
              Price
            </label>
            <Input
              id="price"
              {...register("price")}
              type="number"
              placeholder="$ 0.00"
              className="sm:w-fit my-2 rounded-md hover:bg-slate-100"
            />
          </div>
          <div className="bg-white p-3 rounded-md flex flex-col w-full shadow-lg mb-5 border border-stone-300">
            <span className="text-sm mb-5 text-black">Inventory</span>
            <label
              htmlFor="quantity"
              className="text-xs text-black cursor-pointer"
            >
              Quantity
            </label>
            <Input
              id="quantity"
              {...register("quantity")}
              type="number"
              placeholder="0"
              className="sm:w-fit my-2 rounded-md hover:bg-slate-100"
            />
          </div>
          <div className="bg-white p-3 rounded-md flex flex-col w-full shadow-lg border border-stone-300 mb-5">
            <span className="text-sm mb-5 text-black">Shipping</span>
            <label
              htmlFor="shipping"
              className="text-xs flex items-center text-slate-800 cursor-pointer"
            >
              <input
                {...register("shipping")}
                type="checkbox"
                onChange={() => setShipping(!shipping)}
                checked={shipping !== null ? shipping : undefined}
                disabled={shippingCheckbox ? shippingCheckbox : undefined}
                className="mr-2 cursor-pointer"
                id="shipping"
              />
              This product requires shipping
            </label>

            {shipping && (
              <>
                <label htmlFor="weight" className="text-xs text-slate-800 mt-5">
                  Weight
                </label>
                <div className="flex items-center">
                  <Input
                    id="weight"
                    {...register("weight")}
                    type="number"
                    placeholder="0"
                    className="sm:w-fit my-2 rounded-md hover:bg-slate-100"
                  />
                  <div className="ml-5">
                    <CustomSelect
                      name="weightMeasurement"
                      options={weightOptions}
                      placeholder="Select a weight"
                      control={control}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="mt-5 flex justify-end">
        <Modal
          title="Discard all unsaved changes?"
          description="If you discard changes, you’ll delete any edits you made since you last saved."
          onConfirm={() => {
            // handleDelete(product.id, product.images);
            // router.push("/products");
          }}
          btnClasses="mr-2 h-fit text-xs text-white py-1 px-3 bg-red-500 rounded-md"
          triggerTitle="Delete variant"
          btnTitle="Delete variant"
        />
        <Button
          disabled={isLoading}
          onClick={handleSubmit(onSubmit)}
          className="h-fit text-xs text-white py-1 bg-black"
        >
          {isLoading ? "Loading..." : "Update"}
        </Button>
      </div>
    </>
  );
};

export default EditVariantForm;
