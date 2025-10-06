import { NextResponse } from 'next/server';
import cloudinary from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const sku = searchParams.get('sku');

  if (!sku) {
    return NextResponse.json({ error: 'SKU is required' }, { status: 400 });
  }

  try {
    const images = await cloudinary.v2.api.resources({
      type: 'upload',
      prefix: `products/${sku}/images/`, // Adjust the prefix based on your Cloudinary structure
    });

    return NextResponse.json({ images: images.resources.map(img => img.secure_url) }, { status: 200 });
  } catch (error) {
    console.error('Cloudinary error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}