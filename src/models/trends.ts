import mongoose, { Schema, Document } from 'mongoose';

interface SearchTrend extends Document {
  keyword: string;
  count: number;
}

const searchTrendSchema = new Schema<SearchTrend>({
  keyword: { type: String, required: true, unique: true },
  count: { type: Number, required: true, default: 1 }
});

const SearchTrend = mongoose.model<SearchTrend>('SearchTrend', searchTrendSchema);

export default SearchTrend;
