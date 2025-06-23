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
    const { message } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
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
      detectedDeviceType: deviceType
    });
    
    // Get country from IP
    const country = await getCountryFromIP(ipAddress);

    // Store message in database
    const { data: dbMessage, error: dbError } = await supabase
      .from('contact_messages')
      .insert({
        message: message.trim(),
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
        emailSent = true;
        console.log('Email sent successfully via Resend.');
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
      return NextResponse.json(
        { success: true, message: 'Message received and email sent successfully' },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { 
          success: true, 
          message: 'Message received, but email could not be sent', 
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