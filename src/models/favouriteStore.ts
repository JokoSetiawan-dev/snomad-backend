import mongoose, { Document, Schema } from 'mongoose';

// Review interface
interface IFavourite extends Document {
  store?: mongoose.Schema.Types.ObjectId;// Reference to User in array format
  user?: mongoose.Schema.Types.ObjectId; // Reference to User
}

// Review schema
const FavouriteSchema: Schema = new Schema({
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

const FavouriteStore = mongoose.model<IFavourite>('FavouriteStore', FavouriteSchema);
export default FavouriteStore;
