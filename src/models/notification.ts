import mongoose, { Document, Schema } from 'mongoose';

// Review interface
interface INotification extends Document {
  tagline: string;
  messages: string;
  user: mongoose.Schema.Types.ObjectId[]; // Reference to User in array format
  creator: mongoose.Schema.Types.ObjectId; // Reference to User
}

// Review schema
const NotificationSchema: Schema = new Schema({
  tagline: {
    type: String,
    required: true
  },
  messages: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
export default Notification;
