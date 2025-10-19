import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, phone, reason } = body;

    // Validation
    if (!email || !phone) {
      return NextResponse.json(
        { message: 'Email and phone number are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const connection = await connectDB();
    const db = connection.connection.db;
    const deletionRequestsCollection = db.collection('account_deletion_requests');

    // Check if there's already a pending request
    const existingRequest = await deletionRequestsCollection.findOne({
      email: email.toLowerCase(),
      status: { $in: ['pending', 'processing'] }
    });

    if (existingRequest) {
      return NextResponse.json(
        { message: 'You already have a pending deletion request. Please check your email for status updates.' },
        { status: 400 }
      );
    }

    // Create deletion request
    const deletionRequest = {
      email: email.toLowerCase(),
      phone,
      reason: reason || '',
      status: 'pending',
      submittedAt: new Date(),
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      verificationToken: generateVerificationToken(),
      verifiedAt: null,
      processedAt: null,
      completedAt: null,
      notes: ''
    };

    await deletionRequestsCollection.insertOne(deletionRequest);

    // Send notification email to admin (you can implement this later)
    // await sendAdminNotification(deletionRequest);

    // Send confirmation email to user (you can implement this later)
    // await sendUserConfirmation(email, deletionRequest.verificationToken);

    return NextResponse.json(
      {
        success: true,
        message: 'Account deletion request submitted successfully. You will receive a confirmation email shortly.'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error processing deletion request:', error);
    return NextResponse.json(
      { message: 'An error occurred while processing your request. Please try again later.' },
      { status: 500 }
    );
  }
}

// Generate a random verification token
function generateVerificationToken(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15) +
         Date.now().toString(36);
}

