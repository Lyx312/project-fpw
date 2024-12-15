import connectDB from "@/config/database";
import User from "@/models/userModel";
import mongoose from "mongoose";
import sendEmail, { emailTemplate } from "@/emails/mailer";

// Update user endpoint logic
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const { id } = await params;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(id).session(session);
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return Response.json({ message: 'User not found' }, { status: 404 });
    }

    user.is_banned = !user.is_banned;
    await user.save({ session });

    // Send email to the user
    const subject = user.is_banned ? 'Your Account Has Been Banned - Freelance Hub' : 'Your Account Has Been Unbanned - Freelance Hub';
    const text = user.is_banned ? 'Your account has been banned due to violations of our terms of service.' : 'Your account has been unbanned. You can now access all features.';
    const html = emailTemplate(
      user.is_banned ? 'Your Account Has Been Banned - Freelance Hub' : 'Your Account Has Been Unbanned - Freelance Hub',
      user.is_banned ? 'Your account has been banned due to violations of our terms of service.' : 'Your account has been unbanned. You can now access all features.'
    );

    await sendEmail(user.email, subject, text, html);

    await session.commitTransaction();
    session.endSession();

    return Response.json({ message: 'User updated successfully' }, { status: 200 });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return Response.json({ message: 'Internal server error', error: error }, { status: 500 });
  }
}
