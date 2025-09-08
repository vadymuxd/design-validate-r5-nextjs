-- ============================================================================
-- HEATMAPS TOOLS BACKFILL MIGRATION
-- ============================================================================
-- This migration adds existing tools to the Heatmaps method (method_id = 6)
-- with initial vote scores and method-specific pros/cons descriptions
-- ============================================================================

BEGIN;

-- ============================================================================
-- STEP 1: Add tools to Heatmaps method leaderboard (method_id = 6)
-- ============================================================================

-- Insert/Update leaderboard data for all Heatmaps tools
INSERT INTO tools_leaderboard (tool_id, method_id, initial_upvotes, initial_downvotes, current_upvotes, current_downvotes)
SELECT t.id, 6, -- Heatmaps method_id
  CASE t.name
    -- Provided vote counts from user
    WHEN 'Hotjar' THEN 11
    WHEN 'CrazyEgg' THEN 9
    WHEN 'Crazy Egg' THEN 9  -- Handle potential name variation
    WHEN 'Mouseflow' THEN 9
    WHEN 'FullStory' THEN 7
    WHEN 'Smartlook' THEN 7
    WHEN 'Lucky Orange' THEN 7
    WHEN 'Microsoft Clarity' THEN 6
    WHEN 'Plerdy' THEN 6
    WHEN 'VWO' THEN 5
    WHEN 'Zoho' THEN 3
    WHEN 'Heap' THEN 2
    WHEN 'Sprig' THEN 2
    WHEN 'LogRocket' THEN 2
    WHEN 'Quantum Metric' THEN 2
    WHEN 'Glassbox' THEN 2
    WHEN 'Contentsquare' THEN 2
    WHEN 'UXCam' THEN 1
    ELSE 0
  END, 0, 0, 0 -- initial_upvotes, initial_downvotes, current_upvotes, current_downvotes
FROM tools t
WHERE t.name IN (
  'Hotjar', 'CrazyEgg', 'Crazy Egg', 'Mouseflow', 'FullStory', 'Smartlook', 
  'Lucky Orange', 'Microsoft Clarity', 'Plerdy', 'VWO', 'Zoho', 'Heap', 
  'Sprig', 'LogRocket', 'Quantum Metric', 'Glassbox', 'Contentsquare', 'UXCam'
)
ON CONFLICT (tool_id, method_id) DO UPDATE SET
    initial_upvotes = EXCLUDED.initial_upvotes,
    initial_downvotes = EXCLUDED.initial_downvotes;

-- ============================================================================
-- STEP 2: Add method-specific pros and cons for Heatmaps tools
-- ============================================================================

-- Insert/Update pros and cons for each tool specific to Heatmaps method
INSERT INTO tool_pros_and_cons (tool_id, method_id, feature_description, pro_text, con_text)
SELECT t.id, 6,
  CASE t.name
    WHEN 'Hotjar' THEN 'Captures user behavior on-page with click, scroll, and move heatmaps, complemented by session recordings and feedback tools.'
    WHEN 'CrazyEgg' THEN 'Known for its unique heatmap visualizations like Confetti and Overlay, which provide granular insights into individual clicks and traffic sources.'
    WHEN 'Crazy Egg' THEN 'Known for its unique heatmap visualizations like Confetti and Overlay, which provide granular insights into individual clicks and traffic sources.'
    WHEN 'Mouseflow' THEN 'Automatically builds multiple heatmap types for every tracked page, including those that detect user friction like rage clicks and dead clicks.'
    WHEN 'FullStory' THEN 'Offers a sophisticated platform with a broad selection of heatmaps, advanced filtering, and a unique frustration signals detection feature.'
    WHEN 'Smartlook' THEN 'Provides unified tracking for both websites and mobile apps, with features like session replay and heatmap analytics for real-time insights.'
    WHEN 'Lucky Orange' THEN 'An all-in-one CRO toolkit that provides heatmaps and session recordings with a focus on real-time analytics and interaction tracking.'
    WHEN 'Microsoft Clarity' THEN 'Provides a comprehensive, no-cost solution for analyzing user behavior through scroll and click heatmaps, with rage click detection.'
    WHEN 'Plerdy' THEN 'A CRO platform that offers real-time user activity tracking on heatmaps, along with SEO checks and e-commerce analytics.'
    WHEN 'VWO' THEN 'A powerful platform for A/B testing and conversion optimization that includes comprehensive heatmaps to visualize user engagement.'
    WHEN 'Zoho' THEN 'Primarily focuses on website analytics and optimization, providing heatmaps to conduct scroll-depth analysis and track visitor behavior.'
    WHEN 'Heap' THEN 'Automatically captures all user interactions and events on a site, enabling retrospective analysis without the need for manual event tagging.'
    WHEN 'Sprig' THEN 'Leverages AI-powered analysis to provide insights through heatmaps and session recordings, focusing on in-product feedback.'
    WHEN 'LogRocket' THEN 'Focuses on frontend performance monitoring and error tracking, using heatmaps to visualize user interactions and identify points of friction.'
    WHEN 'Quantum Metric' THEN 'A platform that uses heatmaps and session replay to detect and quantify technical issues that impact user experience and conversions.'
    WHEN 'Glassbox' THEN 'An enterprise solution offering tagless data capture, allowing for heatmaps and session replays without manual event tagging.'
    WHEN 'Contentsquare' THEN 'Provides enterprise-level user experience analytics, including heatmaps, to understand complex user journeys and behaviors at scale.'
    WHEN 'UXCam' THEN 'A mobile app analytics tool that uses heatmaps and session replays to help developers and product managers optimize app user experience.'
  END,
  CASE t.name
    WHEN 'Hotjar' THEN 'It is exceptionally user-friendly with an intuitive interface, making it perfect for beginners to quickly gather actionable insights on user behavior.'
    WHEN 'CrazyEgg' THEN 'Integrates native A/B testing directly into its platform, streamlining the process of testing and validating changes based on heatmap insights.'
    WHEN 'Crazy Egg' THEN 'Integrates native A/B testing directly into its platform, streamlining the process of testing and validating changes based on heatmap insights.'
    WHEN 'Mouseflow' THEN 'Its standout feature is the automatic friction score, which identifies and quantifies frustrated user behavior, helping to pinpoint and fix UX issues.'
    WHEN 'FullStory' THEN 'Captures a vast amount of "tagless" data, which allows for powerful retrospective analysis and the creation of custom dashboards to monitor trends.'
    WHEN 'Smartlook' THEN 'Excels in cross-platform analytics, allowing users to track and compare user journeys across websites and mobile applications from one interface.'
    WHEN 'Lucky Orange' THEN 'Offers real-time user behavior analytics, providing instant insights and the ability to engage with users as they browse through features like live chat.'
    WHEN 'Microsoft Clarity' THEN 'Offers a completely free, robust feature set that includes heatmaps, session recordings, and insights, making it ideal for those on a tight budget.'
    WHEN 'Plerdy' THEN 'Combines advanced heatmap analytics with real-time user activity monitoring and SEO tools, offering a multi-faceted approach to website optimization.'
    WHEN 'VWO' THEN 'Integrates robust A/B testing capabilities with heatmaps, allowing for a data-driven approach to testing hypotheses and optimizing conversion funnels.'
    WHEN 'Zoho' THEN 'Offers excellent features for in-depth scroll-depth analysis, making it a strong tool for optimizing content placement and user engagement on a page.'
    WHEN 'Heap' THEN 'Provides retroactive data analysis, allowing you to create heatmaps and event reports for past user behavior without any prior setup.'
    WHEN 'Sprig' THEN 'Helps to boost conversion rates by combining AI-powered user behavior analysis with targeted in-product feedback collection, all without coding.'
    WHEN 'LogRocket' THEN 'Combines session replay and heatmaps with error and performance monitoring, allowing developers to see the technical impact of user behavior in real-time.'
    WHEN 'Quantum Metric' THEN 'Excels at identifying user frustration and struggle, automatically detecting errors and technical issues in real time to help resolve conversion-blocking problems.'
    WHEN 'Glassbox' THEN 'Provides seamless, tagless data capture across web and mobile apps, offering a comprehensive view of customer journeys and enabling struggle analysis.'
    WHEN 'Contentsquare' THEN 'Offers advanced features like zoning analysis and customer journey mapping, giving large enterprises detailed insights into how users navigate their digital properties.'
    WHEN 'UXCam' THEN 'Specializes in mobile app analytics, providing valuable insights into user behavior within applications, which is a niche many competitors don''t cover.'
  END,
  CASE t.name
    WHEN 'Hotjar' THEN 'The tool can negatively impact a website''s loading speed, and its limited form analytics may hinder a deeper analysis of abandonment patterns.'
    WHEN 'CrazyEgg' THEN 'Reports are not as comprehensive as alternatives like Google Analytics, and the lack of a free plan may be a deterrent for some users.'
    WHEN 'Crazy Egg' THEN 'Reports are not as comprehensive as alternatives like Google Analytics, and the lack of a free plan may be a deterrent for some users.'
    WHEN 'Mouseflow' THEN 'Users have reported issues with inadequate mobile analytics and occasional bugs, which can hinder usability and provide an incomplete view of a user''s journey.'
    WHEN 'FullStory' THEN 'Its complex and opaque pricing model can be a significant barrier to entry for smaller businesses, making it more suited for enterprise-level use.'
    WHEN 'Smartlook' THEN 'Some users have reported that lower-tier plans lack essential features, limiting its full potential and value for smaller product teams or startups.'
    WHEN 'Lucky Orange' THEN 'Its extensive suite of features may be overwhelming for users seeking a simpler tool, and some reports mention data precision issues.'
    WHEN 'Microsoft Clarity' THEN 'High-traffic websites may find the 100,000 page views limit per heatmap to be insufficient for a complete analysis of their extensive data.'
    WHEN 'Plerdy' THEN 'Its wide range of features may present a steeper learning curve for users and might be seen as less specialized in a single area compared to competitors.'
    WHEN 'VWO' THEN 'While powerful, its comprehensive feature set can be overwhelming for users who only need simple heatmap functionalities and may have a steep learning curve.'
    WHEN 'Zoho' THEN 'While part of a larger suite, its specific heatmap features may be less robust than dedicated competitors and could be less intuitive for new users.'
    WHEN 'Heap' THEN 'The high degree of automation can be overwhelming and the pricing model may be less transparent compared to other tools, posing a challenge for small businesses.'
    WHEN 'Sprig' THEN 'It may not be the most suitable choice for teams requiring deep, manual data analysis, as it focuses more on automated, AI-driven insights and feedback.'
    WHEN 'LogRocket' THEN 'The tool is highly technical and developer-focused, which may make it less accessible or useful for marketing and UX teams without a technical background.'
    WHEN 'Quantum Metric' THEN 'As an enterprise-level platform, its cost and complexity are not suitable for small to medium-sized businesses with simpler analytics needs.'
    WHEN 'Glassbox' THEN 'The high cost and complexity of the platform make it a poor fit for smaller organizations, as it''s designed for large-scale enterprise use.'
    WHEN 'Contentsquare' THEN 'Designed for large corporations, the platform''s pricing and feature set are out of reach for most small to medium-sized businesses and individuals.'
    WHEN 'UXCam' THEN 'The focus on mobile apps means it is not suitable for analyzing website traffic, which limits its utility for businesses that need both web and app analytics.'
  END
FROM tools t
WHERE t.name IN (
  'Hotjar', 'CrazyEgg', 'Crazy Egg', 'Mouseflow', 'FullStory', 'Smartlook', 
  'Lucky Orange', 'Microsoft Clarity', 'Plerdy', 'VWO', 'Zoho', 'Heap', 
  'Sprig', 'LogRocket', 'Quantum Metric', 'Glassbox', 'Contentsquare', 'UXCam'
)
ON CONFLICT (tool_id, method_id) DO UPDATE SET
    feature_description = EXCLUDED.feature_description,
    pro_text = EXCLUDED.pro_text,
    con_text = EXCLUDED.con_text;

-- ============================================================================
-- STEP 3: Verification queries
-- ============================================================================

-- Verify new tools were added to leaderboard
SELECT 
    'Heatmaps Tools Leaderboard' as verification,
    t.name as tool_name,
    tl.initial_upvotes,
    tl.initial_downvotes,
    tl.current_upvotes,
    tl.current_downvotes,
    (tl.initial_upvotes + tl.current_upvotes) - (tl.initial_downvotes + tl.current_downvotes) as net_score
FROM tools_leaderboard tl
JOIN tools t ON t.id = tl.tool_id
JOIN methods m ON m.id = tl.method_id
WHERE m.slug = 'heat-maps'
ORDER BY net_score DESC, t.name;

-- Verify pros and cons entries
SELECT 
    'Heatmaps Tool Pros and Cons' as verification,
    t.name as tool_name,
    LEFT(tpc.feature_description, 100) as feature_description_preview,
    LEFT(tpc.pro_text, 80) as pro_text_preview,
    LEFT(tpc.con_text, 80) as con_text_preview
FROM tool_pros_and_cons tpc
JOIN tools t ON t.id = tpc.tool_id
JOIN methods m ON m.id = tpc.method_id
WHERE m.slug = 'heat-maps'
ORDER BY t.name;

-- Count total tools for Heatmaps method
SELECT 
    'Heatmaps Tools Count' as summary,
    COUNT(*) as total_tools,
    COUNT(CASE WHEN tl.initial_upvotes > 0 THEN 1 END) as tools_with_votes
FROM tools_leaderboard tl
JOIN methods m ON m.id = tl.method_id
WHERE m.slug = 'heat-maps';

COMMIT;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- This migration adds 17 existing heatmap tools to the Heatmaps method
-- with proper initial scores, feature descriptions, and method-specific pros/cons
-- for the Heatmaps method (method_id = 6)
-- ============================================================================
