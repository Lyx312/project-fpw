/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import connectDB from '../../../../config/database'; // Utility function for MongoDB connection
import Country from '../../../../models/countryModel'; // Adjust the path to your model

// GET: Fetch country by ID from MongoDB
export async function GET(request: Request, context: { params: { id: string } }) {
  try {
    // Destructure params after awaiting it
    const { params } = context;
    
    // Connect to MongoDB
    await connectDB();
    
    // Fetch the country by country_id
    const country = await Country.findOne({ country_id: params.id });

    if (!country) {
      return NextResponse.json({ message: 'Country not found' }, { status: 404 });
    }

    // Return the country in JSON format
    return NextResponse.json({ message: 'Country fetched successfully', data: country });
  } catch (error: any) {
    console.error('Error fetching country:', error);
    return NextResponse.json({ message: 'Error fetching country', error: error.message }, { status: 500 });
  }
}