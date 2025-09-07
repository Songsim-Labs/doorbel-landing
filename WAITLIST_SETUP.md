# DoorBel Waitlist System Setup Guide

## 🚀 Overview

The waitlist system is now fully implemented with:
- ✅ Waitlist signup page (`/waitlist`)
- ✅ MongoDB database integration
- ✅ Email notifications (welcome emails)
- ✅ Hidden admin dashboard (`/admin/waitlist`)
- ✅ API endpoints for data management
- ✅ CSV export functionality

## 📋 Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the `doorbel-landing` directory:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/doorbel-waitlist
# For production: mongodb+srv://username:password@cluster.mongodb.net/doorbel-waitlist

# Email Configuration (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@doorbel.com

# Admin Configuration
ADMIN_EMAIL=admin@doorbel.com
```

### 2. MongoDB Setup

#### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use: `MONGODB_URI=mongodb://localhost:27017/doorbel-waitlist`

#### Option B: MongoDB Atlas (Recommended)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get connection string
4. Use: `MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/doorbel-waitlist`

### 3. Email Setup (Gmail)

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use the app password in `SMTP_PASS`

### 4. Start the Application

```bash
cd doorbel-landing
pnpm dev
```

## 📱 Pages & Features

### Waitlist Signup Page (`/waitlist`)
- **Features:**
  - User-friendly signup form
  - City selection (Ghana cities)
  - Role selection (Customer/Rider/Both)
  - Terms and marketing consent
  - Real-time validation
  - Success confirmation page

### Admin Dashboard (`/admin/waitlist`)
- **Features:**
  - View all waitlist signups
  - Filter by city, role, status
  - Search functionality
  - Export to CSV
  - Analytics and statistics
  - Pagination

### API Endpoints

#### POST `/api/waitlist`
- **Purpose:** Add new user to waitlist
- **Body:** User signup data
- **Response:** Success/error message

#### GET `/api/waitlist`
- **Purpose:** Retrieve waitlist data (admin)
- **Query params:** page, limit, city, role, status
- **Response:** Users data with pagination

## 📊 Data Model

### WaitlistUser Schema
```typescript
{
  firstName: string;
  lastName: string;
  email: string; // unique
  phone: string;
  city: string;
  role: 'customer' | 'rider' | 'both';
  agreeToTerms: boolean;
  agreeToMarketing: boolean;
  status: 'pending' | 'confirmed' | 'launched';
  referralCode: string; // auto-generated
  signupDate: Date;
  confirmationDate?: Date;
  launchNotificationSent?: boolean;
  metadata: {
    userAgent?: string;
    ipAddress?: string;
    source?: string;
  };
}
```

## 🎯 User Journey

1. **Landing Page** → User clicks "Join Waitlist"
2. **Waitlist Page** → User fills form and submits
3. **API Processing** → Data saved to MongoDB
4. **Email Sent** → Welcome email with referral code
5. **Admin Notification** → Admin gets notified of new signup
6. **Success Page** → User sees confirmation

## 🔧 Admin Features

### Dashboard Access
- Navigate to `/admin/waitlist`
- View real-time statistics
- Filter and search users
- Export data to CSV
- Monitor signup trends

### Email Management
- Welcome emails sent automatically
- Admin notifications for new signups
- Customizable email templates

## 🚀 Launch Strategy

### Pre-Launch
1. **Marketing Campaign** → Drive traffic to landing page
2. **Waitlist Collection** → Capture interested users
3. **Email Nurturing** → Send updates and build anticipation
4. **Referral Program** → Users share referral codes

### Launch Day
1. **Email Blast** → Notify all waitlist users
2. **App Launch** → Direct users to download app
3. **Special Offers** → Honor early access benefits

## 📈 Analytics & Tracking

### Key Metrics to Monitor
- Total signups
- Signups by city
- Signups by role (customer/rider)
- Email open rates
- Referral code usage
- Conversion to app downloads

### Admin Dashboard Features
- Real-time signup count
- Geographic distribution
- Role distribution
- Weekly/monthly trends
- Export capabilities

## 🔒 Security Features

- Input validation and sanitization
- Email format validation
- Phone number validation (Ghana format)
- Duplicate email/phone prevention
- IP address tracking
- User agent logging

## 🎨 Customization

### Email Templates
- Edit `src/lib/email.ts`
- Customize welcome email HTML
- Add your branding and colors

### Form Fields
- Modify `src/app/waitlist/page.tsx`
- Add/remove form fields
- Update validation rules

### Admin Dashboard
- Customize `src/app/admin/waitlist/page.tsx`
- Add new filters or analytics
- Modify export format

## 🚀 Next Steps

1. **Set up environment variables**
2. **Configure MongoDB**
3. **Set up email service**
4. **Test the complete flow**
5. **Launch marketing campaign**
6. **Monitor and optimize**

## 📞 Support

For technical issues or questions:
- Check the console logs for errors
- Verify environment variables
- Test email configuration
- Check MongoDB connection

The waitlist system is now ready to capture early interest and build your user base before the full app launch! 🎉
