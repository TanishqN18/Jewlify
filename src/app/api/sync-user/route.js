import dbConnect from "../../../../lib/dbConnect";
import User from "../../../../models/Users";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(req) {
  try {
    await dbConnect();
    
    const { userId } = getAuth(req);
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { email, name, image, clerkId } = body;


    // Check if user already exists
    let user = await User.findOne({ clerkId });

    if (user) {
      // Update existing user
      user = await User.findOneAndUpdate(
        { clerkId },
        { 
          email,
          name,
          image,
        },
        { new: true }
      );
    } else {
      // Create new user
      user = new User({
        email,
        name,
        image,
        clerkId,
        addresses: [] // Initialize with empty addresses array
      });
      await user.save();
      console.log("User created:", user._id);
    }

    return Response.json({ 
      message: "User synced successfully", 
      user 
    }, { status: 200 });

  } catch (error) {
    console.error("Sync user error:", error);
    return Response.json({ 
      error: "Failed to sync user",
      details: error.message 
    }, { status: 500 });
  }
}