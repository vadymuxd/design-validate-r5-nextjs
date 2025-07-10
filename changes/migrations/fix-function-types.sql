-- Fix for function type mismatch - use correct PostgreSQL data types

-- Drop the existing function first
DROP FUNCTION IF EXISTS get_methods_with_scores();

-- Create the function with correct data types
CREATE OR REPLACE FUNCTION get_methods_with_scores()
RETURNS TABLE (
    id BIGINT,
    name TEXT,
    slug TEXT,
    description TEXT,
    collection_id BIGINT,
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
        COALESCE(
            (SELECT 
                SUM(COALESCE(tl.initial_upvotes, 0) + COALESCE(tl.current_upvotes, 0)) -
                SUM(COALESCE(tl.initial_downvotes, 0) + COALESCE(tl.current_downvotes, 0))
             FROM tools_leaderboard tl 
             WHERE tl.method_id = m.id), 0
        ) + COALESCE(m.current_upvotes, 0) - COALESCE(m.current_downvotes, 0) as net_score,
        COALESCE(m.current_upvotes, 0) as current_upvotes,
        COALESCE(m.current_downvotes, 0) as current_downvotes
    FROM methods m
    INNER JOIN collections c ON m.collection_id = c.id
    WHERE c.slug = 'tools'
    ORDER BY net_score DESC, m.id;
END;
$$ LANGUAGE plpgsql;

-- Test the function
SELECT 
    id,
    name,
    slug,
    LEFT(description, 50) || '...' as description_preview,
    net_score,
    current_upvotes,
    current_downvotes
FROM get_methods_with_scores()
ORDER BY net_score DESC, id
LIMIT 5;

-- Show summary
SELECT 
    'Function fixed and working!' as status,
    COUNT(*) as total_methods,
    SUM(CASE WHEN description IS NOT NULL AND description != '' THEN 1 ELSE 0 END) as methods_with_descriptions,
    SUM(net_score) as total_net_score
FROM get_methods_with_scores(); 