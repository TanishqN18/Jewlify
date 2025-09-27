export const dynamic = 'force-dynamic';

import dbConnect from '../../../../lib/dbConnect';
import Product from '../../../../models/Product';
import ProductDetailPage from '../../../../components/ProductDetail';
import mongoose from 'mongoose';

export default async function ProductPage(props) {
  // Await params per Next.js requirement
  const { params } = await props;
  const { id } = params;

  await dbConnect();

  // Invalid ObjectId -> Not Found UI (using your theme classes only)
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return (
      <div className="min-h-screen bg-primary">
        <div className="mx-auto max-w-5xl px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-primary">Product not found</h1>
          <p className="mt-2 text-secondary">
            The product you are looking for does not exist.
          </p>
        </div>
      </div>
    );
  }

  const product = await Product.findById(id).lean();

  if (!product) {
    return (
      <div className="min-h-screen bg-primary">
        <div className="mx-auto max-w-5xl px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-primary">Product not found</h1>
          <p className="mt-2 text-secondary">
            The product you are looking for does not exist.
          </p>
        </div>
      </div>
    );
  }

  // Related products (exclude current)
  const relatedProducts = await Product.aggregate([
    { $match: { _id: { $ne: new mongoose.Types.ObjectId(id) } } },
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
