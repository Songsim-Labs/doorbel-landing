'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

export default function DeleteAccountPage() {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    reason: '',
    confirmation: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate confirmation
    if (formData.confirmation.toUpperCase() !== 'DELETE') {
      setErrorMessage('Please type DELETE to confirm account deletion');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/delete-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          phone: formData.phone,
          reason: formData.reason
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit deletion request');
      }

      setSubmitStatus('success');
      setFormData({ email: '', phone: '', reason: '', confirmation: '' });
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
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

      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
          <div className="flex items-start space-x-3 mb-6">
            <AlertCircle className="h-8 w-8 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Deletion Request</h1>
              <p className="text-gray-600">
                We&apos;re sorry to see you go. Please read the information below before submitting your request.
              </p>
            </div>
          </div>

          {/* Important Information */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-red-900 mb-3">⚠️ Important Information</h2>
            <ul className="space-y-2 text-sm text-red-800">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span><strong>This action cannot be undone.</strong> Once your account is deleted, all your data will be permanently removed.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span><strong>Account Information:</strong> Your name, email, phone number, and profile will be deleted.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span><strong>Order History:</strong> All your past orders and delivery records will be removed.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span><strong>Saved Addresses:</strong> All saved delivery and pickup addresses will be deleted.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span><strong>Payment Methods:</strong> Saved payment methods will be removed.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span><strong>For Riders:</strong> Your earnings history, KYC documents, and payout information will be deleted.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span><strong>Processing Time:</strong> Account deletion will be processed within 30 days of your request.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span><strong>Legal Retention:</strong> Some data may be retained for legal, tax, or regulatory compliance purposes as required by law.</span>
              </li>
            </ul>
          </div>

          {/* Alternatives */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-blue-900 mb-3">💡 Consider These Alternatives</h2>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span><strong>Temporary Break:</strong> Simply stop using the app - no need to delete your account.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span><strong>Update Settings:</strong> Manage notification preferences and privacy settings in the app.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span><strong>Contact Support:</strong> If you&apos;re experiencing issues, our support team can help: <a href="mailto:support@doorbel.com" className="underline font-medium">support@doorbel.com</a></span>
              </li>
            </ul>
          </div>

          {/* Success Message */}
          {submitStatus === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold text-green-900 mb-2">Request Submitted Successfully</h3>
                  <p className="text-sm text-green-800 mb-4">
                    Your account deletion request has been received. You will receive an email confirmation shortly.
                  </p>
                  <p className="text-sm text-green-800 mb-2">
                    <strong>What happens next:</strong>
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-green-800 ml-4">
                    <li>Our team will review your request within 2-3 business days</li>
                    <li>You will receive a confirmation email with a verification link</li>
                    <li>Once verified, your account will be scheduled for deletion</li>
                    <li>Your account and data will be permanently deleted within 30 days</li>
                  </ol>
                  <p className="text-sm text-green-800 mt-4">
                    If you change your mind, please contact us at <a href="mailto:support@doorbel.com" className="underline font-medium">support@doorbel.com</a> before the deletion is finalized.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {submitStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-red-900 mb-1">Submission Failed</h3>
                  <p className="text-sm text-red-800">{errorMessage}</p>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-600">*</span>
              </label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your.email@example.com"
                className="w-full"
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500 mt-1">Enter the email associated with your DoorBel account</p>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number <span className="text-red-600">*</span>
              </label>
              <Input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+233 XX XXX XXXX"
                className="w-full"
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500 mt-1">Enter the phone number associated with your account</p>
            </div>

            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Deletion (Optional)
              </label>
              <Textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Please let us know why you're leaving (optional). Your feedback helps us improve."
                rows={4}
                className="w-full"
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500 mt-1">Help us understand how we can improve our service</p>
            </div>

            <div>
              <label htmlFor="confirmation" className="block text-sm font-medium text-gray-700 mb-2">
                Type DELETE to Confirm <span className="text-red-600">*</span>
              </label>
              <Input
                type="text"
                id="confirmation"
                name="confirmation"
                value={formData.confirmation}
                onChange={handleChange}
                required
                placeholder="DELETE"
                className="w-full"
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500 mt-1">Type the word DELETE in capital letters to confirm</p>
            </div>

            <div className="flex items-start space-x-2 bg-gray-50 p-4 rounded-lg">
              <input
                type="checkbox"
                id="acknowledge"
                required
                className="mt-1"
                disabled={isSubmitting}
              />
              <label htmlFor="acknowledge" className="text-sm text-gray-700">
                I understand that deleting my account is permanent and cannot be undone. All my data, including order history, saved addresses, and payment methods will be permanently deleted. <span className="text-red-600">*</span>
              </label>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting Request...
                  </>
                ) : (
                  'Submit Deletion Request'
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                asChild
                className="flex-1"
                disabled={isSubmitting}
              >
                <Link href="/">Cancel and Go Back</Link>
              </Button>
            </div>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Need Help?</h2>
            <p className="text-sm text-gray-600 mb-4">
              If you&apos;re experiencing issues with your account or have questions before deleting, please contact our support team:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
              <p><strong>Email:</strong> <a href="mailto:support@doorbel.com" className="text-green-600 hover:underline">support@doorbel.com</a></p>
              <p><strong>Phone:</strong> <a href="tel:+233246654390" className="text-green-600 hover:underline">+233 246 654 390</a></p>
              <p><strong>Hours:</strong> Monday - Saturday, 8:00 AM - 6:00 PM (GMT)</p>
            </div>
          </div>
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

