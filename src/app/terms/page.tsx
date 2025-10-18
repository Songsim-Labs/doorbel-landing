import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | DoorBel',
  description: 'Terms of Service for DoorBel delivery platform - Read our terms and conditions for using our services.',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-sm text-gray-600 mb-8">Last updated: October 15, 2025</p>

          <div className="space-y-8 text-gray-700">
            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using the DoorBel delivery service (&quot;Service&quot;), including our mobile application, website, and related services, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our Service.
              </p>
              <p className="mt-4">
                These Terms of Service (&quot;Terms&quot;) constitute a legally binding agreement between you and DoorBel Delivery Services (&quot;DoorBel,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;).
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Service Description</h2>
              <p className="mb-4">
                DoorBel provides an on-demand delivery platform that connects customers with independent delivery riders (&quot;Riders&quot;). We facilitate the delivery of packages, documents, food, and other items within Ghana.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.1 Customer Services</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Order creation and management</li>
                <li>Real-time delivery tracking</li>
                <li>Secure payment processing</li>
                <li>Customer support and dispute resolution</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.2 Rider Services</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access to delivery opportunities</li>
                <li>Earnings tracking and payment processing</li>
                <li>Route optimization and navigation</li>
                <li>Rider support and training resources</li>
              </ul>

              <p className="mt-4">
                DoorBel acts as a technology platform and is not a delivery service provider. Riders are independent contractors, not employees of DoorBel.
              </p>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Account Registration and Eligibility</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3.1 Eligibility</h3>
              <p className="mb-2">To use DoorBel, you must:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Be at least 18 years of age</li>
                <li>Have the legal capacity to enter into binding contracts</li>
                <li>Provide accurate and complete registration information</li>
                <li>Maintain the security of your account credentials</li>
                <li>For Riders: possess a valid driver&apos;s license and vehicle registration</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3.2 Account Security</h3>
              <p>
                You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3.3 Verification</h3>
              <p>
                We may require you to verify your email address and phone number. Riders must complete KYC (Know Your Customer) verification, including submission of identification documents, before accepting deliveries.
              </p>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. User Responsibilities</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4.1 Customer Responsibilities</h3>
              <p className="mb-2">As a customer, you agree to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide accurate pickup and delivery information, including valid Ghana Post GPS codes</li>
                <li>Ensure items comply with our prohibited items policy</li>
                <li>Be available at pickup and delivery locations within reasonable timeframes</li>
                <li>Properly package items to prevent damage during transit</li>
                <li>Treat Riders with respect and courtesy</li>
                <li>Pay all fees and charges associated with your orders</li>
                <li>Declare high-value items (above GH₵500) for appropriate insurance coverage</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4.2 Rider Responsibilities</h3>
              <p className="mb-2">As a Rider, you agree to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Complete KYC verification and maintain valid documentation</li>
                <li>Maintain your vehicle in safe operating condition</li>
                <li>Hold valid insurance coverage as required by Ghana law</li>
                <li>Accept deliveries in good faith and complete them professionally</li>
                <li>Enable location tracking during active deliveries</li>
                <li>Handle items with care and deliver them safely</li>
                <li>Comply with all traffic laws and regulations</li>
                <li>Treat customers with respect and professionalism</li>
                <li>Report any issues or incidents immediately</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Orders and Deliveries</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">5.1 Order Creation</h3>
              <p>
                Customers can create delivery orders through the DoorBel app by providing pickup and delivery details. Order pricing is calculated based on distance, delivery type, and current rate structures.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">5.2 Rider Assignment</h3>
              <p>
                Riders may be assigned automatically based on location and availability, or customers may select a Rider manually. Riders have the right to accept or decline delivery requests.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">5.3 Delivery Timeframes</h3>
              <p>
                Estimated delivery times are approximations and not guarantees. Actual delivery times may vary due to traffic, weather, or other factors beyond our control.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">5.4 Delivery Proof</h3>
              <p>
                Riders must provide proof of delivery, including a photo at the delivery location. This serves as confirmation that the delivery was completed.
              </p>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Payment Terms</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">6.1 Pricing</h3>
              <p>
                Delivery fees are calculated based on:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Base delivery fee</li>
                <li>Distance between pickup and delivery locations</li>
                <li>Delivery type (standard or express)</li>
                <li>Platform service fee</li>
              </ul>
              <p className="mt-4">
                All prices are displayed in Ghana Cedis (GH₵) and include applicable taxes.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">6.2 Payment Methods</h3>
              <p className="mb-2">We accept the following payment methods:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Mobile Money (MTN, Vodafone, AirtelTigo)</li>
                <li>Credit and debit cards</li>
                <li>Bank transfers</li>
              </ul>
              <p className="mt-4">
                Payment is due upon order confirmation and must be completed before delivery begins. We use Paystack as our payment processor.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">6.3 Rider Earnings</h3>
              <p>
                Riders earn a percentage of the delivery fee, minus platform fees. Earnings are paid out weekly to the Rider&apos;s designated mobile money account or bank account. DoorBel reserves the right to withhold payments pending investigation of suspected fraud or policy violations.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">6.4 Refunds</h3>
              <p>
                Refunds are issued at our discretion for cancelled orders, failed deliveries, or service issues. Refund processing times vary by payment method. See our Cancellation Policy for details.
              </p>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Cancellation and Modification Policy</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">7.1 Customer Cancellations</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Before Rider Pickup:</strong> Free cancellation, full refund</li>
                <li><strong>After Rider Pickup:</strong> Cancellation fee may apply based on distance traveled</li>
                <li><strong>During Transit:</strong> Partial refund based on completion percentage</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">7.2 Rider Cancellations</h3>
              <p>
                Riders may cancel accepted orders before pickup without penalty. Repeated cancellations after pickup may result in account suspension or termination.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">7.3 Order Modifications</h3>
              <p>
                Order modifications (delivery address changes, item additions) may be possible before Rider pickup. Contact support immediately for assistance. Additional charges may apply.
              </p>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Prohibited Items</h2>
              <p className="mb-4">The following items are strictly prohibited from being delivered through DoorBel:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Illegal substances, drugs, or contraband</li>
                <li>Weapons, firearms, ammunition, or explosives</li>
                <li>Hazardous materials, chemicals, or flammable substances</li>
                <li>Live animals or plants</li>
                <li>Perishable items without proper packaging</li>
                <li>Fragile items without appropriate protective packaging</li>
                <li>Items exceeding weight limits (50kg maximum)</li>
                <li>Items exceeding size limits (determined by vehicle type)</li>
                <li>Stolen goods or items obtained illegally</li>
                <li>Currency, precious metals, or negotiable instruments above GH₵500 without declaration</li>
              </ul>
              <p className="mt-4">
                We reserve the right to refuse delivery of any item at our discretion. Violation of this policy may result in order cancellation, account suspension, and potential legal action.
              </p>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Liability and Insurance</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">9.1 Insurance Coverage</h3>
              <p>
                DoorBel provides basic insurance coverage for items up to GH₵500 per delivery. For high-value items, customers must:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Declare the value at the time of order creation</li>
                <li>Pay additional insurance fees as applicable</li>
                <li>Provide proof of value (receipts, invoices) for claims</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">9.2 Limitation of Liability</h3>
              <p className="mb-4">
                To the maximum extent permitted by law, DoorBel shall not be liable for:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Damages to improperly packaged items</li>
                <li>Loss or damage to prohibited items</li>
                <li>Indirect, incidental, or consequential damages</li>
                <li>Delays due to circumstances beyond our control (traffic, weather, force majeure)</li>
                <li>Actions or omissions of Riders acting as independent contractors</li>
                <li>Loss or damage exceeding declared value or insurance coverage</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">9.3 Claims Process</h3>
              <p>
                Claims for lost or damaged items must be reported within 24 hours of delivery completion through our support system. Claims require:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Order number and delivery details</li>
                <li>Photos of damage (if applicable)</li>
                <li>Proof of item value</li>
                <li>Detailed description of the issue</li>
              </ul>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Intellectual Property</h2>
              <p>
                All content, features, and functionality of the DoorBel platform, including but not limited to text, graphics, logos, icons, images, software, and design, are the exclusive property of DoorBel and are protected by copyright, trademark, and other intellectual property laws.
              </p>
              <p className="mt-4">
                You may not copy, reproduce, distribute, modify, or create derivative works from our platform without express written permission.
              </p>
            </section>

            {/* Section 11 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. User Conduct and Termination</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">11.1 Acceptable Use</h3>
              <p className="mb-2">You agree not to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Violate any laws or regulations</li>
                <li>Harass, abuse, or harm other users or Riders</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Use automated systems (bots) to access the platform</li>
                <li>Submit false or fraudulent information</li>
                <li>Interfere with the proper functioning of the platform</li>
                <li>Attempt to manipulate ratings or reviews</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">11.2 Account Suspension and Termination</h3>
              <p>
                We reserve the right to suspend or terminate your account at any time, with or without notice, for violations of these Terms, suspected fraud, or any conduct we deem harmful to DoorBel, other users, or the public.
              </p>
              <p className="mt-4">
                You may terminate your account at any time by contacting support. Upon termination, you remain liable for any outstanding payments or obligations.
              </p>
            </section>

            {/* Section 12 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Dispute Resolution</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">12.1 Customer Support</h3>
              <p>
                If you have a dispute or complaint, please contact our support team first. We are committed to resolving issues amicably and efficiently.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">12.2 Governing Law</h3>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the Republic of Ghana, without regard to conflict of law principles.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">12.3 Arbitration</h3>
              <p>
                Any disputes arising from these Terms or your use of DoorBel shall be resolved through binding arbitration in accordance with the Alternative Dispute Resolution Act, 2010 (Act 798) of Ghana, unless otherwise required by law.
              </p>
            </section>

            {/* Section 13 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Modifications to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. We will notify you of material changes through:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>In-app notifications</li>
                <li>Email to your registered address</li>
                <li>Updates to this page with a new &quot;Last updated&quot; date</li>
              </ul>
              <p className="mt-4">
                Your continued use of DoorBel after changes take effect constitutes acceptance of the modified Terms.
              </p>
            </section>

            {/* Section 14 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Miscellaneous</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">14.1 Entire Agreement</h3>
              <p>
                These Terms, together with our Privacy Policy, constitute the entire agreement between you and DoorBel regarding use of the Service.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">14.2 Severability</h3>
              <p>
                If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">14.3 Waiver</h3>
              <p>
                Our failure to enforce any right or provision of these Terms shall not be deemed a waiver of such right or provision.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">14.4 Assignment</h3>
              <p>
                You may not assign or transfer these Terms or your account without our prior written consent. We may assign these Terms without restriction.
              </p>
            </section>

            {/* Section 15 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">15. Contact Information</h2>
              <p className="mb-4">
                For questions about these Terms or any other inquiries, please contact us:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg space-y-2">
                <p><strong>Legal Email:</strong> legal@doorbel.com</p>
                <p><strong>Support Email:</strong> support@doorbel.com</p>
                <p><strong>Phone:</strong> +233 123 456 789</p>
                <p><strong>Address:</strong> DoorBel Delivery Services, Accra, Ghana</p>
              </div>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              By using DoorBel, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

