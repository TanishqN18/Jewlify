import FilterSidebarWrapper from '../../../components/SidebarFiltersWrapper';
import ProductGrid from '../../../components/ProductGrid';
import dbConnect from '../../../lib/dbConnect';
import Product from '../../../models/Product';

export default async function ShopPage() {
  await dbConnect();
  const products = await Product.find({}).lean();

  const safeProducts = products.map((product) => ({
    ...product,
    _id: product._id.toString(),
  }));

  return (
    <div className="px-4 sm:px-10 py-10 min-h-screen bg-neutral-50 dark:bg-black">
      <h1 className="text-4xl font-extrabold mb-10 text-center text-gray-800 dark:text-white tracking-wide">
        Explore Our Collection
      </h1>

      <div className="flex flex-col lg:flex-row gap-10">
        <div className="lg:w-1/4">
          <FilterSidebarWrapper />
        </div>

        <ProductGrid allProducts={safeProducts} />
      </div>
    </div>
  );
}
