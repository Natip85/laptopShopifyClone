import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FieldPath, useController } from "react-hook-form";

interface CustomSelectProps {
  name: FieldPath<any>;
  control: any;
  options: any[];
  placeholder: string;
}

const CustomSelect = ({
  name,
  control,
  options,
  placeholder,
}: CustomSelectProps) => {
  const {
    field: { value, onChange },
  } = useController({ name, control });

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              className="cursor-pointer"
              value={option.value}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default CustomSelect;
