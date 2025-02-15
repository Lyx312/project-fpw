import connectDB from "@/config/database";
import Country from "@/models/countryModel";
import User from "@/models/userModel";

export async function GET(req: Request) {
  await connectDB();

  try {
      const { searchParams } = new URL(req.url);
      const name = searchParams.get('name'); // Filter by name
      const country = searchParams.get('country'); // Filter by country
      const roles = searchParams.getAll('role');

      // Build the query object dynamically
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const query: any = {};

      if (name) {
          // Match name in either first_name or last_name
          query.$or = [
              { first_name: { $regex: name, $options: 'i' } },
              { last_name: { $regex: name, $options: 'i' } },
              { email: { $regex: name, $options: 'i' } },
          ];
      }

      if (country) {
          // Add country filter
          query.country_id = { $regex: country, $options: 'i' };
      }

      if (roles.length > 0) {
        // Add role filters
        query.role = {
          $in: roles,  // Matches roles in the array
          $ne: "admin" // Excludes "admin" in all cases
        };
      } else {
        // Ensure "admin" is excluded even if roles array is empty
        query.role = { $ne: "admin" };
      }
      // console.log(roles);

      // Only fetch users with is_approved set to true or null
      query.is_approved = { $ne: false };

      // only fetch users that are is_email_verified
      query.is_email_verified = { $ne: false };

      // Fetch users based on the query
      const users = await User.find(query);

      // Fetch the countries based on the country_ids found in users
      const countryIds = users.map(user => user.country_id);
      const countries = await Country.find({ country_id: countryIds });

      // Create a map of country_id to country_name for easier lookup
      const countryMap = countries.reduce((map, country) => {
          map[country.country_id.toString()] = country.country_name;
          return map;
      }, {});

      // Map users to include country_name instead of country_id
      const usersWithCountryName = users.map(user => ({
          ...user.toObject(),
          country_name: countryMap[user.country_id.toString()] || null
      }));

      return Response.json(usersWithCountryName, { status: 200 });
  } catch (error) {
      return Response.json({ message: 'Error fetching users', error: error }, { status: 500 });
  }
}
