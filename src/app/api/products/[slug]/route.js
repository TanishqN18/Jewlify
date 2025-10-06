import { NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/dbConnect';
import Product from '../../../../../models/Product';

export async function GET(req, { params }) {
  const { slug } = params;

  try {
    await dbConnect();

    // Find product by slug or _id (in case slug is actually an ID)
    let product;
    
    // First try to find by slug
    product = await Product.findOne({ slug });
    
    // If not found by slug, try to find by _id (for backward compatibility)
    if (!product && slug.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(slug);
    }

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    // Transform the product data to ensure consistency
    const productData = {
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
      
      // Calculated price (if needed)
      currentPrice: product.getCurrentPrice(5000, 3000) // Default gold/silver rates
    };

    return NextResponse.json({ 
      success: true, 
      data: productData 
    });
    
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch product', error: error.message },
      { status: 500 }
    );
  }
}

// Optional: Add PUT method for updating products
export async function PUT(req, { params }) {
  const { slug } = params;

  try {
    await dbConnect();
    
    const body = await req.json();
    
    // Find product by slug or _id
    let product = await Product.findOne({ slug });
    if (!product && slug.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(slug);
    }

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    // Update the product with new data
    const updatedProduct = await Product.findByIdAndUpdate(
      product._id,
      { ...body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      data: updatedProduct,
      message: 'Product updated successfully'
    });

  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update product', error: error.message },
      { status: 500 }
    );
  }
}

// Optional: Add DELETE method for deleting products
export async function DELETE(req, { params }) {
  const { slug } = params;

  try {
    await dbConnect();
    
    // Find product by slug or _id
    let product = await Product.findOne({ slug });
    if (!product && slug.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(slug);
    }

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    // Delete the product
    await Product.findByIdAndDelete(product._id);

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete product', error: error.message },
      { status: 500 }
    );
  }
}
