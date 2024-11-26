import jwt from 'jsonwebtoken';
import connectDB from '../../../config/database';
import User from '../../../models/userModel';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    await connectDB();

    const formData = await req.formData();
    const token = formData.get('token');

    if (!token || typeof token !== 'string') {
        return NextResponse.json({ message: 'Token is required' }, { status: 400 });
    }

    try {
        if (!process.env.JWT_SECRET) {
            return NextResponse.json({ message: 'JWT secret is not defined' }, { status: 500 });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const decodedToken = decoded as jwt.JwtPayload;
        const user = await User.findOne({ email: decodedToken.email });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        console.log(token);
        if (user.email_token !== token) {
            return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
        }

        // Update user is_email_verified field
        user.is_email_verified = true;
        await user.save();
        
        return NextResponse.json({ message: 'Token is valid' }, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
        }
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}