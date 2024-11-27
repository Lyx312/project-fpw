import { NextResponse } from 'next/server';
import connectDB from '../../../config/database'; // Utility function for MongoDB connection
import Country from '../../../models/countryModel'; // Adjust the path to your model
import axios from 'axios';

// GET: Fetch countries from MongoDB
export async function GET() {
  try {
    // Connect to MongoDB
    await connectDB();

    // Fetch countries from MongoDB
    const countries = await Country.find();

    // Return countries in JSON format
    return NextResponse.json({ message: 'Countries fetched successfully', data: countries });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error : any) {
    console.error('Error fetching countries:', error);
    return NextResponse.json({ message: 'Error fetching countries', error: error.message }, { status: 500 });
  }
}

export async function POST() {
    try {
      // Connect to MongoDB
      await connectDB();
  
      // Check API Key
      const apiKey = process.env.API_NINJAS_API_KEY;
      if (!apiKey) {
        console.error('Missing API key');
        return NextResponse.json({ message: 'API key is missing' }, { status: 500 });
      }
      const apiUrl = "https://api.api-ninjas.com/v1/country?name=";
      const headers = { 'X-Api-Key': apiKey };
  
        const response = await axios.get(apiUrl, { headers });
        const countries = response.data;
    
        // Iterate over the fetched countries
        for (const country of countries) {
            console.log(country)
          // Check if a document with the same country ID exists in the database
          const existingCountry = await Country.findOne({ country_id: country.iso2 });
    
          if (!existingCountry) {
            // If no duplicate, insert the new country document
            const newCountry = new Country({
                country_id: country.iso2,
                country_name: country.name
            });
    
            await newCountry.save();
          } else {
            console.log(`Country with ID ${country.id} already exists`);
          }
        }
        return NextResponse.json({ message: 'Countries inserted successfully' }, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Error inserting countries:', error.message, error.stack);
      return NextResponse.json({ message: 'Error inserting countries', error: error.message }, { status: 500 });
    }
  }