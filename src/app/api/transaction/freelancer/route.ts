/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Post from '@/models/postModel';
import connectDB from '../../../../config/database';
import User_trans from '../../../../models/user_transModel';
import User from '../../../../models/userModel'; // Import User model to access first_name and last_name
import Post_category from '@/models/post_categoryModel';
import Category from '@/models/categoryModel';

export async function GET(req: Request) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get('userEmail');
    const status = searchParams.get('status');

    if (!userEmail) {
      return new Response(JSON.stringify([]), { status: 200 });
    }

    // Fetch posts related to the email
    const posts = await Post.find({ post_email: userEmail });
    const postMap = posts.reduce((acc: any, post: any) => {
      acc[post.post_id] = post.post_title;
      return acc;
    }, {});

    const postIds = Object.keys(postMap);

    // Fetch user transactions related to the post IDs and optionally filter by status
    const filter: any = { post_id: { $in: postIds } };
    if (status) filter.trans_status = status;

    const transactions = await User_trans.find(filter);

    // Enrich transactions with post titles, format dates, and user names
    const enrichedTransactions = await Promise.all(transactions.map(async (transaction: any) => {
      // Fetch user details by user_id
      const user = await User.findOne({email: transaction.email}); // Assuming transaction has a user_id field
      const userName = user ? `${user.first_name} ${user.last_name}` : "Unknown User"; // Combine first_name and last_name
      const categoryTrans = await Post_category.find({ post_id: { $in: [transaction.post_id] } });
      const categoryIds = categoryTrans.map(category => category.category_id);
      const categoryId = await Category.find({ category_id: { $in: categoryIds } });
      const categoryNames = categoryId.map(category => category.category_name).join(', ') || 'No Categories';
      
      return {
        ...transaction._doc, // Spread existing transaction fields
        post_title: postMap[transaction.post_id] || "Unknown Title", // Add post_title
        user_name: userName, // Add user name
        category: categoryNames
      };
    }));

    // Sort transactions by status and then by updatedAt or createdAt
    const sortedTransactions = enrichedTransactions.sort((a, b) => {
      const statusOrder = ["in-progress", "pending", "completed", "paid", "cancelled", "failed"];
      const statusComparison = statusOrder.indexOf(a.trans_status) - statusOrder.indexOf(b.trans_status);

      if (statusComparison !== 0) return statusComparison;

      const aDate = a.updatedAt ? new Date(a.updatedAt) : new Date(a.createdAt);
      const bDate = b.updatedAt ? new Date(b.updatedAt) : new Date(b.createdAt);

      return bDate.getTime() - aDate.getTime(); // Descending order by date
    });

    return new Response(JSON.stringify(sortedTransactions), { status: 200 });
  } catch (error: any) {
    // Return an empty array if there's an error
    return new Response(JSON.stringify([]), { status: 200 });
  }
}