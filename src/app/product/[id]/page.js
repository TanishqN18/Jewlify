export const dynamic = 'force-dynamic';

import dbConnect from '../../../../lib/dbConnect';
import Product from '../../../../models/Product';
import ProductDetailPage from '../../../../components/ProductDetail';

export default async function ProductPage({ params }) {
  const { id } = params; // ✅ Keep this synchronous — no await needed
  await dbConnect();

  const product = await Product.findById(id).lean();

  if (!product) {
    return <div className="p-10 text-center text-red-500">Product not found</div>;
  }

  // Get 4 random related products excluding the current one
  const relatedProducts = await Product.aggregate([
    { $match: { _id: { $ne: product._id } } },
    { $sample: { size: 4 } },
  ]);

  return (
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
  );
}
