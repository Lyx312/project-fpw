import bcrypt from 'bcrypt';
import connectDB from '@/config/database';
import User from '@/models/userModel';
import Joi from 'joi';
import { NextResponse } from 'next/server';
import sendEmail, { emailTemplate } from '@/emails/mailer';
import { SignJWT } from 'jose';
import mongoose from 'mongoose';
import { baseUrl } from '@/config/url';

export async function POST(req: Request) {
    const { first_name, last_name, email, phone, password, confirm_password, country_id, role, cv_path, categories } = await req.json();

    const { error } = userRegisterSchema.validate({ first_name, last_name, email, phone, password, confirm_password, country_id, role });
    if (error) {
        return NextResponse.json({ message: error.details[0].message }, { status: 400 });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        await connectDB();

        const existingUser = await User.findOne({ email }).session(session);
        if (existingUser) {
            await session.abortTransaction();
            session.endSession();
            return NextResponse.json({ message: 'Email already in use' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate JWT token using jose
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined');
        }
        const jwtSecret = new TextEncoder().encode(process.env.JWT_SECRET);
        const token = await new SignJWT({ email: email })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('1h')
            .sign(jwtSecret);

        if (role === 'freelancer' && categories.length === 0) {
            await session.abortTransaction();
            session.endSession();
            return NextResponse.json({ message: 'Please select at least one category' }, { status: 400 });
        }

        const newUser = new User({
            email,
            password: hashedPassword,
            first_name,
            last_name,
            phone,
            country_id,
            role,
            email_token: token,
            cv_path: role === 'freelancer' ? `${cv_path}` : null,
            categories: role === 'freelancer' && Array.isArray(categories) ? categories : [],
            is_approved: role === 'freelancer' ? false : null,
            status: role === 'freelancer' ? 'Available' : null
        });

        await newUser.save({ session });

        // Send verification email
        const verificationLink = `${baseUrl}/api/verifyEmail`;
        const emailContent = emailTemplate(
            'Verify Your Email',
            `Hi ${first_name},<br/><br/>
            Thank you for registering with Freelance Hub. Please verify your email by clicking the button below:<br/><br/>
            <form action="${verificationLink}" method="POST" style="display: inline-block;">
                <input type="hidden" name="token" value="${token}" />
                <button type="submit" style="background-color: #00a2ff; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">Verify Email</button>
            </form><br/><br/>
            If you did not create an account, no further action is required.<br/><br/>
            `
        );

        try {
            await sendEmail(
                email,
                'Verify Your Email',
                'Please verify your email by clicking the button below:',
                emailContent
            );
        } catch (emailError) {
            await session.abortTransaction();
            session.endSession();
            console.log(emailError);
            return NextResponse.json({ message: "Failed to send verification email. Please try again.", emailError }, { status: 500 });
        }

        await session.commitTransaction();
        session.endSession();
        return NextResponse.json({ message: "Open your email to verify your account" }, { status: 201 });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error(error);
        return NextResponse.json({ message: error }, { status: 500 });
    }
}

const userRegisterSchema = Joi.object({
    first_name: Joi.string().min(2).max(30).required().messages({
        'string.base': 'First name should be a type of text',
        'string.empty': 'First name cannot be empty',
        'string.min': 'First name should have a minimum length of 2',
        'string.max': 'First name should have a maximum length of 30',
        'any.required': 'First name is required'
    }),
    last_name: Joi.string().min(2).max(30).required().messages({
        'string.base': 'Last name should be a type of text',
        'string.empty': 'Last name cannot be empty',
        'string.min': 'Last name should have a minimum length of 2',
        'string.max': 'Last name should have a maximum length of 30',
        'any.required': 'Last name is required'
    }),
    email: Joi.string().email().required().messages({
        'string.base': 'Email should be a type of text',
        'string.empty': 'Email cannot be empty',
        'string.email': 'Email must be a valid email',
        'any.required': 'Email is required'
    }),
    phone: Joi.string().pattern(/^[0-9]{10,15}$/).required().messages({
        'string.base': 'Phone should be a type of text',
        'string.empty': 'Phone cannot be empty',
        'string.pattern.base': 'Phone must be a valid phone number with 10 to 15 digits',
        'any.required': 'Phone is required'
    }),
    password: Joi.string().min(6).required().messages({
        'string.base': 'Password should be a type of text',
        'string.empty': 'Password cannot be empty',
        'string.min': 'Password should have a minimum length of 6',
        'any.required': 'Password is required'
    }),
    confirm_password: Joi.string().valid(Joi.ref('password')).required().messages({
        'any.only': 'Confirm password does not match password',
        'any.required': 'Confirm password is required'
    }),
    country_id: Joi.string().required().messages({
        'string.base': 'Country is required',
        'string.empty': 'Country is required',
        'any.required': 'Country is required'
    }),
    role: Joi.string().valid('client', 'freelancer').required().messages({
        'string.base': 'Role should be a type of text',
        'any.only': 'Role must be either client or freelancer',
        'any.required': 'Role is required'
    }),
});
