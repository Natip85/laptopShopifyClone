"use client";
import Image from "next/image";
import { useState } from "react";
import { useDropzone } from "react-dropzone";

interface SelectImageProps {
  handleFileChange: (value: any) => void;
}

const SelectImage = ({ handleFileChange }: SelectImageProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

  const { acceptedFiles, getRootProps, getInputProps, isDragActive } =
    useDropzone({
      accept: { "image/*": [".jpeg", ".png", ".jpg", ".webp"] },
      onDrop: (acceptedFiles) => {
        const updatedFiles = [...uploadedFiles, ...acceptedFiles];
        setUploadedFiles(updatedFiles);
        handleFileChange(updatedFiles);
      },
    });

  return (
    <>
      <div
        {...getRootProps()}
        className="h-[5rem] hover:bg-slate-100 border-black border-[1px] border-dashed p-3 mt-3 mb-3 rounded-lg w-full flex flex-col justify-center items-center cursor-pointer"
      >
        <input {...getInputProps()} />

        {isDragActive ? (
          <p className="text-sm font-normal text-slate-400">
            Drop image here...
          </p>
        ) : (
          <>
            <p className="text-sm font-normal text-slate-400">
              Click to upload or drag images here
            </p>
          </>
        )}
      </div>
      <div className="relative mt-3">
        <div className="grid grid-cols-4 gap-4 col-span-2">
          {uploadedFiles.map((img, i) => (
            <div
              key={i}
              className={`border border-slate-300 rounded-md object-fit overflow-hidden relative aspect-square ${
                i === 0 ? "row-span-2 col-span-2" : ""
              }`}
            >
              <Image
                src={`${URL.createObjectURL(img)}`}
                alt="prod img"
                priority
                fill
                className="object-fit w-[100%]"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SelectImage;
