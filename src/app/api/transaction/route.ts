import { NextResponse } from 'next/server';
import connectDB from '@/config/database';
import User_trans from '@/models/user_transModel';
import Post from '@/models/postModel';
import sendEmail, { emailTemplate } from '@/emails/mailer';
import mongoose from 'mongoose';
import User from '@/models/userModel';
import Notification from '@/models/notificationModel';
import { pusherServer } from '@/lib/pusher';
import { ICategory } from '@/models/categoryModel';
import { baseUrl } from '@/config/url';

export async function GET(req: Request) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const trans_id = searchParams.get('trans_id');
    const post_id = searchParams.get('post_id');
    const email = searchParams.get('email');
    const trans_status = searchParams.get('trans_status');
    const start_date = searchParams.get('start_date');
    const end_date = searchParams.get('end_date');
    const min_price = searchParams.get('min_price');
    const max_price = searchParams.get('max_price');
    const status = searchParams.get('status');
    const role = searchParams.get('role');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};

    if (trans_id) query.trans_id = trans_id;
    if (post_id) query.post_id = post_id;
    if (email) query.email = { $regex: email, $options: 'i' };
    if (trans_status) query.trans_status = { $regex: trans_status, $options: 'i' };
    if (start_date) query.start_date = { $gte: new Date(start_date) };
    if (end_date) query.end_date = { $lte: new Date(end_date) };
    if (min_price) query.price = { $gte: parseFloat(min_price) };
    if (max_price) query.price = { ...query.price, $lte: parseFloat(max_price) };
    if (status) query.trans_status = status;

    const transactions = await User_trans.find(query);

    const enhancedTransactions = await Promise.all(
      transactions.map(async (transaction) => {
        const post = await Post.findOne({ post_id: transaction.post_id }).populate('post_categories');
        const user = await User.findOne({ email: post.post_email });
        const categoryNames = post.post_categories.map((category: ICategory) => category.category_name).join(', ') || 'No Categories';
        const userName = user ? `${user.first_name} ${user.last_name}` : "Unknown User";
        return {
          ...transaction.toObject(),
          user_name: userName,
          user_id: user?._id,
          post_title: post?.post_title || 'Unknown Post',
          category: categoryNames
        };
      })
    );

    // Sort transactions based on trans_status
    if (role != 'admin') {
        const statusOrder = ['submitted', 'in-progress', 'pending', 'completed', 'cancelled', 'failed'];
        
        enhancedTransactions.sort((a, b) => {
        const statusA = statusOrder.indexOf(a.trans_status.toLowerCase());
        const statusB = statusOrder.indexOf(b.trans_status.toLowerCase());
        return statusA - statusB;
      });
    }

    return NextResponse.json(enhancedTransactions, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching transactions', error: error }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await connectDB();
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { email, post_id, price, request, deadline } = await req.json();

    // Check if the required fields are present
    if (!email || !post_id || !price || !request || !deadline) {
      return NextResponse.json({ message: 'Email, post_id, price, request, and deadline is required' }, { status: 400 });
    }

    // Find the last transaction
    const lastTrans = await User_trans.findOne().sort({ trans_id: -1 });

    // Increment the last trans_id by one
    const trans_id = lastTrans ? lastTrans.trans_id + 1 : 1;
    
    const newUserTrans = new User_trans({
      trans_id,
      email,
      post_id,
      price,
      request,
      deadline,
    });

    const savedUserTrans = await newUserTrans.save({ session });

    // Find the post by post_id to get the freelancer email
    const post = await Post.findOne({ post_id });

    // Get the user_id of the freelancer
    const user = await User.findOne({ email: post.post_email });

    if (post) {
      const freelancerEmail = post.post_email;
      const subject = 'Client Request to Hire - Freelance Hub';
      const text = `A client has requested to hire you for the post titled "${post.post_title}" on Freelance Hub. Please review the request and choose to accept or decline. You can review the request at the following link: ${baseUrl}/freelancer/history`;
      const html = emailTemplate(
      'Client Request to Hire - Freelance Hub',
      `A client has requested to hire you for the post titled "<strong>${post.post_title}</strong>" on Freelance Hub. Please review the request and choose to accept or decline. You can review the request at the following link: <a href="${baseUrl}/freelancer/history">Review Request</a>`
      );

      // Send email to the freelancer
      await sendEmail(freelancerEmail, subject, text, html);
      const notification = new Notification({ 
        userId: user._id, 
        message: `A client has requested to hire you for the post titled ${post.post_title}`, 
        link: "/freelancer/history", 
        type: "transaction" 
      });
      await notification.save({ session });
      pusherServer.trigger('notification', 'newNotif', {
        notification: notification,
      });
    }

    await session.commitTransaction();
    session.endSession();

    return NextResponse.json({ message: "Success creating transaction", savedUserTrans}, { status: 201 });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return NextResponse.json({ message: 'Error creating user transaction', error }, { status: 400 });
  }
}
