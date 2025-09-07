import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import WaitlistUser from '@/models/WaitlistUser';
import { sendBulkMarketingEmail, sendBulkLaunchAnnouncement } from '@/lib/marketingEmail';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { 
      type, 
      subject, 
      content, 
      templateId, 
      targetAudience,
      isLaunch = false 
    } = body;

    // Build filter based on target audience
    const filter: any = {};
    if (targetAudience.cities && targetAudience.cities.length > 0) {
      filter.city = { $in: targetAudience.cities };
    }
    if (targetAudience.roles && targetAudience.roles.length > 0) {
      filter.role = { $in: targetAudience.roles };
    }
    if (targetAudience.status && targetAudience.status.length > 0) {
      filter.status = { $in: targetAudience.status };
    }

    console.log('Campaign filter:', filter);

    // Get recipients
    const recipients = await WaitlistUser.find(filter)
      .select('email firstName city role status')
      .lean();

    console.log('Found recipients:', recipients.length, recipients.map(r => ({ email: r.email, status: r.status })));

    if (recipients.length === 0) {
      return NextResponse.json(
        { 
          error: 'No recipients found for the specified criteria',
          stats: {
            total: 0,
            sent: 0,
            failed: 0,
            results: []
          }
        },
        { status: 400 }
      );
    }

    let results;
    
    if (type === 'confirm') {
      // Confirm users (no email sending, just status update)
      await WaitlistUser.updateMany(
        { _id: { $in: recipients.map(r => r._id) } },
        { status: 'confirmed' }
      );
      
      results = recipients.map(r => ({
        ...r,
        result: { success: true, messageId: 'confirmed' }
      }));
    } else if (isLaunch) {
      // Send launch announcements
      results = await sendBulkLaunchAnnouncement(
        recipients.map(r => ({
          email: r.email,
          firstName: r.firstName,
          city: r.city,
          role: r.role
        }))
      );
      
      // Update user status to launched
      await WaitlistUser.updateMany(
        { _id: { $in: recipients.map(r => r._id) } },
        { 
          status: 'launched',
          launchNotificationSent: true 
        }
      );
    } else {
      // Send marketing emails
      results = await sendBulkMarketingEmail(
        recipients.map(r => ({
          email: r.email,
          firstName: r.firstName,
          city: r.city,
          role: r.role
        })),
        subject,
        content,
        templateId
      );
    }

    const successCount = results.filter(r => r.result && r.result.success).length;
    const failureCount = results.length - successCount;

    console.log('Campaign results:', { successCount, failureCount, total: recipients.length });

    const message = type === 'confirm' 
      ? `Successfully confirmed ${successCount} users`
      : `Campaign sent successfully`;

    return NextResponse.json({
      message,
      stats: {
        total: recipients.length,
        sent: successCount,
        failed: failureCount,
        results
      }
    });

  } catch (error) {
    console.error('Campaign error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get campaign statistics
    const stats = await WaitlistUser.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          byCity: { $push: '$city' },
          byRole: { $push: '$role' },
          byStatus: { $push: '$status' },
          confirmed: { $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] } },
          launched: { $sum: { $cond: [{ $eq: ['$status', 'launched'] }, 1, 0] } },
          marketingOptIn: { $sum: { $cond: ['$agreeToMarketing', 1, 0] } }
        }
      }
    ]);

    // Get recent signups (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentSignups = await WaitlistUser.aggregate([
      {
        $match: {
          signupDate: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$signupDate'
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Get city distribution
    const cityStats = await WaitlistUser.aggregate([
      {
        $group: {
          _id: '$city',
          count: { $sum: 1 },
          confirmed: { $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] } },
          launched: { $sum: { $cond: [{ $eq: ['$status', 'launched'] }, 1, 0] } }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Get role distribution
    const roleStats = await WaitlistUser.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    return NextResponse.json({
      stats: stats[0] || { total: 0, byCity: [], byRole: [], byStatus: [], confirmed: 0, launched: 0, marketingOptIn: 0 },
      recentSignups,
      cityStats,
      roleStats
    });

  } catch (error) {
    console.error('Get campaign stats error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
