
import NullData from "@/components/NullData";
import getProductById from "@/actions/getProductById";
import getCurrentUser from "@/actions/getCurrentUser";
import ProductDetails from "../../store-components/product/ProductDetails";
import AddRating from "../../store-components/product/AddRating";
import ListRating from "../../store-components/product/ListRating";

interface IParams {
  productId?: string;
}
const Product = async ({ params }: { params: IParams }) => {
  const product = await getProductById(params);
  const user = await getCurrentUser();
  if (!product) {
    return <NullData title="Product does not exist" />;
  }
  return (
    <div className="p-8">
     
        <ProductDetails product={product} />
        <div>variants</div>
        <div className="flex flex-col mt-20 gap-4">
          <AddRating product={product} user={user} />
          
          <ListRating product={product} />
        </div>
    </div>
  );
};

export default Product;
