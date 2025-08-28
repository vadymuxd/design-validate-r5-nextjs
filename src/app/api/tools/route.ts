import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

// Define a type for the shape of our processed tool
type ProcessedTool = {
  id: string;
  name: string;
  description: string | null;
  feature_description: string | null;
  logo_url: string | null;
  website_url: string | null;
  method_id: number;
  upvotes: number;
  downvotes: number;
  net_score: number;
  pro_text: string | null;
  con_text: string | null;
};

// Define the shape of the data coming from the Supabase query
type SupabaseLeaderboardResponse = {
  initial_upvotes: number | null;
  initial_downvotes: number | null;
  current_upvotes: number | null;
  current_downvotes: number | null;
  tool_pros_and_cons: {
    pro_text: string | null;
    con_text: string | null;
    feature_description: string | null;
  } | null;
  tools: {
    id: string;
    name: string;
    description: string | null;
    logo_url: string | null;
    website_url: string | null;
  } | null;
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const methodSlug = searchParams.get('method_slug');

    if (!methodSlug) {
      return NextResponse.json(
        { error: 'method_slug is required' },
        { status: 400 }
      );
    }

    // Fetch the method to get its ID
    const { data: method, error: methodError } = await supabase
      .from('methods')
      .select('id')
      .eq('slug', methodSlug)
      .single();

    if (methodError || !method) {
      console.error('Error fetching method:', methodError);
      return NextResponse.json(
        { error: 'Failed to find method' },
        { status: 404 }
      );
    }

    // Handle "All in" view (method_id = 0)
    if (method.id === 0) {
      return await handleAllInView();
    }

    // Fetch tools linked to this method via the tools_leaderboard table
    const { data, error: toolsError } = await supabase
      .from('tools_leaderboard')
      .select(`
        initial_upvotes,
        initial_downvotes,
        current_upvotes,
        current_downvotes,
        tool_pros_and_cons (
          pro_text,
          con_text,
          feature_description
        ),
        tools (
          id,
          name,
          description,
          logo_url,
          website_url
        )
      `)
      .eq('method_id', method.id);

    if (toolsError) {
      console.error('Error fetching tools for method:', toolsError);
      return NextResponse.json(
        { error: 'Failed to fetch tools' },
        { status: 500 }
      );
    }

    // The linter is incorrect here; the logs show 'tools' is an object.
    // We use the standard 'as unknown as' pattern to assert the correct type.
    const typedData = (data || []) as unknown as SupabaseLeaderboardResponse[];

    // Process the data to create the desired structure and calculate the net score
    const processedTools: ProcessedTool[] = typedData
      .map(item => {
        const toolData = item.tools;
        if (!toolData) {
          return null;
        }

        const proConData = item.tool_pros_and_cons || { pro_text: null, con_text: null, feature_description: null };
        const totalUpvotes = (item.initial_upvotes ?? 0) + (item.current_upvotes ?? 0);
        const totalDownvotes = (item.initial_downvotes ?? 0) + (item.current_downvotes ?? 0);
        const netScore = totalUpvotes - totalDownvotes;

        return {
          ...toolData,
          method_id: method.id,
          upvotes: totalUpvotes,
          downvotes: totalDownvotes,
          net_score: netScore,
          pro_text: proConData.pro_text,
          con_text: proConData.con_text,
          feature_description: proConData.feature_description,
        };
      })
      .filter((tool): tool is ProcessedTool => tool !== null);

    // Sort by NET score (upvotes - downvotes) in descending order
    const sortedTools = processedTools.sort((a, b) => b.net_score - a.net_score);

    return NextResponse.json({ tools: sortedTools });
  } catch (error) {
    console.error('Error processing tools request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handleAllInView() {
  try {
    // Get all tools with their basic info
    const { data: allToolsData, error: toolsError } = await supabase
      .from('tools')
      .select(`
        id,
        name,
        description,
        logo_url,
        website_url,
        pro_text,
        con_text
      `);

    if (toolsError) {
      console.error('Error fetching tools:', toolsError);
      return NextResponse.json(
        { error: 'Failed to fetch tools data' },
        { status: 500 }
      );
    }

    // For each tool, calculate the total score across all methods + direct "All in" votes
    const toolsWithScores = await Promise.all(
      (allToolsData || []).map(async (tool) => {
        // Get aggregated scores from all method-specific leaderboards (excluding method_id = 0)
        const { data: methodScores, error: methodError } = await supabase
          .from('tools_leaderboard')
          .select('initial_upvotes, initial_downvotes, current_upvotes, current_downvotes')
          .eq('tool_id', tool.id)
          .neq('method_id', 0); // Exclude "All in" method to avoid double counting

        // Get direct "All in" votes (method_id = 0) if they exist
        const { data: allInScore } = await supabase
          .from('tools_leaderboard')
          .select('initial_upvotes, initial_downvotes, current_upvotes, current_downvotes')
          .eq('tool_id', tool.id)
          .eq('method_id', 0)
          .maybeSingle(); // Use maybeSingle since "All in" entry might not exist yet

        if (methodError) {
          console.error('Error fetching method scores:', methodError);
          return {
            ...tool,
            method_id: 0,
            upvotes: 0,
            downvotes: 0,
            net_score: 0,
            pro_text: tool.pro_text,
            con_text: tool.con_text,
          };
        }

        // Calculate totals from method-specific scores (initial + current)
        const methodUpvotes = (methodScores || []).reduce((sum, score) => 
          sum + (score.initial_upvotes || 0) + (score.current_upvotes || 0), 0);
        const methodDownvotes = (methodScores || []).reduce((sum, score) => 
          sum + (score.initial_downvotes || 0) + (score.current_downvotes || 0), 0);
        
        // Add direct "All in" votes (initial + current) if they exist
        const allInUpvotes = allInScore ? 
          (allInScore.initial_upvotes || 0) + (allInScore.current_upvotes || 0) : 0;
        const allInDownvotes = allInScore ? 
          (allInScore.initial_downvotes || 0) + (allInScore.current_downvotes || 0) : 0;

        // Total = method scores + direct "All in" votes
        const totalUpvotes = methodUpvotes + allInUpvotes;
        const totalDownvotes = methodDownvotes + allInDownvotes;
        const netScore = totalUpvotes - totalDownvotes;

        return {
          ...tool,
          method_id: 0, // All in method ID
          upvotes: totalUpvotes,
          downvotes: totalDownvotes,
          net_score: netScore,
          pro_text: tool.pro_text,
          con_text: tool.con_text,
        };
      })
    );

    // Sort by net score (highest first)
    const sortedTools = toolsWithScores.sort((a, b) => b.net_score - a.net_score);

    return NextResponse.json({ tools: sortedTools });
  } catch (error) {
    console.error('Error processing all-in view:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 