import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User_trans from '@/models/user_transModel';
import sendEmail, { emailTemplate } from '@/emails/mailer';
import Post from '@/models/postModel';
import User from '@/models/userModel';
import Notification from '@/models/notificationModel';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { id } = await params;
  const { type, reason } = await req.json();

  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ message: 'Invalid transaction ID' }, { status: 400 });
  }

  if (!type || !reason) {
    return NextResponse.json({ message: 'Type and reason are required' }, { status: 400 });
  }

  if (type !== 'freelancer' && type !== 'client') {
    return NextResponse.json({ message: 'Invalid type' }, { status: 400 });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const trans = await User_trans.findOne({ trans_id: id });
    const updateStatus = trans.start_date == null ? 'cancelled' : 'failed';
    await User_trans.findOneAndUpdate(
      { trans_id: id },
      { 
      trans_status: updateStatus,
      cancelled_reason: reason
      },
      { new: true, session }
    );

    if (!trans) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json({ message: 'Transaction not found' }, { status: 404 });
    }

    // update post status to available
    const post = await Post.findOneAndUpdate(
      { post_id: trans.post_id },
      { post_status: 'available' },
      { new: true, session }
    );

    if (!post) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    // get user details
    const user = await User.findOne({ email: trans.email });

    // Send email to the user
    const email = trans.email; // Assuming the email is stored in the userTrans document
    const subject = 'Transaction Cancelled';
    const text = `Your transaction has been cancelled by the ${type}. Reason: ${reason}`;
    const html = emailTemplate('Transaction Cancelled', `Your transaction has been cancelled by the ${type}. Reason: ${reason}`);

    try {
      await sendEmail(email, subject, text, html);
      const notification = new Notification({ 
        userId: user._id, 
        message: `Your transaction has been cancelled by the ${type}. Reason: ${reason}`, 
        link: `/${type === "client" ? "freelancer" : "client"}/history`, 
        type: "transaction" 
      });
      await notification.save({ session });
    } catch (emailError) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json({ message: 'Failed to send email', error: emailError }, { status: 500 });
    }

    await session.commitTransaction();
    session.endSession();

    return NextResponse.json(trans, { status: 200 });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return NextResponse.json({ message: 'Internal server error', error }, { status: 500 });
  }
}