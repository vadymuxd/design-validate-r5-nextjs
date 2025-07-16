// Test script to validate new user email functionality
// This can be run to test the email sending without creating an actual user

import { Resend } from 'resend';

async function testNewUserEmail() {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    
    if (!apiKey || apiKey === 'your_resend_api_key_here') {
      console.log('❌ Resend API key not configured');
      return false;
    }

    const resend = new Resend(apiKey);
    
    // Test data
    const userInfo = {
      user_id: 12345,
      is_new_user: true
    };
    
    const deviceData = {
      deviceId: 'test-device-id-123',
      deviceType: 'desktop',
      os: 'macOS',
      browser: 'Chrome',
      city: 'San Francisco',
      region: 'California',
      country: 'United States',
      ipAddress: '203.0.113.1',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    };
    
    // Format the email content
    const emailContent = `
      <h2>🎉 New User Detected on Design Validate (TEST)</h2>
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
      subject: 'New user detected (TEST)',
      html: emailContent,
    });

    console.log('✅ Test email sent successfully');
    return true;
  } catch (error) {
    console.error('❌ Error sending test email:', error);
    return false;
  }
}

// Run the test
testNewUserEmail().then((success) => {
  console.log(success ? '✅ Test completed successfully' : '❌ Test failed');
});
