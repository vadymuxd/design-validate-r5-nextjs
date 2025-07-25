import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Get count of methods from methods table
    const { count: methodsCount, error: methodsError } = await supabase
      .from('methods')
      .select('*', { count: 'exact', head: true });

    // Get count of tools from tools table
    const { count: toolsCount, error: toolsError } = await supabase
      .from('tools')
      .select('*', { count: 'exact', head: true });

    // Get count of frameworks from frameworks table
    const { count: frameworksCount, error: frameworksError } = await supabase
      .from('frameworks')
      .select('*', { count: 'exact', head: true });

    // Get count of metrics from metrics table
    const { count: metricsCount, error: metricsError } = await supabase
      .from('metrics')
      .select('*', { count: 'exact', head: true });

    // Check for errors
    if (methodsError) {
      console.error('Error fetching methods count:', methodsError);
    }
    if (toolsError) {
      console.error('Error fetching tools count:', toolsError);
    }
    if (frameworksError) {
      console.error('Error fetching frameworks count:', frameworksError);
    }
    if (metricsError) {
      console.error('Error fetching metrics count:', metricsError);
    }

    // Return the counts - default to 0 if there was an error
    return NextResponse.json({
      success: true,
      data: {
        Methods: methodsCount || 0,
        Tools: toolsCount || 0,
        Frameworks: frameworksCount || 0,
        Metrics: metricsCount || 0,
        Cases: 0, // Placeholder - no cases table found
      }
    });

  } catch (error) {
    console.error('Error in collections counts API:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
