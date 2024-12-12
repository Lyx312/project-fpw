/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Post from '@/models/postModel';
import connectDB from '../../../../config/database';
import User_trans from '../../../../models/user_transModel';

export async function GET(req: Request) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get('userEmail');

    if (!userEmail) {
      return new Response(JSON.stringify([]), { status: 200 });
    }

    // Fetch posts related to the email
    const posts = await Post.find({ post_email: userEmail });
    const postIds = posts.map((post) => post.post_id);

    // Fetch user transactions related to the post IDs
    const transactions = await User_trans.find({ post_id: { $in: postIds } });

    return new Response(JSON.stringify(transactions), { status: 200 });
  } catch (error : any) {
    // Return an empty array if there's an error
    return new Response(JSON.stringify([]), { status: 200 });
  }
}