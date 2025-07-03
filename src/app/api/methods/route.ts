import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: methods, error } = await supabase
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
      .eq('collections.slug', 'tools') // Only get methods from the "tools" collection
      .order('id');

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch methods' },
        { status: 500 }
      );
    }

    // Transform the data to match the expected format
    const formattedMethods = methods?.map(method => ({
      id: method.id,
      name: method.name,
      slug: method.slug,
      collection_id: method.collection_id
    })) || [];

    return NextResponse.json({ methods: formattedMethods });
  } catch (error) {
    console.error('Error fetching methods:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 