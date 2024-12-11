import mongoose, { Schema, Document } from 'mongoose';

interface IPost extends Document {
    post_id: number;
    post_email: string;
    post_title: string;
    post_description: string;
    post_price: number;
    post_status: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}

const PostSchema: Schema = new Schema(
    {
        post_id: { type: Number, required: true, unique: true },
        post_email: { type: String, ref: 'User', required: true },
        post_title: { type: String, required: true },
        post_description: { type: String, required: true },
        post_price: { type: Number, required: true },
        post_status: { type: String, enum: ['available', 'unavailable'], default: "available" },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: null },
        deletedAt: { type: Date, default: null },
    },
    {
        timestamps: true,
    }
);

const Post = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);

export default Post;