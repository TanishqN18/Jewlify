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
    await dbConnect();
    
    const body = await request.json();
    
    // Ensure that the variants are included in the update
    const product = await Product.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      product
    });
    
  } catch (error) {
    console.error('Product update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
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