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
        trans_status: 'completed',
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
    const post = await Post.findOneAndUpdate(
      { post_id: userTrans.post_id },
      { post_status: 'available' },
      { new: true, session }
    );

    // get client details
    const client = await User.findOne({ email: userTrans.email });

    // Send email to the client
    if (post) {
      const clientEmail = userTrans.email;
      const subject = 'Freelancer Completed Your Job - Freelance Hub';
      const text = `The freelancer has completed your job request for the post titled "${post.post_title}" on Freelance Hub. The work is now completed.`;
      const html = emailTemplate(
        'Freelancer Completed Your Job - Freelance Hub',
        `The freelancer has completed your job request for the post titled "<strong>${post.post_title}</strong>" on Freelance Hub. The work is now completed.`
      );

      // Send email to the client
      await sendEmail(clientEmail, subject, text, html);
      const notification = new Notification({ 
        userId: client._id, 
        message: `The freelancer has accepted your job request for the post titled ${post.post_title}`, 
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