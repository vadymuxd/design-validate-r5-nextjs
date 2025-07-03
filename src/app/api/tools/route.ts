import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

// Define a type for the shape of our processed tool
type ProcessedTool = {
  id: string;
  name: string;
  description: string | null;
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
          con_text
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

        const proConData = item.tool_pros_and_cons || { pro_text: null, con_text: null };
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