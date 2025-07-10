-- Usability Testing Tools Backfill - SINGLE CONSOLIDATED QUERY
-- Run this ONE query to update everything for Category 1 (Usability Testing)

-- Update vote counts, pros/cons, and tool descriptions all at once
WITH updated_leaderboard AS (
    UPDATE tool_category_leaderboard 
    SET 
        initial_upvotes = CASE tool_id
            WHEN (SELECT id FROM tools WHERE name = 'UserTesting') THEN 310
            WHEN (SELECT id FROM tools WHERE name = 'UXTweak') THEN 240
            WHEN (SELECT id FROM tools WHERE name = 'Optimal Workshop') THEN 180
            WHEN (SELECT id FROM tools WHERE name = 'Userlytics') THEN 170
            WHEN (SELECT id FROM tools WHERE name = 'UserZoom') THEN 160
            WHEN (SELECT id FROM tools WHERE name = 'Userfeel') THEN 120
            WHEN (SELECT id FROM tools WHERE name = 'UsabilityHub') THEN 120
            WHEN (SELECT id FROM tools WHERE name = 'Maze') THEN 200
            WHEN (SELECT id FROM tools WHERE name = 'Userbrain') THEN 100
            WHEN (SELECT id FROM tools WHERE name = 'Lookback') THEN 90
            ELSE initial_upvotes
        END,
        initial_downvotes = CASE tool_id
            WHEN (SELECT id FROM tools WHERE name = 'UserTesting') THEN 110
            WHEN (SELECT id FROM tools WHERE name = 'UXTweak') THEN 60
            WHEN (SELECT id FROM tools WHERE name = 'Optimal Workshop') THEN 40
            WHEN (SELECT id FROM tools WHERE name = 'Userlytics') THEN 50
            WHEN (SELECT id FROM tools WHERE name = 'UserZoom') THEN 65
            WHEN (SELECT id FROM tools WHERE name = 'Userfeel') THEN 35
            WHEN (SELECT id FROM tools WHERE name = 'UsabilityHub') THEN 60
            WHEN (SELECT id FROM tools WHERE name = 'Maze') THEN 145
            WHEN (SELECT id FROM tools WHERE name = 'Userbrain') THEN 50
            WHEN (SELECT id FROM tools WHERE name = 'Lookback') THEN 110
            ELSE initial_downvotes
        END
    WHERE category_id = 1
    RETURNING tool_id
),
updated_pros_cons AS (
    UPDATE tool_pros_and_cons 
    SET 
        pro_text = CASE 
            WHEN tool_id = (SELECT id FROM tools WHERE name = 'UserTesting') THEN 'Massive panel, strong demographic filtering, high-quality video insights'
            WHEN tool_id = (SELECT id FROM tools WHERE name = 'UXTweak') THEN 'All-in-one platform, quality participant panel, good analytics'
            WHEN tool_id = (SELECT id FROM tools WHERE name = 'Optimal Workshop') THEN 'Best-in-class for card sorting & tree testing, clear reports'
            WHEN tool_id = (SELECT id FROM tools WHERE name = 'Userlytics') THEN 'Global panel, advanced screening logic, flexible study options'
            WHEN tool_id = (SELECT id FROM tools WHERE name = 'UserZoom') THEN 'Advanced quantitative metrics, flexible recruiting, robust features'
            WHEN tool_id = (SELECT id FROM tools WHERE name = 'Userfeel') THEN 'Flexible pricing (no subscription), fast turnaround, multilingual panel'
            WHEN tool_id = (SELECT id FROM tools WHERE name = 'UsabilityHub') THEN 'Extremely fast for simple tests, intuitive, affordable'
            WHEN tool_id = (SELECT id FROM tools WHERE name = 'Maze') THEN 'Deep Figma integration, fast results, beautiful reports'
            WHEN tool_id = (SELECT id FROM tools WHERE name = 'Userbrain') THEN 'Simple setup, consistent weekly tests, predictable pricing'
            WHEN tool_id = (SELECT id FROM tools WHERE name = 'Lookback') THEN 'Excellent for live moderated testing, records multiple streams'
            ELSE pro_text
        END,
        con_text = CASE 
            WHEN tool_id = (SELECT id FROM tools WHERE name = 'UserTesting') THEN 'Very expensive, some panel quality issues despite screeners, slow'
            WHEN tool_id = (SELECT id FROM tools WHERE name = 'UXTweak') THEN 'Can be complex to learn, UI feels less polished than some rivals'
            WHEN tool_id = (SELECT id FROM tools WHERE name = 'Optimal Workshop') THEN 'Core usability testing features are less developed than its IA tools'
            WHEN tool_id = (SELECT id FROM tools WHERE name = 'Userlytics') THEN 'UI can be complex, pricing can be high for smaller teams'
            WHEN tool_id = (SELECT id FROM tools WHERE name = 'UserZoom') THEN 'Complex UI, very high cost, now merged with UserTesting'
            WHEN tool_id = (SELECT id FROM tools WHERE name = 'Userfeel') THEN 'Reporting is less robust, test setup is more basic than others'
            WHEN tool_id = (SELECT id FROM tools WHERE name = 'UsabilityHub') THEN 'Not suitable for task-based usability testing, limited test types'
            WHEN tool_id = (SELECT id FROM tools WHERE name = 'Maze') THEN 'Widespread and severe complaints about poor participant panel quality'
            WHEN tool_id = (SELECT id FROM tools WHERE name = 'Userbrain') THEN 'Not flexible for one-off projects, smaller feature set'
            WHEN tool_id = (SELECT id FROM tools WHERE name = 'Lookback') THEN 'Widely reported technical bugs, frequent connection drops, poor reliability'
            ELSE con_text
        END
    WHERE category_id = 1
    RETURNING tool_id
)
UPDATE tools 
SET description = CASE name
    WHEN 'UserTesting' THEN 'Offers unparalleled access to a large, diverse participant panel for video feedback'
    WHEN 'UXTweak' THEN 'Provides a broad suite of testing tools, including usability and IA, at a great value'
    WHEN 'Optimal Workshop' THEN 'The industry standard for information architecture testing with specialized tools'
    WHEN 'Userlytics' THEN 'An enterprise-ready platform with a flexible global panel and advanced testing features'
    WHEN 'UserZoom' THEN 'An enterprise platform combining deep quantitative analytics with qualitative feedback'
    WHEN 'Userfeel' THEN 'A pay-as-you-go model perfect for quick, ad-hoc usability tests'
    WHEN 'UsabilityHub' THEN 'The fastest tool for simple, unmoderated preference and first-click tests'
    WHEN 'Maze' THEN 'Delivers rapid, unmoderated prototype testing integrated directly into Figma'
    WHEN 'Userbrain' THEN 'A simple, subscription-based service for continuous, automated testing'
    WHEN 'Lookback' THEN 'Focuses exclusively on real-time, moderated user interview sessions'
    ELSE description
END
WHERE name IN (
    'UserTesting', 'UXTweak', 'Optimal Workshop', 'Userlytics', 'UserZoom', 
    'Userfeel', 'UsabilityHub', 'Maze', 'Userbrain', 'Lookback'
);

-- VERIFICATION QUERIES (run these separately to check results)

-- Check final leaderboard
SELECT 
    t.name,
    tcl.initial_upvotes,
    tcl.initial_downvotes,
    (tcl.initial_upvotes - tcl.initial_downvotes) as sentiment_score
FROM tool_category_leaderboard tcl
JOIN tools t ON tcl.tool_id = t.id
WHERE tcl.category_id = 1
ORDER BY (tcl.initial_upvotes - tcl.initial_downvotes) DESC;

-- Check pros/cons preview
SELECT 
    t.name,
    LEFT(tpc.pro_text, 50) || '...' as pro_preview,
    LEFT(tpc.con_text, 50) || '...' as con_preview
FROM tool_pros_and_cons tpc
JOIN tools t ON tpc.tool_id = t.id
WHERE tpc.category_id = 1
ORDER BY t.name;

-- Check tool descriptions
SELECT 
    name,
    LEFT(description, 60) || '...' as description_preview
FROM tools 
WHERE name IN (
    'UserTesting', 'UXTweak', 'Optimal Workshop', 'Userlytics', 'UserZoom', 
    'Userfeel', 'UsabilityHub', 'Maze', 'Userbrain', 'Lookback'
)
ORDER BY name; 