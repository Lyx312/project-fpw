import connectDB from '@/config/database';
import User from '@/models/userModel';
import sendEmail from '@/emails/mailer';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  await connectDB();

  try {
    const { id } = await context.params;
    const application = await User.findOne({email: id});
    if (!application) {
      return new Response(JSON.stringify({ message: 'Application not found' }), { status: 404 });
    }
    return new Response(JSON.stringify(application), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error fetching application', error }), { status: 500 });
  }
}

export async function PUT(request: Request, context: { params: { id: string } }) {
  await connectDB();

  try {
    const { id } = context.params;
    const application = await User.findOne({ email: id });
    if (!application) {
      return new Response(JSON.stringify({ message: 'Application not found' }), { status: 404 });
    }

    application.is_approved = true;
    await application.save();

    await sendEmail(
      application.email,
      'Application Approved',
      'Your application has been approved.',
      '<p>Your application has been approved.</p>'
    );

    return new Response(JSON.stringify({ message: 'Application approved successfully' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error updating application', error }), { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: { id: string } }) {
  await connectDB();

  try {
    const { id } = context.params;
    const application = await User.findOneAndDelete({ email: id });
    if (!application) {
      return new Response(JSON.stringify({ message: 'Application not found' }), { status: 404 });
    }

    await sendEmail(
      application.email,
      'Application Declined',
      'Your application has been declined.',
      '<p>Your application has been declined.</p>'
    );

    return new Response(JSON.stringify({ message: 'Application deleted successfully' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error deleting application', error }), { status: 500 });
  }
}