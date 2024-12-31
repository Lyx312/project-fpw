/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import connectDB from "../../../../config/database"; // Utility function for MongoDB connection
import Post_review from "@/models/post_reviewModel";
import Post from "@/models/postModel";

// GET: Fetch all reviews for a given clientId (email) along with the post id & title
export async function GET(req: Request) {
  try {
    await connectDB();

    // Retrieve clientId from query parameters
    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get("clientId");

    if (!clientId) {
      return NextResponse.json(
        { message: "clientId is required" },
        { status: 400 }
      );
    }

    // Fetch all reviews associated with the provided clientId (email)
    const reviews = await Post_review.find({ email: clientId }).exec();

    // Check if reviews exist
    if (!reviews || reviews.length === 0) {
      return NextResponse.json(
        { message: "No reviews found for this clientId" },
        { status: 404 }
      );
    }

    // For each review, fetch the associated post title using the post_id
    const reviewsWithPostInfo = await Promise.all(
      reviews.map(async (review) => {
        const post = await Post.findOne({ post_id: review.post_id }).exec();
        return {
          review_id: review.review_id,
          review_rating: review.review_rating,
          review_description: review.review_description,
          createdAt: review.createdAt,
          post_id: review.post_id,
          post_title: post ? post.post_title : "Post not found", // Handle case where post is not found
        };
      })
    );

    // Return reviews with post information
    return NextResponse.json(
      { message: "Reviews fetched successfully", data: reviewsWithPostInfo },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { message: "Error fetching reviews", error: error.message },
      { status: 500 }
    );
  }
}
