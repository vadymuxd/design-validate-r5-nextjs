import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Get cases from database with current vote counts
    const { data: cases, error } = await supabase
      .from('cases')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching cases:', error);
      return NextResponse.json(
        { error: 'Failed to fetch cases' },
        { status: 500 }
      );
    }

    // Process the cases to extract methods from metadata and calculate net scores
    const processedCases = cases?.map(case_item => ({
      ...case_item,
      methods: case_item.metadata?.methods || [],
      netScore: (case_item.initial_upvotes || 0) + (case_item.current_upvotes || 0) - 
                (case_item.initial_downvotes || 0) - (case_item.current_downvotes || 0),
      totalUpvotes: (case_item.initial_upvotes || 0) + (case_item.current_upvotes || 0),
      totalDownvotes: (case_item.initial_downvotes || 0) + (case_item.current_downvotes || 0)
    })) || [];

    return NextResponse.json({
      success: true,
      data: processedCases
    });

  } catch (error) {
    console.error('Error in cases API:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
