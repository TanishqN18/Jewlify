import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    const body = await request.json();
    const { paramsToSign } = body;

    console.log('🔐 Generating signature for params:', paramsToSign);

    // Validate required parameters
    if (!paramsToSign || typeof paramsToSign !== 'object') {
      return NextResponse.json(
        { error: 'Invalid paramsToSign object' },
        { status: 400 }
      );
    }

    // Ensure timestamp is present
    if (!paramsToSign.timestamp) {
      paramsToSign.timestamp = Math.round(new Date().getTime() / 1000);
    }

    // Generate signature using Cloudinary utility
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET
    );

    console.log('✅ Signature generated successfully');

    return NextResponse.json({
      signature,
      api_key: process.env.CLOUDINARY_API_KEY,
      timestamp: paramsToSign.timestamp,
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    });

  } catch (error) {
    console.error('❌ Signature generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate signature', details: error.message },
      { status: 500 }
    );
  }
}