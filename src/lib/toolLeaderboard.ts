import { supabase } from '@/lib/supabase';

export interface ToolLeaderboardPosition {
  methodId: number;
  methodName: string;
  methodSlug: string;
  rank: number;
}

export async function getToolLeaderboardPositions(toolId: string): Promise<ToolLeaderboardPosition[]> {
  try {
    // Get all methods where this tool is listed (has an entry in tools_leaderboard)
    const { data: toolMethodsData, error: toolMethodsError } = await supabase
      .from('tools_leaderboard')
      .select(`
        method_id,
        methods (
          id,
          name,
          slug
        )
      `)
      .eq('tool_id', toolId);

    if (toolMethodsError) {
      console.error('Error fetching tool methods:', toolMethodsError);
      return [];
    }

    if (!toolMethodsData || toolMethodsData.length === 0) {
      return [];
    }

    const positions: ToolLeaderboardPosition[] = [];

    // For each method where this tool is listed, calculate its rank
    for (const toolMethod of toolMethodsData) {
      const methodId = toolMethod.method_id;
      const methodData = toolMethod.methods as unknown as { id: number; name: string; slug: string } | null;
      
      if (!methodData) continue;

      // Get all tools for this method sorted by net score (same logic as API)
      const { data: methodToolsData, error: methodToolsError } = await supabase
        .from('tools_leaderboard')
        .select(`
          tool_id,
          initial_upvotes,
          initial_downvotes,
          current_upvotes,
          current_downvotes
        `)
        .eq('method_id', methodId);

      if (methodToolsError) {
        console.error('Error fetching method tools:', methodToolsError);
        continue;
      }

      // Calculate net scores and sort (same logic as the API)
      const toolsWithScores = (methodToolsData || []).map(tool => {
        const totalUpvotes = (tool.initial_upvotes ?? 0) + (tool.current_upvotes ?? 0);
        const totalDownvotes = (tool.initial_downvotes ?? 0) + (tool.current_downvotes ?? 0);
        const netScore = totalUpvotes - totalDownvotes;
        
        return {
          tool_id: tool.tool_id,
          net_score: netScore
        };
      });

      // Sort by net score (highest first) - same as API
      const sortedTools = toolsWithScores.sort((a, b) => b.net_score - a.net_score);

      // Find the rank of our tool (1-indexed)
      const rankIndex = sortedTools.findIndex(tool => tool.tool_id === toolId);
      
      if (rankIndex >= 0) {
        positions.push({
          methodId,
          methodName: methodData.name,
          methodSlug: methodData.slug,
          rank: rankIndex + 1 // Convert to 1-indexed
        });
      }
    }

    return positions;
  } catch (error) {
    console.error('Error calculating tool leaderboard positions:', error);
    return [];
  }
}
