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

// Helper function to get location from IP (city, region, country)
async function getLocationFromIP(ip: string): Promise<{
  city: string | null;
  region: string | null;
  country: string | null;
} | null> {
  if (ip === 'unknown' || ip === '127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
    return null; // Local IP addresses
  }
  
  try {
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=city,regionName,country`);
    const data = await response.json();
    
    return {
      city: data.city || null,
      region: data.regionName || null,
      country: data.country || null
    };
  } catch (error) {
    console.error('Error getting location from IP:', error);
    return null;
  }
}

// Types for email function
interface UserInfo {
  user_id: number;
  is_new_user: boolean;
}

interface DeviceData {
  deviceId: string;
  deviceType: string;
  os: string;
  browser: string;
  city: string | null;
  region: string | null;
  country: string | null;
  ipAddress: string;
  userAgent: string;
}

// Helper function to send new user email notification
async function sendNewUserEmail(userInfo: UserInfo, deviceData: DeviceData): Promise<boolean> {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    
    if (!apiKey || apiKey === 'your_resend_api_key_here') {
      console.log('Resend API key not configured, skipping new user email.');
      return false;
    }

    const resend = new Resend(apiKey);
    
    // Format the email content with user information
    const emailContent = `
      <h2>🎉 New User Detected on Design Validate</h2>
      <p>A new user has been added to the users table:</p>
      
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>User Information:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">User ID:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${userInfo.user_id}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Device ID:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${deviceData.deviceId}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Device Type:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${deviceData.deviceType || 'Unknown'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Operating System:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${deviceData.os || 'Unknown'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Browser:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${deviceData.browser || 'Unknown'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">City:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${deviceData.city || 'Unknown'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Region:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${deviceData.region || 'Unknown'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Country:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${deviceData.country || 'Unknown'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">IP Address:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${deviceData.ipAddress}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">User Agent:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; word-break: break-all;">${deviceData.userAgent}</td>
          </tr>
        </table>
      </div>
      
      <p style="margin-top: 20px;">
        <em>This email was automatically generated when a new user was detected on Design Validate.</em><br>
        <em>Timestamp: ${new Date().toISOString()}</em>
      </p>
      
      <hr style="margin: 20px 0;">
      <p style="color: #666; font-size: 12px;">
        Visit the <a href="https://design-validate.com/admin">Admin Dashboard</a> to view detailed analytics.
      </p>
    `;

    await resend.emails.send({
      from: 'Design Validate <noreply@design-validate.com>',
      to: 'info@design-validate.com',
      subject: 'New user detected',
      html: emailContent,
    });

    console.log('New user email sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending new user email:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get client information
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    // Generate device ID using the same method as votes and contact tables
    const deviceId = Buffer.from(userAgent).toString('base64').substring(0, 50);
    
    // Detect device information
    const browser = detectBrowser(userAgent);
    const os = detectOS(userAgent);
    const deviceType = detectDeviceType(userAgent);
    
    // Get location from IP (with error handling)
    let city: string | null = null;
    let region: string | null = null;
    let country: string | null = null;
    
    try {
      const locationData = await getLocationFromIP(ipAddress);
      if (locationData) {
        city = locationData.city;
        region = locationData.region;
        country = locationData.country;
      }
    } catch (error) {
      console.error('Error getting location from IP:', error);
      // Continue without location data
    }
    
    console.log('User tracking data:', {
      deviceId: deviceId.substring(0, 20) + '...',
      deviceType,
      os,
      browser,
      city,
      region,
      country,
      ipAddress: ipAddress.substring(0, 10) + '...'
    });

    // Use the database function to upsert the user
    const { data: userResult, error: userError } = await supabase
      .rpc('upsert_user', {
        p_device_id: deviceId,
        p_device_type: deviceType,
        p_os: os,
        p_browser: browser,
        p_city: city,
        p_region: region,
        p_country: country,
        p_user_agent: userAgent,
        p_ip_address: ipAddress
      });

    if (userError) {
      console.error('Database error in user tracking:', userError);
      return NextResponse.json(
        { error: 'Failed to track user', details: userError.message },
        { status: 500 }
      );
    }

    const userInfo = userResult?.[0];
    
    if (!userInfo) {
      console.error('No user info returned from upsert_user function');
      return NextResponse.json(
        { error: 'Failed to get user info' },
        { status: 500 }
      );
    }

    // Log new user creation (for analytics)
    if (userInfo.is_new_user) {
      console.log('New user created:', {
        userId: userInfo.user_id,
        deviceType,
        os,
        browser,
        city,
        region,
        country
      });

      // Send email notification for new user
      try {
        const deviceData = {
          deviceId,
          deviceType,
          os,
          browser,
          city,
          region,
          country,
          ipAddress,
          userAgent
        };

        const emailSent = await sendNewUserEmail(userInfo, deviceData);
        
        if (emailSent) {
          console.log('New user email notification sent successfully');
        } else {
          console.log('New user email notification failed or was skipped');
        }
      } catch (emailError) {
        console.error('Error sending new user email:', emailError);
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({
      success: true,
      userId: userInfo.user_id,
      isNewUser: userInfo.is_new_user,
      message: userInfo.is_new_user ? 'New user created' : 'User updated'
    });

  } catch (error) {
    console.error('General error in user tracking:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// GET endpoint for user analytics (optional - for admin use)
export async function GET() {
  try {
    // Get user statistics by device type
    const { data: deviceStats, error: deviceError } = await supabase
      .rpc('get_user_stats_by_device_type');

    if (deviceError) {
      console.error('Error fetching device stats:', deviceError);
      return NextResponse.json(
        { error: 'Failed to fetch device statistics' },
        { status: 500 }
      );
    }

    // Get user statistics by OS
    const { data: osStats, error: osError } = await supabase
      .rpc('get_user_stats_by_os');

    if (osError) {
      console.error('Error fetching OS stats:', osError);
      return NextResponse.json(
        { error: 'Failed to fetch OS statistics' },
        { status: 500 }
      );
    }

    // Get user statistics by country
    const { data: countryStats, error: countryError } = await supabase
      .rpc('get_user_stats_by_country');

    if (countryError) {
      console.error('Error fetching country stats:', countryError);
      return NextResponse.json(
        { error: 'Failed to fetch country statistics' },
        { status: 500 }
      );
    }

    // Get user statistics by city
    const { data: cityStats, error: cityError } = await supabase
      .rpc('get_user_stats_by_city');

    if (cityError) {
      console.error('Error fetching city stats:', cityError);
      return NextResponse.json(
        { error: 'Failed to fetch city statistics' },
        { status: 500 }
      );
    }

    // Get user statistics by region
    const { data: regionStats, error: regionError } = await supabase
      .rpc('get_user_stats_by_region');

    if (regionError) {
      console.error('Error fetching region stats:', regionError);
      return NextResponse.json(
        { error: 'Failed to fetch region statistics' },
        { status: 500 }
      );
    }

    // Get total user count
    const { count: totalUsers, error: countError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Error fetching total user count:', countError);
      return NextResponse.json(
        { error: 'Failed to fetch user count' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      analytics: {
        totalUsers,
        deviceStats,
        osStats,
        countryStats,
        cityStats,
        regionStats
      }
    });

  } catch (error) {
    console.error('Error in user analytics:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
