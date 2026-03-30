import connectDB from '@/app/lib/mongodb';
import Astrologer from '@/app/models/Astrologer';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

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

    if (!astrologer.pendingUpdates) {
      return NextResponse.json(
        {
          success: false,
          error: 'No pending updates found for this astrologer',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: astrologer,
    });
  } catch (error: any) {
    console.error('Error fetching pending update:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch pending update',
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

    if (!astrologer.pendingUpdates) {
      return NextResponse.json(
        {
          success: false,
          error: 'No pending updates to approve',
        },
        { status: 404 }
      );
    }

    const approvedData = { ...astrologer.pendingUpdates, pendingUpdates: null };
    const updatedAstrologer = await Astrologer.findByIdAndUpdate(
      id,
      { $set: approvedData },
      { new: true, runValidators: false }
    );

    if (!updatedAstrologer) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to approve pending update',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedAstrologer,
      message: 'Pending update approved successfully',
    });
  } catch (error: any) {
    console.error('Error approving pending update:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to approve pending update',
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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid astrologer ID',
        },
        { status: 400 }
      );
    }

    const astrologer = await Astrologer.findByIdAndUpdate(
      id,
      { pendingUpdates: null },
      { new: true }
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
      message: 'Pending update rejected successfully',
    });
  } catch (error: any) {
    console.error('Error rejecting pending update:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to reject pending update',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
