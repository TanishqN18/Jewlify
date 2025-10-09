import { NextResponse } from 'next/server';
import dbConnect from '../../../../../../lib/dbConnect';
import Product from '../../../../../../models/Product';
import rate from '../../../../../../models/rate';

// GET - Fetch single product
export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    const product = await Product.findById(params.id);
    
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Get current rates
    const currentRate = await rate.findOne().sort({ createdAt: -1 });
    const goldRate = currentRate?.goldRate || 0;
    const silverRate = currentRate?.silverRate || 0;
    
    const productObj = product.toObject();
    productObj.currentPrice = product.getCurrentPrice(goldRate, silverRate);
    
    return NextResponse.json({
      success: true,
      product: productObj,
      rates: { goldRate, silverRate }
    });
    
  } catch (error) {
    console.error('Product fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// PUT - Update product
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();
    
    console.log('PUT request received for product ID:', id);
    console.log('Data to update:', data);

    // Connect to database
    await dbConnect();

    // Validate required fields
    if (!data.name || !data.category || !data.material) {
      return NextResponse.json(
        { error: 'Missing required fields: name, category, material' },
        { status: 400 }
      );
    }

    // Prepare update data with proper field mapping
    const updateData = {
      ...data,
      
      // Ensure numeric fields are properly converted
      fixedPrice: data.fixedPrice ? parseFloat(data.fixedPrice) : null,
      weight: data.weight ? parseFloat(data.weight) : 0,
      stock: data.stock ? parseInt(data.stock) : 0,
      minStock: data.minStock ? parseInt(data.minStock) : 5,
      
      // Handle pricing based on type
      priceType: data.priceType || 'fixed',
      
      // Ensure arrays are properly formatted
      tags: Array.isArray(data.tags) 
        ? data.tags 
        : String(data.tags || "").split(",").map(t => t.trim()).filter(Boolean),
      gemstones: Array.isArray(data.gemstones) ? data.gemstones : [],
      mixedMetals: Array.isArray(data.mixedMetals) ? data.mixedMetals : [],
      image: Array.isArray(data.image) ? data.image : [],
      
      // Handle dimensions properly
      dimensions: {
        length: data.dimensions?.length ? parseFloat(data.dimensions.length) : 0,
        width: data.dimensions?.width ? parseFloat(data.dimensions.width) : 0,
        height: data.dimensions?.height ? parseFloat(data.dimensions.height) : 0,
      },
      
      // Handle customization options
      customizationOptions: {
        allowEngraving: Boolean(data.customizationOptions?.allowEngraving),
        maxEngravingLength: data.customizationOptions?.maxEngravingLength 
          ? parseInt(data.customizationOptions.maxEngravingLength) 
          : 20,
        allowSpecialInstructions: Boolean(data.customizationOptions?.allowSpecialInstructions),
        sizeOptions: Array.isArray(data.customizationOptions?.sizeOptions) 
          ? data.customizationOptions.sizeOptions 
          : [],
      },
      
      // Handle variants
      variants: Array.isArray(data.variants) ? data.variants : [],
      
      // Set update timestamp
      updatedAt: new Date(),
    };

    // Remove undefined/null values but keep 0 values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined || updateData[key] === null) {
        delete updateData[key];
      }
    });

    console.log('Processed update data:', updateData);

    // Find and update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { 
        new: true, // Return the updated document
        runValidators: true // Run schema validations
      }
    );

    if (!updatedProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    console.log('Product updated successfully:', updatedProduct._id);

    return NextResponse.json({
      message: 'Product updated successfully',
      product: updatedProduct
    });

  } catch (error) {
    console.error('Error updating product:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update product', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete product
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    
    const product = await Product.findByIdAndDelete(params.id);
    
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    });
    
  } catch (error) {
    console.error('Product deletion error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}