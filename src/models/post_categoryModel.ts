import mongoose, { Schema, Document } from 'mongoose';

interface IPost_category extends Document {
    post_id: number;
    category_id: number;
}

const Post_categorySchema: Schema = new Schema(
    {
        post_id: { type: Number, required: true },
        category_id: { type: String, required: true },
    }
);

Post_categorySchema.index({ post_id: 1, category_id: 1 }, { unique: true });

const Post_category = mongoose.models.Post_category || mongoose.model<IPost_category>('Post_category', Post_categorySchema);

export default Post_category;