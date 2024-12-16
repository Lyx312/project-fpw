import { NextResponse } from 'next/server';
import Post_category from '@/models/post_categoryModel';
import User from '@/models/userModel';
import UserTransaction from '@/models/user_transModel'; // Assuming you have this model
import connectDB from '@/config/database';
import Category from '@/models/categoryModel';


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
    
    // Get the categories from the category IDs
    const post_categories = await Post_category.find({ post_id: { $in: postIds } })
      .sort({ createdAt: -1 })
      .limit(3)
      .exec();
    
    // get the category from the category ID
    const categoryIds = post_categories.map(category => category.category_id);
    const categories = await Category.find({ category_id: { $in: categoryIds } })
      .select('category_name')
      .exec();

    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}