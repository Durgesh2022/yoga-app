import { NextRequest, NextResponse } from 'next/server';
import connectDB from './../../../lib/mongodb';
import Astrologer from './../../../models/Astrologer';
import mongoose from 'mongoose';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid astrologer ID',
        },
        { status: 400 }
      );
    }

    const astrologer = await Astrologer.findById(id);

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
    });
  } catch (error: any) {
    console.error('Error fetching astrologer:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch astrologer',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid astrologer ID',
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    const astrologer = await Astrologer.findByIdAndUpdate(
      id,
      body,
      {
        new: true,
        runValidators: true,
      }
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
      message: 'Astrologer updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating astrologer:', error);

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
        error: 'Failed to update astrologer',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid astrologer ID',
        },
        { status: 400 }
      );
    }

    const astrologer = await Astrologer.findByIdAndDelete(id);

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
      data: {},
      message: 'Astrologer deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting astrologer:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete astrologer',
        message: error.message,
      },
      { status: 500 }
    );
  }
}