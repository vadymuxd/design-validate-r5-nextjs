import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: categories, error } = await supabase
      .from('categories')
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
      .eq('collections.slug', 'tools') // Only get categories from the "tools" collection
      .order('id');

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch categories' },
        { status: 500 }
      );
    }

    // Transform the data to match the expected format
    const formattedCategories = categories?.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      collection_id: category.collection_id
    })) || [];

    return NextResponse.json({ categories: formattedCategories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 