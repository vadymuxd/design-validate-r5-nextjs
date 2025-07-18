import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Get metrics from database
    const { data: metrics, error } = await supabase
      .from('metrics')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching metrics:', error);
      return NextResponse.json(
        { error: 'Failed to fetch metrics' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: metrics || []
    });

  } catch (error) {
    console.error('Error in metrics API:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
