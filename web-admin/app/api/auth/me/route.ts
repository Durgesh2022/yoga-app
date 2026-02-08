// app/api/auth/me/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import User from '../../../models/User';
import { authenticate } from '../../../lib/middleware';

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const authResult = await authenticate(request);
    
    if (!authResult.authenticated) {
      return authResult.response;
    }

    // Connect to database
    await connectDB();

    // Find user
    const user = await User.findById(authResult.user?.userId);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'User not found',
        },
        { status: 404 }
      );
    }

    // Return user data
    return NextResponse.json(
      {
        success: true,
        data: {
          user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            phone: user.phone,
            expertise: user.expertise,
            experience: user.experience,
            languages: user.languages,
            bio: user.bio,
            rating: user.rating,
            reviews: user.reviews,
            available: user.available,
            isVerified: user.isVerified,
            profileImage: user.profileImage,
            createdAt: user.createdAt,
            lastLogin: user.lastLogin,
          },
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get user error:', error);

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