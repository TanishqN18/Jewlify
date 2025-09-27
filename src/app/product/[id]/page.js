export const dynamic = 'force-dynamic';

import dbConnect from '../../../../lib/dbConnect';
import Product from '../../../../models/Product';
import ProductDetailPage from '../../../../components/ProductDetail';

export default async function ProductPage({ params }) {
  const { id } = params;
  await dbConnect();

  const product = await Product.findById(id).lean();

  if (!product) {
    return (
      <div className="min-h-screen bg-primary">
        <div className="p-10 text-center">
          <h1 className="text-2xl font-bold text-red-500 dark:text-red-400">
            Product not found
          </h1>
          <p className="text-secondary mt-2">
            The product you are looking for does not exist.
          </p>
        </div>
      </div>
    );
  }

  // Get 4 random related products excluding the current one
  const relatedProducts = await Product.aggregate([
    { $match: { _id: { $ne: product._id } } },
    { $sample: { size: 4 } },
  ]);

  return (
    <div className="min-h-screen bg-primary">
      <ProductDetailPage
        product={{
          _id: product._id.toString(),
          name: product.name,
          image: product.image,
          price: product.price,
          category: product.category,
          description: product.description,
          tag: product.tag || '',
        }}
        relatedProducts={relatedProducts.map((p) => ({
          _id: p._id.toString(),
          name: p.name,
          image: p.image,
          price: p.price,
          category: p.category,
        }))}
      />
    </div>
  );
}
