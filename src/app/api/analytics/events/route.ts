import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { component, value, url } = body;

    // Validate required fields
    if (!component || !value || !url) {
      return NextResponse.json(
        { error: 'Missing required fields: component, value, url' },
        { status: 400 }
      );
    }

    // Validate component values
    const validComponents = ['CollectionCard', 'TitleNavigation', 'TopNav'];
    if (!validComponents.includes(component)) {
      return NextResponse.json(
        { error: 'Invalid component. Must be one of: CollectionCard, TitleNavigation, TopNav' },
        { status: 400 }
      );
    }

    // Validate value (content type)
    const validValues = ['methods', 'metrics', 'tools', 'frameworks', 'cases'];
    if (!validValues.includes(value)) {
      return NextResponse.json(
        { error: 'Invalid value. Must be one of: methods, metrics, tools, frameworks, cases' },
        { status: 400 }
      );
    }

    // Create new event record
    const { data: eventData, error: eventError } = await supabase
      .from('events')
      .insert({
        component,
        value,
        url
      })
      .select();

    if (eventError) {
      console.error('Error creating event:', eventError);
      return NextResponse.json(
        { error: 'Failed to create event record' },
        { status: 500 }
      );
    }

    // Update content_analytics current_score by incrementing it
    // First get the current score, then update it
    const { data: currentAnalytics, error: fetchError } = await supabase
      .from('content_analytics')
      .select('current_score')
      .eq('content', value)
      .single();

    if (fetchError) {
      console.error('Error fetching current analytics:', fetchError);
      return NextResponse.json({
        message: 'Event created but analytics update failed',
        event: eventData?.[0]
      });
    }

    const newScore = (currentAnalytics?.current_score || 0) + 1;
    
    const { data: analyticsData, error: analyticsError } = await supabase
      .from('content_analytics')
      .update({
        current_score: newScore
      })
      .eq('content', value)
      .select();

    if (analyticsError) {
      console.error('Error updating content analytics:', analyticsError);
      // Still return success for event creation even if analytics update fails
      return NextResponse.json({
        message: 'Event created but analytics update failed',
        event: eventData?.[0]
      });
    }

    return NextResponse.json({
      message: 'Event tracked successfully',
      event: eventData?.[0],
      analytics: analyticsData?.[0]
    });

  } catch (error) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to retrieve events (for debugging/admin purposes)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const component = searchParams.get('component');
    const value = searchParams.get('value');

    let query = supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (component) {
      query = query.eq('component', component);
    }

    if (value) {
      query = query.eq('value', value);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching events:', error);
      return NextResponse.json(
        { error: 'Failed to fetch events' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      events: data,
      count: data?.length || 0
    });

  } catch (error) {
    console.error('Error in GET /api/analytics/events:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}