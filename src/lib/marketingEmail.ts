import nodemailer from 'nodemailer';
import { emailTemplates, replaceTemplateVariables } from './emailTemplates';

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

export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  templateId: string;
  targetAudience: {
    cities?: string[];
    roles?: string[];
    status?: string[];
  };
  scheduledAt?: Date;
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  sentCount: number;
  openCount: number;
  clickCount: number;
  createdAt: Date;
  sentAt?: Date;
}

export const sendMarketingEmail = async (
  email: string,
  firstName: string,
  subject: string,
  content: string,
  templateId: string = 'marketing'
) => {
  try {
    const transporter = createTransporter();
    const template = emailTemplates.find(t => t.id === templateId);
    
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    const html = replaceTemplateVariables(template.html, {
      firstName,
      subject,
      content
    });

    const mailOptions = {
      from: `"DoorBel Team" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: email,
      subject: replaceTemplateVariables(template.subject, { subject }),
      html,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Marketing email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending marketing email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const sendLaunchAnnouncement = async (
  email: string,
  firstName: string,
  city: string,
  role?: string
) => {
  try {
    const transporter = createTransporter();
    const template = emailTemplates.find(t => t.id === 'launch');
    
    if (!template) {
      throw new Error('Launch template not found');
    }

    // Handle rider-specific benefits
    let html = replaceTemplateVariables(template.html, {
      firstName,
      city
    });

    // Handle rider-specific content
    if (role === 'rider' || role === 'both') {
      // Keep rider benefits section for riders
      // The template already includes the rider benefits section
    } else {
      // Remove rider benefits section for non-riders
      html = html.replace(/<div class="rider-benefits"[\s\S]*?<\/div>/g, '');
    }

    const mailOptions = {
      from: `"DoorBel Team" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: email,
      subject: replaceTemplateVariables(template.subject, { city }),
      html,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Launch announcement sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending launch announcement:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const sendBulkMarketingEmail = async (
  recipients: Array<{ email: string; firstName: string; city: string; role: string }>,
  subject: string,
  content: string,
  templateId: string = 'marketing'
) => {
  const results = [];
  
  for (const recipient of recipients) {
    try {
      const result = await sendMarketingEmail(
        recipient.email,
        recipient.firstName,
        subject,
        content,
        templateId
      );
      results.push({ ...recipient, result });
      
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      results.push({ 
        ...recipient, 
        result: { success: false, error: error instanceof Error ? error.message : 'Unknown error' } 
      });
    }
  }
  
  return results;
};

export const sendBulkLaunchAnnouncement = async (
  recipients: Array<{ email: string; firstName: string; city: string; role?: string }>
) => {
  const results = [];
  
  for (const recipient of recipients) {
    try {
      const result = await sendLaunchAnnouncement(
        recipient.email,
        recipient.firstName,
        recipient.city,
        recipient.role
      );
      results.push({ ...recipient, result });
      
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      results.push({ 
        ...recipient, 
        result: { success: false, error: error instanceof Error ? error.message : 'Unknown error' } 
      });
    }
  }
  
  return results;
};
