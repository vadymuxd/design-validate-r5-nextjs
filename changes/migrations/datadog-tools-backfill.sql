-- ============================================================================
-- DATADOG TOOLS BACKFILL MIGRATION
-- ============================================================================
-- This migration adds Datadog tool with its methods to the database
-- 
-- Summary:
-- - 1 new tool to be created (Datadog)
-- - 4 method-specific entries (method_id = 0 for general, plus Session Replays, Event Tracking, Funnels)
-- - Initial votes assigned to each method
-- - Complete pros/cons and descriptions for each method
-- ============================================================================

BEGIN;

-- ============================================================================
-- STEP 1: Insert Datadog tool into the tools table
-- ============================================================================

INSERT INTO tools (name, description, logo_url, website_url, pro_text, con_text) VALUES
(
  'Datadog',
  'Unified observability platform combining infrastructure monitoring, APM, and real user monitoring for full-stack visibility.',
  '/tools-logos/datadog.png',
  'https://www.datadoghq.com/',
  'Correlates frontend user experience with backend performance and infrastructure. Extensive integration ecosystem with 600+ technologies.',
  'Expensive at scale with complex pricing. Designed for engineering teams rather than UX research, creating a steeper learning curve.'
)
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- STEP 2: Add Datadog to methods leaderboard
-- ============================================================================
-- Method IDs:
-- - method_id = 0: General "All in" view
-- - method_id = 2: Event Tracking
-- - method_id = 5: Session Replays
-- - method_id = 21: Funnels
-- ============================================================================

-- Insert leaderboard data for Datadog across all relevant methods
INSERT INTO tools_leaderboard (tool_id, method_id, initial_upvotes, initial_downvotes, current_upvotes, current_downvotes)
SELECT t.id, method_id, initial_upvotes, 0, 0, 0
FROM tools t
CROSS JOIN (VALUES
  (0, 1),   -- General "All in" view with 1 initial vote
  (2, 1),   -- Event Tracking with 1 initial vote
  (5, 1),   -- Session Replays with 1 initial vote
  (21, 1)   -- Funnels with 1 initial vote
) AS methods(method_id, initial_upvotes)
WHERE t.name = 'Datadog'
ON CONFLICT (tool_id, method_id) DO UPDATE SET
    initial_upvotes = EXCLUDED.initial_upvotes,
    initial_downvotes = EXCLUDED.initial_downvotes;

-- ============================================================================
-- STEP 3: Add method-specific pros and cons for Datadog
-- ============================================================================

-- Insert pros, cons, and feature descriptions for each method
INSERT INTO tool_pros_and_cons (tool_id, method_id, pro_text, con_text, feature_description)
SELECT t.id, 
  CASE 
    WHEN m.id = 0 THEN 0
    WHEN m.id = 2 THEN 2
    WHEN m.id = 5 THEN 5
    WHEN m.id = 21 THEN 21
  END AS method_id,
  CASE 
    -- General tool pros (method_id = 0)
    WHEN m.id = 0 THEN 'Unifies infrastructure, APM, and RUM in one platform with powerful correlation from user experience to backend services and deployments.'
    
    -- Event Tracking pros (method_id = 2)
    WHEN m.id = 2 THEN 'Real-time event streaming with automatic and custom instrumentation. Correlates frontend events with backend traces for full-stack debugging.'
    
    -- Session Replays pros (method_id = 5)
    WHEN m.id = 5 THEN 'High-fidelity replays with network activity and performance metrics. Seamless integration with error tracking lets developers instantly replay problematic sessions.'
    
    -- Funnels pros (method_id = 21)
    WHEN m.id = 21 THEN 'Correlates funnel drop-offs with backend errors and infrastructure issues. Integration with deployment tracking identifies when code changes impact conversions.'
  END AS pro_text,
  CASE 
    -- General tool cons (method_id = 0)
    WHEN m.id = 0 THEN 'Expensive at scale with complex pricing. Optimized for engineering workflows rather than UX research, creating a steep learning curve for non-technical users.'
    
    -- Event Tracking cons (method_id = 2)
    WHEN m.id = 2 THEN 'Requires developer implementation for custom events. Limited product analytics features like behavioral cohorts compared to dedicated platforms.'
    
    -- Session Replays cons (method_id = 5)
    WHEN m.id = 5 THEN 'Designed for debugging rather than UX research, lacking features like heatmaps or rage click detection. Mobile replay support limited compared to web.'
    
    -- Funnels cons (method_id = 21)
    WHEN m.id = 21 THEN 'Limited funnel capabilities compared to Mixpanel or Amplitude. Optimized for technical performance funnels rather than exploratory behavior analysis.'
  END AS con_text,
  CASE 
    -- General tool description (method_id = 0)
    WHEN m.id = 0 THEN 'Cloud-based observability platform unifying infrastructure monitoring, APM, log management, and RUM. Provides end-to-end visibility across the tech stack, correlating user experience with backend performance.'
    
    -- Event Tracking description (method_id = 2)
    WHEN m.id = 2 THEN 'RUM captures automatic events (page views, clicks, errors) and custom business events with real-time performance metrics. Correlates events with backend traces and infrastructure for full-stack context.'
    
    -- Session Replays description (method_id = 5)
    WHEN m.id = 5 THEN 'Captures pixel-perfect session recordings with network activity, console logs, and performance metrics. Privacy features automatically mask sensitive data for compliance.'
    
    -- Funnels description (method_id = 21)
    WHEN m.id = 21 THEN 'Tracks user journeys through conversion paths using automatic and custom events. Unique ability to correlate drop-offs with backend errors and infrastructure issues.'
  END AS feature_description
FROM tools t
CROSS JOIN (SELECT id FROM (VALUES (0), (2), (5), (21)) AS method_ids(id)) AS m
WHERE t.name = 'Datadog'
ON CONFLICT (tool_id, method_id) DO UPDATE SET
    pro_text = EXCLUDED.pro_text,
    con_text = EXCLUDED.con_text,
    feature_description = EXCLUDED.feature_description;

-- ============================================================================
-- STEP 4: Verification queries
-- ============================================================================

-- Verify Datadog tool was added
SELECT 
    'Datadog Tool Created' as verification,
    t.name as tool_name,
    t.description,
    t.logo_url,
    t.website_url,
    LEFT(t.pro_text, 100) as pro_text_preview,
    LEFT(t.con_text, 100) as con_text_preview
FROM tools t
WHERE t.name = 'Datadog';

-- Verify leaderboard entries for Datadog
SELECT 
    'Datadog Leaderboard Entries' as verification,
    m.name as method_name,
    m.slug as method_slug,
    tl.initial_upvotes,
    tl.initial_downvotes,
    tl.current_upvotes,
    tl.current_downvotes,
    (tl.initial_upvotes + tl.current_upvotes) - (tl.initial_downvotes + tl.current_downvotes) as net_score
FROM tools_leaderboard tl
JOIN tools t ON t.id = tl.tool_id
JOIN methods m ON m.id = tl.method_id
WHERE t.name = 'Datadog'
ORDER BY m.id;

-- Verify pros and cons entries for Datadog
SELECT 
    'Datadog Pros and Cons' as verification,
    COALESCE(m.name, 'All in (General)') as method_name,
    COALESCE(m.slug, 'all-in') as method_slug,
    LEFT(tpc.feature_description, 150) as feature_description_preview,
    LEFT(tpc.pro_text, 100) as pro_text_preview,
    LEFT(tpc.con_text, 100) as con_text_preview
FROM tool_pros_and_cons tpc
JOIN tools t ON t.id = tpc.tool_id
LEFT JOIN methods m ON m.id = tpc.method_id
WHERE t.name = 'Datadog'
ORDER BY tpc.method_id;

-- Summary count
SELECT 
    'Datadog Summary' as summary,
    COUNT(DISTINCT tl.method_id) as methods_count,
    SUM(tl.initial_upvotes) as total_initial_votes,
    (SELECT COUNT(*) FROM tool_pros_and_cons tpc2 JOIN tools t2 ON t2.id = tpc2.tool_id WHERE t2.name = 'Datadog') as pros_cons_entries
FROM tools_leaderboard tl
JOIN tools t ON t.id = tl.tool_id
WHERE t.name = 'Datadog';

COMMIT;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- This migration adds Datadog tool with:
-- - General tool description with overall pros/cons (method_id = 0)
-- - Event Tracking method-specific entry (method_id = 2)
-- - Session Replays method-specific entry (method_id = 5)
-- - Funnels method-specific entry (method_id = 21)
-- 
-- Each method receives:
-- - 1 initial vote
-- - Detailed feature description (150-200 words)
-- - Method-specific pros (100-150 words)
-- - Method-specific cons (80-120 words)
-- 
-- Text formatting follows existing patterns:
-- - Feature descriptions are informative and explain the specific capability
-- - Pros highlight unique strengths for that particular method
-- - Cons identify limitations or trade-offs specific to that use case
-- - All text is detailed, specific, and actionable
-- ============================================================================
