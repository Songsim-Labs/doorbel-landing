# DoorBel Admin Dashboard

A comprehensive admin dashboard for managing the DoorBel delivery platform built with Next.js 15, TypeScript, and shadcn/ui.

## Features

### Public Pages (No Authentication Required)
- **Landing Page**: Marketing website with hero, features, and CTA at `/`
- **Waitlist Registration**: User signup form with email confirmation at `/waitlist`
- **Privacy Policy**: Comprehensive privacy policy at `/privacy`
- **Terms of Service**: Legal terms and conditions at `/terms`

### Admin Dashboard (Authentication Required)
- **Dashboard**: Real-time statistics and metrics
- **Order Management**: Track and manage all delivery orders
- **Rider Management**: View and manage delivery riders
- **KYC Approvals**: Review and approve rider verification documents
- **Payment Tracking**: Monitor all transactions and payouts
- **Waitlist Management**: View and manage waitlist signups
- **Email Campaigns**: Create and send marketing emails with WYSIWYG editor
- **Support Tickets**: Manage customer and rider support tickets
- **Real-time Updates**: WebSocket integration for live updates
- **Analytics**: Platform performance insights

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **State Management**: React Context + Custom Hooks
- **API Client**: Axios
- **Real-time**: Socket.io Client
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- pnpm (recommended) or npm
- MongoDB Atlas account (for waitlist system)
- SMTP email account (Gmail, SendGrid, etc.)

### Installation

```bash
# Install dependencies
pnpm install

# Create environment file
cp .env.example .env.local

# Update environment variables
# See WAITLIST_SETUP_GUIDE.md for detailed configuration
```

### Environment Variables

**Required for Admin Dashboard:**
```env
NEXT_PUBLIC_API_URL=https://doorbel-api.onrender.com
NEXT_PUBLIC_WS_URL=https://doorbel-api.onrender.com
```

**Required for Waitlist & Campaigns:**
```env
MONGODB_URI=mongodb+srv://...
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@doorbel.com
ADMIN_EMAIL=admin@doorbel.com
```

See `WAITLIST_SETUP_GUIDE.md` for detailed setup instructions.

### Development

```bash
# Run development server
pnpm dev

# Open http://localhost:3000
```

### Build

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── login/             # Login page
│   └── dashboard/         # Admin dashboard pages
│       ├── page.tsx       # Dashboard home
│       ├── orders/        # Orders management
│       ├── riders/        # Riders management
│       │   └── kyc/       # KYC approvals
│       ├── payments/      # Payments tracking
│       ├── analytics/     # Analytics (coming soon)
│       └── settings/      # Settings (coming soon)
├── components/
│   ├── admin/             # Admin-specific components
│   │   ├── layout/        # Layout components
│   │   ├── DataTable.tsx  # Reusable data table
│   │   ├── StatsCard.tsx  # Statistics card
│   │   ├── StatusBadge.tsx# Status indicators
│   │   ├── OrderTimeline.tsx
│   │   └── DocumentViewer.tsx
│   └── ui/                # shadcn/ui components
├── contexts/              # React contexts
│   ├── AuthContext.tsx    # Authentication
│   └── WebSocketContext.tsx
├── hooks/                 # Custom React hooks
│   ├── useStats.ts
│   ├── useOrders.ts
│   └── useRiders.ts
├── lib/                   # Utilities
│   ├── api-client.ts      # API client
│   ├── websocket-client.ts
│   ├── config.ts
│   └── utils.ts
└── types/                 # TypeScript types
    ├── admin.ts
    ├── rider.ts
    ├── order.ts
    ├── payment.ts
    └── stats.ts
```

## Color Theme

The dashboard uses DoorBel's brand colors:

- **Primary**: Green (#22C55E)
- **Secondary**: Amber (#F59E0B)
- **Status Colors**: Success, Warning, Error, Info
- **Supports**: Light and Dark modes

## Authentication

The admin dashboard uses JWT-based authentication:

1. Login with admin credentials
2. Tokens stored in secure httpOnly cookies
3. Automatic token refresh
4. Protected routes via middleware

## API Integration

All backend API calls are handled through the `apiClient` service:

- Base URL: `https://doorbel-api.onrender.com/api/v1`
- Authentication: Bearer token
- Error handling: Automatic 401 redirect
- Real-time: WebSocket for live updates

## Key Pages

### Public Pages

#### Landing Page (`/`)
- Hero section with CTA
- Feature showcase (6 features)
- How it works (3 steps)
- Benefits section
- Footer with navigation

#### Waitlist (`/waitlist`)
- Registration form with validation
- Email confirmation
- Referral code generation
- Success page

### Admin Pages

#### Dashboard (`/dashboard`)
- Overview statistics
- Order trends chart
- Revenue chart
- Recent activity feed
- Quick actions

#### Orders (`/dashboard/orders`)
- Searchable data table
- Advanced filtering (status, payment, dates)
- Order details modal
- Real-time status updates
- Export to CSV

#### Riders (`/dashboard/riders`)
- Rider list with filtering
- Rider profile details
- Performance metrics
- Payout account info

#### KYC Approvals (`/dashboard/riders/kyc`)
- Pending/Approved/Rejected tabs
- Document preview cards
- Full-screen document viewer
- Approve/Reject with reason
- Real-time new submissions

#### Payments (`/dashboard/payments`)
- Transaction history
- Payment statistics
- Filter by status, type, date
- Transaction details
- Paystack integration data

#### Waitlist Management (`/dashboard/waitlist`)
- User data table with filtering
- Stats cards (total, pending, confirmed)
- User details modal
- Export to CSV
- Bulk actions (confirm, launch)

#### Campaigns (`/dashboard/campaigns`)
- Campaign statistics
- Signup trends and analytics
- Quick launch actions
- Link to campaign builder

#### Campaign Builder (`/dashboard/campaigns/builder`)
- WYSIWYG email editor (Tiptap)
- Template selector
- Audience targeting
- Preview (rendered & HTML)
- Send campaign with progress tracking

## Development

### Adding New Pages

1. Create page in `src/app/dashboard/`
2. Add route to sidebar navigation
3. Create types in `src/types/`
4. Add API methods to `api-client.ts`
5. Create custom hook if needed

### Adding Components

Use shadcn/ui CLI:

```bash
npx shadcn@latest add [component-name]
```

## License

Proprietary - DoorBel Delivery Platform
