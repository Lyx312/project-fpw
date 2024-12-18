/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import connectDB from "@/config/database";
import Post from "@/models/postModel";
import User from "@/models/userModel";
import Post_category from "@/models/post_categoryModel";
import Category from "@/models/categoryModel";

interface Post {
  post_id: string;
  post_title: string;
  post_description: string;
  post_price: number;
  post_email: {
    _id: string;
    email: string;
    first_name: string;
    last_name: string;
    pfp_path: string;
    status: string;
  };
  post_status: string;
  createdAt: string;
  }

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
    .lean<Post>();
  
    if (!post) {
    return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }
  
    // Fetch categories for the post
    const postCategories = await Post_category.find({ post_id: id })
    .populate({
      path: "category_id",
      model: Category,
      localField: "category_id",
      foreignField: "category_id",
      select: "category_name",
    })
    .lean();
  
    const categories = postCategories.map((cat) => cat.category_id?.category_name || "Unknown");
    const categories_id = postCategories.map((cat) => cat.category_id?.category_id || "Unknown");

    return NextResponse.json({
    id: post.post_id,
    title: post.post_title,
    description: post.post_description,
    price: post.post_price,
    status: post.post_status,
    categories,
    categories_id,
    postMaker: {
      _id: post.post_email?._id || "Unknown",
      email: post.post_email?.email || "Unknown",
      name: `${post.post_email?.first_name || ""} ${post.post_email?.last_name || ""}`.trim(),
      pfp_path: post.post_email?.pfp_path || "",
      status: post.post_email?.status || "Unknown",
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
  const body = await req.json();

  // Validate input
  const { title, description, price, categories, status } = body;
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
    },
    { new: true }
  );

  if (!updatedPost) {
    return NextResponse.json(
    { message: "Post not found" },
    { status: 404 }
    );
  }

  // Update categories
  if (categories?.length > 0) {
    // Remove existing categories for the post
    await Post_category.deleteMany({ post_id: id });

    // Insert new categories
    const postCategories = categories.map((categoryId: string) => ({
      post_id: id,
      category_id: categoryId,
    }));
    await Post_category.insertMany(postCategories);
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
