import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user'; // The user model where password hashing is done
import dotenv from 'dotenv';

dotenv.config();

// Load environment variables
const JWT_SECRET = process.env.JWT_SECRET_KEY as string;
const JWT_REFRESH = process.env.JWT_REFRESH_KEY as string;
const MAX_LOGIN_ATTEMPTS = 5; // Maximum allowed failed login attempts
const LOCK_TIME = 2 * 60 * 60 * 1000; // Lock the account for 2 hours

// Register a new user
export const register = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  try {
    // Validate that all required fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user instance
    const newUser = new User({
      name,
      email,
      password, // The model will handle the hashing
      role: role,
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    // Generate a JWT token
    const token = jwt.sign({ id: savedUser._id }, JWT_SECRET, { expiresIn: '1d' });

    // Send response back with the new user info and the token
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Invalid email or password' });
    }

    // Check if the user account is locked
    if (user.isLocked()) {
      return res.status(423).json({ message: 'Account is locked. Try again later.' });
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Increment login attempts
      user.loginAttempts += 1;

      // Lock the account if login attempts exceed the max allowed
      if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        user.lockUntil = Date.now() + LOCK_TIME;
      }

      await user.save();
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Reset login attempts and lock status on successful login
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    // Generate JWT Token
    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '15m' } // Token expires in 15 minutes
    );

    const refreshToken = jwt.sign(
      { id: user._id, role: user.role },
      JWT_REFRESH,
      { expiresIn: '7d' } // Token refresh expires in 7 days
    );

    // Set token in HTTP-only cookie
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      maxAge: 3600000, // 1 hour
      sameSite: 'strict', // Prevent CSRF attacks
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      maxAge: 3600000, // 1 hour
      sameSite: 'strict', // Prevent CSRF attacks
    });

    user.refreshToken = refreshToken; // Store refresh token
    await user.save();

    // Send success response
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies.refreshToken;

  if (!refreshToken) return res.sendStatus(401); // No refresh token provided

  const user = await User.findOne({ refreshToken: refreshToken });
  if (!user) return res.sendStatus(403); // Invalid refresh token

  jwt.verify(refreshToken, JWT_REFRESH, (err: any) => {
    if (err) return res.sendStatus(403); // Invalid refresh token
  });

  const newAccessToken = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '15m' });

  // Set token in HTTP-only cookie
  res.cookie('accessToken', newAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    maxAge: 3600000, // 1 hour
    sameSite: 'strict', // Prevent CSRF attacks
  });
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logout successful' });
};


const authController = {register, login, refreshToken,logout};
export default authController;