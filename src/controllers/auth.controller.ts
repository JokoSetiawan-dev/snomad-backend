import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user'; // The user model where password hashing is done

// Load environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

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
      role: role || 'user', // default role is 'user'
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

const authController = {register};
export default authController;