# Waitlist & Campaigns Setup Guide

This guide explains how to configure the integrated landing page and waitlist management system in the DoorBel Admin Dashboard.

## Overview

The admin dashboard now includes:
- **Public Landing Page** at `/` (root)
- **Waitlist Registration** at `/waitlist`
- **Privacy Policy** at `/privacy`
- **Terms of Service** at `/terms`
- **Admin Waitlist Management** at `/dashboard/waitlist`
- **Email Campaign Builder** at `/dashboard/campaigns/builder`

## Environment Configuration

### 1. MongoDB Setup

The waitlist system requires a MongoDB database connection.

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/doorbel-waitlist?retryWrites=true&w=majority
```

**Steps:**
1. Create a MongoDB Atlas account (free tier available)
2. Create a new cluster
3. Create a database called `doorbel-waitlist`
4. Get the connection string and replace username/password
5. Add the connection string to `.env.local`

### 2. Email Configuration (SMTP)

For sending waitlist confirmation and campaign emails:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@doorbel.com
ADMIN_EMAIL=admin@doorbel.com
```

**Gmail Setup:**
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account → Security → 2-Step Verification → App Passwords
   - Select "Mail" and "Other (Custom name)"
   - Copy the 16-character password
3. Use the app password as `SMTP_PASS`

**Other SMTP Providers:**
- **SendGrid**: Free tier (100 emails/day)
- **Mailgun**: Free tier (5,000 emails/month)
- **AWS SES**: Pay-as-you-go

### 3. Complete Environment File

Create a `.env.local` file in the `doorbel-admin-web` directory with:

```env
# Backend API (Existing)
NEXT_PUBLIC_API_URL=https://doorbel-api.onrender.com
NEXT_PUBLIC_WS_URL=https://doorbel-api.onrender.com

# MongoDB (New - for Waitlist)
MONGODB_URI=mongodb+srv://...

# Email (New - for Waitlist Emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@doorbel.com
ADMIN_EMAIL=admin@doorbel.com
```

## Features

### Public Pages (No Authentication Required)

#### Landing Page (`/`)
- Hero section with CTA buttons
- Feature showcase (6 features)
- How it works (3 steps)
- Benefits section
- Stats section
- Footer with navigation

#### Waitlist Page (`/waitlist`)
- Registration form with validation
- Real-time form validation
- Email confirmation
- Referral code generation
- Success page with next steps
- Toast notifications

### Admin Pages (Authentication Required)

#### Waitlist Management (`/dashboard/waitlist`)
**Features:**
- Data table with all waitlist users
- Advanced filtering:
  - Search by name, email, phone
  - Filter by status (pending/confirmed/launched)
  - Filter by role (customer/rider/both)
  - Filter by city
- Stats cards showing:
  - Total users
  - Pending count
  - Confirmed count
  - Marketing opt-in count
- User details modal
- Export to CSV
- Bulk actions:
  - Confirm all pending users
  - Send launch announcement

#### Campaigns Overview (`/dashboard/campaigns`)
**Features:**
- Campaign statistics dashboard
- Signup trend chart (last 30 days)
- Role distribution pie chart
- City distribution bar chart
- Quick actions:
  - Send launch announcement
  - Confirm pending users
- Link to campaign builder

#### Campaign Builder (`/dashboard/campaigns/builder`)
**Features:**
- **WYSIWYG Email Editor** (Tiptap):
  - Rich text formatting (bold, italic, headings)
  - Lists (ordered/unordered)
  - Text alignment
  - Insert links and images
  - Undo/redo
  - Template variables support
- **Email Configuration:**
  - Subject line input
  - Template selector (Welcome, Marketing, Launch)
- **Audience Targeting:**
  - Filter by status (pending/confirmed/launched)
  - Filter by role (customer/rider/both)
  - Filter by city (multi-select)
  - Marketing opt-in only checkbox
  - Real-time audience count preview
- **Preview:**
  - Rendered HTML preview
  - Raw HTML code view
  - Template variable substitution preview
- **Actions:**
  - Send campaign
  - Test send (to admin email)
  - Save as draft (coming soon)

## Workflow

### Waitlist Signup Flow

1. User visits `/waitlist`
2. Fills out registration form
3. Form validates:
   - All required fields filled
   - Valid email format
   - Valid Ghana phone number (0XXXXXXXXX)
   - Terms agreed to
4. Submits form → POST `/api/waitlist`
5. Backend:
   - Checks for duplicate email/phone
   - Creates waitlist user in MongoDB
   - Generates unique referral code (DBXXXXXX)
   - Sends welcome email with referral code
   - Sends admin notification email
   - Updates status to 'confirmed'
6. User sees success page
7. User receives welcome email

### Campaign Creation Flow

1. Admin navigates to `/dashboard/campaigns`
2. Clicks "New Campaign"
3. Redirects to `/dashboard/campaigns/builder`
4. Admin:
   - Selects email template
   - Enters subject line
   - Composes content with WYSIWYG editor
   - Targets audience (status, role, city)
   - Previews email
   - Sends test (optional)
5. Clicks "Send Campaign"
6. Confirms send
7. Backend:
   - Queries MongoDB for matching users
   - Sends emails in batches (100ms delay between emails)
   - Returns success/failure counts
8. Admin sees success toast with stats

### Launch Announcement Flow

1. Admin navigates to `/dashboard/campaigns`
2. Clicks "Send Launch Announcement"
3. Confirms action
4. Backend:
   - Finds all confirmed users
   - Sends launch email to each
   - Updates status to 'launched'
   - Sets `launchNotificationSent` flag
5. Admin sees success notification

## Database Collections

### WaitlistUser Collection

```typescript
{
  _id: ObjectId,
  firstName: string,
  lastName: string,
  email: string (unique),
  phone: string (unique, Ghana format),
  city: enum[accra, kumasi, ...],
  role: enum[customer, rider, both],
  agreeToTerms: boolean,
  agreeToMarketing: boolean,
  status: enum[pending, confirmed, launched],
  referralCode: string (auto-generated, unique),
  referredBy: string (optional),
  signupDate: Date (auto),
  confirmationDate: Date (auto),
  launchNotificationSent: boolean,
  metadata: {
    userAgent: string,
    ipAddress: string,
    source: string
  },
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- email, phone, city, role, status, signupDate

## Email Templates

### Template Variables

Available in all emails:
- `{{firstName}}` - User's first name
- `{{lastName}}` - User's last name
- `{{city}}` - User's city
- `{{referralCode}}` - User's referral code
- `{{subject}}` - Custom subject (marketing emails)
- `{{content}}` - Custom content (marketing emails)

### Pre-built Templates

1. **Welcome Email** (`welcome`)
   - Sent automatically on signup
   - Includes referral code
   - Lists early access benefits
   - Call-to-action to visit website

2. **Marketing Email** (`marketing`)
   - Customizable subject and content
   - DoorBel branded header
   - Unsubscribe link
   - Best for updates and announcements

3. **Launch Announcement** (`launch`)
   - Sent when launching to users
   - Includes app download links
   - Special rider benefits (conditional)
   - Call-to-action to get started

## API Routes

### POST /api/waitlist
Create a new waitlist user

**Request:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "0201234567",
  "city": "accra",
  "role": "customer",
  "agreeToTerms": true,
  "agreeToMarketing": true
}
```

**Response:**
```json
{
  "message": "Successfully joined waitlist!",
  "referralCode": "DBXY12Z"
}
```

### GET /api/waitlist
List waitlist users (with pagination & filters)

**Query Params:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `city` - Filter by city
- `role` - Filter by role
- `status` - Filter by status
- `search` - Search by name, email, phone

**Response:**
```json
{
  "users": [...],
  "pagination": { "page": 1, "limit": 10, "total": 100, "pages": 10 },
  "stats": { "total": 100, "pending": 20, "confirmed": 70, "launched": 10, ... }
}
```

### POST /api/campaigns
Send email campaign

**Request:**
```json
{
  "type": "marketing",
  "subject": "DoorBel Update",
  "content": "<p>Hello {{firstName}}, we have exciting news!</p>",
  "templateId": "marketing",
  "targetAudience": {
    "cities": ["accra", "kumasi"],
    "roles": ["customer"],
    "status": ["confirmed"]
  }
}
```

**Response:**
```json
{
  "message": "Campaign sent successfully",
  "stats": {
    "total": 100,
    "sent": 98,
    "failed": 2,
    "results": [...]
  }
}
```

### GET /api/campaigns
Get campaign statistics

**Response:**
```json
{
  "stats": { "total": 500, "confirmed": 400, "launched": 50, ... },
  "recentSignups": [...],
  "cityStats": [...],
  "roleStats": [...]
}
```

## Troubleshooting

### Email Not Sending

1. **Check SMTP credentials:**
   - Verify `SMTP_USER` and `SMTP_PASS` are correct
   - For Gmail, ensure app password is used (not regular password)
   - Check that 2FA is enabled on Gmail

2. **Check firewall/network:**
   - Ensure port 587 is not blocked
   - Try port 465 with `secure: true` in transporter config

3. **Check logs:**
   - Look for error messages in console
   - Verify transporter is being created successfully

### MongoDB Connection Issues

1. **Connection string:**
   - Verify `MONGODB_URI` is correctly formatted
   - Check username/password don't contain special characters (URL encode if needed)
   - Ensure IP whitelist includes your deployment IP (or use 0.0.0.0/0 for development)

2. **Network access:**
   - In MongoDB Atlas, add your IP to Network Access
   - For Vercel/production, add `0.0.0.0/0` or specific IPs

### Waitlist Form Not Submitting

1. **Check API route:**
   - Verify `/api/waitlist/route.ts` exists
   - Check browser console for errors
   - Verify fetch is hitting correct endpoint

2. **Validation errors:**
   - Phone must be 10 digits starting with 0
   - Email must be valid format
   - All required fields must be filled

## Production Deployment

### Environment Variables

Add all environment variables to your deployment platform (Vercel, Netlify, etc.):
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_WS_URL`
- `MONGODB_URI`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`
- `ADMIN_EMAIL`

### Build Command

```bash
pnpm build
```

### Start Command

```bash
pnpm start
```

## Support

For issues or questions:
- Email: support@doorbel.com
- Check logs in browser console and server logs
- Verify all environment variables are set correctly

