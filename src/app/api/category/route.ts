import { NextResponse } from 'next/server';
import connectDB from '../../../config/database'; // Utility function for MongoDB connection
import Category from '@/models/categoryModel'; // Adjust the path to your model

// GET: Fetch countries from MongoDB
export async function GET(req: Request) {
  try {
    // Connect to MongoDB
    await connectDB();

    const { searchParams } = new URL(req.url);
    const name = searchParams.get('name');

    // Fetch categories with optional filtering
    const query = name ? { category_name: { $regex: name, $options: 'i' } } : {};
    const categories = await Category.find(query);

    // Return countries in JSON format
    return NextResponse.json({ message: 'Countries fetched successfully', data: categories });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error : any) {
    console.error('Error fetching countries:', error);
    return NextResponse.json({ message: 'Error fetching countries', error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
    try {
      // Connect to MongoDB
      await connectDB();

        const { category_name } = await req.json();
  
        if (!category_name) {
          return NextResponse.json({ message: 'Category name is required' }, { status: 400 });
        }
        const categoryExist = await Category.findOne({category_name});
        if (categoryExist) {
            return NextResponse.json({ message: 'Category already exists' }, { status: 409 });
          }

        const categoryCount = await Category.countDocuments();
        const newCategory = new Category({
          category_id: categoryCount + 1,
          category_name,
        });
  
        await newCategory.save();
        return NextResponse.json({ message: 'Category added successfully' }, { status: 201 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Error inserting categories:', error.message, error.stack);
      return NextResponse.json({ message: 'Error inserting categories', error: error.message }, { status: 500 });
    }
  }