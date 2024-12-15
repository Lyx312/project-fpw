import { jwtVerify } from 'jose';
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

        let decodedToken;
        try {
            const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
            decodedToken = payload;
        } catch (error) {
            if (error instanceof Error) {
                return NextResponse.json({ message: 'Invalid token', error: error.message }, { status: 401 });
            }
            return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
        }

        const user = await User.findOne({ email: decodedToken.email });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        if (user.email_token !== token) {
            return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
        }

        // Update user is_email_verified field
        user.is_email_verified = true;
        await user.save();
        
        return NextResponse.json({ message: 'Email verified. Please go back to Freelance Hub to login.' }, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
        }
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}