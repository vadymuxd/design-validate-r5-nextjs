import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sentiment, category, component } = body;

    console.log('Feedback request received:', { sentiment, category, component });

    // Validate sentiment
    if (sentiment !== 'LIKE' && sentiment !== 'DISLIKE') {
      console.log('Invalid sentiment:', sentiment);
      return NextResponse.json(
        { error: "Sentiment must be either 'LIKE' or 'DISLIKE'" },
        { status: 400 }
      );
    }

    // Get IP address and device info from headers
    const ip_address = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const device_id = Buffer.from(userAgent).toString('base64').substring(0, 50);

    console.log('Request metadata:', { ip_address, device_id: `${device_id.substring(0, 20)}...` });

    // Check for existing vote from this device for this tool
    if (category === 'tools' && component && device_id) {
      console.log('Checking for existing vote...');
      const { data: existingVotes, error: checkError } = await supabase
        .from('feedback')
        .select('*')
        .eq('category', 'tools')
        .eq('component', component)
        .eq('device_id', device_id);

      if (checkError) {
        console.error('Error checking for existing vote:', checkError);
        return NextResponse.json(
          { error: 'Failed to check existing votes' },
          { status: 500 }
        );
      }

      const existingVote = existingVotes && existingVotes.length > 0 ? existingVotes[0] : null;

      if (existingVote) {
        console.log('Found existing vote:', existingVote.sentiment);
        
        if (existingVote.sentiment === sentiment) {
          console.log('Duplicate vote attempt blocked');
          return NextResponse.json(
            { error: 'You have already voted for this!' },
            { status: 409 }
          );
        } else {
          console.log('Updating existing vote to opposite direction');
          const { error: updateError } = await supabase
            .from('feedback')
            .update({ 
              sentiment, 
              updated_at: new Date().toISOString()
            })
            .eq('id', existingVote.id);

          if (updateError) {
            console.error('Error updating existing vote:', updateError);
            return NextResponse.json(
              { error: 'Failed to update vote' },
              { status: 500 }
            );
          }

          console.log('Successfully updated existing vote');
        }
      } else {
        console.log('No existing vote found, creating new record');
        const { error: insertError } = await supabase
          .from('feedback')
          .insert({
            sentiment,
            ip_address,
            device_id,
            category,
            component,
            updated_at: new Date().toISOString()
          });

        if (insertError) {
          console.error('Error inserting feedback:', insertError);
          return NextResponse.json(
            { error: 'Failed to save feedback' },
            { status: 500 }
          );
        }

        console.log('Successfully inserted new vote');
      }
    } else {
      // For non-tools category or missing component, just insert normally
      console.log('Inserting feedback for non-tools category or missing component');
      const { error: insertError } = await supabase
      .from('feedback')
        .insert({
          sentiment,
          ip_address,
          device_id,
          category,
          component,
          updated_at: new Date().toISOString()
        });

      if (insertError) {
        console.error('Error inserting feedback:', insertError);
      return NextResponse.json(
          { error: 'Failed to save feedback' },
        { status: 500 }
      );
    }

      console.log('Successfully inserted feedback');
    }

    // Update tool totals if this is a tools vote
    if (category === 'tools' && component) {
      console.log('Updating tool totals for component:', component);
      
      try {
        const updateResponse = await fetch(`${request.nextUrl.origin}/api/tools/update-totals`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ toolName: component }),
        });

        if (!updateResponse.ok) {
          console.error('Error updating tool totals:', updateResponse.statusText);
        } else {
          console.log('Successfully updated tool totals');
        }
      } catch (fetchError) {
        console.error('Error updating tool totals:', fetchError);
      }
    }

    console.log('Feedback submission completed successfully');
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Unexpected error in feedback API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 