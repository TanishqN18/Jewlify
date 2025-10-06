import Product from "../../../../../models/Product";
import dbConnect from "../../../../../lib/dbConnect";
import { notFound } from "next/navigation";
import ProductEditorClient from "../ProductEditorCient";

export const dynamic = "force-dynamic";

export default async function ItemDetailPage({ params }) {
  const { id } = params;
  await dbConnect();
  const product = await Product.findById(id).lean();
  if (!product) return notFound();

  // Normalize fields that may be missing in current schema
  const normalized = {
    ...product,
    image: product.image || [],
    seoTitle: product.seoTitle || "",
    seoDescription: product.seoDescription || "",
    seoKeywords: product.seoKeywords || "",
    slug: product.slug || "",
    isPublished: product.isPublished ?? true,
    dimensions: product.dimensions || { length: "", width: "", height: "" },
    mixedMetals: product.mixedMetals || [],
    customizationOptions: {
      allowEngraving: product.customizationOptions?.allowEngraving || false,
      maxEngravingLength: product.customizationOptions?.maxEngravingLength || 20,
      allowSpecialInstructions: product.customizationOptions?.allowSpecialInstructions || false,
      sizeOptions: product.customizationOptions?.sizeOptions || []
    },
    variants: product.variants || []
  };

  return <ProductEditorClient initialProduct={JSON.parse(JSON.stringify(normalized))} productId={id} />;
}