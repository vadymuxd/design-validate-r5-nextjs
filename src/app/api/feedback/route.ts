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

    // If this is feedback for a specific tool (not "general feedback"), update the tool's current totals
    if (category === 'tools' && component && component !== 'general feedback') {
      // Get the tool's current initial votes
      const { data: tool, error: toolError } = await supabase
        .from('tools')
        .select('initial_upvotes, initial_downvotes')
        .eq('name', component)
        .single();

      if (toolError) {
        console.error('Error fetching tool for total update:', toolError);
        // Don't fail the entire request if update fails
      } else if (tool) {
        // Count total LIKE feedback for this tool
        const { count: likeCount, error: likeError } = await supabase
          .from('feedback')
          .select('*', { count: 'exact', head: true })
          .eq('category', 'tools')
          .eq('component', component)
          .eq('sentiment', 'LIKE');

        // Count total DISLIKE feedback for this tool
        const { count: dislikeCount, error: dislikeError } = await supabase
          .from('feedback')
          .select('*', { count: 'exact', head: true })
          .eq('category', 'tools')
          .eq('component', component)
          .eq('sentiment', 'DISLIKE');

        if (likeError || dislikeError) {
          console.error('Error counting feedback for total update:', likeError || dislikeError);
          // Don't fail the entire request if update fails
        } else {
          // Calculate new current totals: initial + feedback counts
          const current_upvotes_total = tool.initial_upvotes + (likeCount || 0);
          const current_downvotes_total = tool.initial_downvotes + (dislikeCount || 0);

          // Update the tool's current totals in the database
          const { error: updateError } = await supabase
            .from('tools')
            .update({
              current_upvotes_total,
              current_downvotes_total
            })
            .eq('name', component);

          if (updateError) {
            console.error('Error updating tool current totals:', updateError);
            // Don't fail the entire request if update fails
          }
        }
      }
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