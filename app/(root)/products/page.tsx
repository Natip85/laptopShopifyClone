import getProducts from "@/actions/getProducts";
import ProductTable from "@/components/tables/ProductTable";
import Link from "next/link";
import { columns } from "@/components/tables/ProductColumns";

const Products = async () => {
  const allProducts = await getProducts();

  return (
    <>
      <div className="w-full flex justify-between items-center">
        <h1 className="font-bold text-xl ">Products</h1>
        <Link
          href={"/products/new"}
          className="h-fit text-sm text-white py-1 px-3 bg-black rounded-lg"
        >
          Add product
        </Link>
      </div>
      <ProductTable columns={columns} data={allProducts} />
    </>
  );
};

export default Products;
