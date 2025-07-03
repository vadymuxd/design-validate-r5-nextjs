import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { method_id, sentiment } = body;

    // Validate required fields
    if (!method_id || !sentiment) {
      return NextResponse.json(
        { error: 'method_id and sentiment are required' },
        { status: 400 }
      );
    }

    // Validate sentiment value
    if (!['UPVOTE', 'DOWNVOTE'].includes(sentiment)) {
      return NextResponse.json(
        { error: 'sentiment must be UPVOTE or DOWNVOTE' },
        { status: 400 }
      );
    }

    // Get user identification (using IP address and User-Agent for now)
    const ip_address = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      '127.0.0.1';
    const user_agent = request.headers.get('user-agent') || '';
    
    // Create a simple device_id from IP and User-Agent
    const device_id = Buffer.from(`${ip_address}-${user_agent}`).toString('base64').slice(0, 32);

    // First, let's check if the votes table allows NULL for tool_id or we need a different approach
    // For now, let's create a dummy tool entry for method votes or check if we can use NULL
    
    // Let's try to insert/update vote directly without the problematic tool_id constraint
    // We'll use a different approach - check if user voted on this method using app_feedback table
    // or create a separate method_votes table
    
    // Check existing vote using a different approach - look for method votes specifically
    let existingVote = null;
    try {
      const { data: votes, error: voteCheckError } = await supabase
        .from('votes')
        .select('*')
        .eq('method_id', method_id)
        .eq('device_id', device_id)
        .is('tool_id', null); // Look for method votes (no specific tool)

      if (voteCheckError) {
        console.error('Vote check error:', voteCheckError);
        // If the above doesn't work, try using the app_feedback table instead
        const { data: feedbackVotes, error: feedbackError } = await supabase
          .from('app_feedback')
          .select('*')
          .eq('method_slug', method_id.toString()) // Convert method_id to string for slug matching
          .eq('device_id', device_id)
          .single();

        if (feedbackError && feedbackError.code !== 'PGRST116') {
          console.error('Feedback check error:', feedbackError);
        } else if (feedbackVotes) {
          // User already voted via feedback, prevent duplicate
          return NextResponse.json({
            voteStatus: 'ALREADY_VOTED',
            message: 'You have already provided feedback for this method',
            variant: 'warning' as const,
            method_id,
            sentiment
          });
        }
      } else if (votes && votes.length > 0) {
        existingVote = votes[0];
      }
    } catch (error) {
      console.error('Error checking votes:', error);
    }

    let voteStatus = '';
    let message = '';

    if (existingVote) {
      if (existingVote.sentiment === sentiment) {
        // User trying to vote the same way again
        voteStatus = 'ALREADY_VOTED';
        message = `You've already ${sentiment.toLowerCase()}d this method`;
        return NextResponse.json({
          voteStatus,
          message,
          variant: 'warning' as const,
          method_id,
          sentiment
        });
      } else {
        // User changing their vote
        const { error: updateError } = await supabase
          .from('votes')
          .update({ 
            sentiment,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingVote.id);

        if (updateError) {
          console.error('Error updating vote:', updateError);
          return NextResponse.json(
            { error: 'Failed to update vote' },
            { status: 500 }
          );
        }

        voteStatus = 'VOTE_UPDATED';
        message = `Vote updated to ${sentiment.toLowerCase()}`;
      }
    } else {
      // Create new vote - try without tool_id first (NULL)
      const { error: insertError } = await supabase
        .from('votes')
        .insert({
          method_id,
          tool_id: null, // No specific tool for method votes
          sentiment: sentiment as 'UPVOTE' | 'DOWNVOTE',
          device_id,
          ip_address
        });

      if (insertError) {
        console.error('Error creating vote with NULL tool_id:', insertError);
        
        // If that fails due to constraints, try to create a dummy tool or use app_feedback table
        const { error: feedbackError } = await supabase
          .from('app_feedback')
          .insert({
            method_slug: method_id.toString(),
            sentiment: sentiment === 'UPVOTE' ? 'LIKE' : 'DISLIKE',
            device_id,
            ip_address
          });

        if (feedbackError) {
          console.error('Error creating feedback vote:', feedbackError);
          return NextResponse.json(
            { error: 'Failed to create vote' },
            { status: 500 }
          );
        }

        voteStatus = 'VOTE_CREATED';
        message = `Method ${sentiment.toLowerCase()}d successfully (via feedback)`;
      } else {
        voteStatus = 'VOTE_CREATED';
        message = `Method ${sentiment.toLowerCase()}d successfully`;
      }
    }

    // Get current vote counts for this method (both votes and app_feedback)
    let upvotes = 0;
    let downvotes = 0;

    // Count from votes table (method votes with NULL tool_id)
    const { data: voteCounts } = await supabase
      .from('votes')
      .select('sentiment')
      .eq('method_id', method_id)
      .is('tool_id', null);

    if (voteCounts) {
      upvotes += voteCounts.filter(v => v.sentiment === 'UPVOTE').length;
      downvotes += voteCounts.filter(v => v.sentiment === 'DOWNVOTE').length;
    }

    // Count from app_feedback table
    const { data: feedbackCounts } = await supabase
      .from('app_feedback')
      .select('sentiment')
      .eq('method_slug', method_id.toString());

    if (feedbackCounts) {
      upvotes += feedbackCounts.filter(v => v.sentiment === 'LIKE').length;
      downvotes += feedbackCounts.filter(v => v.sentiment === 'DISLIKE').length;
    }

    // Update the method's current vote counts
    const { error: updateMethodError } = await supabase
      .from('methods')
      .update({
        current_upvotes: upvotes,
        current_downvotes: downvotes
      })
      .eq('id', method_id);

    if (updateMethodError) {
      console.log('Note: Could not update method vote counts:', updateMethodError.message);
      // Don't fail the request if we can't update the aggregated counts
    }

    return NextResponse.json({
      voteStatus,
      message,
      variant: 'default' as const,
      method_id,
      sentiment,
      upvotes,
      downvotes
    });

  } catch (error) {
    console.error('Error in method voting:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 