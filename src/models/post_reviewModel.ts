import mongoose, { Schema, Document } from 'mongoose';

interface IPost_review extends Document {
    review_id: number;
    email: string;
    post_id: number;
    review_rating: number;
    review_description: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}

const Post_reviewSchema: Schema = new Schema(
    {
        review_id: { type: Number, required: true, unique: true },
        email: { type: String, ref: 'User', required: true },
        post_id: { type: Number, ref: 'Post', required: true },
        review_rating: { type: Number, required: true, min: 1, max: 5 },
        review_description: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: null },
        deletedAt: { type: Date, default: null },
    },
    {
        _id: false,
        timestamps: true,
    }
);

const Post_review = mongoose.models.Post_review || mongoose.model<IPost_review>('Post_review', Post_reviewSchema);

export default Post_review;