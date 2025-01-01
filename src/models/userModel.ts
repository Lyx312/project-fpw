import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    email: string;
    country_id: string;
    password: string;
    first_name: string;
    last_name: string;
    phone: string;
    role: string;
    cv_path: string;
    pfp_path: string;
    gender: string;
    is_banned: boolean;
    banned_reason: string;
    is_approved: boolean;
    status: string;
    is_email_verified: boolean;
    email_token: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    categories: mongoose.Types.ObjectId[];
}

const UserSchema: Schema = new Schema(
    {
        email: { type: String, required: true, unique: true },
        country_id: { type: String, ref: 'Country', required: true },
        password: { type: String, required: true },
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },
        phone: { type: String, required: true },
        role: { type: String, enum: ["admin", "client", "freelancer"], required: true },
        cv_path: { type: String, default: null },
        pfp_path: { type: String, default: null },
        gender: { type: String, enum: ['M', 'F'], default: null },
        is_banned: { type: Boolean, default: false },
        banned_reason: { type: String, default: null },
        is_approved: { type: Boolean, default: null },
        categories: [{ type: Schema.Types.ObjectId, ref: 'Category', default: null }],
        status: { type: String, enum: ['Available', 'Away'], default: null },
        is_email_verified: { type: Boolean, default: false },
        email_token: { type: String, default: null },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: null },
        deletedAt: { type: Date, default: null },
    },
    {
        timestamps: true
    }
);

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;