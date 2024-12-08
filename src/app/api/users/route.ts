import connectDB from '@/config/database';
import User from '@/models/userModel';

export async function GET(req: Request) {
    await connectDB();

    try {
        const { searchParams } = new URL(req.url);
        const name = searchParams.get('name'); // Filter by name
        const country = searchParams.get('country'); // Filter by country

        // Build the query object dynamically
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: any = {};

        if (name) {
            // Match name in either first_name or last_name
            query.$or = [
                { first_name: { $regex: name, $options: 'i' } },
                { last_name: { $regex: name, $options: 'i' } },
            ];
        }

        if (country) {
            // Add country filter
            query.country = { $regex: country, $options: 'i' };
        }

        // Fetch users based on the query
        const users = await User.find(query);
        return Response.json(users, { status: 200 });
    } catch (error) {
        return Response.json({ message: 'Error fetching users', error: error }, { status: 500 });
    }
}