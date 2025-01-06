import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
    _id: string;
    category_id: number;
    category_name: string;
}

const CategorySchema: Schema = new Schema(
    {
        category_id: { type: Number, required: true, unique: true },
        category_name: { type: String, required: true },
    }
);

const Category = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);

export default Category;