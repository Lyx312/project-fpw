import connectDB from '@/config/database';
import Country from '@/models/countryModel';
import User from '@/models/userModel';

export async function GET(request: Request) {
    await connectDB();

    const url = new URL(request.url);
    const role = url.searchParams.get('role');
    const nameOrEmail = url.searchParams.get('nameOrEmail');
    const categories = url.searchParams.get('categories');
    const country = url.searchParams.get('country');

    try {
        const query: any = {};

        if (role) {
            query.role = role;
        }

        if (nameOrEmail) {
            query.$or = [
                { name: new RegExp(nameOrEmail, 'i') },
                { email: new RegExp(nameOrEmail, 'i') }
            ];
        }

        if (categories) {
            query.categories = { $in: categories.split(',') };
        }

        if (country) {
            query.country_id = country;
        }

        const users = await User.find(query).populate('categories').exec();
        const countries = await Country.find();

        // modify user object
        const usersObj = users.map(user => {
            const userObj = user.toObject();
            delete userObj.password;
            const country = countries.find(c => c.country_id === user.country_id);
            userObj.country_name = country ? country.country_name : null;
            return userObj;
        });

        return Response.json(usersObj, { status: 200 });
    } catch (error) {
        console.log(error);
        return Response.json({ message: 'Error fetching users', error: error }, { status: 500 });
    }
}