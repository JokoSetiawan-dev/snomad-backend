import { body, ValidationChain, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Middleware for handling validation errors
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Email validation
export const validateEmail: ValidationChain[] = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail() // optional: sanitizing the email input
];

// Password validation
export const validatePassword: ValidationChain[] = [
  body('password')
    .exists({ checkFalsy: true })
    .withMessage('Password is required.')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long.')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d\W]{8,}$/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number.')
];

export const validateName: ValidationChain[] = [
    body('name')
      .exists({ checkFalsy: true }).withMessage('Name is required.')
      .isLength({ min: 2 }).withMessage('Name must be at least 2 characters long.')
      .trim()
  ];
  
  // Role Validation
  export const validateRole: ValidationChain[] = [
    body('role')
      .exists({ checkFalsy: true }).withMessage('Role is required.')
      .isIn(['buyer', 'seller', 'admin']).withMessage('Invalid role.')
  ];
  
  // OTP Validation
  export const validateOtp: ValidationChain[] = [
    body('otp')
      .exists({ checkFalsy: true }).withMessage('OTP is required.')
      .isLength({ min: 6, max: 6 }).withMessage('OTP must be exactly 6 digits.')
      .isNumeric().withMessage('OTP must be a numeric value.')
  ];

