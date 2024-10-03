import mongoose, { Document, Schema } from 'mongoose';

// Review interface
interface IReview extends Document {
  rating: number;
  comment: string;
  user: mongoose.Schema.Types.ObjectId; // Reference to User
  store: mongoose.Schema.Types.ObjectId; // Reference to Store
}

// Review schema
const ReviewSchema: Schema = new Schema({
  rating: {
    type: Number,
    required: true,
    min: 1, // Minimum rating value
    max: 5, // Maximum rating value
  },
  comment: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true,
  },
}, { timestamps: true });

const Review = mongoose.model<IReview>('Review', ReviewSchema);
export default Review;
