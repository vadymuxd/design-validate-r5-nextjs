import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    // Fetch frameworks from the database
    const { data, error } = await supabase
      .from('frameworks')
      .select('*');

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch frameworks', details: error.message },
        { status: 500 }
      );
    }

    // Transform the data to include total upvotes, downvotes, and net score
    const frameworksWithTotals = (data || []).map(framework => {
      const totalUpvotes = (framework.initial_upvotes || 0) + (framework.current_upvotes || 0);
      const totalDownvotes = (framework.initial_downvotes || 0) + (framework.current_downvotes || 0);
      const netScore = totalUpvotes - totalDownvotes;
      
      return {
        ...framework,
        upvotes: totalUpvotes,
        downvotes: totalDownvotes,
        net_score: netScore,
      };
    });

    // Sort by NET score (upvotes - downvotes) in descending order
    const sortedFrameworks = frameworksWithTotals.sort((a, b) => b.net_score - a.net_score);

    return NextResponse.json({ 
      frameworks: sortedFrameworks,
      count: sortedFrameworks.length 
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
