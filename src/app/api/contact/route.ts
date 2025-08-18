import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';

// Helper function to detect browser from user agent
function detectBrowser(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  
  if (ua.includes('chrome') && !ua.includes('edg')) {
    return 'Chrome';
  } else if (ua.includes('firefox')) {
    return 'Firefox';
  } else if (ua.includes('safari') && !ua.includes('chrome')) {
    return 'Safari';
  } else if (ua.includes('edge')) {
    return 'Edge';
  } else if (ua.includes('opera')) {
    return 'Opera';
  } else if (ua.includes('brave')) {
    return 'Brave';
  }
  
  return 'Unknown';
}

// Helper function to detect OS from user agent
function detectOS(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  
  if (ua.includes('macintosh')) {
    return 'macOS';
  } else if (ua.includes('windows nt')) {
    return 'Windows';
  } else if (ua.includes('linux') && !ua.includes('android')) {
    return 'Linux';
  } else if (ua.includes('android')) {
    return 'Android';
  } else if (ua.includes('iphone') || ua.includes('ipad')) {
    return 'iOS';
  }
  
  return 'Unknown';
}

// Helper function to detect device type from user agent
function detectDeviceType(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  
  // Check for mobile devices first
  if (/mobile|android|iphone|phone|blackberry|opera mini|windows phone/i.test(ua)) {
    return 'mobile';
  }
  
  // Check for tablets
  if (/tablet|ipad|playbook|kindle/i.test(ua)) {
    return 'tablet';
  }
  
  // Check for desktop/laptop devices
  if (/macintosh|windows nt|linux|ubuntu|fedora|centos|debian/i.test(ua)) {
    return 'desktop';
  }
  
  // Default to desktop for unknown devices
  return 'desktop';
}

// Helper function to get country from IP (simplified - you can use a proper geolocation service)
async function getCountryFromIP(ip: string): Promise<string | null> {
  if (ip === 'unknown' || ip === '127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
    return null; // Local IP addresses
  }
  
  try {
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=country`);
    const data = await response.json();
    return data.country || null;
  } catch (error) {
    console.error('Error getting country from IP:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message, email, feedback_source, component } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Determine source and component based on provided data
    const finalFeedbackSource = feedback_source || 'about';
    const finalComponent = component || 'contact-form';
    
    // Email is optional for community feedback, but validate if provided
    if (email && typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email must be a valid string' },
        { status: 400 }
      );
    }

    // Get client information
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    // Generate device ID using the same method as votes table
    const deviceId = Buffer.from(userAgent).toString('base64').substring(0, 50);
    
    // Detect browser, OS, and device type
    const browser = detectBrowser(userAgent);
    const os = detectOS(userAgent);
    const deviceType = detectDeviceType(userAgent);
    
    console.log('Device detection:', {
      userAgent: userAgent.substring(0, 100) + '...',
      detectedBrowser: browser,
      detectedOS: os,
      detectedDeviceType: deviceType,
      feedbackSource: finalFeedbackSource,
      component: finalComponent
    });
    
    // Get country from IP
    const country = await getCountryFromIP(ipAddress);

    // Store message in database
    const { data: dbMessage, error: dbError } = await supabase
      .from('contact_messages')
      .insert({
        message: message.trim(),
        user_email: email?.trim() || null,
        feedback_source: finalFeedbackSource,
        component: finalComponent,
        ip_address: ipAddress,
        user_agent: userAgent,
        device_id: deviceId,
        device_type: deviceType,
        country: country,
        browser: browser,
        os: os,
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to store message' },
        { status: 500 }
      );
    }

    // Initialize Resend
    const resend = new Resend(process.env.RESEND_API_KEY);
    let emailSent = false;

    // Try to send email
    try {
      const apiKey = process.env.RESEND_API_KEY;

      if (!apiKey || apiKey === 'your_resend_api_key_here') {
        console.log('Resend API key not configured, skipping email send.');
      } else {
        // Determine email content based on feedback source
        if (finalFeedbackSource === 'community') {
          let emailSubject = 'New Community Feedback';
          let emailContent = '';
          
          if (finalComponent === 'discord') {
            emailSubject = 'New Discord Invitation Request';
            emailContent = `
              <h2>🎮 New Discord Invitation Request</h2>
              <p>Someone wants to join the Design Validate Discord community!</p>
              
              <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>Request Details:</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Platform:</td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">Discord</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">User Email:</td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${email?.trim() || 'Not provided'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Message:</td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${message.trim()}</td>
                  </tr>
                </table>
              </div>
            `;
          } else if (finalComponent === 'slack') {
            emailSubject = 'New Slack Invitation Request';
            emailContent = `
              <h2>💬 New Slack Invitation Request</h2>
              <p>Someone wants to join the Design Validate Slack workspace!</p>
              
              <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>Request Details:</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Platform:</td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">Slack</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">User Email:</td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${email?.trim() || 'Not provided'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Message:</td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${message.trim()}</td>
                  </tr>
                </table>
              </div>
            `;
          } else {
            // Regular community feedback
            emailSubject = `New Community Feedback - ${finalComponent.charAt(0).toUpperCase() + finalComponent.slice(1)}`;
            emailContent = `
              <h2>🎉 New Community Feedback Received</h2>
              <p>Someone is interested in being a <strong>${finalComponent}</strong> on Design Validate!</p>
              
              <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>Feedback Details:</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Component:</td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${finalComponent.charAt(0).toUpperCase() + finalComponent.slice(1)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">User Email:</td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${email?.trim() || 'Not provided'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Message:</td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${message.trim()}</td>
                  </tr>
                </table>
              </div>
            `;
          }

          await resend.emails.send({
            from: 'Community Feedback <noreply@design-validate.com>',
            to: 'info@design-validate.com',
            subject: emailSubject,
            html: `
              ${emailContent}

              <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h4>Technical Information:</h4>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 6px; border-bottom: 1px solid #ddd; font-weight: bold;">Source:</td>
                    <td style="padding: 6px; border-bottom: 1px solid #ddd;">Community Page</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px; border-bottom: 1px solid #ddd; font-weight: bold;">IP Address:</td>
                    <td style="padding: 6px; border-bottom: 1px solid #ddd;">${ipAddress}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px; border-bottom: 1px solid #ddd; font-weight: bold;">Country:</td>
                    <td style="padding: 6px; border-bottom: 1px solid #ddd;">${country || 'Unknown'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px; border-bottom: 1px solid #ddd; font-weight: bold;">Browser:</td>
                    <td style="padding: 6px; border-bottom: 1px solid #ddd;">${browser}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px; border-bottom: 1px solid #ddd; font-weight: bold;">OS:</td>
                    <td style="padding: 6px; border-bottom: 1px solid #ddd;">${os}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px; border-bottom: 1px solid #ddd; font-weight: bold;">Device Type:</td>
                    <td style="padding: 6px; border-bottom: 1px solid #ddd;">${deviceType}</td>
                  </tr>
                </table>
              </div>

              <hr style="margin: 20px 0;">
              <p style="margin-top: 20px;">
                <em>This email was automatically generated from the Community page feedback form.</em><br>
                <em>Submitted at: ${new Date().toISOString()}</em>
              </p>
            `,
          });
        } else {
          // Regular contact form email
          await resend.emails.send({
            from: 'Contact Form <noreply@design-validate.com>',
            to: 'info@design-validate.com',
            subject: 'New Contact Form Message',
            html: `<p>New message from the Design Validate contact form:</p>
                   <p><strong>Message:</strong> ${message.trim()}</p>
                   <hr>
                   <p><em>Submitted at: ${new Date().toISOString()}</em></p>
                   <p><em>IP Address: ${ipAddress}</em></p>
                   <p><em>Country: ${country || 'Unknown'}</em></p>
                   <p><em>Browser: ${browser}</em></p>
                   <p><em>OS: ${os}</em></p>
                   <p><em>Device Type: ${deviceType}</em></p>`,
          });
        }
        emailSent = true;
        console.log(`${finalFeedbackSource} email sent successfully via Resend.`);
      }
    } catch (emailError) {
      console.error('Resend email sending error:', emailError);
      // Email failed, but we don't throw an error, just mark it as not sent
      emailSent = false;
    }

    // Update database with email status
    try {
      await supabase
        .from('contact_messages')
        .update({
          email_sent: emailSent,
          email_sent_at: emailSent ? new Date().toISOString() : null,
        })
        .eq('id', dbMessage.id);
    } catch (updateError) {
      console.error('Failed to update email status in DB:', updateError);
      // This is a secondary failure, log it but don't override the primary response
    }

    // Return different status codes based on email success
    if (emailSent) {
      const successMessage = finalFeedbackSource === 'community' 
        ? 'Community feedback received and email sent successfully'
        : 'Message received and email sent successfully';
      
      return NextResponse.json(
        { success: true, message: successMessage },
        { status: 200 }
      );
    } else {
      const partialSuccessMessage = finalFeedbackSource === 'community'
        ? 'Community feedback received, but email could not be sent'
        : 'Message received, but email could not be sent';
        
      return NextResponse.json(
        { 
          success: true, 
          message: partialSuccessMessage, 
          emailSent: false,
        },
        { status: 202 }
      );
    }
  } catch (error) {
    console.error('General error in /api/contact:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 