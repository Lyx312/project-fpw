import connectDB from "@/config/database";
import User from "@/models/userModel";
import Joi from "joi";
import bcrypt from "bcrypt";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

const updateUserSchema = Joi.object({
  country_id: Joi.string().optional().messages({
    'string.base': 'Country should be a type of text',
  }),
  old_password: Joi.string().optional().messages({
    'string.base': 'Old password should be a type of text',
    'any.and': 'Old password is required when updating password',
  }),
  new_password: Joi.string().min(6).optional().messages({
    'string.base': 'New password should be a type of text',
    'string.min': 'New password should have a minimum length of 6',
    'any.and': 'New password is required when updating password',
  }),
  confirm_password: Joi.string().valid(Joi.ref('new_password')).optional().messages({
    'any.only': 'Confirm password does not match new password',
    'any.and': 'Confirm password is required when updating password',
  }),
  first_name: Joi.string().min(2).max(30).required().messages({
    'string.base': 'First name should be a type of text',
    'string.min': 'First name should have a minimum length of 2',
    'string.max': 'First name should have a maximum length of 30',
    'string.empty': 'First name cannot be empty',
    'any.required': 'First name is required',
  }),
  last_name: Joi.string().min(2).max(30).required().messages({
    'string.base': 'Last name should be a type of text',
    'string.min': 'Last name should have a minimum length of 2',
    'string.max': 'Last name should have a maximum length of 30',
    'string.empty': 'Last name cannot be empty',
    'any.required': 'Last name is required',
  }),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/).required().messages({
    'string.base': 'Phone should be a type of text',
    'string.pattern.base': 'Phone must be a valid phone number with 10 to 15 digits',
    'string.empty': 'Phone cannot be empty',
    'any.required': 'Phone is required',
  }),
  gender: Joi.string().valid('M', 'F').allow(null).optional().messages({
    'string.base': 'Gender should be a type of text',
    'any.only': 'Gender must be either Male or Female',
  }),
  pfp_path: Joi.string().optional().messages({
    'string.base': 'Profile picture path should be a type of text',
  }),
})
.and('new_password', 'old_password', 'confirm_password')
.messages({
  'object.and': '{#presentWithLabels} is provided without its required peers {#missingWithLabels}',
});


// Update user endpoint logic
export async function PUT(request: Request) {
  await connectDB();
  const {
    country_id,
    old_password,
    new_password,
    confirm_password,
    first_name,
    last_name,
    phone,
    gender,
    pfp_path,
  } = await request.json();
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop();

  // console.log({ country_id, old_password, new_password, confirm_password, first_name, last_name, phone, gender });

  // Validate request body
  const { error } = updateUserSchema.validate({
    country_id,
    old_password: old_password=='' ? undefined : old_password,
    new_password: new_password=='' ? undefined : new_password,
    confirm_password: confirm_password=='' ? undefined : confirm_password,
    first_name,
    last_name,
    phone,
    gender,
    pfp_path,
  });
  if (error) {
    return Response.json({ message: error.details[0].message }, { status: 400 });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return Response.json({ message: 'User not found' }, { status: 404 });
    }

    // Check if old password is correct
    if (old_password) {
      const isPasswordCorrect = await bcrypt.compare(old_password, user.password);
      if (!isPasswordCorrect) {
        return Response.json({ message: 'Old password is incorrect' }, { status: 400 });
      }
    }

    if (country_id) user.country_id = country_id;
    if (new_password) user.password = await bcrypt.hash(new_password, 10);
    if (first_name) user.first_name = first_name;
    if (last_name) user.last_name = last_name;
    if (phone) user.phone = phone;
    if (gender) user.gender = gender;
    if (pfp_path) user.pfp_path = pfp_path;

    await user.save();

    // Update the cookie without extending the expiry
    const cookieStore = await cookies();
    const existingCookie = cookieStore.get('userToken');
    if (existingCookie) {
      const jwtSecret = new TextEncoder().encode(process.env.JWT_SECRET);

      const exp = await jwtVerify(existingCookie.value, jwtSecret).then((result) => result.payload.exp);
      // console.log(exp);

      if (exp) {
        const token = await new SignJWT({ ...user.toJSON() })
          .setProtectedHeader({ alg: 'HS256' })
          .setExpirationTime(Math.floor(exp))
          .sign(jwtSecret);

        cookieStore.set('userToken', token, { expires: new Date(exp * 1000), httpOnly: true });
      }
    }

    return Response.json({ message: 'User updated successfully' }, { status: 200 });
  } catch (error) {
    return Response.json({ message: 'Internal server error', error: error }, { status: 500 });
  }
}
