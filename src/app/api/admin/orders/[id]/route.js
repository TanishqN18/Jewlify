import { NextResponse } from 'next/server';
import dbConnect from '../../../../../../lib/dbConnect';
import Order from '../../../../../../models/order';
import mongoose from 'mongoose';

export async function GET(_req, { params }) {
  try {
    await dbConnect();
    const order = await Order.findById(params.id).lean();
    if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(order);
  } catch (err) {
    console.error('GET /orders/:id error', err);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

// PUT - update any fields (including status)
export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const payload = await req.json();

    const order = await Order.findById(params.id);
    if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Track status change
    if (payload.status && payload.status !== order.status) {
      order.statusHistory.push({ status: payload.status, note: payload.note });
      order.status = payload.status;
      delete payload.status; // prevent overriding twice
    }

    Object.assign(order, payload);
    await order.save();

    return NextResponse.json(order);
  } catch (err) {
    console.error('PUT /orders/:id error', err);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

// PATCH - status only
export async function PATCH(req, { params }) {
  try {
    await dbConnect();
    const { status, note } = await req.json();
    if (!status) return NextResponse.json({ error: 'status is required' }, { status: 400 });

    const order = await Order.findByIdAndUpdate(
      params.id,
      {
        $set: { status },
        $push: { statusHistory: { status, note } }
      },
      { new: true }
    ).lean();

    if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(order);
  } catch (err) {
    console.error('PATCH /orders/:id error', err);
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}

export async function DELETE(_req, { params }) {
  try {
    await dbConnect();
    const res = await Order.deleteOne({ _id: new mongoose.Types.ObjectId(params.id) });
    if (res.deletedCount === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('DELETE /orders/:id error', err);
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}