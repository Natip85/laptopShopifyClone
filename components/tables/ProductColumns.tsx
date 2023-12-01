"use client";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, EyeIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@prisma/client";
import toast from "react-hot-toast";
import axios from "axios";
import Modal from "../Modal";
import { FaTrashCan } from "react-icons/fa6";
import { deleteObject, getStorage, ref } from "firebase/storage";
import firebaseApp from "@/lib/firebase";

export const columns: ColumnDef<Product>[] = [
  {
    id: "select",
    header: ({ table }) => {
      return (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value);
          }}
        />
      );
    },
    cell: ({ row }) => {
      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
          }}
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: "",
    accessorKey: "images",
    cell: ({ row }) => {
      const product = row.original;
      const productId = product.id;
      const allImages: any[] = row.getValue("images");

      return (
        <Link href={`/products/${productId}`}>
          <div className="w-[60px] h-[60px] overflow-hidden relative aspect-video">
            <Image
              src={
                allImages[0].image ||
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTv2rNkxu82jwemyb3lSLkmbyLCqflQDMJPA&usqp=CAU"
              }
              alt="prod img"
              priority
              fill
              sizes="20"
              className="object-contain"
            />
          </div>
        </Link>
      );
    },
  },
  {
    header: "Product",
    accessorKey: "title",
    cell: ({ row }) => {
      const product = row.original;
      const productId = product.id;
      const allTitles: string = row.getValue("title");
      return (
        <Link
          href={`/products/${productId}`}
          className="font-bold hover:underline "
        >
          {allTitles}
        </Link>
      );
    },
  },
  {
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === "asc");
          }}
        >
          Product Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorKey: "category",
  },
  {
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === "asc");
          }}
        >
          Product Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorKey: "productStatus",
    cell: ({ row }) => {
      const product = row.original;
      const prodStatus = product.productStatus;
      return (
        <span
          className={`inline-flex items-center rounded-md  px-2 py-1 text-xs font-medium  ring-1 ring-inset
          ${
            product.productStatus === "active"
              ? "bg-green-200 text-green-700 ring-green-600/20"
              : "bg-red-50 text-red-700 ring-red-600/10"
          }
          `}
        >
          {prodStatus}
        </span>
      );
    },
  },
  {
    header: "Product Inventory",
    accessorKey: "quantity",

    cell: ({ row }) => {
      const quantity = row.getValue("quantity") as number;
      return <span className="text-stone-500">{quantity} in stock</span>;
    },
  },
  {
    header: "",
    id: "id",
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;
      const productId = product.id;

      const handleDelete = async (id: string, images: any[]) => {
        toast("Deleting product, please wait.");
        try {
          for (const item of images) {
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
        await axios
          .delete(`/api/product/${id}`)
          .then((res) => {
            toast.success("Product deleted");
            window.location.reload();
          })
          .catch((error: any) => {
            toast.error("Failed to delete product");
            console.log(error);
          });
      };
      return (
        <div className="flex">
          <Link
            href={`/products/${productId}`}
            className="w-full flex justify-center items-center"
          >
            <EyeIcon style={{ color: "#26659B" }} />
          </Link>
          <Modal
            icon={<FaTrashCan style={{ color: "red" }} />}
            onConfirm={() => handleDelete(product.id, product.images)}
            title="Delete product?"
            description="If you delete, this cannot be undone."
            btnTitle="Delete product"
          />
        </div>
      );
    },
  },
];
