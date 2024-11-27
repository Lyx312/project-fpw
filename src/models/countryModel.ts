import mongoose, { Schema, Document } from 'mongoose';

interface ICountry extends Document {
    country_id: string;
    country_name: string;
}

const CountrySchema: Schema = new Schema(
    {
        country_id: { type: String, required: true, unique: true },
        country_name: { type: String, required: true },
    }
);

const Country = mongoose.models.Country || mongoose.model<ICountry>('Country', CountrySchema);

export default Country;