// controllers/auth.controller.ts

import { Request, Response } from "express";
import User from "../models/user";
import crypto from "crypto";
import bcrypt from 'bcrypt';
import nodemailer from "nodemailer"; // You need to configure nodemailer with your email service provider

// Generate a random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Step 1: Request Password Reset (Send OTP)
export const requestPasswordReset = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User with this email does not exist" });
    }

    // Generate a 6-digit OTP and set expiration (e.g., 1 minutes)
    const otp = generateOTP();
    const otpExpiration = new Date(Date.now() + 1 * 60 * 1000);// 1 minutes from now

    // Update the user's OTP and OTP expiration
    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpires = otpExpiration;
    await user.save();

    // Send OTP via email
    const transporter = nodemailer.createTransport({
      service: "gmail", // Example: you can use any email service provider
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER, // your email
        pass: process.env.EMAIL_PASS, // your email password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request - Your OTP Code",
      text: `You have requested to reset your password. To complete the process, please use the following One-Time Password (OTP):
      
      Your OTP Code: ${otp}
      
This code is valid for the next 10 minutes. Please do not share this code with anyone.
      
If you did not request this password reset, please ignore this email or contact our support team for assistance.
      
Thank you,
Snomad Support Team`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "OTP has been sent to your email" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const validateOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User with this email does not exist' });
    }

    // Check if OTP is valid and not expired
    if (!user.resetPasswordOtpExpires || user.resetPasswordOtp !== otp || user.resetPasswordOtpExpires.getTime() < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    

    res.status(200).json({ message: 'OTP is valid, you can now reset your password' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { email, newPassword } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User with this email does not exist' });
    }

    // Update the user's password and clear the OTP fields
    user.password = newPassword;
    user.resetPasswordOtp = undefined; // Clear OTP
    user.resetPasswordOtpExpires = undefined; // Clear OTP expiration
    await user.save();

    res.status(200).json({ message: 'Password has been successfully reset' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const passwordController = { requestPasswordReset, validateOtp, resetPassword };
export default passwordController;
