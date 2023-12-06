import getProducts from "@/actions/getProducts";
import NullData from "@/components/NullData";
import ProductCard from "../store-components/product/ProductCard";
import HomeBanner from "../store-components/HomeBanner";

const Store = async () => {
  const products = await getProducts();
   if (products.length === 0) {
    return (
      <NullData title="Oops! No products found. Click 'All' to clear filters." />
    );
  }

  function shuffleArray(array: any) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const shuffledProducts = shuffleArray(products);
  return (
  <main className="p-8">
     
        <div>
          <HomeBanner />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
          {shuffledProducts.map((product: any) => {
            return (
              <ProductCard
                key={product.id}
                data={product}
                shuffledProducts={shuffledProducts}
              />
            );
          })}
        </div>
    </main>
  );
};

export default Store;
