import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sentiment, category, component } = body;

    // Validate sentiment
    if (sentiment !== 'LIKE' && sentiment !== 'DISLIKE') {
      return NextResponse.json(
        { error: "Sentiment must be either 'LIKE' or 'DISLIKE'" },
        { status: 400 }
      );
    }

    // Get IP address and device info from headers
    const ip_address = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const userAgent = request.headers.get('user-agent');
    const device_id = userAgent ? Buffer.from(userAgent).toString('base64') : undefined;

    // Insert feedback
    const { error } = await supabase
      .from('feedback')
      .insert([
        {
          sentiment,
          ip_address,
          device_id,
          category,
          component
        }
      ]);

    if (error) {
      console.error('Error inserting feedback:', error);
      return NextResponse.json(
        { error: 'Failed to submit feedback' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing feedback:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 