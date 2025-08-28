import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Define supported vote types
type VoteEntityType = 'tool' | 'method' | 'case' | 'metric' | 'article' | 'framework';

// Types for email function
interface VoteInfo {
  id: string;
  vote_type: string;
  entity_id: string;
  sentiment: string;
  method_id?: number;
  tool_id?: string;
  created_at: string;
}

interface VoteDeviceData {
  deviceId: string;
  ipAddress: string;
  userAgent: string;
}

// Helper function to send new vote email notification
async function sendNewVoteEmail(voteInfo: VoteInfo, deviceData: VoteDeviceData): Promise<boolean> {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    
    if (!apiKey || apiKey === 'your_resend_api_key_here') {
      console.log('Resend API key not configured, skipping new vote email.');
      return false;
    }

    const resend = new Resend(apiKey);

    // Get additional context for the vote
    let entityName = 'Unknown';
    let methodName = '';
    let voteContext = '';

    try {
      // Try to get entity name based on vote type
      if (voteInfo.vote_type === 'tool' && voteInfo.tool_id) {
        const { data: tool } = await supabase
          .from('tools')
          .select('name')
          .eq('id', voteInfo.tool_id)
          .single();
        if (tool) {
          entityName = tool.name;
        }
      } else if (voteInfo.vote_type === 'method' && voteInfo.entity_id) {
        const { data: method } = await supabase
          .from('methods')
          .select('name')
          .eq('id', parseInt(voteInfo.entity_id))
          .single();
        if (method) {
          entityName = method.name;
        }
      } else if (voteInfo.vote_type === 'framework' && voteInfo.entity_id) {
        const { data: framework } = await supabase
          .from('frameworks')
          .select('name')
          .eq('id', parseInt(voteInfo.entity_id))
          .single();
        if (framework) {
          entityName = framework.name;
        }
      } else if (voteInfo.vote_type === 'case' && voteInfo.entity_id) {
        const { data: caseStudy } = await supabase
          .from('cases')
          .select('name')
          .eq('id', parseInt(voteInfo.entity_id))
          .single();
        if (caseStudy) {
          entityName = caseStudy.name;
        }
      }

      // Get method context if applicable
      if (voteInfo.method_id) {
        const { data: method } = await supabase
          .from('methods')
          .select('name')
          .eq('id', voteInfo.method_id)
          .single();
        if (method) {
          methodName = method.name;
          voteContext = voteInfo.vote_type === 'tool' ? ` (in ${methodName} method)` : '';
        }
      }
    } catch (error) {
      console.log('Could not fetch entity name for vote email:', error);
    }
    
    // Format the email content with vote information
    const emailContent = `
      <h2>🗳️ New Vote Detected on Design Validate</h2>
      <p>A new vote has been added to the votes table:</p>
      
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Vote Information:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Vote ID:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${voteInfo.id}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Vote Type:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${voteInfo.vote_type.toUpperCase()}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Entity Name:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${entityName}${voteContext}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Entity ID:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${voteInfo.entity_id}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Sentiment:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; color: ${voteInfo.sentiment === 'UPVOTE' ? '#22c55e' : '#ef4444'};">
              ${voteInfo.sentiment === 'UPVOTE' ? '👍 UPVOTE' : '👎 DOWNVOTE'}
            </td>
          </tr>
          ${voteInfo.method_id ? `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Method Context:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${methodName} (ID: ${voteInfo.method_id})</td>
          </tr>
          ` : ''}
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
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${new Date(voteInfo.created_at).toLocaleString()}</td>
          </tr>
        </table>
      </div>
      
      <p style="margin-top: 20px;">
        <em>This email was automatically generated when a new vote was detected on Design Validate.</em><br>
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
      subject: `New ${voteInfo.vote_type} vote: ${voteInfo.sentiment}`,
      html: emailContent,
    });

    console.log('New vote email sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending new vote email:', error);
    return false;
  }
}

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
    // For "All in" view (method_id = 0), ONLY update the "All in" leaderboard entry
    if (methodId === 0) {
      await updateToolLeaderboardForMethod(toolId, 0);
      return;
    }

    // For specific method, update normally
    await updateToolLeaderboardForMethod(toolId, methodId);
  } catch (error) {
    console.error('Unexpected error in updateToolLeaderboard:', error);
  }
}

// Helper function to update tool leaderboard for a specific method
async function updateToolLeaderboardForMethod(toolId: string, methodId: number) {
  try {
    // Count votes for this specific tool and method using new structure
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
    console.error('Unexpected error in updateToolLeaderboardForMethod:', error);
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
    if (vote_type === 'tool' && context_id === undefined) {
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
    } else if (context_id !== undefined && context_id !== null) {
      // Only add method_id filter if context_id is explicitly provided (including 0 for "All in")
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
            method_id: vote_type === 'method' ? parseInt(entity_id) : (context_id !== undefined ? context_id : null)
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
      } else if (context_id !== undefined && context_id !== null) {
        // Include context_id even if it's 0 (for "All in" view)
        voteData.method_id = context_id;
      }
      
      const { data: insertedVote, error: insertError } = await supabase
        .from('votes')
        .insert(voteData)
        .select('*')
        .single();

      if (insertError) {
        console.error('Error inserting vote:', insertError);
        console.error('Insert data was:', voteData);
        return NextResponse.json({ message: 'Failed to save vote', error: insertError.message }, { status: 500 });
      }

      // Update aggregated counts
      await updateAggregatedCounts(vote_type, entity_id, context_id);

      // Send email notification for new vote
      try {
        const deviceData = {
          deviceId: device_id,
          ipAddress: ip_address,
          userAgent: userAgent
        };

        const voteInfo = {
          id: insertedVote.id.toString(),
          vote_type: insertedVote.vote_type,
          entity_id: insertedVote.entity_id,
          sentiment: insertedVote.sentiment,
          method_id: insertedVote.method_id,
          tool_id: insertedVote.tool_id,
          created_at: insertedVote.created_at
        };

        const emailSent = await sendNewVoteEmail(voteInfo, deviceData);
        
        if (emailSent) {
          console.log('New vote email notification sent successfully');
        } else {
          console.log('New vote email notification failed or was skipped');
        }
      } catch (emailError) {
        console.error('Error sending new vote email:', emailError);
        // Don't fail the request if email fails
      }
      
      return NextResponse.json({ status: 'VOTE_CREATED', message: 'Thanks for your feedback!' });
    }

  } catch (error) {
    console.error('Unexpected error in scalable votes API:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 