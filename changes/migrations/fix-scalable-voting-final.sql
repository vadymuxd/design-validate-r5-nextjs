-- ============================================================================
-- FIX SCALABLE VOTING - SINGLE SCRIPT
-- ============================================================================
-- This single script completes the scalable voting migration
-- Run this after simple-voting-fix.sql and fix-voting-system-migration.sql

-- Drop existing functions first to avoid conflicts
DROP FUNCTION IF EXISTS get_methods_with_scores();
DROP FUNCTION IF EXISTS count_entity_votes(vote_entity_type, text, bigint);
DROP FUNCTION IF EXISTS count_method_votes(bigint);

-- Create vote entity type enum
CREATE TYPE vote_entity_type AS ENUM (
  'tool', 
  'method', 
  'case', 
  'metric', 
  'article', 
  'framework'
);

-- Add new columns for scalable voting
ALTER TABLE votes 
ADD COLUMN vote_type vote_entity_type,
ADD COLUMN entity_id text;

-- Backfill existing tool votes
UPDATE votes 
SET 
  vote_type = 'tool',
  entity_id = tool_id::text
WHERE tool_id IS NOT NULL;

-- Backfill existing method votes  
UPDATE votes 
SET 
  vote_type = 'method',
  entity_id = method_id::text
WHERE tool_id IS NULL;

-- Make new columns required
ALTER TABLE votes 
ALTER COLUMN vote_type SET NOT NULL,
ALTER COLUMN entity_id SET NOT NULL;

-- Add performance indexes
CREATE INDEX idx_votes_type_entity_device ON votes (vote_type, entity_id, device_id);
CREATE INDEX idx_votes_type_entity_context ON votes (vote_type, entity_id, method_id);

-- Create generic vote counting function
CREATE OR REPLACE FUNCTION count_entity_votes(
  entity_type vote_entity_type,
  entity_id_param text,
  context_id_param bigint DEFAULT NULL
)
RETURNS TABLE (
  upvotes bigint,
  downvotes bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) FILTER (WHERE sentiment = 'UPVOTE') as upvotes,
    COUNT(*) FILTER (WHERE sentiment = 'DOWNVOTE') as downvotes
  FROM votes 
  WHERE vote_type = entity_type 
    AND entity_id = entity_id_param
    AND (context_id_param IS NULL OR method_id = context_id_param);
END;
$$ LANGUAGE plpgsql;

-- Create updated scoring function with new return type
CREATE OR REPLACE FUNCTION get_methods_with_scores()
RETURNS TABLE (
    id BIGINT,
    name TEXT,
    slug TEXT,
    description TEXT,
    collection_id BIGINT,
    initial_score INTEGER,
    net_score BIGINT,
    current_upvotes INTEGER,
    current_downvotes INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        m.id,
        m.name,
        m.slug,
        m.description,
        m.collection_id,
        COALESCE(m.initial_score, 0) as initial_score,
        -- New scoring logic using generic vote structure
        COALESCE(m.initial_score, 0) + COALESCE(
            (SELECT 
                SUM(COALESCE(tl.current_upvotes, 0)) - SUM(COALESCE(tl.current_downvotes, 0))
             FROM tools_leaderboard tl 
             WHERE tl.method_id = m.id), 0
        ) + COALESCE(
            (SELECT 
                COUNT(*) FILTER (WHERE sentiment = 'UPVOTE') - 
                COUNT(*) FILTER (WHERE sentiment = 'DOWNVOTE')
             FROM votes v
             WHERE v.vote_type = 'method' 
               AND v.entity_id = m.id::text), 0
        ) as net_score,
        COALESCE(m.current_upvotes, 0) as current_upvotes,
        COALESCE(m.current_downvotes, 0) as current_downvotes
    FROM methods m
    JOIN collections c ON m.collection_id = c.id 
    WHERE c.slug = 'tools'
    ORDER BY net_score DESC;
END;
$$ LANGUAGE plpgsql;

-- Verify the migration worked
SELECT 
  vote_type,
  COUNT(*) as total_votes,
  COUNT(*) FILTER (WHERE sentiment = 'UPVOTE') as upvotes,
  COUNT(*) FILTER (WHERE sentiment = 'DOWNVOTE') as downvotes
FROM votes 
GROUP BY vote_type;

-- Success message
SELECT 'Scalable voting architecture completed! Ready for tools, methods, cases, metrics, articles, and frameworks!' as result; 