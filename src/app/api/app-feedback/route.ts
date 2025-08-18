import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Types for email function
interface AppFeedbackInfo {
  id: string;
  sentiment: string;
  collection_slug?: string;
  context_slug?: string;
  created_at: string;
}

interface FeedbackDeviceData {
  deviceId: string;
  ipAddress: string;
  userAgent: string;
}

// Helper function to send new app feedback email notification
async function sendNewAppFeedbackEmail(feedbackInfo: AppFeedbackInfo, deviceData: FeedbackDeviceData): Promise<boolean> {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    
    if (!apiKey || apiKey === 'your_resend_api_key_here') {
      console.log('Resend API key not configured, skipping new app feedback email.');
      return false;
    }

    const resend = new Resend(apiKey);

    // Get additional context for the feedback
    let collectionName = feedbackInfo.collection_slug || 'Unknown';
    let contextName = feedbackInfo.context_slug || 'General';
    
    try {
      // Try to get collection name
      if (feedbackInfo.collection_slug) {
        const { data: collection } = await supabase
          .from('collections')
          .select('name')
          .eq('slug', feedbackInfo.collection_slug)
          .single();
        if (collection) {
          collectionName = collection.name;
        }
      }

      // Try to get context name (could be method slug, category slug, etc.)
      if (feedbackInfo.context_slug) {
        // Try methods first
        const { data: method } = await supabase
          .from('methods')
          .select('name')
          .eq('slug', feedbackInfo.context_slug)
          .single();
        if (method) {
          contextName = `${method.name} (method)`;
        } else {
          // Try categories
          const { data: category } = await supabase
            .from('categories')
            .select('name')
            .eq('slug', feedbackInfo.context_slug)
            .single();
          if (category) {
            contextName = `${category.name} (category)`;
          } else {
            // Keep the slug as is if no match found
            contextName = feedbackInfo.context_slug;
          }
        }
      }
    } catch (error) {
      console.log('Could not fetch context names for app feedback email:', error);
    }
    
    // Format the email content with feedback information
    const emailContent = `
      <h2>💬 New App Feedback Detected on Design Validate</h2>
      <p>A new app feedback entry has been added to the app_feedback table:</p>
      
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Feedback Information:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Feedback ID:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${feedbackInfo.id}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Sentiment:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; color: ${feedbackInfo.sentiment === 'LIKE' ? '#22c55e' : '#ef4444'};">
              ${feedbackInfo.sentiment === 'LIKE' ? '👍 LIKE' : '👎 DISLIKE'}
            </td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Collection:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${collectionName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Context:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${contextName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Collection Slug:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${feedbackInfo.collection_slug || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Context Slug:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${feedbackInfo.context_slug || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Device ID:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${deviceData.deviceId}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">IP Address:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${deviceData.ipAddress}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">User Agent:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; word-break: break-all;">${deviceData.userAgent}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Created At:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${new Date(feedbackInfo.created_at).toLocaleString()}</td>
          </tr>
        </table>
      </div>
      
      <p style="margin-top: 20px;">
        <em>This email was automatically generated when new app feedback was detected on Design Validate.</em><br>
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
      subject: `New app feedback: ${feedbackInfo.sentiment} on ${collectionName}`,
      html: emailContent,
    });

    console.log('New app feedback email sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending new app feedback email:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sentiment, collection_slug, context_slug } = body;

    if (sentiment !== 'LIKE' && sentiment !== 'DISLIKE') {
      return NextResponse.json(
        { error: "Sentiment must be either 'LIKE' or 'DISLIKE'" },
        { status: 400 }
      );
    }

    const ip_address = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const device_id = Buffer.from(userAgent).toString('base64').substring(0, 50);

    const { data: insertedFeedback, error: insertError } = await supabase
      .from('app_feedback')
      .insert({
        sentiment,
        collection_slug,
        context_slug,
        ip_address,
        device_id,
      })
      .select('*')
      .single();

    if (insertError) {
      console.error('Error inserting app feedback:', insertError);
      return NextResponse.json(
        { error: 'Failed to save feedback' },
        { status: 500 }
      );
    }

    // Send email notification for new app feedback
    try {
      const deviceData = {
        deviceId: device_id,
        ipAddress: ip_address,
        userAgent: userAgent
      };

      const feedbackInfo = {
        id: insertedFeedback.id.toString(),
        sentiment: insertedFeedback.sentiment,
        collection_slug: insertedFeedback.collection_slug,
        context_slug: insertedFeedback.context_slug,
        created_at: insertedFeedback.created_at
      };

      const emailSent = await sendNewAppFeedbackEmail(feedbackInfo, deviceData);
      
      if (emailSent) {
        console.log('New app feedback email notification sent successfully');
      } else {
        console.log('New app feedback email notification failed or was skipped');
      }
    } catch (emailError) {
      console.error('Error sending new app feedback email:', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Unexpected error in app-feedback API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 