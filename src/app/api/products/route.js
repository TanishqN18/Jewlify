// src/app/api/products/route.js

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Product from '@/models/Product';

export async function GET() {
  try {
    await dbConnect();

    const products = await Product.find({});

     return NextResponse.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    return NextResponse.json({ message: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    
    const data = await request.json();
    
    // Validate mixed metals
    if (data.material === 'Mixed') {
      if (!data.mixedMetals || data.mixedMetals.length === 0) {
        return NextResponse.json(
          { error: 'Mixed metal products must specify metal combinations' },
          { status: 400 }
        );
      }
    } else {
      // Clear mixed metals if material is not Mixed
      data.mixedMetals = [];
    }
    
    const product = new Product(data);
    await product.save();
    
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}
