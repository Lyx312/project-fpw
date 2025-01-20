import { NextResponse } from 'next/server';
import connectDB from '@/config/database';
import User_trans from '@/models/user_transModel';
import Post from '@/models/postModel';
import sendEmail, { emailTemplate } from '@/emails/mailer';
import mongoose from 'mongoose';
import Notification from '@/models/notificationModel';
import User from '@/models/userModel';
import { pusherServer } from '@/lib/pusher';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const session = await mongoose.startSession();
  session.startTransaction();

  const { id } = await params;

  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ message: 'Invalid transaction ID' }, { status: 400 });
  }

  try {
    const userTrans = await User_trans.findOneAndUpdate(
      { trans_id: id },
      { 
        trans_status: 'completed',
      },
      { new: true, session }
    );

    if (!userTrans) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json({ message: 'Transaction not found' }, { status: 404 });
    }

    // update post status to available
    const post = await Post.findOneAndUpdate(
      { post_id: userTrans.post_id },
      { post_status: 'available' },
      { new: true, session }
    );

    const freelancer = await User.findOne({ email: post.post_email });

    // Send email to the client
    if (post) {
      const freelancerEmail = post.post_email;
      const subject = 'Client Accepted Your Work - Freelance Hub';
      const text = `The client has accepted your work for the post titled "${post.post_title}" on Freelance Hub.`;
      const html = emailTemplate(
      'Client Accepted Your Work - Freelance Hub',
      `The client has accepted your work for the post titled "<strong>${post.post_title}</strong>" on Freelance Hub.`
      );

      // Send email to the client
      await sendEmail(freelancerEmail, subject, text, html);
      const notification = new Notification({ 
        userId: freelancer._id, 
        message: `The client has accepted your work for the post titled ${post.post_title}.`, 
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

    return NextResponse.json(userTrans, { status: 200 });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return NextResponse.json({ message: 'Internal server error', error }, { status: 500 });
  }
}