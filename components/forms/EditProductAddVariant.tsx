import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FaRegTrashCan } from "react-icons/fa6";
import { v4 as uuidv4 } from "uuid";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { variantOptions } from "@/lib/utils";

interface AddProductVariantProps {
  variant: (variant1: any) => void;
  closeVariants: () => void;
  product?: any;
}

const EditProductAddVariant = ({
  product,
  variant,
  closeVariants,
}: AddProductVariantProps) => {
  const [optionType, setOptionType] = useState("");
  const [optionValues, setOptionValues] = useState("");
  const [saved, setSaved] = useState(false);

  const handleOptionTypeChange = (value: string) => {
    setOptionType(value);
  };

  const handleSave = () => {

    if (!optionType) {
      alert(`Option type is required.`);
      return;
    }
    if (!optionValues) {
      alert(`Option value is required.`);
      return;
    }
const newId = product.variants.length

    const optionTypeObjects = {
      [optionType]: optionValues,
      variantID: newId ,
    };

    variant(optionTypeObjects);
    setSaved(true)
  };
  return (
    <div>
      {saved ? (
        <>
          <span className="font-bold mr-2">{optionType}</span>

          <span
            className={`${"bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300"}`}
          >
            {optionValues}
          </span>
        </>
      ) : (
        <div className="rounded-lg border p-3">
          <label
            htmlFor="optionType"
            className="text-xs text-slate-800 cursor-pointer"
          >
            Option Type
          </label>

          <div className="flex justify-between">
            <Select value={optionType} onValueChange={handleOptionTypeChange}>
              <SelectTrigger className="w-[90%]">
                <SelectValue placeholder="Select a variant" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {variantOptions.map((item, index) => (
                    <SelectItem key={index} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <button onClick={closeVariants}>
              <FaRegTrashCan style={{ color: "red", marginLeft: 15 }} />
            </button>
          </div>

          <label
            htmlFor="optionValue"
            className="text-xs text-slate-800 cursor-pointer"
          >
            Option Value
          </label>
            <div className="flex justify-between">
              <Input
                id={`optionValue`}
                value={optionValues}
                onChange={(e)=>setOptionValues(e.target.value)}
                className="my-2 rounded-md text-sm hover:bg-slate-100 bg-white w-[90%]"
              />
            </div>
          <Button
            onClick={handleSave}
            className="my-2 h-fit text-sm text-white py-1 px-3 bg-black rounded-lg"
          >
            Save
          </Button>
        </div>
      )}
    </div>
  );
};

export default EditProductAddVariant;
