import mongoose, { Schema, Document } from 'mongoose';

interface IUser_category extends Document {
    email: string;
    category_id: number;
}

const User_categorySchema: Schema = new Schema(
    {
        email: { type: String, required: true },
        category_id: { type: Number, required: true },
    }
);

User_categorySchema.index({ email: 1, category_id: 1 }, { unique: true });

const User_category = mongoose.models.User_category || mongoose.model<IUser_category>('User_category', User_categorySchema);

export default User_category;