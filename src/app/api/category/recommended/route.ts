import { NextResponse } from 'next/server';
import Post from '@/models/postModel';
import User from '@/models/userModel';
import UserTransaction from '@/models/user_transModel';
import connectDB from '@/config/database';
import { ICategory } from '@/models/categoryModel';

export async function GET(req: Request) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const user = await User.findById(userId);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get the last few user transactions
    const userTransactions = await UserTransaction.find({ email: user.email })
      .sort({ createdAt: -1 })
      .limit(3)
      .exec();
    
    const postIds = userTransactions.map(transaction => transaction.post_id);
    
    // Get the posts from the post IDs
    const posts = await Post.find({ post_id: { $in: postIds } })
      .populate('post_categories')
      .select('post_categories')
      .exec();

    // Extract category names from posts
    const categoryNames = new Set();
    posts.forEach(post => {
      post.post_categories.forEach((category: ICategory) => {
      if (categoryNames.size < 9) {
        categoryNames.add(category.category_name);
      }
      });
    });

    const categories = Array.from(categoryNames);
    // console.log(categories);
    
    
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}