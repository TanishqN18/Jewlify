import { getAuth } from "@clerk/nextjs/server";
import dbConnect from "../../../../lib/dbConnect";
import Order from "../../../../models/order";

export async function POST(req) {
  try {
    // Authenticate user
    const { userId } = getAuth(req);
    if (!userId) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    // Parse body
    const body = await req.json();
    const { items, totalAmount, shippingAddress, paymentMethod, status } = body;

    if (!items || !totalAmount || !shippingAddress) {
      return new Response(JSON.stringify({ message: "Missing required fields" }), { status: 400 });
    }

    await dbConnect();

    const newOrder = new Order({
      userId,
      items,
      total: totalAmount,
      shippingAddress,
      paymentMethod: paymentMethod || "COD",
      status: status || "pending",
      createdAt: new Date()
    });

    await newOrder.save();

    return new Response(JSON.stringify({ message: "Order created successfully", order: newOrder }), { status: 201 });

  } catch (error) {
    console.error("Error creating order:", error);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}

export async function GET(req) {
  try {
    // Authenticate user
    const { userId } = getAuth(req);
    if (!userId) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    await dbConnect();

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    return new Response(JSON.stringify(orders), { status: 200 });

  } catch (error) {
    console.error("Error fetching orders:", error);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}