import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

// This function will be triggered by a database webhook or a cron job in a real-world scenario.
// For the purpose of this refactor, we are calling it directly after a successful vote.
// This is not a production-ready approach for high-traffic sites but is suitable for this context.
async function updateLeaderboard(tool_id: string, category_id: number) {
  try {
    // Count UPVOTES
    const { count: upvotes, error: upvoteError } = await supabase
      .from('votes')
      .select('*', { count: 'exact', head: true })
      .eq('tool_id', tool_id)
      .eq('category_id', category_id)
      .eq('sentiment', 'UPVOTE');

    // Count DOWNVOTES
    const { count: downvotes, error: downvoteError } = await supabase
      .from('votes')
      .select('*', { count: 'exact', head: true })
      .eq('tool_id', tool_id)
      .eq('category_id', category_id)
      .eq('sentiment', 'DOWNVOTE');

    if (upvoteError || downvoteError) {
      console.error('Error counting votes:', upvoteError || downvoteError);
      return;
    }

    // Update the leaderboard table
    const { error: updateError } = await supabase
      .from('tool_category_leaderboard')
      .update({
        current_upvotes: upvotes ?? 0,
        current_downvotes: downvotes ?? 0,
      })
      .eq('tool_id', tool_id)
      .eq('category_id', category_id);
    
    if (updateError) {
      console.error('Error updating leaderboard:', updateError);
    }

  } catch (error) {
    console.error('Unexpected error in updateLeaderboard:', error);
  }
}


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sentiment, tool_id, category_id } = body;

    // 1. Validate sentiment
    if (sentiment !== 'UPVOTE' && sentiment !== 'DOWNVOTE') {
      return NextResponse.json(
        { error: "Sentiment must be either 'UPVOTE' or 'DOWNVOTE'" },
        { status: 400 }
      );
    }

    // 2. Get user identifiers
    const ip_address = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const device_id = Buffer.from(userAgent).toString('base64').substring(0, 50);

    // 3. Check for an existing vote
    const { data: existingVote, error: checkError } = await supabase
      .from('votes')
      .select('id, sentiment')
      .eq('tool_id', tool_id)
      .eq('category_id', category_id)
      .eq('device_id', device_id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error checking for existing vote:', checkError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
    
    // 4. Handle voting logic
    if (existingVote) {
      if (existingVote.sentiment === sentiment) {
        // User is voting the same way again. Return a conflict error.
        return NextResponse.json({ message: 'You have already voted for this!' }, { status: 409 });
      } else {
        // Change of vote: update the existing record
        const { error: updateError } = await supabase
          .from('votes')
          .update({ 
            sentiment,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingVote.id);

        if (updateError) {
          console.error('Error updating vote:', updateError);
          return NextResponse.json({ message: 'Failed to update vote' }, { status: 500 });
        }
      }
    } else {
      // New vote: insert a new record
      const { error: insertError } = await supabase
        .from('votes')
        .insert({
          sentiment,
          tool_id,
          category_id,
          ip_address,
          device_id,
        });

      if (insertError) {
        console.error('Error inserting vote:', insertError);
        return NextResponse.json({ message: 'Failed to save vote' }, { status: 500 });
      }
    }

    // 5. Update the leaderboard in real-time.
    await updateLeaderboard(tool_id, category_id);

    return NextResponse.json({ message: 'Thanks for your feedback!' });

  } catch (error) {
    console.error('Unexpected error in votes API:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 