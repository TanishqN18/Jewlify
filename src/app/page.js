import Product from '../../models/Product';
import  dbconnect  from '../../lib/dbConnect';
import CategoryTabs from '../../components/CategoryTab';
import HeroSection from '../../components/HeroSection';

export default async function HomePage() {
  await dbconnect();

  // Convert Mongoose documents to plain objects and stringify _id
  const products = await Product.find({}).lean();
  const plainProducts = products.map(product => ({
    ...product,
    _id: product._id.toString(),
  }));

  return (
    <main className="bg-white min-h-screen text-slate-800 dark:bg-gray-950 dark:text-gray-200">
      <HeroSection />
      <CategoryTabs products={plainProducts} />
    </main>
  );
}
