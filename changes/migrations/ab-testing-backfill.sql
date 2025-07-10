-- A/B Testing Tools Backfill - Add 10 New Tools to Category 3
-- Run this script to populate the A/B Testing category

-- ============================================================================
-- STEP 1: Insert all A/B Testing tools into the tools table
-- ============================================================================
INSERT INTO tools (name, description, website_url, logo_url) VALUES
('Optimizely', 'An enterprise-grade platform for robust, server-side experimentation', 'https://www.optimizely.com/', '/tools-logos/optimizely.png'),
('VWO', 'An all-in-one platform combining testing with behavioral analytics', 'https://vwo.com/', '/tools-logos/vwo.png'),
('Google Optimize', 'A free, widely-used tool that integrates natively with Google Analytics', 'https://optimize.google.com/', '/tools-logos/google-optimize.png'),
('AB Tasty', 'A unified platform for experimentation, personalization, and feature management', 'https://www.abtasty.com/', '/tools-logos/ab-tasty.png'),
('Kameleoon', 'A fast, reliable platform with a strong focus on personalization and AI features', 'https://www.kameleoon.com/', '/tools-logos/kameleoon.png'),
('Convert.com', 'A fast, privacy-focused testing tool with a large number of integrations', 'https://www.convert.com/', '/tools-logos/convert.png'),
('SiteSpect', 'A powerful server-side solution that avoids using JavaScript tags', 'https://www.sitespect.com/', '/tools-logos/sitespect.png'),
('Omniconvert', 'An all-in-one CRO platform that includes surveys and personalization', 'https://www.omniconvert.com/', '/tools-logos/omniconvert.png'),
('LaunchDarkly', 'A feature management platform with integrated A/B testing capabilities', 'https://launchdarkly.com/', '/tools-logos/launchdarkly.png'),
('Crazy Egg', 'A simple tool focused on heatmaps with basic A/B testing functionality', 'https://www.crazyegg.com/', '/tools-logos/crazy-egg.png')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- STEP 2: Add all tools to the leaderboard for A/B Testing (category 3)
-- ============================================================================
INSERT INTO tool_category_leaderboard (tool_id, category_id, initial_upvotes, initial_downvotes, current_upvotes, current_downvotes)
SELECT 
    t.id,
    3, -- A/B Testing category
    CASE t.name
        WHEN 'Optimizely' THEN 300
        WHEN 'VWO' THEN 280
        WHEN 'Google Optimize' THEN 250
        WHEN 'AB Tasty' THEN 200
        WHEN 'Kameleoon' THEN 180
        WHEN 'Convert.com' THEN 160
        WHEN 'SiteSpect' THEN 140
        WHEN 'Omniconvert' THEN 120
        WHEN 'LaunchDarkly' THEN 190
        WHEN 'Crazy Egg' THEN 100
    END as initial_upvotes,
    CASE t.name
        WHEN 'Optimizely' THEN 70
        WHEN 'VWO' THEN 60
        WHEN 'Google Optimize' THEN 100
        WHEN 'AB Tasty' THEN 60
        WHEN 'Kameleoon' THEN 50
        WHEN 'Convert.com' THEN 40
        WHEN 'SiteSpect' THEN 50
        WHEN 'Omniconvert' THEN 40
        WHEN 'LaunchDarkly' THEN 120
        WHEN 'Crazy Egg' THEN 80
    END as initial_downvotes,
    0, -- current_upvotes
    0  -- current_downvotes
FROM tools t
WHERE t.name IN (
    'Optimizely', 'VWO', 'Google Optimize', 'AB Tasty', 'Kameleoon',
    'Convert.com', 'SiteSpect', 'Omniconvert', 'LaunchDarkly', 'Crazy Egg'
)
ON CONFLICT (tool_id, category_id) DO UPDATE SET
    initial_upvotes = EXCLUDED.initial_upvotes,
    initial_downvotes = EXCLUDED.initial_downvotes;

-- ============================================================================
-- STEP 3: Add pros/cons for all A/B Testing tools
-- ============================================================================
INSERT INTO tool_pros_and_cons (tool_id, category_id, pro_text, con_text)
SELECT 
    t.id,
    3, -- A/B Testing category
    CASE t.name
        WHEN 'Optimizely' THEN 'Powerful statistical engine, strong for complex tests, good security'
        WHEN 'VWO' THEN 'Easy-to-use visual editor, strong reporting, includes heatmaps'
        WHEN 'Google Optimize' THEN 'Free to use, easy integration with GA4, familiar interface'
        WHEN 'AB Tasty' THEN 'Strong client-side testing, good personalization features'
        WHEN 'Kameleoon' THEN 'Server-side testing, AI-powered personalization, good performance'
        WHEN 'Convert.com' THEN 'Great performance (no flicker), strong privacy compliance (GDPR/CCPA)'
        WHEN 'SiteSpect' THEN 'No client-side flicker, robust for complex sites, strong security'
        WHEN 'Omniconvert' THEN 'Good value for money, combines multiple CRO tools'
        WHEN 'LaunchDarkly' THEN 'Excellent for feature flagging and phased rollouts for developers'
        WHEN 'Crazy Egg' THEN 'Very easy to use for beginners, visual editor is intuitive'
    END as pro_text,
    CASE t.name
        WHEN 'Optimizely' THEN 'Very expensive, steep learning curve, requires developer support'
        WHEN 'VWO' THEN 'Can get expensive, some users report occasional editor bugs'
        WHEN 'Google Optimize' THEN 'Sunsetting in Sept 2023, limited features compared to paid tools'
        WHEN 'AB Tasty' THEN 'Can be complex to navigate, some analytics are less intuitive'
        WHEN 'Kameleoon' THEN 'Less known in the market, pricing can be high for some'
        WHEN 'Convert.com' THEN 'UI feels dated compared to others, fewer features than all-in-one tools'
        WHEN 'SiteSpect' THEN 'Requires deep technical expertise, complex setup, expensive'
        WHEN 'Omniconvert' THEN 'Less powerful for complex tests, smaller feature set than leaders'
        WHEN 'LaunchDarkly' THEN 'A/B testing is a secondary feature, not its core strength'
        WHEN 'Crazy Egg' THEN 'A/B testing features are very limited and not statistically robust'
    END as con_text
FROM tools t
WHERE t.name IN (
    'Optimizely', 'VWO', 'Google Optimize', 'AB Tasty', 'Kameleoon',
    'Convert.com', 'SiteSpect', 'Omniconvert', 'LaunchDarkly', 'Crazy Egg'
)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check that all tools were added
SELECT 
    name,
    LEFT(description, 60) || '...' as description_preview
FROM tools 
WHERE name IN (
    'Optimizely', 'VWO', 'Google Optimize', 'AB Tasty', 'Kameleoon',
    'Convert.com', 'SiteSpect', 'Omniconvert', 'LaunchDarkly', 'Crazy Egg'
)
ORDER BY name;

-- Check leaderboard for A/B Testing category (should show 10 tools)
SELECT 
    t.name,
    tcl.initial_upvotes,
    tcl.initial_downvotes,
    (tcl.initial_upvotes - tcl.initial_downvotes) as sentiment_score
FROM tool_category_leaderboard tcl
JOIN tools t ON tcl.tool_id = t.id
WHERE tcl.category_id = 3
ORDER BY (tcl.initial_upvotes - tcl.initial_downvotes) DESC;

-- Check pros/cons were added
SELECT 
    t.name,
    LEFT(tpc.pro_text, 50) || '...' as pro_preview,
    LEFT(tpc.con_text, 50) || '...' as con_preview
FROM tool_pros_and_cons tpc
JOIN tools t ON tpc.tool_id = t.id
WHERE tpc.category_id = 3
ORDER BY t.name;

-- Check category info
SELECT 
    c.name as category_name,
    COUNT(tcl.tool_id) as tool_count
FROM categories c
LEFT JOIN tool_category_leaderboard tcl ON c.id = tcl.category_id
WHERE c.id = 3
GROUP BY c.id, c.name; 