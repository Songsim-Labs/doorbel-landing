export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  html: string;
  type: 'marketing' | 'update' | 'launch' | 'welcome';
}

export const emailTemplates: EmailTemplate[] = [
  {
    id: 'welcome',
    name: 'Welcome Email',
    subject: 'Welcome to DoorBel Waitlist! 🚀',
    type: 'welcome',
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
            <h1>Welcome to DoorBel, {{firstName}}! 🎉</h1>
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
              <div style="font-size: 24px; letter-spacing: 2px;">{{referralCode}}</div>
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
    `
  },
  {
    id: 'marketing',
    name: 'Marketing Campaign',
    subject: '{{subject}}',
    type: 'marketing',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{{subject}}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #22c55e, #16a34a); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .button { display: inline-block; background: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>DoorBel Update</h1>
            <p>Ghana's Premier Delivery Platform</p>
          </div>
          
          <div class="content">
            <h2>Hello {{firstName}}!</h2>
            {{content}}
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://doorbel.org" class="button">Visit DoorBel</a>
            </div>
          </div>
          
          <div class="footer">
            <p>Best regards,<br>The DoorBel Team</p>
            <p>🇬🇭 Building Ghana's #1 Delivery Platform</p>
            <p><small>You're receiving this because you joined our waitlist. <a href="#">Unsubscribe</a></small></p>
          </div>
        </div>
      </body>
      </html>
    `
  },
  {
    id: 'launch',
    name: 'Launch Announcement',
    subject: '🚀 DoorBel is Now Live in {{city}}!',
    type: 'launch',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>DoorBel is Live!</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #22c55e, #16a34a); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .launch-banner { background: #fef3c7; border: 2px solid #f59e0b; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .button { display: inline-block; background: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
          .app-buttons { text-align: center; margin: 20px 0; }
          .app-button { display: inline-block; margin: 10px; padding: 15px 25px; background: #000; color: white; text-decoration: none; border-radius: 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚀 DoorBel is LIVE!</h1>
            <p>Your wait is over, {{firstName}}!</p>
          </div>
          
          <div class="content">
            <div class="launch-banner">
              <h2>🎉 We're officially launching in {{city}}!</h2>
              <p>Download the app now and start using DoorBel today!</p>
            </div>

            <h2>Your Early Access Benefits Are Ready:</h2>
            <ul>
              <li>⭐ <strong>Priority Support</strong> - Dedicated early user support</li>
              <li>🚀 <strong>Exclusive Features</strong> - Access to all new features</li>
              <li>📱 <strong>Early Access</strong> - Be among the first to experience DoorBel</li>
            </ul>

            <div class="rider-benefits" style="background: #f0f9ff; border: 2px solid #0ea5e9; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #0c4a6e; margin-top: 0;">🚚 Special Rider Benefits</h3>
              <p style="color: #0c4a6e; margin-bottom: 15px;">As an early rider, you'll enjoy:</p>
              <ul style="color: #0c4a6e;">
                <li><strong>Reduced Commission Fee</strong> - Special reduced commission for your first month</li>
                <li><strong>Priority Order Assignment</strong> - Get first access to delivery requests</li>
                <li><strong>Enhanced Support</strong> - Dedicated rider support team</li>
              </ul>
            </div>

            <div class="app-buttons">
              <a href="#" class="app-button">📱 Download iOS App</a>
              <a href="#" class="app-button">🤖 Download Android App</a>
            </div>

            <h3>How to Get Started:</h3>
            <ol>
              <li>Download the DoorBel app from your app store</li>
              <li>Sign in with the email you used for the waitlist</li>
              <li>Your early access benefits will be automatically applied</li>
              <li>Start sending or delivering packages right away!</li>
            </ol>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://doorbel.org" class="button">Visit Our Website</a>
            </div>
          </div>
          
          <div class="footer">
            <p>Thank you for being part of our journey!<br>The DoorBel Team</p>
            <p>🇬🇭 Ghana's #1 Delivery Platform</p>
            <p><small>Questions? Reply to this email or contact salimdadabajr@gmail.com</small></p>
          </div>
        </div>
      </body>
      </html>
    `
  }
];

export const replaceTemplateVariables = (template: string, variables: Record<string, string>): string => {
  let result = template;
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, value);
  });
  return result;
};
