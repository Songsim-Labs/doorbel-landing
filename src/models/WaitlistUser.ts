import mongoose, { Document, Schema } from 'mongoose';

export interface IWaitlistUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  role: 'customer' | 'rider' | 'both';
  agreeToTerms: boolean;
  agreeToMarketing: boolean;
  status: 'pending' | 'confirmed' | 'launched';
  referralCode?: string;
  referredBy?: string;
  signupDate: Date;
  confirmationDate?: Date;
  launchNotificationSent?: boolean;
  metadata?: {
    userAgent?: string;
    ipAddress?: string;
    source?: string;
  };
}

const WaitlistUserSchema = new Schema<IWaitlistUser>({
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    match: [/^0\d{9}$/, 'Please enter a valid Ghana phone number']
  },
  city: {
    type: String,
    required: true,
    enum: ['accra', 'kumasi', 'takoradi', 'tamale', 'cape-coast', 'koforidua', 'sunyani', 'ho', 'bolgatanga', 'wa', 'other']
  },
  role: {
    type: String,
    required: true,
    enum: ['customer', 'rider', 'both']
  },
  agreeToTerms: {
    type: Boolean,
    required: true,
    default: false
  },
  agreeToMarketing: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'launched'],
    default: 'pending'
  },
  referralCode: {
    type: String,
    unique: true,
    sparse: true
  },
  referredBy: {
    type: String
  },
  signupDate: {
    type: Date,
    default: Date.now
  },
  confirmationDate: {
    type: Date
  },
  launchNotificationSent: {
    type: Boolean,
    default: false
  },
  metadata: {
    userAgent: String,
    ipAddress: String,
    source: String
  }
}, {
  timestamps: true
});

// Indexes for better performance
WaitlistUserSchema.index({ email: 1 });
WaitlistUserSchema.index({ phone: 1 });
WaitlistUserSchema.index({ city: 1 });
WaitlistUserSchema.index({ role: 1 });
WaitlistUserSchema.index({ status: 1 });
WaitlistUserSchema.index({ signupDate: -1 });

// Generate referral code before saving
WaitlistUserSchema.pre('save', function(next) {
  if (!this.referralCode) {
    const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.referralCode = `DB${randomCode}`;
  }
  next();
});

export default mongoose.models.WaitlistUser || mongoose.model<IWaitlistUser>('WaitlistUser', WaitlistUserSchema);
