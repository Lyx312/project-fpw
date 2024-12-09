/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import connectDB from "../../../../config/database";
import Post from "../../../../models/postModel";
import User from "@/models/userModel";
import Post_category from "@/models/post_categoryModel";
import Category from "@/models/categoryModel";

interface Post {
    post_id: string;
    post_title: string;
    post_description: string;
    post_price: number;
    post_email: {
      first_name: string;
      last_name: string;
    };
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
          select: "first_name last_name",
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
  
      return NextResponse.json({
        id: post.post_id,
        title: post.post_title,
        description: post.post_description,
        price: post.post_price,
        categories,
        postMaker: `${post.post_email?.first_name || ""} ${post.post_email?.last_name || ""}`.trim(),
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