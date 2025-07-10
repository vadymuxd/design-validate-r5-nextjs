-- ============================================================================
-- METHOD SCORE REFACTOR MIGRATION SCRIPT
-- ============================================================================
-- This script:
-- 1. Removes unused aggregated_upvotes and aggregated_downvotes columns
-- 2. Adds initial_score column to methods table
-- 3. Backfills initial_score with provided values
-- 4. Updates the scoring function to use new logic

-- ============================================================================
-- STEP 1: Remove unused aggregated columns from methods table
-- ============================================================================
ALTER TABLE methods 
DROP COLUMN IF EXISTS aggregated_upvotes,
DROP COLUMN IF EXISTS aggregated_downvotes;

-- ============================================================================
-- STEP 2: Add initial_score column
-- ============================================================================
ALTER TABLE methods 
ADD COLUMN IF NOT EXISTS initial_score INTEGER DEFAULT 0;

-- ============================================================================
-- STEP 3: Backfill initial_score values by method name
-- ============================================================================
UPDATE methods SET initial_score = 3245 WHERE name = 'User Interviews';
UPDATE methods SET initial_score = 2987 WHERE name = 'Usability Testing';
UPDATE methods SET initial_score = 2765 WHERE name = 'Surveys';
UPDATE methods SET initial_score = 2543 WHERE name = 'A/B Testing';
UPDATE methods SET initial_score = 2311 WHERE name = 'User Feedback';
UPDATE methods SET initial_score = 2189 WHERE name = 'Event Tracking';
UPDATE methods SET initial_score = 1976 WHERE name = 'Funnels';
UPDATE methods SET initial_score = 1854 WHERE name = 'User Data Intelligence';
UPDATE methods SET initial_score = 1672 WHERE name = 'Heatmaps';
UPDATE methods SET initial_score = 1539 WHERE name = 'Session Replays';
UPDATE methods SET initial_score = 1287 WHERE name = 'Concept Testing';
UPDATE methods SET initial_score = 943 WHERE name = 'Card Sorting';
UPDATE methods SET initial_score = 765 WHERE name = 'Tree Testing';
UPDATE methods SET initial_score = 654 WHERE name = 'Form Analytics';
UPDATE methods SET initial_score = 521 WHERE name = 'First-Click Testing';
UPDATE methods SET initial_score = 389 WHERE name = 'AI Validation';

-- ============================================================================
-- STEP 4: Update the scoring function with new logic
-- ============================================================================
-- Drop the existing function first
DROP FUNCTION IF EXISTS get_methods_with_scores();

-- Create the function with new scoring logic
CREATE OR REPLACE FUNCTION get_methods_with_scores()
RETURNS TABLE (
    id BIGINT,
    name TEXT,
    slug TEXT,
    description TEXT,
    collection_id BIGINT,
    net_score BIGINT,
    current_upvotes INTEGER,
    current_downvotes INTEGER,
    initial_score INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        m.id,
        m.name,
        m.slug,
        m.description,
        m.collection_id,
        -- New scoring logic: initial_score + tool current votes
        COALESCE(m.initial_score, 0) + COALESCE(
            (SELECT 
                SUM(COALESCE(tl.current_upvotes, 0)) - SUM(COALESCE(tl.current_downvotes, 0))
             FROM tools_leaderboard tl 
             WHERE tl.method_id = m.id), 0
        ) + COALESCE(m.current_upvotes, 0) - COALESCE(m.current_downvotes, 0) as net_score,
        COALESCE(m.current_upvotes, 0) as current_upvotes,
        COALESCE(m.current_downvotes, 0) as current_downvotes,
        COALESCE(m.initial_score, 0) as initial_score
    FROM methods m
    INNER JOIN collections c ON m.collection_id = c.id
    WHERE c.slug = 'tools'
    ORDER BY net_score DESC, m.id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- STEP 5: Verification queries
-- ============================================================================
-- Check that aggregated columns are removed
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'methods' 
AND column_name LIKE 'aggregated%';

-- Check that initial_score column was added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'methods' 
AND column_name = 'initial_score';

-- Check backfilled data
SELECT name, initial_score 
FROM methods 
WHERE initial_score > 0
ORDER BY initial_score DESC;

-- Test the new scoring function
SELECT 
    id,
    name,
    initial_score,
    net_score,
    current_upvotes,
    current_downvotes,
    (net_score - initial_score) as tool_vote_contribution
FROM get_methods_with_scores()
ORDER BY net_score DESC
LIMIT 10;

-- ============================================================================
-- STEP 6: Summary
-- ============================================================================
SELECT 
    'Migration completed successfully!' as status,
    COUNT(*) as total_methods,
    SUM(CASE WHEN initial_score > 0 THEN 1 ELSE 0 END) as methods_with_initial_score,
    SUM(initial_score) as total_initial_score,
    MAX(initial_score) as highest_initial_score,
    MIN(initial_score) as lowest_initial_score
FROM methods; 