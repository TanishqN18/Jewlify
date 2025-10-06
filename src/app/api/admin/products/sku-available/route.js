import { NextResponse } from "next/server";
import dbConnect from "../../../../../../lib/dbConnect";            
import Product from "../../../../../../models/Product";      

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const sku = (searchParams.get("sku") || "").trim();
  if (!sku) return NextResponse.json({ available: false, reason: "empty" }, { status: 400 });

  await dbConnect();
  const exists = await Product.exists({ sku });
  return NextResponse.json({ available: !exists });
}