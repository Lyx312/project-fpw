import { NextResponse } from "next/server";
import connectDB from "../../../config/database"; // Utility function for MongoDB connection
import axios from "axios";
import Post from "../../../models/postModel";

// GET: Fetch post from MongoDB
export async function GET() {
  try {
    // Connect to MongoDB
    await connectDB();

    // Fetch countries from MongoDB
    const post = await Post.find();

    // Return post in JSON format
    return NextResponse.json({
      message: "post fetched successfully",
      data: post,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { message: "Error fetching post", error: error.message },
      { status: 500 }
    );
  }
}
