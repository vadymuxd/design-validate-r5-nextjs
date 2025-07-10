-- ============================================================================
-- SCALABLE VOTING SYSTEM MIGRATION
-- ============================================================================
-- This migration transforms the voting system to support any votable entity
-- using generic vote_type and entity_id fields

-- ============================================================================
-- STEP 1: Add new generic columns to votes table
-- ============================================================================

-- Add vote_type enum to define what type of entity is being voted on
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

-- ============================================================================
-- STEP 2: Backfill existing data to use new structure
-- ============================================================================

-- Update existing tool votes
UPDATE votes 
SET 
  vote_type = 'tool',
  entity_id = tool_id::text
WHERE tool_id IS NOT NULL;

-- Update existing method votes  
UPDATE votes 
SET 
  vote_type = 'method',
  entity_id = method_id::text
WHERE tool_id IS NULL;

-- ============================================================================
-- STEP 3: Add constraints after backfill
-- ============================================================================

-- Make vote_type and entity_id required (after backfill)
ALTER TABLE votes 
ALTER COLUMN vote_type SET NOT NULL,
ALTER COLUMN entity_id SET NOT NULL;

-- Add index for performance on the new query pattern
CREATE INDEX idx_votes_type_entity_device ON votes (vote_type, entity_id, device_id);
CREATE INDEX idx_votes_type_entity_context ON votes (vote_type, entity_id, method_id);

-- ============================================================================
-- STEP 4: Create generic vote counting function
-- ============================================================================

-- Drop existing function first (if it exists)
DROP FUNCTION IF EXISTS count_entity_votes(vote_entity_type, text, bigint);

-- Create new generic vote counting function
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

-- ============================================================================
-- STEP 5: Test the new system
-- ============================================================================

-- Test tool vote counting
SELECT 'Tool votes test:' as test_name;
SELECT * FROM count_entity_votes('tool', (
  SELECT entity_id FROM votes WHERE vote_type = 'tool' LIMIT 1
));

-- Test method vote counting  
SELECT 'Method votes test:' as test_name;
SELECT * FROM count_entity_votes('method', (
  SELECT entity_id FROM votes WHERE vote_type = 'method' LIMIT 1
));

-- ============================================================================
-- STEP 6: Update scoring function to use new structure
-- ============================================================================

-- Drop existing function first (required when changing return type)
DROP FUNCTION IF EXISTS get_methods_with_scores();

-- Create new function with updated return type
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

-- ============================================================================
-- STEP 7: Future entity examples (for reference)
-- ============================================================================

-- Example: Voting on cases
-- INSERT INTO votes (vote_type, entity_id, method_id, sentiment, device_id, ip_address)
-- VALUES ('case', 'case-slug-123', NULL, 'UPVOTE', 'device123', 'ip');

-- Example: Voting on metrics  
-- INSERT INTO votes (vote_type, entity_id, method_id, sentiment, device_id, ip_address)
-- VALUES ('metric', 'conversion-rate', 5, 'UPVOTE', 'device123', 'ip');

-- Example: Voting on articles
-- INSERT INTO votes (vote_type, entity_id, method_id, sentiment, device_id, ip_address)  
-- VALUES ('article', 'how-to-ab-test', NULL, 'UPVOTE', 'device123', 'ip');

-- ============================================================================
-- STEP 8: Verification queries
-- ============================================================================

-- Show current vote distribution by type
SELECT 
  vote_type,
  COUNT(*) as total_votes,
  COUNT(*) FILTER (WHERE sentiment = 'UPVOTE') as upvotes,
  COUNT(*) FILTER (WHERE sentiment = 'DOWNVOTE') as downvotes
FROM votes 
GROUP BY vote_type;

-- Show table structure (using standard SQL instead of psql \d command)
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'votes' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Test generic counting function
SELECT 'Generic vote counting works!' as status; 