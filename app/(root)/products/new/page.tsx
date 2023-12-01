"use client";

import Modal from "@/components/Modal";
import AddProductForm from "@/components/forms/AddProductForm";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { BiArrowBack } from "react-icons/bi";

const New = () => {
  const router = useRouter();

  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="flex items-center font-bold mb-5 ">
        <Modal
          title="Leave page with unsaved changes?"
          description="Leaving this page will delete all unsaved changes."
          icon={<BiArrowBack width={25} height={25} />}
          onConfirm={() => router.push("/products")}
          btnClasses="hover:bg-slate-300 rounded-md mr-1 p-1 cursor-pointer"
          btnTitle="Leave page"
        />
        Add product
      </div>
      <AddProductForm />
    </>
  );
};

export default New;
