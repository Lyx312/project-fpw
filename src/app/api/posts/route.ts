/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import connectDB from "../../../config/database"; // Utility function for MongoDB connection
import Post from "../../../models/postModel";
import User from "@/models/userModel";
import Post_review from "@/models/post_reviewModel";

// GET: Fetch post from MongoDB
export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    // Extract filters from query parameters
    const name = searchParams.get("name");
    const minPrice = Number(searchParams.get("minPrice")) || 0;
    const maxPrice = Number(searchParams.get("maxPrice")) || Number.MAX_SAFE_INTEGER;
    const minRating = Number(searchParams.get("minRating")) || 0;
    const maxRating = Number(searchParams.get("maxRating")) || 5;
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const freelancerId = searchParams.get("freelancerId");

    // Build query dynamically
    const query: any = {
      post_price: { $gte: minPrice, $lte: maxPrice },
    };

    if (name) {
      query.post_title = { $regex: name, $options: "i" };
    }

    if (status) {
      query.post_status = status;
    }

    if (freelancerId) {
      query.post_email = freelancerId;
    }

    if (category) {
      // Check for posts in the specified category
      query.post_categories = category;
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
      .populate('post_categories')
      .lean();

    // Fetch postsIds
    const postIds = posts.map((post) => post.post_id);

    // Fetch ratings for posts within the rating range
    const postRatings = await Post_review.aggregate([
      { $match: { post_id: { $in: postIds } } },
      {
        $group: {
          _id: "$post_id",
          averageRating: { $avg: "$review_rating" },
        },
      },
      { $match: { averageRating: { $gte: minRating, $lte: maxRating } } },
    ]);

    // Filter posts based on the rating range
    const filteredPostIds = postRatings.map((item) => item._id);
    query.post_id = { $in: filteredPostIds };

    // Map average rating to each post
    const ratingMap = postRatings.reduce<Record<number, number>>((map, item) => {
      map[item._id] = item.averageRating;
      return map;
    }, {});

    // Map response to include full name of the post maker, category list, and average rating
    return NextResponse.json({
      message: "Posts fetched successfully",
      data: posts
        .filter((post) => {
          const averageRating = ratingMap[post.post_id] || 0; // Default to 0 if no rating exists
          return averageRating >= minRating && averageRating <= maxRating;
        })
        .map((post) => ({
          id: post.post_id,
          title: post.post_title,
          description: post.post_description,
          price: post.post_price,
          categories: post.post_categories || "Uncategorized", // Join categories with a comma
          postMaker: `${post.post_email.first_name} ${post.post_email.last_name}`,
          createdAt: post.createdAt,
          averageRating: ratingMap[post.post_id] || 0, // Add the average rating to the response
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

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    // Validate input
    const { title, description, price, email, categories } = body;
    if (!title || !description || !price || !email) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }
    const length = (await Post.find()).length;
    // Create a new post
    const post = await Post.create({
      post_id: length + 1, // Unique post ID
      post_title: title,
      post_description: description,
      post_price: price,
      post_email: email, // This links to the user
      post_categories: categories || [], // Store categories directly in the post model
      createdAt: new Date(),
    });

    return NextResponse.json({ message: "Post created successfully", post });
  } catch (error: any) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { message: "Error creating post", error: error.message },
      { status: 500 }
    );
  }
}
