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
  try {
    console.log('📦 Product creation API called');
    
    await dbConnect();
    console.log('✅ Database connected');
    
    const body = await req.json();
    console.log('📥 Received product data:', JSON.stringify(body, null, 2));

    const {
      name, 
      description, 
      category, 
      material, 
      mixedMetals, 
      gemstones,
      tags,
      priceType, 
      fixedPrice, 
      weight, 
      stock, 
      minStock, 
      sku,
      dimensions, 
      status, 
      salesCount, 
      inStock, 
      variants, 
      customizationOptions,
      coverImage, 
      imageUrls,
      isPublished,
      seoTitle,
      seoDescription,
      seoKeywords,
      slug
    } = body;

    // ✅ Validate required fields
    if (!name || !category || !material || !sku) {
      console.error('❌ Missing required fields');
      return NextResponse.json({ 
        success: false,
        error: 'Missing required fields: name, category, material, and sku are required' 
      }, { status: 400 });
    }

    // ✅ Validate pricing based on priceType
    if (priceType === 'fixed' && (!fixedPrice || isNaN(parseFloat(fixedPrice)))) {
      console.error('❌ Fixed price is required for fixed price type');
      return NextResponse.json({ 
        success: false,
        error: 'Fixed price is required when price type is fixed' 
      }, { status: 400 });
    }

    if (priceType === 'weight-based' && (!weight || isNaN(parseFloat(weight)))) {
      console.error('❌ Weight is required for weight-based price type');
      return NextResponse.json({ 
        success: false,
        error: 'Weight is required when price type is weight-based' 
      }, { status: 400 });
    }

    // ✅ Check if SKU already exists
    console.log('🔍 Checking if SKU exists:', sku);
    const existingProduct = await Product.findOne({ sku });
    if (existingProduct) {
      console.error('❌ SKU already exists:', sku);
      return NextResponse.json({ 
        success: false,
        error: 'SKU already exists' 
      }, { status: 409 });
    }

    // ✅ FIX: Prepare product data with proper weight handling
    const productData = {
      name,
      description: description || '',
      category,
      material,
      mixedMetals: Array.isArray(mixedMetals) ? mixedMetals : [],
      gemstones: Array.isArray(gemstones) ? gemstones : [],
      tags: Array.isArray(tags) ? tags : [],
      priceType: priceType || 'fixed',
      sku,
      dimensions: dimensions || {},
      status: status || 'Available',
      salesCount: salesCount || 0,
      inStock: inStock !== undefined ? inStock : (stock > 0),
      variants: Array.isArray(variants) ? variants : [],
      customizationOptions: customizationOptions || {},
      coverImage: coverImage || '',
      imageUrls: Array.isArray(imageUrls) ? imageUrls : [],
      isPublished: isPublished !== undefined ? isPublished : true,
      seoTitle: seoTitle || '',
      seoDescription: seoDescription || '',
      seoKeywords: seoKeywords || '',
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    };

    // ✅ FIX: Handle pricing and weight based on priceType
    if (priceType === 'fixed') {
      productData.fixedPrice = parseFloat(fixedPrice);
      // For fixed price items, set a default weight of 0 or omit it
      productData.weight = weight ? parseFloat(weight) : 0;
    } else if (priceType === 'weight-based') {
      productData.weight = parseFloat(weight);
      // For weight-based items, fixedPrice should be null/undefined
      productData.fixedPrice = null;
    }

    // ✅ Handle stock
    productData.stock = stock ? parseInt(stock) : 0;
    productData.minStock = minStock ? parseInt(minStock) : 5;

    console.log('💾 Creating product with processed data:', JSON.stringify(productData, null, 2));

    // ✅ Create and save the product
    const newProduct = new Product(productData);
    const savedProduct = await newProduct.save();
    
    console.log('✅ Product created successfully with ID:', savedProduct._id);

    return NextResponse.json({ 
      success: true, 
      message: 'Product created successfully',
      product: savedProduct 
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Product creation error:', error);
    console.error('❌ Error name:', error.name);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);

    // ✅ Handle specific MongoDB/Mongoose errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      }));
      
      console.error('❌ Validation errors:', validationErrors);
      
      return NextResponse.json({ 
        success: false,
        error: 'Validation Error',
        details: validationErrors,
        message: 'Please check the required fields and try again'
      }, { status: 400 });
    }

    if (error.name === 'MongoServerError' && error.code === 11000) {
      console.error('❌ Duplicate key error:', error.keyPattern);
      return NextResponse.json({ 
        success: false,
        error: 'Duplicate field error',
        message: 'A product with this SKU or other unique field already exists'
      }, { status: 409 });
    }

    // ✅ Generic error response
    return NextResponse.json({ 
      success: false,
      error: 'Internal Server Error', 
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : 'An unexpected error occurred'
    }, { status: 500 });
  }
}