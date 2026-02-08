// app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import User from '../../../models/User';

import { generateToken } from '../../../lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await connectDB();

    // Parse request body
    const body = await request.json();
    const { fullName, email, password, confirmPassword } = body;

    // Validation
    if (!fullName || !email || !password || !confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please provide all required fields',
        },
        { status: 400 }
      );
    }

    // Email validation
    if (!email.includes('@')) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please provide a valid email address',
        },
        { status: 400 }
      );
    }

    // Password length validation
    if (password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: 'Password must be at least 6 characters long',
        },
        { status: 400 }
      );
    }

    // Password match validation
    if (password !== confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message: 'Passwords do not match',
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email already registered. Please login.',
        },
        { status: 400 }
      );
    }

    // Prevent creating admin accounts via signup
    if (email.toLowerCase() === 'admin@astro.com') {
      return NextResponse.json(
        {
          success: false,
          message: 'This email is reserved for system administrator',
        },
        { status: 403 }
      );
    }

    // Create new user (always as astrologer)
    const newUser = new User({
      fullName,
      email: email.toLowerCase(),
      password,
      role: 'astrologer',
      lastLogin: new Date(),
    });

    await newUser.save();

    // Generate JWT token
    const token = generateToken(newUser);

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Account created successfully',
        data: {
          token,
          user: {
            id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            role: newUser.role,
          },
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Signup error:', error);

    // Handle duplicate email error
    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email already registered. Please login.',
        },
        { status: 400 }
      );
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        {
          success: false,
          message: messages.join(', '),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Server error. Please try again later.',
        error: error.message,
      },
      { status: 500 }
    );
  }
}