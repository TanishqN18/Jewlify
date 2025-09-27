export const runtime = 'nodejs'; // ensure Node, not Edge

import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';

const CLERK_API_BASE = 'https://api.clerk.com/v1';

const toPublicCart = (items = []) =>
  items.map(i => ({
    _id: i._id,
    name: i.name || '',
    price: Number(i.price || 0),
    image: i.image || '',
    quantity: Number(i.quantity || 1),
  }));

export async function POST(req) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { cart = [] } = await req.json();
    const safeCart = toPublicCart(cart);

    const secret = process.env.CLERK_SECRET_KEY;
    if (!secret) {
      console.error('Missing CLERK_SECRET_KEY env var');
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
    }

    // 1) Read current metadata
    const getRes = await fetch(`${CLERK_API_BASE}/users/${userId}`, {
      headers: { Authorization: `Bearer ${secret}` },
      cache: 'no-store',
    });
    if (!getRes.ok) {
      const t = await getRes.text();
      console.error('Clerk GET user failed:', getRes.status, t);
      return NextResponse.json({ error: 'Clerk GET failed' }, { status: 500 });
    }
    const user = await getRes.json();
    const existingPM = user.public_metadata || {};

    // 2) Merge and PATCH
    const patchRes = await fetch(`${CLERK_API_BASE}/users/${userId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${secret}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        public_metadata: { ...existingPM, cart: safeCart },
      }),
    });
    if (!patchRes.ok) {
      const t = await patchRes.text();
      console.error('Clerk PATCH user failed:', patchRes.status, t);
      return NextResponse.json({ error: 'Clerk PATCH failed' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('Cart sync error:', e);
    return NextResponse.json({ error: 'Failed to sync cart' }, { status: 500 });
  }
}