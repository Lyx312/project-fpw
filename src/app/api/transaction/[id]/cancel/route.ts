import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User_trans from '@/models/user_transModel';
import sendEmail, { emailTemplate } from '@/emails/mailer';

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
    const userTrans = await User_trans.findOneAndUpdate(
      { trans_id: id },
      { 
        trans_status: 'cancelled',
        cancelled_reason: reason
      },
      { new: true, session }
    );

    if (!userTrans) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json({ message: 'Transaction not found' }, { status: 404 });
    }

    const email = userTrans.email; // Assuming the email is stored in the userTrans document
    const subject = 'Transaction Cancelled';
    const text = `Your transaction has been cancelled by the ${type}. Reason: ${reason}`;
    const html = emailTemplate('Transaction Cancelled', `Your transaction has been cancelled by the ${type}. Reason: ${reason}`);

    try {
      await sendEmail(email, subject, text, html);
    } catch (emailError) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json({ message: 'Failed to send email', error: emailError }, { status: 500 });
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