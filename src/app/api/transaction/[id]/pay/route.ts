import { NextResponse } from 'next/server';
import User_trans from '@/models/user_transModel';
import Post from '@/models/postModel';
import sendEmail, { emailTemplate } from '@/emails/mailer';
import mongoose from 'mongoose';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { id } = await params;

  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ message: 'Invalid transaction ID' }, { status: 400 });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userTrans = await User_trans.findOneAndUpdate(
      { trans_id: id },
      { 
        trans_status: 'paid',
      },
      { new: true, session }
    );

    if (!userTrans) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json({ message: 'Transaction not found' }, { status: 404 });
    }

    // Find the post by post_id to get the freelancer email
    const post = await Post.findOne({ post_id: userTrans.post_id }).session(session);

    if (post) {
      const freelancerEmail = post.post_email;
      const subject = 'Payment Received - Freelance Hub';
      const text = `The payment for the post titled "${post.post_title}" has been received.`;
      const html = emailTemplate(
        'Payment Received - Freelance Hub',
        `The payment for the post titled "<strong>${post.post_title}</strong>" has been received.`
      );

      // Send email to the freelancer
      await sendEmail(freelancerEmail, subject, text, html);
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