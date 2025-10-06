import { NextResponse } from 'next/server';
import dbConnect from '../../../../../../lib/dbConnect';
import Order from '../../../../../../models/order';

// PATCH /api/admin/orders/bulk  { ids: string[], status: 'confirmed', note?: string }
export async function PATCH(req) {
  try {
    await dbConnect();
    const { ids = [], status, note } = await req.json();
    if (!ids.length || !status) {
      return NextResponse.json({ error: 'ids and status are required' }, { status: 400 });
    }

    await Order.updateMany(
      { _id: { $in: ids } },
      {
        $set: { status },
        $push: { statusHistory: { status, note } }
      }
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('PATCH /orders/bulk error', err);
    return NextResponse.json({ error: 'Bulk update failed' }, { status: 500 });
  }
}

// DELETE /api/admin/orders/bulk  { ids: string[] }
export async function DELETE(req) {
  try {
    await dbConnect();
    const { ids = [] } = await req.json();
    if (!ids.length) return NextResponse.json({ error: 'ids are required' }, { status: 400 });

    const res = await Order.deleteMany({ _id: { $in: ids } });
    return NextResponse.json({ deleted: res.deletedCount });
  } catch (err) {
    console.error('DELETE /orders/bulk error', err);
    return NextResponse.json({ error: 'Bulk delete failed' }, { status: 500 });
  }
}