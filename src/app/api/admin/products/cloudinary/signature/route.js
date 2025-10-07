import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function respond(data, status = 200) {
  return new NextResponse(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
  });
}

async function handlePOST(req) {
  try {
    const body = await req.json().catch(() => ({}));

    // Accept either { paramsToSign: {...} } or { folder: '...' }
    let paramsToSign = body.paramsToSign;
    if (!paramsToSign && body.folder) {
      paramsToSign = { folder: body.folder };
    }

    if (!paramsToSign || typeof paramsToSign !== 'object') {
      return respond({ error: 'Invalid paramsToSign object' }, 400);
    }

    if (!paramsToSign.folder) {
      return respond({ error: 'folder is required inside paramsToSign' }, 400);
    }

    if (String(paramsToSign.folder).includes('..')) {
      return respond({ error: 'Invalid folder path' }, 400);
    }

    if (!paramsToSign.timestamp) {
      paramsToSign.timestamp = Math.round(Date.now() / 1000);
    }

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET
    );

    return respond({
      signature,
      timestamp: paramsToSign.timestamp,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME
    });
  } catch (e) {
    console.error('Signature generation error:', e);
    return respond({ error: 'Failed to generate signature', details: e.message }, 500);
  }
}

export async function POST(req) {
  return handlePOST(req);
}