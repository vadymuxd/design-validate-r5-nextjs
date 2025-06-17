import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Get all tools
    const { data: tools, error: toolsError } = await supabase
      .from('tools')
      .select('*');

    if (toolsError) {
      console.error('Error fetching tools:', toolsError);
      return NextResponse.json(
        { error: 'Failed to fetch tools' },
        { status: 500 }
      );
    }

    // Update each tool's current totals
    const updates = await Promise.all(
      tools.map(async (tool) => {
        // Count LIKE feedback for this tool
        const { count: likeCount, error: likeError } = await supabase
          .from('feedback')
          .select('*', { count: 'exact', head: true })
          .eq('category', 'tools')
          .eq('component', tool.name)
          .eq('sentiment', 'LIKE');

        // Count DISLIKE feedback for this tool
        const { count: dislikeCount, error: dislikeError } = await supabase
          .from('feedback')
          .select('*', { count: 'exact', head: true })
          .eq('category', 'tools')
          .eq('component', tool.name)
          .eq('sentiment', 'DISLIKE');

        if (likeError || dislikeError) {
          console.error(`Error counting feedback for ${tool.name}:`, likeError || dislikeError);
          return { success: false, tool: tool.name, error: likeError || dislikeError };
        }

        // Calculate current totals: initial + feedback counts
        const current_upvotes_total = tool.initial_upvotes + (likeCount || 0);
        const current_downvotes_total = tool.initial_downvotes + (dislikeCount || 0);

        // Update the tool in the database
        const { error: updateError } = await supabase
          .from('tools')
          .update({
            current_upvotes_total,
            current_downvotes_total
          })
          .eq('id', tool.id);

        if (updateError) {
          console.error(`Error updating tool ${tool.name}:`, updateError);
          return { success: false, tool: tool.name, error: updateError };
        }

        return {
          success: true,
          tool: tool.name,
          previous_upvotes: tool.current_upvotes_total,
          new_upvotes: current_upvotes_total,
          previous_downvotes: tool.current_downvotes_total,
          new_downvotes: current_downvotes_total
        };
      })
    );

    const successful = updates.filter(u => u.success);
    const failed = updates.filter(u => !u.success);

    return NextResponse.json({
      success: true,
      message: `Updated ${successful.length} tools successfully${failed.length > 0 ? `, ${failed.length} failed` : ''}`,
      results: updates
    });
  } catch (error) {
    console.error('Error updating tool totals:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 