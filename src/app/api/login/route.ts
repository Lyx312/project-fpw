import { NextResponse } from 'next/server';
import User from '../../../models/userModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import connectDB from '@/config/database';

export async function POST(request: Request) {
    await connectDB();
    try {
        const { email, password, rememberMe } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        // Find user by email
        const user = await User.findOne({ email });
        console.log(user)
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 401 });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
        }

        // Check if user is verified
        if (!user.is_email_verified) {

            // delete user if email verification token is expired
            const jwtSecret = process.env.JWT_SECRET;
            if (!jwtSecret) {
                throw new Error('JWT_SECRET is not defined');
            }
            try {
                jwt.verify(user.email_token, jwtSecret);
            } catch  {
                await User.deleteOne({ _id: user._id });
                return NextResponse.json({ error: 'Email verification token expired. Account deleted' }, { status: 401 });
            }

            return NextResponse.json({ error: 'Please verify your email' }, { status: 401 });
        }

        // if user is freelancer, check if account is approved
        if (user.role === 'freelancer' && !user.is_approved) {
            return NextResponse.json({ error: 'Account approval pending' }, { status: 401 });
        }

        // Generate JWT token
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined');
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: rememberMe? '7d' : '1d' });

        const cookieStore = await cookies();
        cookieStore.set('userToken', token, { expires: new Date(Date.now() + (rememberMe? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000)) });


        return NextResponse.json({ token }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}