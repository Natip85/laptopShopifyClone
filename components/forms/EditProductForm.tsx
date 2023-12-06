"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import SelectImage from "../inputs/SelectImage";
import CustomSelect from "../inputs/CustomSelect";
import { weightOptions, statusOptions, categories } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import firebaseApp from "@/lib/firebase";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import axios from "axios";
import { useRouter } from "next/navigation";
import Modal from "../Modal";
import { Product } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import EditProductAddVariant from "./EditProductAddVariant";

export interface EditProductFormProps {
  product: Product;
}
const EditProductForm = ({ product }: EditProductFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<any[]>(product.images);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [shipping, setShipping] = useState(product.shipping);
  const storage = getStorage(firebaseApp);
  const [addVariantCheckbox, setAddVariantCheckbox] = useState(false);
  const [variantComponents, setVariantComponents] = useState(
    [] as JSX.Element[]
  );
  const [variant, setVariant] = useState({});

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
      title: product.title,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      weight: product.weight !== null ? product.weight : undefined,
      shipping: product.shipping !== null ? product.shipping : undefined,
      weightMeasurement: product.weightMeasurement ?? undefined,
      productStatus: product.productStatus,
      category: product.category ?? undefined,
      sku: uuidv4(),
      variant: product.variants,
    },
  });
  useEffect(() => {
    setValue("variants", product.variants);
  }, [variant, setValue, product.variants]);
  const addImageToState = useCallback((value: any) => {
    setNewImages(value);
  }, []);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    let uploadedImages: any[] = [];
    
const isEmpty = Object.keys(variant).length === 0;

const newVariants = isEmpty ? [...product.variants] : [...product.variants, variant];

    const newProductData = { ...data, images: newImages, variants: newVariants };
    if (images.length > 0) {
      const handleImageUploads = async () => {
        toast("Editing product. This might take a while...", {
          icon: "🔃",
        });
        try {
          for (const item of newProductData.images) {
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
    }

    const editedProductData = {
      ...newProductData,
      images: [...images, ...uploadedImages],
      id: product.id,
    };
    axios
      .put("/api/product", editedProductData)
      .then(() => {
        toast.success("Product edited");
        setAddVariantCheckbox(false)
        router.refresh();
      })
      .catch((error) => {
        console.log("Error updating product", error);

        toast.error("Something went wrong when editing the product");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleDelete = async (id: string, images: any[]) => {
    toast("Deleting product, please wait.");
    try {
      for (const item of images) {
        if (item.image) {
          const imageRef = ref(storage, item.image);
          await deleteObject(imageRef);
          console.log("image deleted", item.image);
        }
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
    await axios
      .delete(`/api/product/${id}`)
      .then((res) => {
        toast.success("Product deleted");
        router.push("/products");
        router.refresh();
      })
      .catch((error: any) => {
        toast.error("Failed to delete product");
        console.log(error);
      });
  };

  const addVariantComponent = () => {
    setVariantComponents((prev) => [
      ...prev,
      <EditProductAddVariant
        key={prev.length}
        closeVariants={handleOptionSelectorHide}
        variant={handleAddVariant}
        product={product}
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
  return (
    <>
      <div className="flex flex-col md:flex-row md:justify-between">
        <div className="w-full mr-4">
          <div className="bg-white p-3 rounded-md flex flex-col w-full shadow-lg mb-5 border border-stone-300">
            <label htmlFor="title" className="text-sm text-black">
              Title
            </label>
            <Input
              id="title"
              {...register("title")}
              className="my-2 rounded-md text-sm hover:bg-slate-100 bg-white"
            />
            <label htmlFor="description" className="text-sm text-black">
              Description
            </label>
            <Textarea
              id="description"
              {...register("description")}
              cols={10}
              rows={10}
              className="my-2 hover:bg-slate-100"
            />
          </div>
          <div className="bg-white p-3 rounded-md flex flex-col w-full shadow-lg mb-5 border border-stone-300">
            <span className="text-sm text-black mb-5">Media</span>
            <SelectImage handleFileChange={addImageToState} />
            <div className="grid grid-cols-4 gap-4 col-span-2">
              {images.map((img, i) => (
                <div
                  key={i}
                  className={`border border-slate-300 rounded-md object-fit overflow-hidden relative aspect-video ${
                    i === 0 ? "row-span-2 col-span-2" : ""
                  }`}
                >
                  <Image
                    src={img.image}
                    alt="prod img"
                    priority
                    fill
                    sizes="20"
                    className="object-fit w-[100%]"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-3 rounded-md flex flex-col w-full shadow-lg mb-5 border border-stone-300">
            <span className="text-sm mb-5 text-black">Pricing</span>
            <label htmlFor="price" className="text-xs text-black">
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
            <label htmlFor="quantity" className="text-xs text-black">
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
          <div className="bg-white p-3 rounded-md  w-full shadow-lg mb-5 border border-stone-300">
            <span className="text-sm mb-5 text-black">Variants</span>
             <hr className="my-5"/> 
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
                      + Add options like size or color
                    </button>
                  </div>
                )}
            {product.variants.length > 0 && (
              <>
                <hr className="mt-5"/> 
                <ul>
                  {product.variants.map((item, index) => (
                    <Link
                      key={index}
                      href={`/products/${product.id}/${item?.variantID}`}
                    >
                      <li className="hover:bg-slate-100">
                        <div className="flex items-center justify-between gap-3 p-2">
                          <div className="flex items-center gap-3">
                            <div className="w-[65px] h-[75px] relative">
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
                             {item.color !== null ? item.color: ""} {`${item.size !== null ?  item.size: ""}`} {`${item.material !== null ? item.material: ""}`} {`${item.style !== null ?  item.style: ""}`}
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm m-auto">${item.price || "0"}</span>
                            <span className="text-xs">{item.quantity || "0"} available</span>
                          </div>
                        </div>
                        <hr />
                      </li>
                    </Link>
                  ))}
                </ul>
              </>
            )}
             
          </div>
        </div>
        <div className="sm:ml-0 md:mt-0 min-w-[30%]">
          <div className="bg-white p-3 rounded-md flex flex-col shadow-lg border border-stone-300">
            <span className="text-black">Status</span>
            <div className="mt-5">
              <CustomSelect
                name="productStatus"
                options={statusOptions}
                placeholder="Select a status"
                control={control}
              />
            </div>
          </div>
          <div className="bg-white mt-5 p-3 rounded-md flex flex-col shadow-lg border border-stone-300">
            <span className="text-black">Categories</span>
            <div className="mt-5">
              <CustomSelect
                name="category"
                options={categories}
                placeholder="Select a category"
                control={control}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 flex justify-end">
        <Modal
          title="Discard all unsaved changes?"
          description="If you discard changes, you’ll delete any edits you made since you last saved."
          onConfirm={() => {
            handleDelete(product.id, product.images);
            router.push("/products");
          }}
          btnClasses="mr-2 h-fit text-xs text-white py-1 px-3 bg-red-500 rounded-md"
          triggerTitle="Delete product"
          btnTitle="Delete product"
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

export default EditProductForm;
