-- ============================================================================
-- FUNNELS TOOLS BACKFILL MIGRATION
-- ============================================================================
-- This migration adds all Funnels tools to method_id = 21
-- 
-- Summary:
-- - 4 new tools to be created
-- - 19 existing tools to be linked to Funnels method  
-- - Total: 23 tools for Funnels
-- ============================================================================

BEGIN;

-- ============================================================================
-- STEP 1: Insert new tools that don't exist in the database yet
-- ============================================================================

-- Insert new Funnels tools
INSERT INTO tools (name, description, logo_url, website_url, pro_text, con_text) VALUES
('HubSpot', 'All-in-one marketing, sales, and customer service platform with comprehensive CRM and analytics capabilities.', '/tools-logos/hubspot.png', 'https://www.hubspot.com/', 'Complete marketing and sales ecosystem with seamless integration between all customer touchpoints and robust automation capabilities.', 'Can become expensive with advanced features and may be overwhelming for smaller businesses seeking simple solutions.'),
('Kissmetrics', 'Person-based analytics platform focused on tracking individual customer journeys and lifecycle behavior over time.', '/tools-logos/kissmetrics.png', 'https://www.kissmetrics.com/', 'Excellent for tracking long-term customer lifecycles and subscription models with person-centric analytics approach.', 'Interface feels dated compared to modern competitors and lacks some of the advanced visualization capabilities of newer platforms.'),
('Funnelytics', 'Visual funnel mapping and analytics platform designed for planning and tracking marketing campaign performance.', '/tools-logos/funnelytics.png', 'https://funnelytics.io/', 'Excellent visual planning tool for mapping out complex marketing funnels before building them with clear ROI forecasting capabilities.', 'More focused on planning and strategy rather than deep analytical investigation of actual user behavior and optimization.'),
('Mitzu', 'Modern business intelligence tool specializing in time-series funnel analysis and conversion rate tracking over time.', '/tools-logos/mitzu.png', 'https://mitzu.io/', 'Specialized in answering "what changed" questions in funnels over time with intuitive time-series analysis capabilities.', 'Serves as a complementary tool rather than a complete analytics solution and has a smaller ecosystem compared to established platforms.')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- STEP 2: Add tools to Funnels method leaderboard (method_id = 21)
-- ============================================================================

-- Insert/Update leaderboard data for all Funnels tools
INSERT INTO tools_leaderboard (tool_id, method_id, initial_upvotes, initial_downvotes, current_upvotes, current_downvotes)
SELECT t.id, 21, -- Funnels method_id
  CASE t.name
    -- Provided vote counts from user
    WHEN 'Mixpanel' THEN 8
    WHEN 'Amplitude' THEN 7
    WHEN 'Google Analytics 4' THEN 6
    WHEN 'UXCam' THEN 3
    WHEN 'Contentsquare' THEN 3
    WHEN 'Hotjar' THEN 3
    WHEN 'Heap' THEN 3
    WHEN 'Optimizely' THEN 2
    WHEN 'Countly' THEN 2
    WHEN 'Pendo' THEN 2
    WHEN 'HubSpot' THEN 2
    WHEN 'UserPilot' THEN 2
    WHEN 'Mouseflow' THEN 2
    WHEN 'Smartlook' THEN 2
    WHEN 'Plerdy' THEN 2
    WHEN 'Adobe Analytics' THEN 2
    WHEN 'Kissmetrics' THEN 2
    WHEN 'Funnelytics' THEN 2
    WHEN 'FullStory' THEN 2
    WHEN 'VWO' THEN 2
    WHEN 'Lucky Orange' THEN 2
    WHEN 'Mitzu' THEN 2
    WHEN 'Statsig' THEN 2
    ELSE 0
  END, 0, 0, 0 -- initial_upvotes, initial_downvotes, current_upvotes, current_downvotes
FROM tools t
WHERE t.name IN (
  'Mixpanel', 'Amplitude', 'Google Analytics 4', 'UXCam', 'Contentsquare', 'Hotjar', 'Heap',
  'Optimizely', 'Countly', 'Pendo', 'HubSpot', 'UserPilot', 'Mouseflow', 'Smartlook', 
  'Plerdy', 'Adobe Analytics', 'Kissmetrics', 'Funnelytics', 'FullStory', 'VWO', 
  'Lucky Orange', 'Mitzu', 'Statsig'
)
ON CONFLICT (tool_id, method_id) DO UPDATE SET
    initial_upvotes = EXCLUDED.initial_upvotes,
    initial_downvotes = EXCLUDED.initial_downvotes;

-- ============================================================================
-- STEP 3: Add method-specific pros and cons for Funnels tools
-- ============================================================================

INSERT INTO tool_pros_and_cons (tool_id, method_id, pro_text, con_text, feature_description)
SELECT t.id, 21, -- Funnels method_id
  CASE t.name
    WHEN 'Mixpanel' THEN 'Exceptional segmentation allows for deep dives into user behavior and cohort comparisons directly within the funnel steps to find key insights.'
    WHEN 'Amplitude' THEN 'Its user-friendly interface and generous free tier make advanced, product-led funnel analysis highly accessible for teams of all sizes.'
    WHEN 'Google Analytics 4' THEN 'Native integration with Google Ads provides a seamless view of funnel performance from initial ad click all the way through to conversion.'
    WHEN 'UXCam' THEN 'Its key strength is revealing the ''why'' behind drop-offs by providing immediate qualitative context (session replays) for quantitative data.'
    WHEN 'Contentsquare' THEN 'Unparalleled data visualization combines funnels with journey analysis to uncover nuanced in-page behavioral barriers to conversion.'
    WHEN 'Hotjar' THEN 'Simple to set up and combines funnels with feedback polls, providing a quick way to gather both quantitative and qualitative drop-off data.'
    WHEN 'Heap' THEN 'Its ''capture everything'' approach eliminates missed tracking and allows for on-the-fly, retroactive funnel creation and analysis.'
    WHEN 'Optimizely' THEN 'Directly connects funnel performance changes to specific feature flags or experiments, providing clear data on what drives user conversion.'
    WHEN 'Countly' THEN 'Can be self-hosted, giving organizations complete control over their user data, a major advantage for privacy-conscious industries like healthcare.'
    WHEN 'Pendo' THEN 'Uniquely combines funnel data with the ability to immediately deploy in-app guides to nudge users who get stuck or drop off at a specific step.'
    WHEN 'HubSpot' THEN 'Provides a complete view of the marketing and sales funnel, linking user actions directly to known leads, deals, and revenue outcomes.'
    WHEN 'UserPilot' THEN 'Ideal for optimizing the crucial first-time user experience funnel by linking analytics directly to the onboarding elements you build with it.'
    WHEN 'Mouseflow' THEN 'Its funnel-to-replay feature is fast and intuitive, making it extremely easy to see the qualitative ''why'' behind a conversion failure.'
    WHEN 'Smartlook' THEN 'Its event-based tracking is more powerful than simple page-view funnels, allowing for analysis of more specific user actions and clicks.'
    WHEN 'Plerdy' THEN 'Links funnel drop-offs to other CRO insights like heatmap data or pop-up form effectiveness, providing a more holistic optimization view.'
    WHEN 'Adobe Analytics' THEN 'Unmatched segmentation capabilities allow for slicing funnel data across countless dimensions, tailored for the complex needs of large organizations.'
    WHEN 'Kissmetrics' THEN 'Its strength is tracking long-term funnels tied to specific people, making it valuable for subscription models and lifecycle marketing.'
    WHEN 'Funnelytics' THEN 'Excellent for planning and forecasting funnel performance before building, and then comparing projected numbers against actual user data.'
    WHEN 'FullStory' THEN 'Combines retroactive analysis with best-in-class session replay to pinpoint user friction with zero prior tracking implementation.'
    WHEN 'VWO' THEN 'Tightly integrates funnel conversion goals with A/B testing results, making it easy to declare winning variations based on hard data.'
    WHEN 'Lucky Orange' THEN 'Very affordable and easy to implement, providing a great entry point into basic funnel analysis for small businesses and simple websites.'
    WHEN 'Mitzu' THEN 'Designed to quickly answer "what changed" in a funnel over time, a common but often difficult question to answer in other analytics tools.'
    WHEN 'Statsig' THEN 'Provides rigorous, statistics-driven analysis of how feature changes affect every step of a funnel, not just the final conversion goal.'
    ELSE 'Supports funnel analysis functionality for conversion optimization research.'
  END,
  CASE t.name
    WHEN 'Mixpanel' THEN 'Requires meticulous, upfront event tracking implementation, making initial setup and ongoing data governance a significant resource investment.'
    WHEN 'Amplitude' THEN 'The event-based pricing model can become very costly as user volume and data complexity scale up, creating potential budget challenges.'
    WHEN 'Google Analytics 4' THEN 'The interface is less intuitive for complex product funnels, and data sampling in the free version can obscure the true source of drop-offs.'
    WHEN 'UXCam' THEN 'Lacks the deep quantitative segmentation and advanced statistical analysis found in dedicated product analytics platforms for funnels.'
    WHEN 'Contentsquare' THEN 'Primarily an enterprise-level tool, its complexity and cost can be prohibitive for smaller teams seeking simple funnel metrics.'
    WHEN 'Hotjar' THEN 'Funnel analysis is basic, lacking the event-based segmentation and cohorting needed for deep investigation of complex user behavior trends.'
    WHEN 'Heap' THEN 'Autocaptured data can be noisy, requiring significant effort to virtually define events and ensure data quality for accurate funnel reports.'
    WHEN 'Optimizely' THEN 'Funnel analysis capabilities are secondary to experimentation and are not as robust for exploratory analysis as dedicated analytics tools.'
    WHEN 'Countly' THEN 'Requires significant technical resources to deploy and maintain the self-hosted version, creating a higher barrier to entry than SaaS solutions.'
    WHEN 'Pendo' THEN 'Its funnel reporting is less flexible and powerful for deep, exploratory analysis compared to dedicated product analytics platforms.'
    WHEN 'HubSpot' THEN 'Not designed for granular, in-product funnels (e.g., feature usage). Its focus is on the high-level business conversion path.'
    WHEN 'UserPilot' THEN 'Highly specialized for onboarding funnels; it lacks the capability to analyze the broader, self-directed product usage paths of mature users.'
    WHEN 'Mouseflow' THEN 'Funnel creation is limited to page views, not custom events, making it unsuitable for analyzing flows within single-page applications.'
    WHEN 'Smartlook' THEN 'While it offers event tracking, its quantitative analysis and segmentation tools are less mature than those of dedicated analytics leaders.'
    WHEN 'Plerdy' THEN 'The funnel analysis itself is quite basic and lacks the depth required for complex applications or detailed behavioral segmentation.'
    WHEN 'Adobe Analytics' THEN 'Extremely complex and expensive, with a steep learning curve that requires dedicated analysts or specialized training to use effectively.'
    WHEN 'Kissmetrics' THEN 'The platform and UI have seen less innovation compared to modern competitors, and it can feel less intuitive for rapid analysis.'
    WHEN 'Funnelytics' THEN 'Acts more as a strategic planning tool, not a deep analytics platform for granular, event-based investigation of unexpected user behavior.'
    WHEN 'FullStory' THEN 'Its core value is in qualitative replay, not quantitative analysis. It lacks the advanced charting for deep funnel metrics and trends.'
    WHEN 'VWO' THEN 'Its analytics are built around experiments and are not designed for open-ended, exploratory funnel analysis of organic user behavior.'
    WHEN 'Lucky Orange' THEN 'The funnel functionality is typically limited to URL steps and lacks the power needed for modern, event-driven web applications.'
    WHEN 'Mitzu' THEN 'A specialized tool that complements, rather than replaces, a full product analytics suite for comprehensive, exploratory funnel building.'
    WHEN 'Statsig' THEN 'Its analytical frame is based entirely on experiments; it is not a tool for the general-purpose, exploratory analysis of funnels.'
    ELSE 'May require additional setup or customization for optimal funnel analysis workflows.'
  END,
  CASE t.name
    WHEN 'Mixpanel' THEN 'Offers powerful, event-based funnel reports to precisely track user conversion paths and identify specific drop-off points with high granularity.'
    WHEN 'Amplitude' THEN 'Provides sophisticated, real-time funnel charts that help product teams visualize and diagnose conversion issues across complex user journeys.'
    WHEN 'Google Analytics 4' THEN 'GA4 enables flexible, event-based funnel exploration reports to analyze user paths and completion rates for key website conversion goals.'
    WHEN 'UXCam' THEN 'Links funnel drop-off points directly to session recordings, letting you watch the real user struggles that cause them to abandon a task.'
    WHEN 'Contentsquare' THEN 'Visualizes funnel progression with unique zone-based heatmaps, showing exactly where users click and struggle on a page before they drop off.'
    WHEN 'Hotjar' THEN 'Its funnels connect conversion rates to session recordings and heatmaps, helping you visualize where users get stuck in a conversion path.'
    WHEN 'Heap' THEN 'Leverages autocapture to retroactively build any funnel without needing to define events in advance, enabling rapid exploration of user paths.'
    WHEN 'Optimizely' THEN 'Primarily an A/B testing platform, its funnel analysis is used to measure the impact of experiments on conversion rates and user flows.'
    WHEN 'Countly' THEN 'An open-source platform offering detailed funnel analysis to track user journeys on web and mobile, with a strong focus on data ownership.'
    WHEN 'Pendo' THEN 'Analyzes user funnels for feature adoption, then allows for targeted in-app guides to improve conversion at specific drop-off points.'
    WHEN 'HubSpot' THEN 'Tracks customer lifecycle funnels, from anonymous website visitor to closed-won deal, by connecting user behavior to CRM contact records.'
    WHEN 'UserPilot' THEN 'Tracks funnel completion rates specifically for user onboarding flows, helping to identify where new users get stuck during activation.'
    WHEN 'Mouseflow' THEN 'Builds funnels from page visits and immediately connects user drop-off points to corresponding session replays to reveal user friction.'
    WHEN 'Smartlook' THEN 'Combines event-based funnel analysis with always-on session recordings, allowing you to filter for and watch replays of users who drop off.'
    WHEN 'Plerdy' THEN 'A CRO tool that offers conversion funnel analysis to identify poor-performing pages and roadblocks in e-commerce user journeys.'
    WHEN 'Adobe Analytics' THEN 'An enterprise-grade platform offering highly customizable funnel visualizations (fallout reports) for deep, large-scale conversion analysis.'
    WHEN 'Kissmetrics' THEN 'Focuses on person-based funnel reports, tracking individual user journeys over long periods and across devices to measure conversion.'
    WHEN 'Funnelytics' THEN 'A visual-first tool designed for mapping out marketing funnels and then tracking user flow and conversion rates through those planned steps.'
    WHEN 'FullStory' THEN 'Auto-captures all user interactions, letting you build funnels retroactively and instantly watch sessions of users who did or did not convert.'
    WHEN 'VWO' THEN 'Tracks funnel performance primarily as a goal-tracking mechanism to measure the conversion lift from A/B tests and personalization.'
    WHEN 'Lucky Orange' THEN 'Offers simple conversion funnels to identify drop-off pages, which can then be investigated using its suite of heatmaps and recordings.'
    WHEN 'Mitzu' THEN 'A modern BI tool that simplifies time-series funnel analysis, making it easy to see how conversion rates change after a feature launch.'
    WHEN 'Statsig' THEN 'Analyzes how feature flag rollouts and A/B tests impact key product funnels and conversion metrics in near real-time.'
    ELSE 'Provides funnel analysis capabilities for conversion optimization and user journey research.'
  END
FROM tools t
WHERE t.name IN (
  'Mixpanel', 'Amplitude', 'Google Analytics 4', 'UXCam', 'Contentsquare', 'Hotjar', 'Heap',
  'Optimizely', 'Countly', 'Pendo', 'HubSpot', 'UserPilot', 'Mouseflow', 'Smartlook', 
  'Plerdy', 'Adobe Analytics', 'Kissmetrics', 'Funnelytics', 'FullStory', 'VWO', 
  'Lucky Orange', 'Mitzu', 'Statsig'
)
ON CONFLICT (tool_id, method_id) DO UPDATE SET
    pro_text = EXCLUDED.pro_text,
    con_text = EXCLUDED.con_text,
    feature_description = EXCLUDED.feature_description;

-- ============================================================================
-- STEP 4: Verification queries
-- ============================================================================

-- Verify new tools were added
SELECT 
    'New Funnels Tools Added' as verification,
    t.name as tool_name,
    t.description,
    t.logo_url,
    t.website_url
FROM tools t
WHERE t.name IN ('HubSpot', 'Kissmetrics', 'Funnelytics', 'Mitzu')
ORDER BY t.name;

-- Verify leaderboard entries for Funnels method
SELECT 
    'Funnels Tools Leaderboard' as verification,
    t.name as tool_name,
    tl.initial_upvotes,
    tl.initial_downvotes,
    tl.current_upvotes,
    tl.current_downvotes,
    (tl.initial_upvotes + tl.current_upvotes) - (tl.initial_downvotes + tl.current_downvotes) as net_score
FROM tools_leaderboard tl
JOIN tools t ON t.id = tl.tool_id
JOIN methods m ON m.id = tl.method_id
WHERE m.slug = 'funnels'
ORDER BY net_score DESC, t.name;

-- Verify pros and cons entries
SELECT 
    'Funnels Tool Pros and Cons' as verification,
    t.name as tool_name,
    LEFT(tpc.feature_description, 100) as feature_description_preview,
    LEFT(tpc.pro_text, 80) as pro_text_preview,
    LEFT(tpc.con_text, 80) as con_text_preview
FROM tool_pros_and_cons tpc
JOIN tools t ON t.id = tpc.tool_id
JOIN methods m ON m.id = tpc.method_id
WHERE m.slug = 'funnels'
ORDER BY t.name;

-- Count total tools for Funnels method
SELECT 
    'Funnels Tools Count' as summary,
    COUNT(*) as total_tools,
    COUNT(CASE WHEN tl.initial_upvotes > 0 THEN 1 END) as tools_with_votes
FROM tools_leaderboard tl
JOIN methods m ON m.id = tl.method_id
WHERE m.slug = 'funnels';

COMMIT;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- This migration adds 4 new Funnels tools and links all 23 tools to the
-- Funnels method (id=21) with their respective vote counts and detailed
-- method-specific pros, cons, and feature descriptions.
-- 
-- New tools added: HubSpot, Kissmetrics, Funnelytics, Mitzu
-- Existing tools linked: Mixpanel, Amplitude, Google Analytics 4, UXCam, 
--                       Contentsquare, Hotjar, Heap, Optimizely, Countly, 
--                       Pendo, UserPilot, Mouseflow, Smartlook, Plerdy, 
--                       Adobe Analytics, FullStory, VWO, Lucky Orange, Statsig
-- ============================================================================
