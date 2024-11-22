import mongoose, { Schema, Document } from 'mongoose';

interface ICategory extends Document {
    category_id: number;
    category_name: string;
}

const CategorySchema: Schema = new Schema(
    {
        category_id: { type: Number, required: true, unique: true },
        category_name: { type: String, required: true },
    },
    {
        _id: false,
    }
);

const Category = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);

export default Category;