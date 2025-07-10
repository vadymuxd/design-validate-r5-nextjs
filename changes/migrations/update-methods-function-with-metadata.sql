-- ============================================================================
-- UPDATE get_methods_with_scores FUNCTION TO INCLUDE METADATA
-- ============================================================================
-- This script updates the database function to return metadata along with method data

-- Drop the existing function first
DROP FUNCTION IF EXISTS get_methods_with_scores();

-- Create the updated function with metadata support
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
    current_downvotes INTEGER,
    metadata JSONB
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
        -- Scoring logic: initial_score + tool current votes + method votes
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
        COALESCE(m.current_downvotes, 0) as current_downvotes,
        COALESCE(m.metadata, '{}'::jsonb) as metadata
    FROM methods m
    JOIN collections c ON m.collection_id = c.id 
    WHERE c.slug = 'tools'
    ORDER BY net_score DESC;
END;
$$ LANGUAGE plpgsql;

-- Test the updated function
SELECT 
    name,
    slug,
    metadata->'research_type' as research_type,
    metadata->'cognitive_stage' as cognitive_stage,
    net_score
FROM get_methods_with_scores()
LIMIT 5;

-- Success message
SELECT 'Function updated successfully with metadata support!' as result; 