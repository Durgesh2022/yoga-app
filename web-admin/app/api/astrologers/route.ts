import { NextRequest, NextResponse } from 'next/server';
import connectDB from './../../lib/mongodb';
import Astrologer from './../../models/Astrologer';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const available = searchParams.get('available');

    // Build query
    const query: any = {};
    if (available !== null) {
      query.available = available === 'true';
    }

    const astrologers = await Astrologer.find(query).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: astrologers.length,
      data: astrologers,
    });
  } catch (error: any) {
    console.error('Error fetching astrologers:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch astrologers',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'expertise', 'experience', 'languages', 'price', 'services'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          {
            success: false,
            error: `Missing required field: ${field}`,
          },
          { status: 400 }
        );
      }
    }

    const astrologer = await Astrologer.create(body);

    return NextResponse.json(
      {
        success: true,
        data: astrologer,
        message: 'Astrologer created successfully',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating astrologer:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          message: error.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create astrologer',
        message: error.message,
      },
      { status: 500 }
    );
  }
}