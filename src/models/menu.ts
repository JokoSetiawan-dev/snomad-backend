import mongoose, { Document, Schema } from 'mongoose';

// Interface for TypeScript type checking
export interface IMenu extends Document {
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  owner: mongoose.Schema.Types.ObjectId; // Reference to the Store
}


const MenuSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, 
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0, // Price should not be negative
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
    },
  },
  { timestamps: true } // Automatically creates `createdAt` and `updatedAt` fields
);

// Export the model
const Menu = mongoose.model<IMenu>('Menu', MenuSchema);
export default Menu;
