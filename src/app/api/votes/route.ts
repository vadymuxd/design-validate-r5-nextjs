import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

// Define supported vote types
type VoteEntityType = 'tool' | 'method' | 'case' | 'metric' | 'article' | 'framework';

// Update aggregated counts based on vote type
async function updateAggregatedCounts(voteType: VoteEntityType, entityId: string, contextId?: number) {
  try {
    switch (voteType) {
      case 'tool':
        await updateToolLeaderboard(entityId, contextId!);
        break;
      case 'method':
        await updateMethodVoteCounts(entityId);
        break;
      case 'case':
        await updateCaseVoteCounts(entityId);
        break;
      case 'metric':
        // Future: Update metric aggregated counts
        console.log(`Metric vote aggregation not yet implemented for entity: ${entityId}`);
        break;
      case 'article':
        // Future: Update article aggregated counts
        console.log(`Article vote aggregation not yet implemented for entity: ${entityId}`);
        break;
      case 'framework':
        await updateFrameworkVoteCounts(entityId);
        break;
      default:
        console.error(`Unknown vote type: ${voteType}`);
    }
  } catch (error) {
    console.error(`Error updating aggregated counts for ${voteType}:`, error);
  }
}

// Update tool leaderboard counts (legacy support)
async function updateToolLeaderboard(toolId: string, methodId: number) {
  try {
    // Count votes for this specific tool using new structure
    const { count: upvotes, error: upvoteError } = await supabase
      .from('votes')
      .select('*', { count: 'exact', head: true })
      .eq('vote_type', 'tool')
      .eq('entity_id', toolId)
      .eq('method_id', methodId)
      .eq('sentiment', 'UPVOTE');

    const { count: downvotes, error: downvoteError } = await supabase
      .from('votes')
      .select('*', { count: 'exact', head: true })
      .eq('vote_type', 'tool')
      .eq('entity_id', toolId)
      .eq('method_id', methodId)
      .eq('sentiment', 'DOWNVOTE');

    if (upvoteError || downvoteError) {
      console.error('Error counting tool votes:', upvoteError || downvoteError);
      return;
    }

    // Update the tools_leaderboard table
    const { error: updateError } = await supabase
      .from('tools_leaderboard')
      .update({
        current_upvotes: upvotes ?? 0,
        current_downvotes: downvotes ?? 0,
      })
      .eq('tool_id', toolId)
      .eq('method_id', methodId);
    
    if (updateError) {
      console.error('Error updating tool leaderboard:', updateError);
    }

  } catch (error) {
    console.error('Unexpected error in updateToolLeaderboard:', error);
  }
}

// Update method vote counts (legacy support)
async function updateMethodVoteCounts(methodId: string) {
  try {
    // Count votes for this method using new structure
    const { count: upvotes, error: upvoteError } = await supabase
      .from('votes')
      .select('*', { count: 'exact', head: true })
      .eq('vote_type', 'method')
      .eq('entity_id', methodId)
      .eq('sentiment', 'UPVOTE');

    const { count: downvotes, error: downvoteError } = await supabase
      .from('votes')
      .select('*', { count: 'exact', head: true })
      .eq('vote_type', 'method')
      .eq('entity_id', methodId)
      .eq('sentiment', 'DOWNVOTE');

    if (upvoteError || downvoteError) {
      console.error('Error counting method votes:', upvoteError || downvoteError);
      return;
    }

    // Update the methods table with current vote counts
    const { error: updateError } = await supabase
      .from('methods')
      .update({
        current_upvotes: upvotes ?? 0,
        current_downvotes: downvotes ?? 0,
      })
      .eq('id', parseInt(methodId));
    
    if (updateError) {
      console.error('Error updating method vote counts:', updateError);
    }

  } catch (error) {
    console.error('Unexpected error in updateMethodVoteCounts:', error);
  }
}

// Update framework vote counts
async function updateFrameworkVoteCounts(frameworkId: string) {
  try {
    // Count votes for this framework using new structure
    const { count: upvotes, error: upvoteError } = await supabase
      .from('votes')
      .select('*', { count: 'exact', head: true })
      .eq('vote_type', 'framework')
      .eq('entity_id', frameworkId)
      .eq('sentiment', 'UPVOTE');

    const { count: downvotes, error: downvoteError } = await supabase
      .from('votes')
      .select('*', { count: 'exact', head: true })
      .eq('vote_type', 'framework')
      .eq('entity_id', frameworkId)
      .eq('sentiment', 'DOWNVOTE');

    if (upvoteError || downvoteError) {
      console.error('Error counting framework votes:', upvoteError || downvoteError);
      return;
    }

    // Update the frameworks table with current vote counts
    const { error: updateError } = await supabase
      .from('frameworks')
      .update({
        current_upvotes: upvotes ?? 0,
        current_downvotes: downvotes ?? 0,
      })
      .eq('id', parseInt(frameworkId));
    
    if (updateError) {
      console.error('Error updating framework vote counts:', updateError);
    }

  } catch (error) {
    console.error('Unexpected error in updateFrameworkVoteCounts:', error);
  }
}

// Update case vote counts
async function updateCaseVoteCounts(caseId: string) {
  try {
    // Count votes for this case using new structure
    const { count: upvotes, error: upvoteError } = await supabase
      .from('votes')
      .select('*', { count: 'exact', head: true })
      .eq('vote_type', 'case')
      .eq('entity_id', caseId)
      .eq('sentiment', 'UPVOTE');

    const { count: downvotes, error: downvoteError } = await supabase
      .from('votes')
      .select('*', { count: 'exact', head: true })
      .eq('vote_type', 'case')
      .eq('entity_id', caseId)
      .eq('sentiment', 'DOWNVOTE');

    if (upvoteError || downvoteError) {
      console.error('Error counting case votes:', upvoteError || downvoteError);
      return;
    }

    // Update the cases table with current vote counts
    const { error: updateError } = await supabase
      .from('cases')
      .update({
        current_upvotes: upvotes ?? 0,
        current_downvotes: downvotes ?? 0,
      })
      .eq('id', parseInt(caseId));
    
    if (updateError) {
      console.error('Error updating case vote counts:', updateError);
    }

  } catch (error) {
    console.error('Unexpected error in updateCaseVoteCounts:', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { vote_type, entity_id, context_id, sentiment } = body;

    // 1. Validate required fields
    if (!vote_type || !entity_id || !sentiment) {
      return NextResponse.json(
        { error: 'vote_type, entity_id, and sentiment are required' },
        { status: 400 }
      );
    }

    // 2. Validate vote_type
    const validVoteTypes: VoteEntityType[] = ['tool', 'method', 'case', 'metric', 'article', 'framework'];
    if (!validVoteTypes.includes(vote_type)) {
      return NextResponse.json(
        { error: `vote_type must be one of: ${validVoteTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // 3. Validate sentiment
    if (sentiment !== 'UPVOTE' && sentiment !== 'DOWNVOTE') {
      return NextResponse.json(
        { error: "sentiment must be either 'UPVOTE' or 'DOWNVOTE'" },
        { status: 400 }
      );
    }

    // 4. Validate context requirements
    if (vote_type === 'tool' && !context_id) {
      return NextResponse.json(
        { error: 'context_id (method_id) is required for tool votes' },
        { status: 400 }
      );
    }

    // 5. Get user identifiers (same algorithm for all types)
    const ip_address = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const device_id = Buffer.from(userAgent).toString('base64').substring(0, 50);

    // 6. Check for existing vote using new scalable structure
    let existingVoteQuery = supabase
      .from('votes')
      .select('id, sentiment')
      .eq('vote_type', vote_type)
      .eq('entity_id', entity_id)
      .eq('device_id', device_id);
    
    // For method votes, also check method_id to ensure proper duplicate detection
    if (vote_type === 'method') {
      existingVoteQuery = existingVoteQuery.eq('method_id', parseInt(entity_id));
    } else if (context_id) {
      existingVoteQuery = existingVoteQuery.eq('method_id', context_id);
    }
    
    const { data: existingVote, error: checkError } = await existingVoteQuery.single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error checking for existing vote:', checkError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
    
    // 7. Handle voting logic (same for all types)
    if (existingVote) {
      if (existingVote.sentiment === sentiment) {
        // User is voting the same way again
        return NextResponse.json({ message: 'You have already voted for this!' }, { status: 409 });
      } else {
        // Change of vote: update the existing record
        const { error: updateError } = await supabase
          .from('votes')
          .update({ 
            sentiment,
            updated_at: new Date().toISOString(),
            method_id: vote_type === 'method' ? parseInt(entity_id) : (context_id || null)
          })
          .eq('id', existingVote.id);

        if (updateError) {
          console.error('Error updating vote:', updateError);
          return NextResponse.json({ message: 'Failed to update vote' }, { status: 500 });
        }
        
        // Update aggregated counts
        await updateAggregatedCounts(vote_type, entity_id, context_id);
        
        return NextResponse.json({ status: 'VOTE_UPDATED', message: 'Your vote has been updated!' });
      }
    } else {
      // New vote: insert using new scalable structure
      const voteData: {
        vote_type: string;
        entity_id: string;
        sentiment: string;
        ip_address: string;
        device_id: string;
        tool_id: string | null;
        method_id?: number;
      } = {
        vote_type,
        entity_id,
        sentiment,
        ip_address,
        device_id,
        // Legacy fields for backward compatibility during transition
        tool_id: vote_type === 'tool' ? entity_id : null
      };
      
      // Only add method_id if it's actually needed/provided
      if (vote_type === 'method') {
        voteData.method_id = parseInt(entity_id);
      } else if (context_id) {
        voteData.method_id = context_id;
      }
      
      const { error: insertError } = await supabase
        .from('votes')
        .insert(voteData);

      if (insertError) {
        console.error('Error inserting vote:', insertError);
        console.error('Insert data was:', voteData);
        return NextResponse.json({ message: 'Failed to save vote', error: insertError.message }, { status: 500 });
      }

      // Update aggregated counts
      await updateAggregatedCounts(vote_type, entity_id, context_id);
      
      return NextResponse.json({ status: 'VOTE_CREATED', message: 'Thanks for your feedback!' });
    }

  } catch (error) {
    console.error('Unexpected error in scalable votes API:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 