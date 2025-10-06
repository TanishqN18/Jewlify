import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/db";
import Order from "@/models/order";
import Product from "@/models/product";

export async function POST(req) {
  try {
    // Authenticate user
    const { userId } = getAuth(req);
    if (!userId) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    // Parse body
    const body = await req.json();
    const { items, shippingAddress, billingAddress, paymentMethod, status } = body;

    if (!items || !shippingAddress) {
      return new Response(JSON.stringify({ message: "Missing required fields" }), { status: 400 });
    }

    await dbConnect();

    // Process each item and populate from product data
    const processedItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (!product) throw new Error(`Product ${item.productId} not found`);
        
        // Base item data from product
        const orderItem = {
          productId: product._id,
          name: product.name,
          sku: product.sku,
          category: product.category,
          material: product.material,
          priceType: product.priceType,
          image: Array.isArray(product.image) && product.image.length > 0 ? product.image[0] : "",
          quantity: item.quantity || 1,
        };

        // Calculate unit price
        if (product.priceType === "fixed") {
          orderItem.unitPrice = product.fixedPrice || 0;
        } else if (product.priceType === "weight-based") {
          // Get current rates (you'd fetch from your rates API/DB)
          const currentGoldRate = item.goldRateAtPurchase || 5000; // fallback
          const currentSilverRate = item.silverRateAtPurchase || 80; // fallback
          
          orderItem.goldRateAtPurchase = currentGoldRate;
          orderItem.silverRateAtPurchase = currentSilverRate;
          
          // Simple calculation - you'd refine this based on material purity, etc.
          const baseRate = product.material?.toLowerCase().includes('gold') ? currentGoldRate : currentSilverRate;
          orderItem.unitPrice = (product.weight || 0) * baseRate;
        }

        orderItem.totalPrice = orderItem.unitPrice * orderItem.quantity;

        // Map customization from product options + user selections
        orderItem.customization = {
          engraving: "",
          size: "",
          specialInstructions: "",
        };

        // Populate customization if allowed by product
        if (product.customizationOptions?.allowEngraving && item.customization?.engraving) {
          const engravingText = (item.customization.engraving || "").slice(0, product.customizationOptions.maxEngravingLength || 20);
          orderItem.customization.engraving = engravingText;
        }

        if (Array.isArray(product.customizationOptions?.sizeOptions) && 
            product.customizationOptions.sizeOptions.includes(item.customization?.size)) {
          orderItem.customization.size = item.customization.size;
        }

        if (product.customizationOptions?.allowSpecialInstructions && item.customization?.specialInstructions) {
          orderItem.customization.specialInstructions = item.customization.specialInstructions;
        }

        return orderItem;
      })
    );

    // Calculate totals
    const subtotal = processedItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const shippingCost = 100; // You'd calculate this based on address/weight
    const total = subtotal + shippingCost;

    // Create order
    const order = await Order.create({
      userId,
      items: processedItems,
      subtotal,
      shippingCost,
      total,
      shippingAddress,
      billingAddress,
      paymentMethod: paymentMethod || "COD",
      status: status || "pending",
      createdAt: new Date()
    });

    return new Response(JSON.stringify({ message: "Order created successfully", orderId: order._id }), { status: 201 });

  } catch (error) {
    console.error("Error creating order:", error);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const clerkId = searchParams.get("clerkId");

    if (!clerkId) {
      return Response.json({ orders: [] }, { status: 400 });
    }

    // Directly query orders by userId (which is Clerk ID)
    const orders = await Order.find({ userId: clerkId }).sort({ createdAt: -1 });

    return Response.json({ orders }, { status: 200 });

  } catch (error) {
    console.error("Error fetching orders:", error);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}