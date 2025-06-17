import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pill = searchParams.get('pill');

    let query = supabase.from('tools').select('*');
    
    if (pill) {
      query = query.eq('pill', pill);
    }

    const { data: tools, error } = await query;

    if (error) {
      console.error('Error fetching tools:', error);
      return NextResponse.json(
        { error: 'Failed to fetch tools' },
        { status: 500 }
      );
    }

    // Sort by NET score (upvotes - downvotes) in descending order
    const sortedTools = tools.sort((a, b) => {
      const netScoreA = a.current_upvotes_total - a.current_downvotes_total;
      const netScoreB = b.current_upvotes_total - b.current_downvotes_total;
      return netScoreB - netScoreA; // Descending order (highest NET score first)
    });

    return NextResponse.json({ tools: sortedTools });
  } catch (error) {
    console.error('Error processing tools request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 