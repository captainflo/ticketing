import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { validationRequest } from '../middlewares/validate-request';
import { User } from '../models/user';

import { BadRequestError } from '../errors/bad-request-error';
const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
  ],
  validationRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    // Does a user with this email exist
    if (existingUser) {
      throw new BadRequestError('Email in use');
    }
    // build User
    const user = User.build({ email, password });

    // Save into database
    await user.save();
    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      // ! make the exclamation mark tell to typescript
      // we are sure at 100% the variable is defined
      process.env.JWT_KEY!
    );

    // Store it on session object
    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(user);
  }
);

export { router as signupRouter };
