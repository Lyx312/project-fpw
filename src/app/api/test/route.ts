// app/api/test/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/config/database';
import Category from '@/models/categoryModel'; // Import Category model

export async function GET() {
  try {
    // Connect to MongoDB
    await connectDB();

    // Fetch categories from MongoDB
    const categories = await Category.find(); // Fetch data from Category model
    console.log(categories); // Check what is returned by MongoDB

    // Return categories in JSON format
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.error();
  }
}

