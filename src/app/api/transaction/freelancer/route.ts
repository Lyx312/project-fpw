/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Post from '@/models/postModel';
import connectDB from '../../../../config/database';
import User_trans from '../../../../models/user_transModel';
import User from '../../../../models/userModel'; // Import User model to access first_name and last_name

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

      return {
        ...transaction._doc, // Spread existing transaction fields
        post_title: postMap[transaction.post_id] || "Unknown Title", // Add post_title
        start_date: formatDate(transaction.start_date), // Format start_date
        end_date: formatDate(transaction.end_date), // Format end_date
        user_name: userName, // Add user name
      };
    }));

    // Sort transactions by status and then by updatedAt or createdAt
    const sortedTransactions = enrichedTransactions.sort((a, b) => {
      const statusOrder = ["in-progress", "pending", "completed", "paid", "cancelled"];
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

// Helper function to format date
function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  };
  return new Date(dateString).toLocaleString("en-US", options);
}
