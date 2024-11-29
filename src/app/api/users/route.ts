import connectDB from '@/config/database';
import User from '@/models/userModel';
import bcrypt from 'bcrypt';

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

// update user
export async function PUT(request: Request) {
    await connectDB();

    try {
        const { email, country_id, password, first_name, last_name, phone, gender } = await request.json();

        if (!email) {
            return Response.json({ message: 'Email is required' }, { status: 400 });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return Response.json({ message: 'User not found' }, { status: 404 });
        }

        if (country_id) user.country_id = country_id;
        if (password) user.password = await bcrypt.hash(password, 10);;
        if (first_name) user.first_name = first_name;
        if (last_name) user.last_name = last_name;
        if (phone) user.phone = phone;
        if (gender) user.gender = gender;

        await user.save();

        return Response.json({ message: 'User updated successfully' }, { status: 200 });
    } catch (error) {
        return Response.json({ message: 'Internal server error', error: error }, { status: 500 });
    }
}