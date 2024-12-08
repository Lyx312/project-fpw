/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import connectDB from "../../../config/database"; // Utility function for MongoDB connection
import Post from "../../../models/postModel";
import User from "@/models/userModel";
import Post_category from "@/models/post_categoryModel";
import Category from "@/models/categoryModel";

// GET: Fetch post from MongoDB
export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    // Extract filters from query parameters
    const name = searchParams.get("name");
    const minPrice = Number(searchParams.get("minPrice")) || 0;
    const maxPrice = Number(searchParams.get("maxPrice")) || Number.MAX_SAFE_INTEGER;
    const category = searchParams.get("category");

    // Build query dynamically
    const query: any = {
      post_price: { $gte: minPrice, $lte: maxPrice },
    };

    if (name) {
      query.post_title = { $regex: name, $options: "i" };
    }

    if (category) {
      // Check for posts in the specified category
      const postCategories = await Post_category.find({ category_id: category });
      const filteredPostIds = postCategories.map((pc) => pc.post_id);
      query.post_id = { $in: filteredPostIds };
    }

    // Fetch posts with user details populated
    const posts = await Post.find(query)
      .populate({
        path: "post_email", // Field in Post schema
        model: User, // Reference model
        localField: "post_email", // Post field to match
        foreignField: "email", // User field to match
        select: "first_name last_name", // Fields to include
      })
      .lean();
      console.log(posts)

    // Fetch categories for posts
    const postIds = posts.map((post) => post.post_id);
    const postCategories = await Post_category.find({ post_id: { $in: postIds } })
      .populate({
        path: "category_id", // Assuming category_id links to the Category model
        model: Category, // Reference to the Category model
        localField: "category_id",
        foreignField: "category_id",
        select: "category_name", // Field to include
      })
      .lean();

    // Map category names to posts, supporting multiple categories per post
    const categoryMap = postCategories.reduce<Record<number, string[]>>((map, item) => {
      if (!map[item.post_id]) {
        map[item.post_id] = [];
      }
      map[item.post_id].push(item.category_id?.category_name || "Unknown");
      return map;
    }, {});

    // Map response to include full name of the post maker and category list
    return NextResponse.json({
      message: "Posts fetched successfully",
      data: posts.map((post) => ({
        id: post.post_id,
        title: post.post_title,
        description: post.post_description,
        price: post.post_price,
        categories: categoryMap[post.post_id] || "Uncategorized", // Join categories with a comma
        postMaker: `${post.post_email.first_name} ${post.post_email.last_name}`,
        createdAt: post.createdAt,
      })),
    });
  } catch (error: any) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { message: "Error fetching posts", error: error.message },
      { status: 500 }
    );
  }
}
