import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

// Define a type for the shape of our processed tool
type ProcessedTool = {
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  website_url: string | null;
  category_id: number;
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
    const categorySlug = searchParams.get('category_slug');

    if (!categorySlug) {
      return NextResponse.json(
        { error: 'category_slug is required' },
        { status: 400 }
      );
    }

    // Fetch the category to get its ID
    const { data: category, error: categoryError } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .single();

    if (categoryError || !category) {
      console.error('Error fetching category:', categoryError);
      return NextResponse.json(
        { error: 'Failed to find category' },
        { status: 404 }
      );
    }

    // Fetch tools linked to this category via the leaderboard table
    const { data, error: toolsError } = await supabase
      .from('tool_category_leaderboard')
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
      .eq('category_id', category.id);

    if (toolsError) {
      console.error('Error fetching tools for category:', toolsError);
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
          category_id: category.id,
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