import connectDB from '@/config/database';
import User from '@/models/userModel';
import sendEmail, { emailTemplate } from '@/emails/mailer';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  await connectDB();

  try {
    const { id } = await context.params;
    const application = await User.findOne({ email: id }).populate('categories');  
    if (!application) {
      return new Response(JSON.stringify({ message: 'Application not found' }), { status: 404 });
    }
    
    return new Response(JSON.stringify(application), { status: 200 });
  } catch (error) {
    console.log(error);
    
    return new Response(JSON.stringify({ message: 'Error fetching application', error }), { status: 500 });
  }
}

export async function PUT(request: Request, context: { params: { id: string } }) {
  await connectDB();

  try {
    const { id } = await context.params;
    const application = await User.findOne({ email: id });
    if (!application) {
      return new Response(JSON.stringify({ message: 'Application not found' }), { status: 404 });
    }

    application.is_approved = true;
    await application.save();

    await sendEmail(
      application.email,
      'Application Approved - Freelance Hub',
      'Your application has been approved.',
      emailTemplate('Application Approved', 'Your application as a freelancer has been approved.')
    );

    return new Response(JSON.stringify({ message: 'Application approved successfully' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error updating application', error }), { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: { id: string } }) {
  await connectDB();

  try {
    const { id } = await context.params;
    const application = await User.findOneAndDelete({ email: id });
    if (!application) {
      return new Response(JSON.stringify({ message: 'Application not found' }), { status: 404 });
    }

    await sendEmail(
      application.email,
      'Application Declined - Freelancer Hub',
      'Your application has been declined.',
      emailTemplate('Application Declined', 'Your application as a freelancer has been declined.')
    );

    return new Response(JSON.stringify({ message: 'Application deleted successfully' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error deleting application', error }), { status: 500 });
  }
}