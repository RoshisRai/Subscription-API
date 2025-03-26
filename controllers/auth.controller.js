import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dayjs from "dayjs";

import User from "../models/user.model.js"
import { JWT_EXPIRES_IN, JWT_SECRET, SERVER_URL } from "../config/env.js";
import { sendActivationEmail } from "../utils/send-activation-email.js";

export const signUp = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Create a new user
        const { name, email, password } = req.body;

        // Check if a user already exists
        const existingUser = await User.findOne({ email})

        if(existingUser) {
            const error = new Error('User already exists');
            error.statusCode = 400;
            throw error;
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create activation token
        const activationToken = jwt.sign(
            { email },
            JWT_SECRET,
            { expiresIn: "24h"}
        )

        const newUsers = await User.create([{ 
            name, 
            email, 
            password: hashedPassword,
            isActive: false, 
            activationToken,
            activationExpires: dayjs().add(1, 'day')
        }], { session });

        // Generate a regular auth token
        const token = jwt.sign(
            { userId: newUsers[0]._id }, 
            JWT_SECRET, 
            { expiresIn: JWT_EXPIRES_IN}
        );

        // Send activation email
        await sendActivationEmail({
            to: email,
            name,
            activationToken
        });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: "User Created Successfully. Please check your email to activate your account.",
            data: {
                token, 
                user: newUsers[0]
            }
        })

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
}

export const activateAccount = async (req, res, next) => {
    try {
        const { token } = req.params;

        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Find the user with the email in the token
        const user = await User.findOne({
            email: decoded.email,
            activationToken: token,
            isActive: false
        })

        if(!user) {
            const error = new Error('Invalid activation token or account already activated');
            error.statusCode = 400;
            throw error;
        }

        // Activate the user
        user.isActive = true;
        user.activationToken = null;
        user.activationExpires = null;
        await user.save();

        res.status(200).send(`
            <html>
                <head>
                <title>Account Activated</title>
                <style>
                    body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                    .success { color: #4CAF50; }
                </style>
                </head>
                <body>
                <h1 class="success">Account Activated!</h1>
                <p>Your account has been successfully activated.</p>
                <p>You can now login to your account.</p>
                <a href="${process.env.CLIENT_URL || SERVER_URL}">Go to Login</a>
                </body>
            </html>
        `);
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            res.status(400).send(`
              <html>
                <head>
                  <title>Activation Failed</title>
                  <style>
                    body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                    .error { color: #f44336; }
                  </style>
                </head>
                <body>
                  <h1 class="error">Activation Link Expired</h1>
                  <p>Your activation link has expired.</p>
                  <p>Please request a new activation link.</p>
                </body>
              </html>
            `);
          } else {
            next(error);
          } 
    }
}

export const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email});

        if(!user) {
            const error = new Error('User Not Found');
            error.statusCode = 404;
            throw error;
        }

        // Check if the user is active
        if (!user.isActive) {
            const error = new Error('Please activate your account first. Check your email.');
            error.statusCode = 403;
            throw error;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid) {
            const error = new Error('Invalid Password');
            error.statusCode = 400;
            throw error;
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN});

        res.status(200).json({
            success: true,
            message: 'User Logged In Successfully',
            data: {
                token,
                user
            }
        })
    } catch (error) {
        next(error);
    }
}

export const signOut = async (req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            message: "Successfully signed out"
        });
    } catch (error) {
        next(error);
    }
}