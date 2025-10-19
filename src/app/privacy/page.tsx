import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | DoorBel',
  description: 'Privacy Policy for DoorBel delivery platform - Learn how we collect, use, and protect your personal information.',
};

export default function PrivacyPolicyPage() {
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

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-sm text-gray-600 mb-8">Last updated: October 15, 2025</p>

          <div className="space-y-8 text-gray-700">
            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
              <p className="mb-4">
                DoorBel collects information to provide, improve, and protect our services. We collect information you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Account information (name, email address, phone number)</li>
                <li>Delivery addresses and contact details</li>
                <li>Payment information (processed securely through Paystack)</li>
                <li>Order history and delivery preferences</li>
                <li>Profile photo and identification documents (for riders only)</li>
                <li>Communications with customer support</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Information We Collect Automatically</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Location Information:</strong> We collect precise location data from riders during active deliveries to enable real-time tracking. For customers, we collect location data when you use our services to provide accurate delivery addresses.</li>
                <li><strong>Device Information:</strong> Device type, operating system, unique device identifiers, mobile network information</li>
                <li><strong>Usage Information:</strong> App interactions, features used, time spent, and performance data</li>
                <li><strong>Push Notification Tokens:</strong> To send you order updates and important notifications</li>
              </ul>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
              <p className="mb-4">We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Process and fulfill your delivery orders</li>
                <li>Enable real-time order tracking and rider location sharing</li>
                <li>Process payments securely through our payment partners</li>
                <li>Send you notifications about your orders, deliveries, and account</li>
                <li>Communicate with you about your orders and respond to support inquiries</li>
                <li>Verify rider identity and conduct background checks (KYC)</li>
                <li>Detect and prevent fraud, abuse, and security incidents</li>
                <li>Improve our services, develop new features, and conduct research</li>
                <li>Send promotional offers and marketing communications (with your consent)</li>
                <li>Comply with legal obligations and enforce our terms</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Location Information & Background Tracking</h2>
              <p className="mb-4">
                DoorBel uses location services to provide core functionality of our delivery platform:
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">For Customers</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Location is collected when creating orders to set pickup and delivery addresses</li>
                <li>Real-time tracking of your delivery on a map</li>
                <li>Location data is only collected when the app is in use</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">For Riders</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Background Location Tracking:</strong> When you accept a delivery and go online, we collect your location in the background (even when the app is not active) to provide real-time tracking to customers and optimize delivery routes</li>
                <li>Background tracking only occurs when you are actively on duty and have an assigned delivery</li>
                <li>You can stop background tracking by going offline or completing your deliveries</li>
                <li>Location data helps us calculate distance-based earnings and ensure delivery accuracy</li>
              </ul>

              <p className="mt-4">
                We retain location data for completed deliveries for up to 90 days for support purposes, after which it is anonymized or deleted.
              </p>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Information Sharing and Disclosure</h2>
              <p className="mb-4">We share your information only as necessary and in the following circumstances:</p>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">With Service Providers</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Delivery Riders:</strong> We share your name, phone number, and delivery addresses with assigned riders to fulfill your orders</li>
                <li><strong>Payment Processors:</strong> Payment information is shared with Paystack and mobile money providers to process transactions</li>
                <li><strong>SMS and Email Services:</strong> To send notifications and communications</li>
                <li><strong>Cloud Storage Providers:</strong> For secure data storage (Cloudinary for images)</li>
                <li><strong>Error Tracking Services:</strong> To monitor and improve app performance</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">For Legal Reasons</h3>
              <p className="mb-2">We may disclose your information if required by law or if we believe such action is necessary to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Comply with legal obligations, court orders, or government requests</li>
                <li>Protect the rights, property, or safety of DoorBel, our users, or the public</li>
                <li>Detect, prevent, or address fraud, security, or technical issues</li>
                <li>Enforce our Terms of Service or other agreements</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">With Your Consent</h3>
              <p>We may share your information with third parties when you explicitly consent to such sharing.</p>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Security</h2>
              <p className="mb-4">
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Encryption of data in transit using HTTPS/TLS</li>
                <li>Encryption of sensitive data at rest</li>
                <li>Secure password hashing (bcrypt)</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Access controls and authentication mechanisms</li>
                <li>Secure cloud infrastructure with industry-leading providers</li>
              </ul>
              <p className="mt-4">
                However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
              </p>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Your Rights and Choices</h2>
              <p className="mb-4">You have the following rights regarding your personal information:</p>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Access and Portability</h3>
              <p>You can access your account information through the app settings. You can request a copy of your data by contacting us.</p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Correction and Update</h3>
              <p>You can update your account information (name) directly in the app. For other changes, contact our support team.</p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Deletion</h3>
              <p>You can request deletion of your account and associated data by visiting our <Link href="/delete-account" className="text-green-600 hover:underline font-medium">Account Deletion page</Link> or by contacting support@doorbel.com. We will process your deletion request within 30 days, except where we are required to retain certain data for legal purposes.</p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Notification Preferences</h3>
              <p>You can manage your notification preferences in the app settings, including:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Push notifications</li>
                <li>Email notifications</li>
                <li>SMS notifications</li>
                <li>Marketing communications</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Location Permissions</h3>
              <p>You can control location permissions through your device settings. Note that disabling location services may limit functionality.</p>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Data Retention</h2>
              <p className="mb-4">We retain your information for as long as necessary to provide our services and fulfill the purposes outlined in this policy:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Account Information:</strong> Retained until you delete your account</li>
                <li><strong>Order History:</strong> Retained for 3 years for support and dispute resolution</li>
                <li><strong>Location Data:</strong> Active delivery tracking data retained for 90 days, then anonymized</li>
                <li><strong>Payment Records:</strong> Retained for 7 years for tax and accounting purposes</li>
                <li><strong>KYC Documents:</strong> Retained for the duration of rider relationship plus 5 years for regulatory compliance</li>
              </ul>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Cookies and Tracking Technologies</h2>
              <p className="mb-4">
                Our mobile app does not use browser cookies. However, we use similar technologies:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Local Storage:</strong> To store authentication tokens and app preferences</li>
                <li><strong>Analytics:</strong> To understand app usage patterns and improve performance</li>
                <li><strong>Push Notification Tokens:</strong> To send you notifications</li>
              </ul>
              <p className="mt-4">
                Our website uses cookies to improve your browsing experience. You can control cookies through your browser settings.
              </p>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Children&apos;s Privacy</h2>
              <p>
                DoorBel is not intended for use by children under 18 years of age. We do not knowingly collect personal information from children. If we become aware that we have collected information from a child under 18, we will take steps to delete such information promptly.
              </p>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. International Data Transfers</h2>
              <p>
                Your information may be transferred to and processed in countries other than Ghana, including countries that may not have the same data protection laws. We ensure appropriate safeguards are in place to protect your information in accordance with this privacy policy.
              </p>
            </section>

            {/* Section 11 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Changes to This Privacy Policy</h2>
              <p>
                We may update this privacy policy from time to time to reflect changes in our practices or for legal, regulatory, or operational reasons. We will notify you of any material changes by:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Posting the updated policy in the app</li>
                <li>Sending you a notification</li>
                <li>Updating the &ldquo;Last updated&rdquo; date</li>
              </ul>
              <p className="mt-4">
                Your continued use of DoorBel after changes become effective constitutes acceptance of the updated policy.
              </p>
            </section>

            {/* Section 12 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Contact Us</h2>
              <p className="mb-4">
                If you have questions, concerns, or requests regarding this privacy policy or our data practices, please contact us:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg space-y-2">
                <p><strong>Email:</strong> support@doorbel.com</p>
                <p><strong>Support Email:</strong> support@doorbel.com</p>
                <p><strong>Phone:</strong> +233 246 654 390</p>
                <p><strong>Address:</strong> DoorBel Delivery Services, Tamale, Ghana</p>
              </div>
            </section>

            {/* Section 13 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Compliance with Ghana Data Protection Act</h2>
              <p>
                DoorBel is committed to complying with the Ghana Data Protection Act, 2012 (Act 843) and regulations issued by the Data Protection Commission of Ghana. We process personal data lawfully, fairly, and transparently, and only for specified, explicit, and legitimate purposes.
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              This privacy policy is effective as of January 2025. For previous versions or questions about changes, please contact support@doorbel.com.
            </p>
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

