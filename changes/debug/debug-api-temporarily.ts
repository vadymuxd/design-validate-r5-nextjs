// ============================================================================
// TEMPORARY DEBUG VERSION - Replace your API votes/route.ts temporarily
// ============================================================================
// This adds detailed logging to identify the exact error

import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('📥 Received request body:', body);
    
    const { vote_type, entity_id, context_id, sentiment } = body;

    // 1. Validate required fields
    if (!vote_type || !entity_id || !sentiment) {
      console.log('❌ Missing required fields:', { vote_type, entity_id, sentiment });
      return NextResponse.json(
        { error: 'vote_type, entity_id, and sentiment are required' },
        { status: 400 }
      );
    }

    // 2. Get user identifiers
    const ip_address = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const device_id = Buffer.from(userAgent).toString('base64').substring(0, 50);

    console.log('👤 User identifiers:', { ip_address, device_id: device_id.substring(0, 10) + '...' });

    // 3. Test database connection first
    console.log('🔍 Testing database connection...');
    const { data: testQuery, error: testError } = await supabase
      .from('votes')
      .select('id')
      .limit(1);
    
    if (testError) {
      console.log('❌ Database connection failed:', testError);
      return NextResponse.json({ error: 'Database connection failed', details: testError.message }, { status: 500 });
    }
    console.log('✅ Database connection working');

    // 4. Check if new columns exist
    console.log('🔍 Checking for existing vote...');
    const { data: existingVote, error: checkError } = await supabase
      .from('votes')
      .select('id, sentiment, vote_type, entity_id')
      .eq('vote_type', vote_type)
      .eq('entity_id', entity_id)
      .eq('device_id', device_id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.log('❌ Error checking existing vote:', checkError);
      return NextResponse.json({ 
        error: 'Database query error', 
        details: checkError.message,
        code: checkError.code 
      }, { status: 500 });
    }

    if (existingVote) {
      console.log('✅ Found existing vote:', existingVote);
      if (existingVote.sentiment === sentiment) {
        return NextResponse.json({ message: 'You have already voted for this!' }, { status: 409 });
      }
      // For now, just return success for updates to avoid complexity
      return NextResponse.json({ status: 'VOTE_UNCHANGED', message: 'Vote update would happen here' });
    }

    // 5. Try to insert new vote
    console.log('📝 Attempting to insert new vote...');
    const insertData = {
      vote_type,
      entity_id,
      method_id: context_id || null,
      sentiment,
      ip_address,
      device_id,
      tool_id: vote_type === 'tool' ? entity_id : null,
    };
    
    console.log('📊 Insert data:', insertData);

    const { data: insertResult, error: insertError } = await supabase
      .from('votes')
      .insert(insertData)
      .select('*');

    if (insertError) {
      console.log('❌ Insert failed:', insertError);
      return NextResponse.json({ 
        error: 'Failed to save vote', 
        details: insertError.message,
        code: insertError.code,
        hint: insertError.hint
      }, { status: 500 });
    }

    console.log('✅ Vote inserted successfully:', insertResult);
    return NextResponse.json({ status: 'VOTE_CREATED', message: 'Thanks for your feedback!' });

  } catch (error) {
    console.log('💥 Unexpected error:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 