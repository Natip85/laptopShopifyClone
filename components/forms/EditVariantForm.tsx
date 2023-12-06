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
import EditProductVariant from "./EditProductVariant";

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
  const [variantComponents, setVariantComponents] = useState(
    [] as JSX.Element[]
  );

  const id = pathname?.split("/").pop() || "";
  const variantProd = product.variants[parseInt(id)];
  const [variant, setVariant] = useState(variantProd);
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
      weightMeasurement: product.weightMeasurement || "",
      price: product.variants[parseInt(id)]?.price || "",
      quantity: product.variants[parseInt(id)]?.quantity || "",
      weight: product.variants[parseInt(id)]?.weight || "",
    },
  });

  useEffect(() => {
    setValue("images", images);
  }, [images, setValue]);

  const addVariantComponent = () => {
    setVariantComponents((prev) => [
      ...prev,
      <EditProductVariant
        key={prev.length}
        closeVariants={handleOptionSelectorHide}
        variant={handleAddVariant}
        product={variantProd}
      />,
    ]);
  };
  const handleAddVariant = (value: any) => {
    setVariant(value);
  };
  const handleOptionSelectorHide = () => {
    setVariantComponents((prev) => prev.slice(0, -1));
    if (variantComponents.length === 0) setAddVariantCheckbox(false);
  };
  const addImageToState = useCallback((value: string[]) => {
    setImages(value);
  }, []);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    let uploadedImages: any[] = [];

    const newVariantData = {
      ...variant,
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
        uploadedImages.length > 0 ? [...uploadedImages] : variantProd.images,
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
        router.push(`/products/${product.id}`);
      })
      .catch((error) => {
        console.log("Error updating product variant", error);

        toast.error("Something went wrong when editing the product variant");
      })
      .finally(() => {
        setIsLoading(false);
        router.refresh();
      });
  };

  const handleDelete = async () => {
    toast("Deleting product, please wait.");
    const varProduct = product.variants[parseInt(id)].images;
    try {
      for (const item of varProduct) {
        if (item.image) {
          const storage = getStorage(firebaseApp);
          const imageRef = ref(storage, item.image);
          await deleteObject(imageRef);
          console.log("image deleted", item.image);
        }
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }

    const varProducts = product.variants.map((item, index) => {
      return item;
    });
    const myArray = varProducts.filter(
      (item) => item.variantID !== parseInt(id)
    );

    const updatedVariants = myArray.map((variant, index) => ({
      ...variant,
      variantID: index,
    }));
    product.variants = updatedVariants;

    axios
      .put("/api/product", product)
      .then(() => {
        toast.success("Product variant edited");
        router.push(`/products/${product.id}`);
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
      <div className="flex flex-col md:flex-row md:justify-between">
        <div className="w-full md:w-[30%]">
        <div className="bg-white p-3 rounded-md h-fit shadow-lg mb-5 mr-5 border border-stone-300">
         <div className="flex flex-row">
            <div className="w-[80px] h-[85px] relative mr-3">
            <Image
              src={
                product.images[0].image ||
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
            {product.title}{" "}
            <span
              className={`inline-flex items-center rounded-md  px-1 py-0 text-xs font-medium  ring-1 ring-inset 
        ${
          product.productStatus === "active"
            ? "bg-green-200 text-green-700 ring-green-600/20"
            : "bg-red-50 text-red-700 ring-red-600/10"
        }
        `}
            >
              {product.productStatus}
            </span>
            <div className="text-xs mt-2 text-slate-800">{product.variants.length} variants</div>
          </div>
        
</div>
        </div>

        <div className="bg-white p-3 rounded-md flex flex-col  h-fit shadow-lg mb-5 mr-5 border border-stone-300">
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
                    <div className="w-[40px] h-[45px] relative mr-3">
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
                    <div className="flex flex-col">
                      <div> {item.color !== null ? item.color : ""}</div>
                      <div> {`${item.size !== null ? item.size : ""}`}</div>
                      <div>{`${
                        item.material !== null ? item.material : ""
                      }`}</div>
                      <div>{`${item.style !== null ? item.style : ""}`}</div>
                    </div>
                  </div>
                </li>
              </Link>
            ))}
          </ul>
        </div>
        </div>
        <div className="w-full md:w-[70%] ">
          <div className="bg-white p-3 rounded-md flex flex-col w-full shadow-lg mb-5 border border-stone-300">
            <span className="text-sm text-black cursor-pointer">
              Variant options
            </span>
            <hr className="my-5" />
            <div className="mb-5 flex flex-col gap-2">
              {variantProd?.color && (
                <span>
                  Color:{" "}
                  <span className={`bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300`}>
                    {variantProd?.color}
                  </span>
                </span>
              )}
              {variantProd.size && (
                <span>
                  Size:{" "}
                  <span className="bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">
                    {variantProd.size}
                  </span>
                </span>
              )}
              {variantProd.material && (
                <span>
                  Material:{" "}
                  <span className="bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">
                    {variantProd.material}
                  </span>
                </span>
              )}
              {variantProd.style && (
                <span>
                  Style:{" "}
                  <span className="bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">
                    {variantProd.style}
                  </span>
                </span>
              )}
            </div>
            <hr className="mb-3" />
            {addVariantCheckbox ? (
              <>{variantComponents}</>
            ) : (
              <div>
                <button
                  onClick={() => {
                    setAddVariantCheckbox(true);
                    addVariantComponent();
                  }}
                  className="w-fit bg-transparent text-sky-700 text-sm hover:underline hover:text-sky-900"
                >
                  + Edit or add options like size or color
                </button>
              </div>
            )}
            <div className="flex my-5">
              {product.variants[parseInt(id)]?.images.map((item, index) => (
                <div
                  key={index}
                  className="w-[50px] h-[55px] mr-3 border border-slate-300 rounded-md object-fit overflow-hidden relative aspect-square"
                >
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
            </div>
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
            handleDelete();
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
