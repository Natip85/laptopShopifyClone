import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  AiFillMobile,
  AiOutlineDesktop,
  AiOutlineLaptop,
} from "react-icons/ai";
import { MdOutlineKeyboard, MdStorefront, MdTv, MdWatch } from "react-icons/md";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const sidebarLinks = [
  {
    imgURL: "/assets/home.svg",
    route: "/",
    label: "Home",
  },
  {
    imgURL: "/assets/orders.svg",
    route: "/orders",
    label: "Orders",
  },
  {
    imgURL: "/assets/products.svg",
    route: "/products",
    label: "Products",
  },
  {
    imgURL: "/assets/customers.svg",
    route: "/customers",
    label: "Customers",
  },
  {
    imgURL: "/assets/analytics.svg",
    route: "/analytics",
    label: "Analytics",
  },
  {
    imgURL: "/assets/store.svg",
    route: "/store",
    label: "Live Store",
  },
];

export const weightOptions = [
  { label: "lb", value: "lb" },
  { label: "oz", value: "oz" },
  { label: "kg", value: "kg" },
  { label: "g", value: "g" },
];

export const variantOptions = ["color", "size", "material", "style"];

export const statusOptions = [
  { label: "active", value: "active" },
  { label: "draft", value: "draft" },
];

export const categories = [
  {
    label: "All",
    icon: MdStorefront,
    value: "All",
  },
  {
    label: "Phone",
    icon: AiFillMobile,
    value: "Phone",
  },
  {
    label: "Laptop",
    icon: AiOutlineLaptop,
    value: "Laptop",
  },
  {
    label: "Desktop",
    icon: AiOutlineDesktop,
    value: "Desktop",
  },
  {
    label: "Watch",
    icon: MdWatch,
    value: "Watch",
  },
  {
    label: "TV",
    icon: MdTv,
    value: "TV",
  },
  {
    label: "Accesories",
    icon: MdOutlineKeyboard,
    value: "Accesories",
  },
];
