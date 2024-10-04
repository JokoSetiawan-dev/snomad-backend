import { check, ValidationChain, validationResult } from 'express-validator';
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
  check('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail() // optional: sanitizing the email input
];

// Password validation
export const validatePassword: ValidationChain[] = [
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Password is required.')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long.')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d\W]{8,}$/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number.')
];

export const validateName: ValidationChain[] = [
    check('name')
      .exists({ checkFalsy: true }).withMessage('Name is required.')
      .isLength({ min: 2 }).withMessage('Name must be at least 2 characters long.')
      .trim()
  ];
  
  // Role Validation
  export const validateRole: ValidationChain[] = [
    check('role')
      .exists({ checkFalsy: true }).withMessage('Role is required.')
      .isIn(['buyer', 'seller', 'admin']).withMessage('Invalid role.')
  ];
  
  // OTP Validation
  export const validateOtp: ValidationChain[] = [
    check('otp')
      .exists({ checkFalsy: true }).withMessage('OTP is required.')
      .isLength({ min: 6, max: 6 }).withMessage('OTP must be exactly 6 digits.')
      .isNumeric().withMessage('OTP must be a numeric value.')
  ];

  export const validateRatingAndComment = [
    // Rating validation: must be between 1 and 5, required, and must be numeric
    check('rating')
      .isNumeric()
      .withMessage('Rating must be a number')
      .custom((value) => value >= 1 && value <= 5)
      .withMessage('Rating must be between 1 and 5')
      .notEmpty()
      .withMessage('Rating is required'),
  
    // Comment validation: must be a string, required, and have a length between 10 and 500 characters
    check('comment')
      .isString()
      .withMessage('Comment must be a string')
      .isLength({ min: 10, max: 500 })
      .withMessage('Comment must be between 10 and 500 characters')
      .notEmpty()
      .withMessage('Comment is required'),
  ];

  export const validateDescription = [
    check('description')
      .isString()
      .withMessage('Description must be a string')
      .isLength({ min: 10, max: 500 })
      .withMessage('Description must be between 10 and 500 characters')
      .notEmpty()
      .withMessage('Description is required'),
  ]

  export const validatePrice = [
    check('price')
      .exists().withMessage('Price is required') // Ensure the price exists
      .isFloat({ min: 0.01 }).withMessage('Price must be a number greater than 0') // Ensure price is a float greater than 0
      .custom((value) => {
        if (value <= 0) {
          throw new Error('Price must be greater than 0');
        }
        return true;
      })
  ];
