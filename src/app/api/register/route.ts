import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import connectDB from '../../../config/database'; 
import User from '../../../models/userModel'; 
import Joi from 'joi';
import { NextResponse } from 'next/server';
import sendEmail from '../../../emails/mailer';

export async function POST(req: Request) {
    
    const { first_name, last_name, email, phone, password, country_id, role } = await req.json();

    // Validate input fields
    if (!first_name || !last_name || !email || !phone || !password || !country_id || !role) {
        return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    const { error } = userRegisterSchema.validate({ first_name, last_name, email, phone, password, role });
    if (error) {
        return NextResponse.json({ message: error.details[0].message }, { status: 400 });
    }

    try {
        await connectDB();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: 'Email already in use' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const token = jwt.sign({ email: email }, process.env.JWT_SECRET!, {
            expiresIn: '1h',
        });

        const newUser = new User({
            email,
            password: hashedPassword,
            first_name,
            last_name,
            phone,
            country_id,
            role,
            email_token: token,
        });

        await newUser.save();

        // Send verification email
        const verificationLink = `${process.env.BASE_URL}/api/verifyEmail`;
        const emailContent = `
            <p>Please verify your email by clicking the button below:</p>
            <form action="${verificationLink}" method="POST">
                <input type="hidden" name="token" value="${token}" />
                <button type="submit">Verify Email</button>
            </form>
        `;
        await sendEmail(
            email,
            'Verify Your Email',
            'Please verify your email by clicking the button below:',
            emailContent
        );

        return NextResponse.json({ message: "Open your email to verify your account" }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: error }, { status: 500 });
    }
}

const userRegisterSchema = Joi.object({
    first_name: Joi.string().min(2).max(30).required(),
    last_name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^[0-9]{10,15}$/).required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('customer', 'freelancer').required(),
});
