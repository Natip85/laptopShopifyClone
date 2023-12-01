import getProductById from "@/actions/getProductById";
import VariantDetails from "@/components/VariantDetails";
import EditVariantForm from "@/components/forms/EditVariantForm";

interface IParams {
  productId?: string;
}

const Variants = async ({ params }: { params: IParams }) => {
  const product = await getProductById(params);
  if (!product) {
    return <div>Oops! Product with the given id does not exist.</div>;
  }
  return <VariantDetails product={product} />;
};

export default Variants;
