import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    // Fetch all content analytics data
    const { data, error } = await supabase
      .from('content_analytics')
      .select('*')
      .order('content');

    if (error) {
      console.error('Error fetching content analytics:', error);
      return NextResponse.json(
        { error: 'Failed to fetch content analytics' },
        { status: 500 }
      );
    }

    // Calculate total score for percentage calculations
    const totalScore = data?.reduce((sum, item) => sum + item.current_score, 0) || 0;

    // Transform the data to include percentages
    const analyticsWithPercentages = data?.map(item => ({
      ...item,
      percentage: totalScore > 0 ? Math.round((item.current_score / totalScore) * 100) : 0
    })) || [];

    return NextResponse.json({
      analytics: analyticsWithPercentages,
      totalScore,
      summary: {
        methods: data?.find(d => d.content === 'methods')?.current_score || 0,
        metrics: data?.find(d => d.content === 'metrics')?.current_score || 0,
        tools: data?.find(d => d.content === 'tools')?.current_score || 0,
        frameworks: data?.find(d => d.content === 'frameworks')?.current_score || 0,
        cases: data?.find(d => d.content === 'cases')?.current_score || 0,
      }
    });

  } catch (error) {
    console.error('Error in GET /api/analytics/content:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}