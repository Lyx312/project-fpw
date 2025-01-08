import { NextResponse } from 'next/server';
import User from '../../../models/userModel';
import bcrypt from 'bcrypt';
import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';
import connectDB from '@/config/database';
import Joi from 'joi';

export async function POST(request: Request) {
    const { email, password, rememberMe } = await request.json();
        
    const { error } = userLoginSchema.validate({ email, password, rememberMe });

    if (error) {
        return NextResponse.json({ error: error.details[0].message }, { status: 400 });
    }

    try {
        await connectDB();

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

        // Generate JWT token using jose
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined');
        }
        const jwtSecret = new TextEncoder().encode(process.env.JWT_SECRET);

        // Check if user is verified
        if (!user.is_email_verified) {

            // delete user if email verification token is expired
            try {
                await jwtVerify(user.email_token, jwtSecret);
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

        // check if user is banned
        if (user.is_banned) {
            return NextResponse.json({ error: `Your account is banned. Reaseon: ${user.banned_reason}` }, { status: 401 });
        }

        const userObj = {
            _id: user._id,
            email: user.email,
            country_id: user.country_id,
            first_name: user.first_name,
            last_name: user.last_name,
            role: user.role,
            pfp_path: user.pfp_path,
            phone: user.phone,
            gender: user.gender,
            categories: user.categories,
            status: user.status,
        };

        // Generate JWT token
        const token = await new SignJWT(userObj)
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime(rememberMe ? '7d' : '1d')
            .sign(jwtSecret);

        const cookieStore = await cookies();
        cookieStore.set('userToken', token, { expires: new Date(Date.now() + (rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000)), httpOnly: true });

        return NextResponse.json({ token, user }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

const userLoginSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: true } })
        .required()
        .messages({
            'string.email': 'Email is incorrect',
            'string.empty': 'Email is required',
        }),

    password: Joi.string()
        .min(6)
        .required()
        .messages({
            'string.empty': 'Password is required',
            'string.min': 'Password must be at least 6 characters long',
        }),

    rememberMe: Joi.boolean().optional(),
});