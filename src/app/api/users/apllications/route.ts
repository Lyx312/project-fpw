import connectDB from '@/config/database';
import User from '@/models/userModel';

export async function GET() {
  await connectDB();

  try {
    const applications = await User.find({ role: 'freelancer', is_approved: false });
    return Response.json(applications, { status: 200 });
  } catch (error) {
    return Response.json({ message: 'Error fetching applications', error: error }, { status: 500 });
  }
}