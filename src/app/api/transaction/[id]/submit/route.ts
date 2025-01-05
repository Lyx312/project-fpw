import { NextResponse } from 'next/server';
import connectDB from '@/config/database';
import User_trans from '@/models/user_transModel';
import Post from '@/models/postModel';
import sendEmail, { emailTemplate } from '@/emails/mailer';
import mongoose from 'mongoose';
import Notification from '@/models/notificationModel';
import User from '@/models/userModel';

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
        trans_status: 'submitted',
        end_date: new Date()
      },
      { new: true, session }
    );

    if (!userTrans) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json({ message: 'Transaction not found' }, { status: 404 });
    }

    // update post status to available
    const post = await Post.findOne(
      { post_id: userTrans.post_id },
    );

    // get client details
    const client = await User.findOne({ email: userTrans.email });

    // Send email to the client
    if (post) {
      const clientEmail = userTrans.email;
      const subject = 'Freelancer Submitted Their Work - Freelance Hub';
      const text = `The freelancer has submitted their work for the post titled "${post.post_title}" on Freelance Hub. Please review the work and accept or reject it.`;
      const html = emailTemplate(
      'Freelancer Submitted Their Work - Freelance Hub',
      `The freelancer has submitted their work for the post titled "<strong>${post.post_title}</strong>" on Freelance Hub. Please review the work and accept or reject it. <a href="${process.env.BASE_URL}/client/history">Click here to review</a>.`
      );

      // Send email to the client
      await sendEmail(clientEmail, subject, text, html);
      const notification = new Notification({ 
      userId: client._id, 
      message: `The freelancer has submitted their work for the post titled ${post.post_title}. Please review the work and accept or reject it.`, 
      link: "/client/history", 
      type: "transaction" 
      });
      await notification.save({ session });
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