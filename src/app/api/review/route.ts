/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import connectDB from "@/config/database";
import Post_review from "@/models/post_reviewModel";
import User from "@/models/userModel";
import Joi from "joi";

export async function GET(request: Request) {
  try {
    await connectDB();
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    // Fetch reviews
    const reviews = id
      ? await Post_review.find({ post_id: id })
      : await Post_review.find();

    // Fetch user details for each review
    const enrichedReviews = await Promise.all(
      reviews.map(async (review) => {
        const user = await User.findOne(
          { email: review.email },
          "first_name last_name"
        );
        return {
          ...review._doc, // Spread existing review fields
          user: user
            ? { first_name: user.first_name, last_name: user.last_name }
            : null,
        };
      })
    );

    return NextResponse.json({
      message: "Reviews fetched successfully",
      data: enrichedReviews,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { message: "Error fetching reviews", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const { email, post_id, review_rating, review_description } =
    await req.json();

  const { error } = reviewRegisterSchema.validate({
    review_rating,
    review_description,
    email,
    post_id,
  });

  let review_id;

  const ReviewList = await Post_review.find();

  review_id = ReviewList.length + 1;

  try {
    await connectDB();

    const newReview = new Post_review({
      review_id,
      email,
      post_id,
      review_rating,
      review_description,
    });

    await newReview.save();

    return NextResponse.json(
      { message: "Review succesfully added" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}

const reviewRegisterSchema = Joi.object({
  review_rating: Joi.number().min(1).max(5).required().messages({
    "number.base": "Review Rating harus berupa angka.",
    "number.min": "Review Rating minimal bernilai 1.",
    "number.max": "Review Rating maksimal bernilai 5.",
    "any.required": "Review Rating wajib diisi.",
  }),
  review_description: Joi.string().required().messages({
    "string.base": "Review Description harus berupa teks.",
    "any.required": "Review Description wajib diisi.",
  }),
  email: Joi.string().email().required().messages({
    "string.base": "Email should be a type of text",
    "string.empty": "Email cannot be empty",
    "string.email": "Email must be a valid email",
    "any.required": "Email is required",
  }),
  post_id: Joi.number().required().messages({
    "number.base": "Post ID harus berupa angka.",
    "any.required": "Post ID wajib ada.",
  }),
});
