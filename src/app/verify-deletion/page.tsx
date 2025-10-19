'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

function VerificationContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link. Please check your email for the correct link.');
      return;
    }

    verifyToken(token);
  }, [token]);

  const verifyToken = async (verificationToken: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/v1/account-deletion/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: verificationToken }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('Your account deletion request has been verified successfully.');
      } else {
        setStatus('error');
        setMessage(data.message || 'Failed to verify deletion request.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('An error occurred while verifying your request. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/doorbel-logo.png"
                alt="DoorBel Logo"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="text-xl font-bold text-green-600">DoorBel</span>
            </Link>
            <Button variant="ghost" asChild>
              <Link href="/" className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Home</span>
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
          {status === 'loading' && (
            <div className="text-center py-12">
              <Loader2 className="h-16 w-16 text-green-600 animate-spin mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifying Your Request</h1>
              <p className="text-gray-600">Please wait while we verify your account deletion request...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center py-12">
              <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Verification Successful</h1>
              <p className="text-gray-600 mb-8">{message}</p>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-left mb-8">
                <h2 className="text-lg font-semibold text-green-900 mb-3">What Happens Next?</h2>
                <ol className="list-decimal list-inside space-y-2 text-sm text-green-800">
                  <li>Our team will review your verified deletion request within 2-3 business days</li>
                  <li>You will receive an email notification when the deletion process begins</li>
                  <li>Your account and all associated data will be permanently deleted within 30 days</li>
                  <li>You will receive a final confirmation email once the deletion is complete</li>
                </ol>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-left mb-8">
                <h2 className="text-lg font-semibold text-blue-900 mb-3">Changed Your Mind?</h2>
                <p className="text-sm text-blue-800">
                  If you want to cancel your deletion request, please contact our support team as soon as possible at{' '}
                  <a href="mailto:support@doorbel.com" className="underline font-medium">support@doorbel.com</a> or call{' '}
                  <a href="tel:+233246654390" className="underline font-medium">+233 246 654 390</a>.
                </p>
                <p className="text-sm text-blue-800 mt-2">
                  <strong>Important:</strong> Once the deletion process has started, it cannot be reversed.
                </p>
              </div>

              <Button asChild className="w-full sm:w-auto">
                <Link href="/">Return to Home</Link>
              </Button>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center py-12">
              <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Verification Failed</h1>
              <p className="text-gray-600 mb-8">{message}</p>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-left mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Need Help?</h2>
                <p className="text-sm text-gray-600 mb-4">
                  If you believe this is an error or need assistance, please contact our support team:
                </p>
                <div className="space-y-2 text-sm">
                  <p><strong>Email:</strong> <a href="mailto:support@doorbel.com" className="text-green-600 hover:underline">support@doorbel.com</a></p>
                  <p><strong>Phone:</strong> <a href="tel:+233246654390" className="text-green-600 hover:underline">+233 246 654 390</a></p>
                  <p><strong>Hours:</strong> Monday - Saturday, 8:00 AM - 6:00 PM (GMT)</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="outline">
                  <Link href="/delete-account">Submit New Request</Link>
                </Button>
                <Button asChild>
                  <Link href="/">Return to Home</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 DoorBel. All rights reserved.
          </p>
          <div className="flex justify-center space-x-6 mt-4">
            <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</Link>
            <Link href="/delete-account" className="text-gray-400 hover:text-white text-sm transition-colors">Delete Account</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function VerifyDeletionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-16 w-16 text-green-600 animate-spin" />
      </div>
    }>
      <VerificationContent />
    </Suspense>
  );
}

