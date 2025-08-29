-- Add Statsig to Event Tracking Tools
-- Date: August 29, 2025
-- Purpose: Add Statsig as a new tool for Event Tracking method with score of 2
-- Method ID: 2 (Event Tracking)

-- Begin transaction
BEGIN;

-- ============================================================================
-- STEP 1: Insert Statsig into the tools table
-- ============================================================================

INSERT INTO tools (name, description, logo_url, website_url, pro_text, con_text) VALUES
(
  'Statsig', 
  'Feature management and experimentation platform with event tracking capabilities, offering feature flags, A/B testing, and basic product analytics for development teams.',
  '/tools-logos/statsig.png',
  'https://www.statsig.com/',
  'Developer-friendly platform, strong feature flag management, good A/B testing capabilities, generous free tier, and seamless integration with development workflows.',
  'Limited pure analytics depth compared to dedicated tools, primarily focused on experimentation, newer platform with smaller ecosystem, and basic event tracking features.'
)
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- STEP 2: Add Statsig to tools_leaderboard for Event Tracking method
-- ============================================================================

INSERT INTO tools_leaderboard (tool_id, method_id, initial_upvotes, initial_downvotes, current_upvotes, current_downvotes)
SELECT t.id, 2, 2, 0, 0, 0
FROM tools t
WHERE t.name = 'Statsig'
ON CONFLICT (tool_id, method_id) DO UPDATE SET
    initial_upvotes = EXCLUDED.initial_upvotes,
    initial_downvotes = EXCLUDED.initial_downvotes;

-- ============================================================================
-- STEP 3: Add Statsig to tool_pros_and_cons for Event Tracking method
-- ============================================================================

INSERT INTO tool_pros_and_cons (tool_id, method_id, feature_description, pro_text, con_text)
SELECT t.id, 2,
  'Feature management platform with basic event tracking, experimentation capabilities, and developer-focused analytics for measuring feature performance and user interactions.',
  'Strong developer integration, excellent feature flag management, good free tier for startups, easy SDK implementation, and combines experimentation with basic event tracking.',
  'Limited advanced analytics compared to dedicated platforms, primarily focused on feature management rather than deep product analytics, and newer in the pure event tracking space.'
FROM tools t
WHERE t.name = 'Statsig'
ON CONFLICT (tool_id, method_id) DO UPDATE SET
    feature_description = EXCLUDED.feature_description,
    pro_text = EXCLUDED.pro_text,
    con_text = EXCLUDED.con_text;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check that Statsig was added to tools table
SELECT 
    name,
    LEFT(description, 60) || '...' as description_preview,
    website_url,
    LEFT(pro_text, 50) || '...' as pro_preview,
    LEFT(con_text, 50) || '...' as con_preview
FROM tools t
WHERE t.name = 'Statsig';

-- Check Statsig was added to leaderboard for Event Tracking
SELECT 
    t.name,
    tl.method_id,
    tl.initial_upvotes,
    tl.initial_downvotes,
    tl.current_upvotes,
    tl.current_downvotes,
    (tl.initial_upvotes + tl.current_upvotes) - (tl.initial_downvotes + tl.current_downvotes) as net_score
FROM tools_leaderboard tl
JOIN tools t ON tl.tool_id = t.id
WHERE t.name = 'Statsig' AND tl.method_id = 2;

-- Check Statsig pros/cons for Event Tracking method
SELECT 
    t.name,
    tpc.method_id,
    LEFT(tpc.feature_description, 60) || '...' as feature_preview,
    LEFT(tpc.pro_text, 50) || '...' as pro_preview,
    LEFT(tpc.con_text, 50) || '...' as con_preview
FROM tool_pros_and_cons tpc
JOIN tools t ON tpc.tool_id = t.id
WHERE t.name = 'Statsig' AND tpc.method_id = 2;

-- Show updated Event Tracking leaderboard including Statsig
SELECT 
    t.name,
    tl.initial_upvotes,
    tl.initial_downvotes,
    (tl.initial_upvotes + tl.current_upvotes) - (tl.initial_downvotes + tl.current_downvotes) as net_score
FROM tools_leaderboard tl
JOIN tools t ON tl.tool_id = t.id
WHERE tl.method_id = 2
ORDER BY net_score DESC;

-- Commit the transaction
COMMIT;

-- Final verification
SELECT 
    'Statsig Added to Event Tracking' as status,
    COUNT(*) as tools_count
FROM tools t
JOIN tools_leaderboard tl ON t.id = tl.tool_id
JOIN tool_pros_and_cons tpc ON t.id = tpc.tool_id AND tpc.method_id = tl.method_id
WHERE t.name = 'Statsig' AND tl.method_id = 2 AND tpc.method_id = 2;
