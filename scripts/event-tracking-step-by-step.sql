-- Event Tracking Tools Backfill - Step by Step Instructions
-- Run these queries IN ORDER, one at a time

-- ============================================================================
-- STEP 1: Add Adobe Analytics tool (if it doesn't exist)
-- ============================================================================
INSERT INTO tools (name, description, website_url, logo_url) 
VALUES ('Adobe Analytics', 'Provides the most comprehensive enterprise-grade analytics for the entire digital journey', 'https://business.adobe.com/products/analytics/adobe-analytics.html', '/tools-logos/adobe-analytics.png')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- STEP 2: Get Adobe Analytics UUID (copy this for next steps)
-- ============================================================================
SELECT id, name FROM tools WHERE name = 'Adobe Analytics';

-- ============================================================================
-- STEP 3: Add Adobe Analytics to leaderboard 
-- REPLACE 'PASTE_ADOBE_UUID_HERE' with the actual UUID from Step 2
-- ============================================================================
INSERT INTO tool_category_leaderboard (tool_id, category_id, initial_upvotes, initial_downvotes, current_upvotes, current_downvotes)
VALUES ('PASTE_ADOBE_UUID_HERE', 2, 220, 140, 0, 0)
ON CONFLICT (tool_id, category_id) DO UPDATE SET
    initial_upvotes = 220,
    initial_downvotes = 140;

-- ============================================================================
-- STEP 4: Add Adobe Analytics pros/cons
-- REPLACE 'PASTE_ADOBE_UUID_HERE' with the same UUID from Step 2
-- ============================================================================
INSERT INTO tool_pros_and_cons (tool_id, category_id, pro_text, con_text)
VALUES ('PASTE_ADOBE_UUID_HERE', 2, 
        'Unmatched power for deep data analysis, integrates with Adobe''s ecosystem', 
        'Extremely complex with a steep learning curve, requires dedicated analyst support')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- STEP 5: Update vote counts for existing Event Tracking tools
-- ============================================================================
UPDATE tool_category_leaderboard 
SET 
    initial_upvotes = CASE tool_id
        WHEN (SELECT id FROM tools WHERE name = 'Mixpanel') THEN 310
        WHEN (SELECT id FROM tools WHERE name = 'Amplitude') THEN 300
        WHEN (SELECT id FROM tools WHERE name = 'Heap') THEN 250
        WHEN (SELECT id FROM tools WHERE name = 'PostHog') THEN 210
        WHEN (SELECT id FROM tools WHERE name = 'Pendo') THEN 180
        WHEN (SELECT id FROM tools WHERE name = 'FullStory') THEN 150
        WHEN (SELECT id FROM tools WHERE name = 'Hotjar') THEN 110
        WHEN (SELECT id FROM tools WHERE name = 'Google Analytics 4') THEN 200
        WHEN (SELECT id FROM tools WHERE name = 'LogRocket') THEN 90
        WHEN (SELECT id FROM tools WHERE name = 'Indicative') THEN 130
        ELSE initial_upvotes
    END,
    initial_downvotes = CASE tool_id
        WHEN (SELECT id FROM tools WHERE name = 'Mixpanel') THEN 70
        WHEN (SELECT id FROM tools WHERE name = 'Amplitude') THEN 85
        WHEN (SELECT id FROM tools WHERE name = 'Heap') THEN 70
        WHEN (SELECT id FROM tools WHERE name = 'PostHog') THEN 40
        WHEN (SELECT id FROM tools WHERE name = 'Pendo') THEN 65
        WHEN (SELECT id FROM tools WHERE name = 'FullStory') THEN 60
        WHEN (SELECT id FROM tools WHERE name = 'Hotjar') THEN 50
        WHEN (SELECT id FROM tools WHERE name = 'Google Analytics 4') THEN 160
        WHEN (SELECT id FROM tools WHERE name = 'LogRocket') THEN 50
        WHEN (SELECT id FROM tools WHERE name = 'Indicative') THEN 30
        ELSE initial_downvotes
    END
WHERE category_id = 2;

-- ============================================================================
-- STEP 6: Update pros/cons for existing tools with new text
-- ============================================================================
UPDATE tool_pros_and_cons 
SET 
    pro_text = CASE 
        WHEN tool_id = (SELECT id FROM tools WHERE name = 'Mixpanel') THEN 'Best-in-class for funnels, flows, and retention reports'
        WHEN tool_id = (SELECT id FROM tools WHERE name = 'Amplitude') THEN 'Powerful segmentation & predictive features for advanced analysis'
        WHEN tool_id = (SELECT id FROM tools WHERE name = 'Heap') THEN 'Instantly analyze user actions without dev help; retroactive data'
        WHEN tool_id = (SELECT id FROM tools WHERE name = 'PostHog') THEN 'Combines events, replays, and feature flags in one platform'
        WHEN tool_id = (SELECT id FROM tools WHERE name = 'Pendo') THEN 'Act on insights with guides & polls in one tool; tracks adoption'
        WHEN tool_id = (SELECT id FROM tools WHERE name = 'FullStory') THEN 'See the ''why'' behind metrics with video-like session replay'
        WHEN tool_id = (SELECT id FROM tools WHERE name = 'Hotjar') THEN 'Extremely easy to use; simple event setup for basic goal tracking'
        WHEN tool_id = (SELECT id FROM tools WHERE name = 'Google Analytics 4') THEN 'Free to start; integrates well with Google Ads for attribution'
        WHEN tool_id = (SELECT id FROM tools WHERE name = 'LogRocket') THEN 'Connects user behavior to technical errors for bug-fixing'
        ELSE pro_text
    END,
    con_text = CASE 
        WHEN tool_id = (SELECT id FROM tools WHERE name = 'Mixpanel') THEN 'Requires initial developer setup for event tracking'
        WHEN tool_id = (SELECT id FROM tools WHERE name = 'Amplitude') THEN 'Steep learning curve; often too complex for simple questions'
        WHEN tool_id = (SELECT id FROM tools WHERE name = 'Heap') THEN 'Data can get messy without a clear tracking plan'
        WHEN tool_id = (SELECT id FROM tools WHERE name = 'PostHog') THEN 'Requires heavy engineering support; overkill for most PMs'
        WHEN tool_id = (SELECT id FROM tools WHERE name = 'Pendo') THEN 'Analytics less deep than competitors; can be complex to master'
        WHEN tool_id = (SELECT id FROM tools WHERE name = 'FullStory') THEN 'Very expensive; analytics less powerful than dedicated tools'
        WHEN tool_id = (SELECT id FROM tools WHERE name = 'Hotjar') THEN 'Event tracking is not robust enough for deep funnel or retention analysis'
        WHEN tool_id = (SELECT id FROM tools WHERE name = 'Google Analytics 4') THEN 'Confusing UI makes finding product insights difficult'
        WHEN tool_id = (SELECT id FROM tools WHERE name = 'LogRocket') THEN 'More focused on dev/support workflows than product insights'
        ELSE con_text
    END
WHERE category_id = 2;

-- ============================================================================
-- STEP 7: VERIFICATION - Check final results (should show 11 tools total)
-- ============================================================================
SELECT 
    t.name,
    tcl.initial_upvotes,
    tcl.initial_downvotes,
    (tcl.initial_upvotes - tcl.initial_downvotes) as sentiment_score
FROM tool_category_leaderboard tcl
JOIN tools t ON tcl.tool_id = t.id
WHERE tcl.category_id = 2
ORDER BY (tcl.initial_upvotes - tcl.initial_downvotes) DESC;

-- ============================================================================
-- STEP 8: VERIFICATION - Check pros/cons were updated
-- ============================================================================
SELECT 
    t.name,
    LEFT(tpc.pro_text, 50) || '...' as pro_preview,
    LEFT(tpc.con_text, 50) || '...' as con_preview
FROM tool_pros_and_cons tpc
JOIN tools t ON tpc.tool_id = t.id
WHERE tpc.category_id = 2
ORDER BY t.name; 