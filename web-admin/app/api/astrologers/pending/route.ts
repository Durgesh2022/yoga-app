import connectDB from '@/app/lib/mongodb';
import Astrologer from '@/app/models/Astrologer';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const astrologers = await Astrologer.find({ pendingUpdates: { $exists: true, $ne: null } }).sort({ updatedAt: -1 });

    return NextResponse.json({
      success: true,
      count: astrologers.length,
      data: astrologers,
    });
  } catch (error: any) {
    console.error('Error fetching pending updates:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch pending updates',
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
    const { astrologerId, pendingUpdates } = body;

    if (!astrologerId || !pendingUpdates) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing astrologerId or pendingUpdates',
        },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(astrologerId)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid astrologer ID',
        },
        { status: 400 }
      );
    }

    const astrologer = await Astrologer.findByIdAndUpdate(
      astrologerId,
      { $set: { pendingUpdates } },
      { new: true, runValidators: false }
    );

    if (!astrologer) {
      return NextResponse.json(
        {
          success: false,
          error: 'Astrologer not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: astrologer,
      message: 'Pending update saved successfully',
    });
  } catch (error: any) {
    console.error('Error saving pending update:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to save pending update',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
