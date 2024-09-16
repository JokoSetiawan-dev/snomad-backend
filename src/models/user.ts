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
  resetPasswordOtp: string | undefined; // OTP for password reset
  resetPasswordOtpExpires: Date | undefined; // OTP expiration time
  resetPasswordOtpUsed: boolean; // Track if the OTP has been used
  comparePassword(enteredPassword: string): Promise<boolean>;
  isLocked(): boolean;
  setPasswordResetOtp(otp: string, expiresInMinutes: number): void;
  resetPassword(newPassword: string): Promise<void>;
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
  resetPasswordOtp: {
    type: String,
  },
  resetPasswordOtpExpires: {
    type: Date,
  },
  resetPasswordOtpUsed: {
    type: Boolean,
    default: false,
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

// Method to set OTP for password reset
userSchema.methods.setPasswordResetOtp = function (otp: string, expiresInMinutes: number): void {
  this.resetPasswordOtp = otp;
  this.resetPasswordOtpExpires = new Date(Date.now() + expiresInMinutes * 60 * 1000);
  this.resetPasswordOtpUsed = false; // Reset used flag to false
};

// Method to reset the password
userSchema.methods.resetPassword = async function (newPassword: string): Promise<void> {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(newPassword, salt);
  this.resetPasswordOtp = undefined; // Clear OTP after successful reset
  this.resetPasswordOtpExpires = undefined;
  this.resetPasswordOtpUsed = true; // Mark OTP as used
};

// Create the User model based on the schema
const User = mongoose.model<IUser>('User', userSchema);

export default User;
