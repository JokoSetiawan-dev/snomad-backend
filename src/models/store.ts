import mongoose, { Document, Schema } from 'mongoose';

// Store interface
interface IStore extends Document {
  name: string;
  description: string;
  logoUrl: string;
  bannerUrl?: string;
  rating?: number;
  owner: mongoose.Schema.Types.ObjectId;
}

// Store schema
const StoreSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  logoUrl: { type: String, required: true },
  bannerUrl: { type: String },
  rating: { type: Number, default: 0},
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const Store = mongoose.model<IStore>('Store', StoreSchema);
export default Store;
