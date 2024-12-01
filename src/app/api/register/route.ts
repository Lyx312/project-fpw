import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import connectDB from '@/config/database'; 
import User from '@/models/userModel'; 
import Joi from 'joi';
import { NextResponse } from 'next/server';
import sendEmail from '@/emails/mailer';

export async function POST(req: Request) {
    
    const { first_name, last_name, email, phone, password, confirm_password, country_id, role, cv_name } = await req.json();

    const { error } = userRegisterSchema.validate({ first_name, last_name, email, phone, password, confirm_password, country_id, role });
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
            cv_path: role === 'freelancer' ?  `/src/storage/cvs/${cv_name}` : null,
        });

        if (role === 'freelancer') {
            newUser.is_approved = false;
        }
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
