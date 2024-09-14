import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

// Define an interface for the User model
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  loginAttempts: number;
  lockUntil: number | undefined;
  comparePassword(enteredPassword: string): Promise<boolean>;
  isLocked(): boolean;
}

// Create the User schema
const userSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'],
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    validate: {
      validator: function (v: string) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d\W]{8,}$/.test(v);
      },
      message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.',
    },
  },
  role: {
    type: String,
    enum: ['buyer', 'seller', 'admin'],
  },
  loginAttempts: {
    type: Number,
    required: true,
    default: 0,
  },
  lockUntil: {
    type: Number,
  },
}, {
  timestamps: true,
});

// Hash the password before saving the user
userSchema.pre<IUser>('save', async function (next) {
  const user = this; // This is the IUser instance

  // Only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Add method to compare passwords for login
userSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Check if the account is locked
userSchema.methods.isLocked = function (): boolean {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

// Create the User model based on the schema
const User = mongoose.model<IUser>('User', userSchema);

export default User;
