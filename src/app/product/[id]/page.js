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
          imageUrls: product.imageUrls || [product.image],
          currentPrice: product.currentPrice || null,
          price: product.priceType === 'fixed' ? product.fixedPrice || 0 : product.price || 0, // <-- FIXED HERE
          priceType: product.priceType || 'fixed',
          description: product.description,
          category: product.category,
          weight: product.weight || 0,
          inStock: product.inStock || false,
          stock: product.stock || 0,
          gemstones: product.gemstones || [],
          tags: product.tags || [],
          material: product.material || 'unknown',
        }}
        relatedProducts={relatedProducts.map((p) => ({
          _id: p._id.toString(),
          name: p.name,
          imageUrls: p.imageUrls || [p.image],
          currentPrice: p.currentPrice || null,
          price: p.priceType === 'fixed' ? p.fixedPrice || 0 : p.price || 0, // <-- FIXED HERE
          priceType: p.priceType || 'fixed',
          category: p.category,
        }))}
      />
    </div>
  );
}
