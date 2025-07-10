-- ============================================================================
-- DEBUG: Check Database Migration Status
-- ============================================================================
-- Run this to see what's missing from your database migration

-- Check if vote_entity_type enum exists
SELECT 
  typname as enum_name,
  unnest(enum_range(NULL::vote_entity_type)) as enum_values
FROM pg_type 
WHERE typname = 'vote_entity_type';

-- Check votes table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'votes' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check if we have any votes with new structure
SELECT 
  COUNT(*) as total_votes,
  COUNT(vote_type) as votes_with_type,
  COUNT(entity_id) as votes_with_entity_id
FROM votes;

-- Show sample of existing votes
SELECT 
  id,
  method_id,
  tool_id,
  vote_type,
  entity_id,
  sentiment,
  device_id
FROM votes 
LIMIT 5; 