/* eslint-disable @typescript-eslint/no-explicit-any */
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
    const countries = await Country.find().sort({ country_name: 1 });

    // Return countries in JSON format
    return NextResponse.json({ message: 'Countries fetched successfully', data: countries });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error : any) {
    console.error('Error fetching countries:', error);
    return NextResponse.json({ message: 'Error fetching countries', error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Connect to MongoDB
    await connectDB();

    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name') || '';
    const limit = parseInt(searchParams.get('limit') || '30', 10);
    const minPopulation = parseInt(searchParams.get('min_population') || '0', 10);
    const maxPopulation = parseInt(searchParams.get('max_population') || '0', 10);
    const minArea = parseFloat(searchParams.get('min_area') || '0');
    const maxArea = parseFloat(searchParams.get('max_area') || '0');

    const apiKey = process.env.API_NINJAS_API_KEY;
    if (!apiKey) {
      console.error('Missing API key');
      return NextResponse.json({ message: 'API key is missing' }, { status: 500 });
    }

    // Construct API URL with filters
    let apiUrl = `https://api.api-ninjas.com/v1/country?name=${name}&limit=${limit}`;
    if (minPopulation) apiUrl += `&min_population=${minPopulation}`;
    if (maxPopulation) apiUrl += `&max_population=${maxPopulation}`;
    if (minArea) apiUrl += `&min_area=${minArea}`;
    if (maxArea) apiUrl += `&max_area=${maxArea}`;
    
    const headers = { 'X-Api-Key': apiKey };

    const response = await axios.get(apiUrl, { headers });
    const countries = response.data;

    for (const country of countries) {
      const existingCountry = await Country.findOne({ country_id: country.iso2 });

      if (!existingCountry) {
        const newCountry = new Country({
          country_id: country.iso2,
          country_name: country.name,
        });

        await newCountry.save();
      } else {
        console.log(`Country with ID ${country.iso2} already exists`);
      }
    }

    return NextResponse.json({ message: 'Countries inserted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error inserting countries:', error.message, error.stack);
    return NextResponse.json({ message: 'Error inserting countries', error: error.message }, { status: 500 });
  }
}
