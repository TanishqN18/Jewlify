// src/app/api/products/route.js

import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect';
import Product from '../../../../models/Product';

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
