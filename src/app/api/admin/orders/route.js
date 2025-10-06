import { NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/dbConnect';
import Order from '../../../../../models/order';

// GET /api/admin/orders?page=1&limit=20&status=pending&search=abc&dateRange=week
export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100);
    const status = searchParams.get('status'); // pending|confirmed|shipped|delivered|cancelled
    const search = searchParams.get('search')?.trim();
    const dateRange = searchParams.get('dateRange'); // today|week|month

    const where = {};

    if (status && status !== 'all') {
      where.status = status;
    }

    if (search) {
      const regex = new RegExp(search, 'i');
      where.$or = [
        { _id: { $regex: regex } }, // allows searching by ObjectId string
        { 'shippingAddress.name': { $regex: regex } },
        { 'shippingAddress.email': { $regex: regex } },
        { 'shippingAddress.phone': { $regex: regex } },
      ];
    }

    if (dateRange && dateRange !== 'all') {
      const now = new Date();
      const start = new Date();
      if (dateRange === 'today') start.setHours(0, 0, 0, 0);
      if (dateRange === 'week') start.setDate(now.getDate() - 7);
      if (dateRange === 'month') start.setDate(now.getDate() - 30);
      where.createdAt = { $gte: start, $lte: now };
    }

    const [orders, total] = await Promise.all([
      Order.find(where)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Order.countDocuments(where)
    ]);

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      }
    });
  } catch (err) {
    console.error('GET /orders error', err);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

// POST /api/admin/orders
export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    const {
      userId,
      items = [],
      shippingAddress = {},
      paymentMethod = 'COD',
      status = 'pending',
      total,
      note
    } = body;

    if (!userId || !items.length) {
      return NextResponse.json({ error: 'userId and at least one item are required' }, { status: 400 });
    }

    // Compute total if not provided
    const computedTotal = typeof total === 'number'
      ? total
      : items.reduce((sum, it) => sum + (Number(it.price || 0) * Number(it.quantity || 0)), 0);

    const order = await Order.create({
      userId,
      items,
      total: computedTotal,
      shippingAddress,
      paymentMethod,
      status: status || 'pending',
      statusHistory: [{ status: status || 'pending', note }]
    });

    return NextResponse.json(order, { status: 201 });
  } catch (err) {
    console.error('POST /orders error', err);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}