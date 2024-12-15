import { NextResponse } from 'next/server';
import connectDB from '@/config/database';
import User_trans from '@/models/user_transModel';
import Post from '@/models/postModel';
import sendEmail, { emailTemplate } from '@/emails/mailer';
import mongoose from 'mongoose';

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

    // Find the post by post_id to get the client email
    const post = await Post.findOne({ post_id: userTrans.post_id });

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