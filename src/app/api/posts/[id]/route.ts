/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import connectDB from "@/config/database";
import Post, { IPost } from "@/models/postModel";
import User from "@/models/userModel";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const { id } = await params;
  
    // Find the post with the given ID
    const post = await Post.findOne({ post_id: id })
    .populate({
      path: "post_email",
      model: User,
      localField: "post_email",
      foreignField: "email",
      select: "_id email first_name last_name pfp_path status",
    })
    .populate("post_categories")
    .lean<IPost>();

    if (!post) {
    return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({
    id: post.post_id,
    title: post.post_title,
    description: post.post_description,
    price: post.post_price,
    status: post.post_status,
    categories: post.post_categories,
    postMaker: {
      _id: (post.post_email as any)?._id || "Unknown",
      email: (post.post_email as any)?.email || "Unknown",
      name: `${(post.post_email as any)?.first_name || ""} ${(post.post_email as any)?.last_name || ""}`.trim(),
      pfp_path: (post.post_email as any)?.pfp_path || "",
      status: (post.post_email as any)?.status || "Unknown",
    },
    createdAt: post.createdAt,
    });
  } catch (error: any) {
    console.error("Error fetching post details:", error);
    return NextResponse.json(
    { message: "Error fetching post details", error: error.message },
    { status: 500 }
    );
  }
}

export async function PUT(req: Request, context: { params: { id: string } }) {
  try {
  await connectDB();
  const { id } = await context.params;
  const { title, description, price, categories, status } = await req.json();

  // Validate input
  if (!title || !description || !price) {
    return NextResponse.json(
    { message: "Title, description, and price are required" },
    { status: 400 }
    );
  }
  console.log(status);
  
  // Find and update the post
  const updatedPost = await Post.findOneAndUpdate(
    { post_id: id },
    {
    post_title: title,
    post_description: description,
    post_price: price,
    post_status: status,
    post_categories: categories || [],
    },
    { new: true }
  );

  if (!updatedPost) {
    return NextResponse.json(
    { message: "Post not found" },
    { status: 404 }
    );
  }

  return NextResponse.json({ message: "Post updated successfully", post: updatedPost });
  } catch (error: any) {
  console.error("Error updating post:", error);
  return NextResponse.json(
    { message: "Error updating post", error: error.message },
    { status: 500 }
  );
  }
}
