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
    const userAgent = request.headers.get('user-agent');
    const device_id = userAgent ? Buffer.from(userAgent).toString('base64') : undefined;

    console.log('Request metadata:', { ip_address, device_id: device_id?.substring(0, 20) + '...' });

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
        // If they're trying to vote in the same direction, prevent it
        if (existingVote.sentiment === sentiment) {
          console.log('Duplicate vote attempt blocked');
          return NextResponse.json(
            { error: 'You have already voted for this!' },
            { status: 409 } // Conflict status code
          );
        }

        // If they're voting in the opposite direction, update the existing record
        console.log('Updating existing vote to opposite direction');
        const { error: updateError } = await supabase
          .from('feedback')
          .update({ 
            sentiment,
            created_at: new Date().toISOString() // Update timestamp to reflect new vote time
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
      } else {
        // No existing vote, insert new feedback
        console.log('Inserting new feedback...');
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
        console.log('Successfully inserted new feedback');
      }
    } else {
      // For non-tool feedback or when device_id is not available, insert normally
      console.log('Inserting non-tool feedback or no device_id...');
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
      console.log('Successfully inserted feedback');
    }

    // If this is feedback for a specific tool (not "general feedback"), update the tool's current totals
    if (category === 'tools' && component && component !== 'general feedback') {
      console.log('Updating tool totals for component:', component);
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
        console.log('Found tool, updating totals...');
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

          console.log('Updating totals:', { current_upvotes_total, current_downvotes_total });

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
          } else {
            console.log('Successfully updated tool totals');
          }
        }
      }
    }

    console.log('Feedback submission completed successfully');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing feedback:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 