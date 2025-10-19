import nodemailer from 'nodemailer';

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export const sendWelcomeEmail = async (email: string, firstName: string, referralCode: string) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"DoorBel Team" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: email,
      subject: 'Welcome to DoorBel Waitlist! 🚀',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to DoorBel</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #22c55e, #16a34a); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .benefits { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .benefit-item { display: flex; align-items: center; margin: 15px 0; }
            .benefit-icon { color: #22c55e; margin-right: 10px; }
            .referral-code { background: #22c55e; color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0; font-size: 18px; font-weight: bold; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .button { display: inline-block; background: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to DoorBel, ${firstName}! 🎉</h1>
              <p>You're now part of Ghana's delivery revolution</p>
            </div>
            
            <div class="content">
              <h2>Thank you for joining our waitlist!</h2>
              <p>We're excited to have you on board. You're now one of the first people to experience DoorBel when we launch in Ghana.</p>
              
              <div class="benefits">
                <h3>🎁 Your Early Access Benefits:</h3>
                <div class="benefit-item">
                  <span class="benefit-icon">⭐</span>
                  <span><strong>Priority Support</strong> - Dedicated early user support</span>
                </div>
                <div class="benefit-item">
                  <span class="benefit-icon">🚀</span>
                  <span><strong>Exclusive Features</strong> - First access to new features</span>
                </div>
                <div class="benefit-item">
                  <span class="benefit-icon">📱</span>
                  <span><strong>Early Access</strong> - Be among the first to experience DoorBel</span>
                </div>
              </div>

              <div class="referral-code">
                <h3>Your Referral Code</h3>
                <p>Share with friends and earn rewards!</p>
                <div style="font-size: 24px; letter-spacing: 2px;">${referralCode}</div>
              </div>

              <h3>What's Next?</h3>
              <ul>
                <li>We'll notify you as soon as DoorBel launches in your city</li>
                <li>You'll receive exclusive updates and early access opportunities</li>
                <li>Share your referral code to earn rewards when friends join</li>
                <li>Follow us on social media for the latest news</li>
              </ul>

              <div style="background: #f8fafc; border-left: 4px solid #22c55e; padding: 15px; margin: 20px 0;">
                <h4 style="color: #166534; margin-top: 0;">🚚 For Riders</h4>
                <p style="color: #166534; margin-bottom: 0;">Early riders will enjoy reduced commission fees for the first month after launch!</p>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="https://doorbel.org" class="button">Visit Our Website</a>
              </div>
            </div>
            
            <div class="footer">
              <p>Best regards,<br>The DoorBel Team</p>
              <p>🇬🇭 Building Ghana's #1 Delivery Platform</p>
              <p><small>If you didn't sign up for this waitlist, please ignore this email.</small></p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const sendAdminNotification = async (userData: Record<string, unknown>) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"DoorBel Waitlist" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: 'New Waitlist Signup - DoorBel',
      html: `
        <h2>New Waitlist Signup</h2>
        <p><strong>Name:</strong> ${userData.firstName} ${userData.lastName}</p>
        <p><strong>Email:</strong> ${userData.email}</p>
        <p><strong>Phone:</strong> ${userData.phone}</p>
        <p><strong>City:</strong> ${userData.city}</p>
        <p><strong>Role:</strong> ${userData.role}</p>
        <p><strong>Marketing:</strong> ${userData.agreeToMarketing ? 'Yes' : 'No'}</p>
        <p><strong>Signup Date:</strong> ${new Date().toLocaleString()}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending admin notification:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Send custom marketing email
export const sendMarketingEmail = async (
  recipients: string[],
  subject: string,
  htmlContent: string,
  firstName?: string
) => {
  try {
    const transporter = createTransporter();

    // Replace template variables
    let personalizedContent = htmlContent;
    if (firstName) {
      personalizedContent = personalizedContent.replace(/\{\{firstName\}\}/g, firstName);
    }

    const mailOptions = {
      from: `"DoorBel Team" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: recipients.join(', '),
      subject,
      html: personalizedContent,
    };

    const result = await transporter.sendMail(mailOptions);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending marketing email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

