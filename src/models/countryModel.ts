import mongoose, { Schema, Document } from 'mongoose';

interface ICountry extends Document {
    country_id: number;
    country_name: string;
}

const CountrySchema: Schema = new Schema(
    {
        country_id: { type: Number, required: true, unique: true },
        country_name: { type: String, required: true },
    },
    {
        _id: false,
    }
);

const Country = mongoose.models.Country || mongoose.model<ICountry>('Country', CountrySchema);

export default Country;