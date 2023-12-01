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
  variant: (variant1: any[]) => void;
  closeVariants: () => void;
}

const AddProductVariant = ({
  variant,
  closeVariants,
}: AddProductVariantProps) => {
  const [optionType, setOptionType] = useState("");
  const [optionValues, setOptionValues] = useState<string[]>([""]);
  const [saved, setSaved] = useState(false);

  const handleOptionTypeChange = (value: string) => {
    setOptionType(value);
  };
  const handleOptionValueChange =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValues = [...optionValues];
      newValues[index] = e.target.value;
      setOptionValues(newValues);

      if (index === newValues.length - 1 && e.target.value.length >= 2) {
        setOptionValues([...newValues, ""]);
      }
    };

  const removeOptionValue = (index: number) => {
    const newValues = [...optionValues];
    newValues.splice(index, 1);
    setOptionValues(newValues);
  };

  const handleSave = () => {
    const lastFieldFilled = optionValues[optionValues.length - 1].length > 0;

    if (!optionType) {
      alert(`Option type is required.`);
      return;
    }

    if (lastFieldFilled) {
      setSaved(true);
    } else {
      alert(`Please choose additional product ${optionType} value.`);
    }
    const optionTypeObjects = optionValues.map((item, index) => ({
      [optionType]: item,
      variantID: index,
    }));

    variant(optionTypeObjects);
  };
  return (
    <div>
      {saved ? (
        <>
          <span className="font-bold mr-2">{optionType}</span>
          {optionValues.map((value, index) => (
            <span
              key={index}
              className={`${
                value
                  ? "bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300"
                  : ""
              }`}
            >
              {value}
            </span>
          ))}
        </>
      ) : (
        <>
          <label
            htmlFor="optionType"
            className="text-xs text-slate-800 cursor-pointer"
          >
            Option Type
          </label>

          <div className="flex justify-between">
            <Select value={optionType} onValueChange={handleOptionTypeChange}>
              <SelectTrigger>
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
          {optionValues.map((value, index) => (
            <div key={index} className="flex justify-between">
              <Input
                id={`optionValue-${index}`}
                value={value}
                onChange={handleOptionValueChange(index)}
                className="my-2 rounded-md text-sm hover:bg-slate-100 bg-white"
              />
              {index > 0 && (
                <button onClick={() => removeOptionValue(index)}>
                  <FaRegTrashCan style={{ color: "red", marginLeft: 15 }} />
                </button>
              )}
            </div>
          ))}

          <Button
            onClick={handleSave}
            className="my-2 h-fit text-sm text-white py-1 px-3 bg-black rounded-lg"
          >
            Save
          </Button>
        </>
      )}
    </div>
  );
};

export default AddProductVariant;
