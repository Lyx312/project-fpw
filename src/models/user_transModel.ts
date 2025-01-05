import mongoose, { Schema, Document } from 'mongoose';

export interface IUser_trans extends Document {
    trans_id: number;
    email: string;
    post_id: number;
    price: number;
    request: string;
    start_date: Date;
    end_date: Date;
    deadline: Date;
    trans_status: string;
    cancelled_reason: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}

const User_transSchema: Schema = new Schema(
    {
        trans_id: { type: Number, required: true, unique: true },
        email: { type: String, ref: 'User', required: true },
        post_id: { type: Number, ref: 'Post', required: true },
        price: { type: Number, required: true, min: 0 },
        request: { type: String, required: true },
        start_date: { type: Date, default: null },
        end_date: { type: Date, default: null },
        deadline: { type: Date, default: null },
        trans_status: { type: String, enum: ["pending", "in-progress", "submitted", "completed", "cancelled", "failed"], default: "pending" },
        cancelled_reason: { type: String, default: null },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: null },
        deletedAt: { type: Date, default: null },
    },
    {
        timestamps: true,
    }
);

const User_trans = mongoose.models.User_trans || mongoose.model<IUser_trans>('User_trans', User_transSchema);

export default User_trans;