-- ============================================================================
-- FIX METHOD SCORING FUNCTION TO INCLUDE BOTH INITIAL AND CURRENT VOTES
-- ============================================================================
-- This script fixes the get_methods_with_scores() function to properly include
-- both initial_upvotes/downvotes AND current_upvotes/downvotes from tools_leaderboard
-- 
-- PROBLEM: The function was only considering current_upvotes/downvotes, 
-- but tool backfills use initial_upvotes/downvotes
--
-- SOLUTION: Update the function to sum BOTH initial + current votes

-- Drop the existing function first
DROP FUNCTION IF EXISTS get_methods_with_scores();

-- Create the corrected function that includes BOTH initial and current votes
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
        -- CORRECTED scoring logic: initial_score + tool votes (initial + current) + method votes
        COALESCE(m.initial_score, 0) + COALESCE(
            (SELECT 
                -- Include BOTH initial and current votes from tools_leaderboard
                SUM(COALESCE(tl.initial_upvotes, 0) + COALESCE(tl.current_upvotes, 0)) - 
                SUM(COALESCE(tl.initial_downvotes, 0) + COALESCE(tl.current_downvotes, 0))
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
-- VERIFICATION QUERIES
-- ============================================================================

-- Test 1: Check User Interview method before and after
SELECT 
    'User Interviews Method Score (after fix)' as test,
    name,
    initial_score,
    net_score,
    (net_score - initial_score) as tool_contribution
FROM get_methods_with_scores()
WHERE slug = 'user-interviews';

-- Test 2: Show top methods with their tool contributions
SELECT 
    'Top Methods with Tool Contributions' as test,
    name,
    initial_score,
    net_score,
    (net_score - initial_score) as tool_contribution
FROM get_methods_with_scores()
ORDER BY net_score DESC
LIMIT 5;

-- Test 3: Verify User Interview tools are contributing to method score
SELECT 
    'User Interview Tools Contributing to Method Score' as test,
    t.name as tool_name,
    tl.initial_upvotes,
    tl.initial_downvotes,
    tl.current_upvotes,
    tl.current_downvotes,
    (tl.initial_upvotes + tl.current_upvotes) - (tl.initial_downvotes + tl.current_downvotes) as net_contribution
FROM tools t
JOIN tools_leaderboard tl ON t.id = tl.tool_id
JOIN methods m ON tl.method_id = m.id
WHERE m.slug = 'user-interviews'
ORDER BY net_contribution DESC;

-- Test 4: Show total tool votes contributing to User Interviews method
SELECT 
    'Total User Interview Tool Votes' as summary,
    COUNT(*) as tool_count,
    SUM(tl.initial_upvotes + tl.current_upvotes) as total_upvotes,
    SUM(tl.initial_downvotes + tl.current_downvotes) as total_downvotes,
    SUM((tl.initial_upvotes + tl.current_upvotes) - (tl.initial_downvotes + tl.current_downvotes)) as net_tool_contribution
FROM tools_leaderboard tl
JOIN methods m ON tl.method_id = m.id
WHERE m.slug = 'user-interviews';

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================
SELECT 
    'Method scoring function fixed!' as status,
    'Method scores now include both initial and current tool votes' as description,
    'This should fix the all-in view aggregation as well' as impact;
