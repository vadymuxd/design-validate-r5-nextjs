import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Try to get methods with calculated net scores using the function
    let { data: methods, error } = await supabase
      .rpc('get_methods_with_scores');

    // If the function doesn't exist yet, fall back to basic query
    if (error && (error.message?.includes('function') || error.message?.includes('does not exist'))) {
      console.log('Database function not found, using fallback query');
      
      const { data: fallbackMethods, error: fallbackError } = await supabase
        .from('methods')
        .select(`
          id,
          name,
          slug,
          collection_id,
          collections!inner(
            id,
            name,
            slug
          )
        `)
        .eq('collections.slug', 'tools')
        .order('id');

      if (fallbackError) {
        console.error('Fallback database error:', fallbackError);
        return NextResponse.json(
          { error: 'Failed to fetch methods' },
          { status: 500 }
        );
      }

      // Transform fallback data to match expected format with clear error message
      methods = fallbackMethods?.map(method => ({
        id: method.id,
        name: method.name,
        slug: method.slug,
        description: "There is error to connect to your database",
        collection_id: method.collection_id,
        net_score: 0, // Placeholder until script is run
        current_upvotes: 0,
        current_downvotes: 0
      })) || [];
    } else if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch methods' },
        { status: 500 }
      );
    }

    return NextResponse.json({ methods: methods || [] });
  } catch (error) {
    console.error('Error fetching methods:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 