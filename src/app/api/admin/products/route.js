import { NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/dbConnect';
import Product from '../../../../../models/Product';
import Rate from '../../../../../models/rate';
import cloudinary from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET - Fetch all products
export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    
    const query = {};
    if (category && category !== 'all') query.category = category;
    if (status && status !== 'all') query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (page - 1) * limit;
    
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Product.countDocuments(query);
    
    // Use active rate; fallback gracefully
    const currentRate = await Rate.findOne({ isActive: true }).sort({ createdAt: -1 });
    const goldRate = currentRate?.goldRate || 0;
    const silverRate = currentRate?.silverRate || 0;
    
    const productsWithPrices = products.map(product => {
      const productObj = product.toObject();
      productObj.currentPrice = product.getCurrentPrice?.(goldRate, silverRate) ?? 0;
      return productObj;
    });
    
    return NextResponse.json({
      success: true,
      products: productsWithPrices,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalProducts: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      },
      rates: {
        goldRate,
        silverRate
      }
    });
    
  } catch (error) {
    console.error('Products fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST - Create new product
export async function POST(req) {
  await dbConnect();
  const body = await req.json();

  const {
    name, description, category, material, mixedMetals, gemstones, // Add gemstones here
    priceType, fixedPrice, weight, stock, minStock, sku,
    dimensions, status, salesCount, inStock, variants, customizationOptions,
    coverImage, imageUrls, tags // Add tags here
  } = body;

  try {
    const newProduct = new Product({
      name, description, category, material, mixedMetals, gemstones, // Include gemstones
      priceType, fixedPrice, weight, stock, minStock, sku,
      dimensions, status, salesCount, inStock, variants, customizationOptions,
      coverImage, imageUrls, tags // Include tags
    });

    await newProduct.save();
    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (error) {
    console.error('Product creation error:', error); // Add better error logging
    return NextResponse.json({ 
      error: 'Internal Server Error', 
      details: error.message 
    }, { status: 500 });
  }
}