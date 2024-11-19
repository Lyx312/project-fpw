import { NextResponse } from "next/server";
import connectDB from '@/config/database';
import User from '@/models/userModel';

export async function GET() {
    await connectDB();

    try {
        const users = await User.find();
        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching users', error: error }, { status: 500 });
    }
}