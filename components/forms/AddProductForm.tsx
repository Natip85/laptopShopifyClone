import { useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import SelectImage from "../inputs/SelectImage";
import CustomSelect from "../inputs/CustomSelect";
import { weightOptions, statusOptions, categories } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";
import AddProductVariant from "./AddProductVariant";
import toast from "react-hot-toast";
import firebaseApp from "@/lib/firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import axios from "axios";
import { useRouter } from "next/navigation";
import Modal from "../Modal";

const AddProductForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<File[] | null>([]);
  const [variant, setVariant] = useState<any[] | null>(null);
  const [shipping, setShipping] = useState(false);
  const [addVariantCheckbox, setAddVariantCheckbox] = useState(false);
  const [variantComponents, setVariantComponents] = useState(
    [] as JSX.Element[]
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    control,
  } = useForm<FieldValues>({
    defaultValues: {
      productStatus: "draft",
      sku: uuidv4(),
    },
  });

  useEffect(() => {
    setValue("images", images);
    setValue("variants", variant);
  }, [images, variant, setValue]);

  const addImageToState = useCallback((value: File[]) => {
    setImages(value);
  }, []);

  const handleAddVariant = (value: string[]) => {
    setVariant(value);
  };

  const handleOptionSelectorHide = () => {
    setVariantComponents((prev) => prev.slice(0, -1));
    if (variantComponents.length === 0) setAddVariantCheckbox(false);
  };

  const addVariantComponent = () => {
    setVariantComponents((prev) => [
      ...prev,
      <AddProductVariant
        key={prev.length}
        closeVariants={handleOptionSelectorHide}
        variant={handleAddVariant}
      />,
    ]);
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    let uploadedImages: File[] = [];

    if (!data.title) {
      setIsLoading(false);
      return toast.error("Title required");
    }

    if (!data.images || data.images.length === 0) {
      setIsLoading(false);
      return toast.error("Select at least one image");
    }

    const handleImageUploads = async () => {
      toast("Creating product. This might take a while...", {
        icon: "🔃",
      });
      try {
        for (const item of data.images) {
          if (item) {
            const fileName = new Date().getTime() + "new-" + item.name;
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

    const productData = { ...data, images: uploadedImages };
    axios
      .post("/api/product", productData)
      .then(() => {
        toast.success("Product created");
        router.push("/products");
        router.refresh();
      })
      .catch((error) => {
        toast.error("Something went wrong when creating a product");
      })
      .finally(() => {
        setIsLoading(false);
      });
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
          <div className="bg-white p-3 rounded-md flex flex-col w-full shadow-lg mb-5 border border-stone-300">
            <span className="text-sm mb-5 text-black">Variants</span>

            {addVariantCheckbox ? (
              <>{variantComponents}</>
            ) : (
              <button
                onClick={() => {
                  setAddVariantCheckbox(true);
                  addVariantComponent();
                }}
                className="w-fit bg-transparent text-sky-700 text-sm hover:underline hover:text-sky-900"
              >
                + Add options like size or color
              </button>
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
          onConfirm={() => router.push("/products")}
          btnClasses="mr-2 h-fit text-xs text-white py-1 px-3 bg-black rounded-md"
          triggerTitle="Discard"
          btnTitle="Discard changes"
        />
        <Button
          disabled={isLoading}
          onClick={handleSubmit(onSubmit)}
          className="h-fit text-xs text-white py-1 bg-black"
        >
          {isLoading ? "Loading..." : "Save"}
        </Button>
      </div>
    </>
  );
};

export default AddProductForm;
