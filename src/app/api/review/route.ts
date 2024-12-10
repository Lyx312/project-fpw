/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import connectDB from '../../../config/database';
import Post_review from '@/models/post_reviewModel';
import User from '@/models/userModel';

export async function GET(request: Request) {
  try {
    await connectDB();
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    // Fetch reviews
    const reviews = id 
      ? await Post_review.find({ post_id: id }) 
      : await Post_review.find();

    // Fetch user details for each review
    const enrichedReviews = await Promise.all(
      reviews.map(async (review) => {
        const user = await User.findOne({ email: review.email }, 'first_name last_name');
        return {
          ...review._doc, // Spread existing review fields
          user: user ? { first_name: user.first_name, last_name: user.last_name } : null,
        };
      })
    );

    return NextResponse.json({ message: 'Reviews fetched successfully', data: enrichedReviews});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error : any) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ message: 'Error fetching reviews', error: error.message }, { status: 500 });
  }
}