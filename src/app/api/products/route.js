import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect';
import Product from '../../../../models/Product';

export async function GET(request) {
  try {
    await dbConnect();

    // Get query parameters for filtering, pagination, etc.
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const material = searchParams.get('material');
    const priceType = searchParams.get('priceType');
    const inStock = searchParams.get('inStock');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit')) || 50;
    const page = parseInt(searchParams.get('page')) || 1;
    const skip = (page - 1) * limit;

    // Build query object
    let query = {};

    // Filter by category
    if (category && category !== 'all') {
      query.category = { $regex: category, $options: 'i' };
    }

    // Filter by material
    if (material && material !== 'all') {
      query.material = { $regex: material, $options: 'i' };
    }

    // Filter by price type
    if (priceType && priceType !== 'all') {
      query.priceType = priceType;
    }

    // Filter by stock status
    if (inStock === 'true') {
      query.inStock = true;
      query.stock = { $gt: 0 };
    }

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Fetch products with pagination
    const products = await Product.find(query)
      .sort({ createdAt: -1 }) // Sort by newest first
      .limit(limit)
      .skip(skip)
      .lean(); // Use lean() for better performance

    // Get total count for pagination
    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    // Transform products data to ensure consistency
    const transformedProducts = products.map(product => ({
      _id: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      material: product.material,
      mixedMetals: product.mixedMetals || [],
      gemstones: product.gemstones || [],
      
      // Pricing
      priceType: product.priceType,
      fixedPrice: product.fixedPrice,
      weight: product.weight,
      
      // Stock
      stock: product.stock,
      minStock: product.minStock,
      inStock: product.inStock,
      
      // Product details
      sku: product.sku,
      dimensions: product.dimensions || { length: 0, width: 0, height: 0 },
      status: product.status,
      salesCount: product.salesCount || 0,
      
      // Images - ensure imageUrls is properly formatted
      imageUrls: product.imageUrls || [],
      coverImage: product.coverImage,
      
      // Variants and customization
      variants: product.variants || [],
      customizationOptions: product.customizationOptions || {
        allowEngraving: false,
        maxEngravingLength: 20,
        allowSpecialInstructions: false,
        sizeOptions: []
      },
      
      // Additional fields
      tags: product.tags || [],
      slug: product.slug,
      
      // Timestamps
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      
      // Calculated current price (you can adjust gold/silver rates as needed)
      currentPrice: product.priceType === 'fixed' 
        ? product.fixedPrice 
        : (product.weight || 0) * 5000 // Default gold rate of 5000 per gram
    }));

    return NextResponse.json({
      success: true,
      data: transformedProducts,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      filters: {
        category,
        material,
        priceType,
        inStock,
        search
      }
    });

  } catch (err) {
    console.error('Error fetching products:', err);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch products', 
        error: err.message 
      }, 
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.category || !data.priceType) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Name, category, and priceType are required fields' 
        },
        { status: 400 }
      );
    }

    // Validate mixed metals
    if (data.material === 'Mixed') {
      if (!data.mixedMetals || data.mixedMetals.length === 0) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Mixed metal products must specify metal combinations' 
          },
          { status: 400 }
        );
      }
    } else {
      // Clear mixed metals if material is not Mixed
      data.mixedMetals = [];
    }

    // Validate pricing based on priceType
    if (data.priceType === 'fixed' && (!data.fixedPrice || data.fixedPrice <= 0)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Fixed price products must have a valid fixed price' 
        },
        { status: 400 }
      );
    }

    if (data.priceType === 'weight-based' && (!data.weight || data.weight <= 0)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Weight-based products must have a valid weight' 
        },
        { status: 400 }
      );
    }

    // Validate imageUrls if provided
    if (data.imageUrls && !Array.isArray(data.imageUrls)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'imageUrls must be an array' 
        },
        { status: 400 }
      );
    }

    // Ensure default values for optional fields
    const productData = {
      ...data,
      mixedMetals: data.mixedMetals || [],
      gemstones: data.gemstones || [],
      imageUrls: data.imageUrls || [],
      variants: data.variants || [],
      tags: data.tags || [],
      customizationOptions: data.customizationOptions || {
        allowEngraving: false,
        maxEngravingLength: 20,
        allowSpecialInstructions: false,
        sizeOptions: []
      },
      dimensions: data.dimensions || { length: 0, width: 0, height: 0 },
      salesCount: 0,
      inStock: data.stock > 0,
      status: data.status || 'draft',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Generate SKU if not provided
    if (!productData.sku) {
      const categoryPrefix = productData.category.substring(0, 3).toUpperCase();
      const materialPrefix = productData.material ? productData.material.substring(0, 3).toUpperCase() : 'GEN';
      const timestamp = Date.now().toString().slice(-6);
      productData.sku = `${categoryPrefix}-${materialPrefix}-${timestamp}`;
    }

    // Generate slug if not provided
    if (!productData.slug) {
      productData.slug = productData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      // Ensure unique slug
      const existingProduct = await Product.findOne({ slug: productData.slug });
      if (existingProduct) {
        productData.slug = `${productData.slug}-${Date.now()}`;
      }
    }
    
    const product = new Product(productData);
    await product.save();
    
    return NextResponse.json({
      success: true,
      data: product,
      message: 'Product created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating product:', error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed', 
          details: validationErrors 
        },
        { status: 400 }
      );
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern)[0];
      return NextResponse.json(
        { 
          success: false, 
          error: `${duplicateField} already exists` 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: error.message 
      },
      { status: 500 }
    );
  }
}
