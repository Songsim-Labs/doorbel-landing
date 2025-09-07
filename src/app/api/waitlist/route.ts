import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import WaitlistUser from '@/models/WaitlistUser';
import { sendWelcomeEmail, sendAdminNotification } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { firstName, lastName, email, phone, city, role, agreeToTerms, agreeToMarketing } = body;

    // Validation
    if (!firstName || !lastName || !email || !phone || !city || !role || !agreeToTerms) {
      return NextResponse.json(
        { message: 'All required fields must be filled' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await WaitlistUser.findOne({ 
      $or: [{ email }, { phone }] 
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Email or phone number already registered' },
        { status: 409 }
      );
    }

    // Get client IP and user agent
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Create new waitlist user
    const newUser = new WaitlistUser({
      firstName,
      lastName,
      email,
      phone,
      city,
      role,
      agreeToTerms,
      agreeToMarketing,
      status: 'pending',
      metadata: {
        ipAddress,
        userAgent,
        source: 'waitlist_page'
      }
    });

    await newUser.save();

    // Send welcome email
    try {
      await sendWelcomeEmail(email, firstName, newUser.referralCode!);
      newUser.status = 'confirmed';
      newUser.confirmationDate = new Date();
      await newUser.save();
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the signup if email fails
    }

    // Send admin notification
    try {
      await sendAdminNotification({
        firstName,
        lastName,
        email,
        phone,
        city,
        role,
        agreeToMarketing
      });
    } catch (adminEmailError) {
      console.error('Admin notification failed:', adminEmailError);
      // Don't fail the signup if admin email fails
    }

    return NextResponse.json(
      { 
        message: 'Successfully joined waitlist!',
        referralCode: newUser.referralCode
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Waitlist signup error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const city = searchParams.get('city');
    const role = searchParams.get('role');
    const status = searchParams.get('status');

    // Build filter
    const filter: Record<string, unknown> = {};
    if (city) filter.city = city;
    if (role) filter.role = role;
    if (status) filter.status = status;

    // Get total count
    const total = await WaitlistUser.countDocuments(filter);

    // Get users with pagination
    const users = await WaitlistUser.find(filter)
      .sort({ signupDate: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('-__v');

    // Get statistics
    const stats = await WaitlistUser.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          byCity: { $push: '$city' },
          byRole: { $push: '$role' },
          byStatus: { $push: '$status' }
        }
      }
    ]);

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      stats: stats[0] || { total: 0, byCity: [], byRole: [], byStatus: [] }
    });

  } catch (error) {
    console.error('Get waitlist error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
