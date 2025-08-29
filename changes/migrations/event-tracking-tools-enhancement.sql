-- Event Tracking Tools Enhancement Migration
-- Date: August 29, 2025
-- Purpose: Enhance Event Tracking tools with new tools, updated descriptions, pros/cons, and scores
-- Method ID: 2 (Event Tracking)

-- Begin transaction
BEGIN;

-- ============================================================================
-- STEP 1: Insert missing tools into the tools table
-- ============================================================================

INSERT INTO tools (name, description, logo_url, website_url, pro_text, con_text) VALUES
('UserPilot', 'Product adoption platform with no-code event tracking and user engagement tools for onboarding and feature adoption optimization.', '/tools-logos/userpilot.png', 'https://userpilot.com/', 'No-code implementation, comprehensive user onboarding tools, real-time behavioral triggers, good analytics integration, and affordable pricing for growing teams.', 'Limited advanced analytics depth, primarily web-focused, newer in analytics space, and higher cost for pure tracking features.'),
('Plerdy', 'Comprehensive conversion optimization platform combining basic event tracking with heatmaps, session recordings, and e-commerce analytics.', '/tools-logos/plerdy.png', 'https://www.plerdy.com/', 'All-in-one conversion optimization suite, affordable pricing, includes multiple analytics tools, good for e-commerce, and user-friendly interface.', 'Limited advanced event tracking capabilities, basic analytics compared to specialized tools, and more focused on conversion than product analytics.'),
('Countly', 'Privacy-focused analytics platform with flexible event tracking, self-hosting options, and comprehensive mobile and web analytics with GDPR compliance.', '/tools-logos/countly.png', 'https://countly.com/', 'Strong privacy and data control, self-hosting available, GDPR compliant, affordable pricing, and good for organizations with strict data governance.', 'Smaller ecosystem and community, limited advanced analytics features, requires technical expertise for self-hosting, and fewer integrations than mainstream platforms.')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- STEP 2: Update tools_leaderboard for all Event Tracking tools with new scores
-- ============================================================================

-- Insert or update leaderboard entries for all Event Tracking tools
INSERT INTO tools_leaderboard (tool_id, method_id, initial_upvotes, initial_downvotes, current_upvotes, current_downvotes)
SELECT t.id, 2,
  CASE t.name
    WHEN 'Mixpanel' THEN 10
    WHEN 'FullStory' THEN 8
    WHEN 'Amplitude' THEN 7
    WHEN 'Google Analytics' THEN 6
    WHEN 'GA4' THEN 6
    WHEN 'Google Analytics 4' THEN 6
    WHEN 'Pendo' THEN 6
    WHEN 'PostHog' THEN 6
    WHEN 'Adobe Analytics' THEN 4
    WHEN 'Heap' THEN 4
    WHEN 'UserPilot' THEN 3
    WHEN 'LogRocket' THEN 2
    WHEN 'Plerdy' THEN 2
    WHEN 'Quantum Metric' THEN 2
    WHEN 'Countly' THEN 2
    ELSE 0
  END as initial_upvotes,
  0 as initial_downvotes,  -- Set to 0 as per requirement
  0 as current_upvotes,    -- Start with 0 for new site votes
  0 as current_downvotes   -- Start with 0 for new site votes
FROM tools t
WHERE t.name IN ('Mixpanel', 'FullStory', 'Amplitude', 'Google Analytics', 'GA4', 'Google Analytics 4', 'Pendo', 'PostHog', 'Adobe Analytics', 'Heap', 'UserPilot', 'LogRocket', 'Plerdy', 'Quantum Metric', 'Countly')
ON CONFLICT (tool_id, method_id) DO UPDATE SET
    initial_upvotes = EXCLUDED.initial_upvotes,
    initial_downvotes = EXCLUDED.initial_downvotes;

-- ============================================================================
-- STEP 3: Insert/Update tool_pros_and_cons for Event Tracking method
-- ============================================================================

INSERT INTO tool_pros_and_cons (tool_id, method_id, feature_description, pro_text, con_text)
SELECT t.id, 2,
  CASE t.name
    WHEN 'Mixpanel' THEN 'Offers precision event tracking with flexible client/server-side SDKs, autocapture for web interactions, and robust analytics with unlimited reports and dashboards.'
    WHEN 'FullStory' THEN 'Provides autocapture event tracking with zero manual tagging, comprehensive session replays, and visual insights into user interactions across web applications and mobile platforms.'
    WHEN 'Amplitude' THEN 'Advanced product analytics platform with both autocapture and precision tracking, supporting granular event analysis, behavioral cohorts, and comprehensive user journey mapping.'
    WHEN 'Google Analytics' THEN 'Web-focused event tracking with GA4''s enhanced measurement, goal conversion tracking, real-time monitoring, and integration with Google''s marketing ecosystem for attribution analysis.'
    WHEN 'GA4' THEN 'Web-focused event tracking with GA4''s enhanced measurement, goal conversion tracking, real-time monitoring, and integration with Google''s marketing ecosystem for attribution analysis.'
    WHEN 'Google Analytics 4' THEN 'Web-focused event tracking with GA4''s enhanced measurement, goal conversion tracking, real-time monitoring, and integration with Google''s marketing ecosystem for attribution analysis.'
    WHEN 'Pendo' THEN 'Combines event tracking with in-app guidance, featuring visual event tagging, user segmentation, product usage analytics, and integrated feedback collection for product optimization.'
    WHEN 'PostHog' THEN 'Open-source product analytics with autocapture, feature flags, A/B testing, and session replays, offering both cloud and self-hosted deployment options for complete data control.'
    WHEN 'Adobe Analytics' THEN 'Enterprise-grade web analytics with advanced segmentation, multi-channel tracking, AI-powered predictive analytics, and machine learning capabilities for large-scale customer data analysis.'
    WHEN 'Heap' THEN 'Automatic data capture platform tracking all user interactions retroactively, supporting both web and mobile autocapture with session replays and flexible event definition post-collection.'
    WHEN 'UserPilot' THEN 'No-code event tracking with visual tagging, autocapture for web applications, and integrated user engagement platform enabling real-time in-app messaging based on behavioral triggers.'
    WHEN 'LogRocket' THEN 'Session replay and error tracking platform with basic event tracking capabilities, focusing on debugging user experiences and monitoring application performance and technical issues.'
    WHEN 'Plerdy' THEN 'All-in-one conversion optimization tool with basic event tracking, heatmaps, session recordings, and e-commerce analytics, designed for website performance and conversion optimization.'
    WHEN 'Quantum Metric' THEN 'Real-time digital analytics platform with automated anomaly detection, customer journey tracking, and behavioral insights focused on identifying and resolving user experience issues quickly.'
    WHEN 'Countly' THEN 'Privacy-focused analytics platform with flexible event tracking, self-hosting options, and comprehensive mobile and web analytics while maintaining full data ownership and GDPR compliance.'
    ELSE 'Advanced event tracking capabilities for comprehensive user behavior analysis and product optimization.'
  END as feature_description,
  CASE t.name
    WHEN 'Mixpanel' THEN 'Generous free tier (1M events/month), clean intuitive UI, excellent real-time analytics, flexible tracking methods, and strong integration ecosystem make it accessible for all team sizes.'
    WHEN 'FullStory' THEN 'Complete autocapture eliminates manual event setup, powerful session replay for context, automatic frustration signal detection, and rich visual analytics for understanding user behavior.'
    WHEN 'Amplitude' THEN 'Industry-leading analytics depth, robust free tier (50K MTUs), powerful segmentation capabilities, excellent user journey analysis, and strong data governance with taxonomy features.'
    WHEN 'Google Analytics' THEN 'Completely free for most users, seamless Google ecosystem integration, excellent acquisition tracking, and familiar interface for most marketers.'
    WHEN 'GA4' THEN 'Completely free for most users, seamless Google ecosystem integration, excellent acquisition tracking, and familiar interface for most marketers.'
    WHEN 'Google Analytics 4' THEN 'Completely free for most users, seamless Google ecosystem integration, excellent acquisition tracking, and familiar interface for most marketers.'
    WHEN 'Pendo' THEN 'Unified platform combining analytics with engagement, no-code event tagging, strong product adoption features, excellent user onboarding tools, and comprehensive product insights.'
    WHEN 'PostHog' THEN 'Generous free tier (1M events/month), open-source flexibility, self-hosting option for data privacy, all-in-one platform with experimentation tools, and transparent pricing structure.'
    WHEN 'Adobe Analytics' THEN 'Powerful enterprise features, advanced AI/ML capabilities, comprehensive multi-channel tracking, excellent attribution modeling, and strong integration with Adobe Experience Cloud.'
    WHEN 'Heap' THEN 'Most comprehensive autocapture (web + mobile), retroactive analysis without prior event setup, no data loss from missed tracking, excellent for exploration and discovery of user patterns.'
    WHEN 'UserPilot' THEN 'Seamless integration of analytics with engagement, no-code visual event tagging, real-time behavioral triggers for messaging, comprehensive user onboarding tools, and good value proposition.'
    WHEN 'LogRocket' THEN 'Excellent session replay quality, strong error tracking and debugging features, developer-friendly interface, good performance monitoring, and integrates well with development workflows.'
    WHEN 'Plerdy' THEN 'Comprehensive conversion optimization suite, affordable pricing options, includes heatmaps and session replays, good for e-commerce tracking, and user-friendly interface.'
    WHEN 'Quantum Metric' THEN 'Real-time anomaly detection, automated issue identification, good customer journey visualization, enterprise-grade platform, and focuses on actionable insights for UX improvement.'
    WHEN 'Countly' THEN 'Strong privacy and data control features, self-hosting option available, GDPR compliant, affordable pricing structure, and good for organizations with strict data governance requirements.'
    ELSE 'Powerful analytics capabilities with good integration options and user-friendly interface.'
  END as pro_text,
  CASE t.name
    WHEN 'Mixpanel' THEN 'Limited autocapture (web only), can become expensive at scale with high event volumes, and requires more setup for complex backend event tracking scenarios.'
    WHEN 'FullStory' THEN 'Higher cost compared to alternatives, limited mobile autocapture capabilities, requires integration for backend events, and can generate overwhelming data volumes.'
    WHEN 'Amplitude' THEN 'Steeper learning curve for non-technical users, complex UI can overwhelm beginners, limited engagement features compared to specialized tools, and higher pricing at enterprise scale.'
    WHEN 'Google Analytics' THEN 'Limited product analytics capabilities, complex setup for custom events, data sampling issues at scale, and restricted customization compared to dedicated product analytics platforms.'
    WHEN 'GA4' THEN 'Limited product analytics capabilities, complex setup for custom events, data sampling issues at scale, and restricted customization compared to dedicated product analytics platforms.'
    WHEN 'Google Analytics 4' THEN 'Limited product analytics capabilities, complex setup for custom events, data sampling issues at scale, and restricted customization compared to dedicated product analytics platforms.'
    WHEN 'Pendo' THEN 'Higher pricing point, limited session replay compared to specialized tools, requires integration for backend events, and analytics depth not as advanced as pure analytics platforms.'
    WHEN 'PostHog' THEN 'Newer platform with smaller community, limited enterprise features, self-hosting requires technical expertise, and fewer integrations compared to established players.'
    WHEN 'Adobe Analytics' THEN 'Very expensive enterprise-only pricing, steep learning curve, requires significant technical expertise, and overkill for most standard event tracking use cases.'
    WHEN 'Heap' THEN 'Expensive pricing model based on sessions, can capture excessive irrelevant data, requires data cleanup and organization, and limited real-time engagement features.'
    WHEN 'UserPilot' THEN 'Limited pure analytics depth compared to specialized tools, primarily web-focused, newer in the analytics space, and higher pricing for the analytics features offered.'
    WHEN 'LogRocket' THEN 'Limited event tracking capabilities compared to dedicated analytics tools, primarily focused on debugging rather than product analytics, higher cost for the level of analytics features provided.'
    WHEN 'Plerdy' THEN 'Limited advanced analytics capabilities, basic event tracking compared to specialized tools, primarily focused on conversion optimization rather than product analytics insights.'
    WHEN 'Quantum Metric' THEN 'Very expensive enterprise pricing, complex implementation process, requires significant technical resources, and limited flexibility compared to modern product analytics platforms.'
    WHEN 'Countly' THEN 'Smaller community and ecosystem, limited advanced analytics features, requires technical expertise for self-hosting, and fewer integrations compared to mainstream analytics platforms.'
    ELSE 'May require technical setup, learning curve, and can become expensive for extensive use cases.'
  END as con_text
FROM tools t
WHERE t.name IN ('Mixpanel', 'FullStory', 'Amplitude', 'Google Analytics', 'GA4', 'Google Analytics 4', 'Pendo', 'PostHog', 'Adobe Analytics', 'Heap', 'UserPilot', 'LogRocket', 'Plerdy', 'Quantum Metric', 'Countly')
ON CONFLICT (tool_id, method_id) DO UPDATE SET
    feature_description = EXCLUDED.feature_description,
    pro_text = EXCLUDED.pro_text,
    con_text = EXCLUDED.con_text;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check that all tools were added/updated
SELECT 
    t.name,
    LEFT(t.description, 60) || '...' as description_preview,
    t.website_url
FROM tools t
WHERE t.name IN ('Mixpanel', 'FullStory', 'Amplitude', 'Google Analytics', 'GA4', 'Google Analytics 4', 'Pendo', 'PostHog', 'Adobe Analytics', 'Heap', 'UserPilot', 'LogRocket', 'Plerdy', 'Quantum Metric', 'Countly')
ORDER BY t.name;

-- Check leaderboard for Event Tracking method (should show all tools with updated scores)
SELECT 
    t.name,
    tl.initial_upvotes,
    tl.initial_downvotes,
    tl.current_upvotes,
    tl.current_downvotes,
    (tl.initial_upvotes + tl.current_upvotes) as total_upvotes,
    (tl.initial_downvotes + tl.current_downvotes) as total_downvotes,
    ((tl.initial_upvotes + tl.current_upvotes) - (tl.initial_downvotes + tl.current_downvotes)) as net_score
FROM tools_leaderboard tl
JOIN tools t ON tl.tool_id = t.id
WHERE tl.method_id = 2
ORDER BY net_score DESC;

-- Check pros/cons were added/updated
SELECT 
    t.name,
    LEFT(tpc.feature_description, 50) || '...' as feature_preview,
    LEFT(tpc.pro_text, 50) || '...' as pro_preview,
    LEFT(tpc.con_text, 50) || '...' as con_preview
FROM tool_pros_and_cons tpc
JOIN tools t ON tpc.tool_id = t.id
WHERE tpc.method_id = 2
ORDER BY t.name;

-- Check method info
SELECT 
    m.name as method_name,
    COUNT(tl.tool_id) as tool_count,
    SUM(tl.initial_upvotes + tl.current_upvotes) as total_upvotes,
    SUM(tl.initial_downvotes + tl.current_downvotes) as total_downvotes,
    SUM(tl.initial_upvotes + tl.current_upvotes) - SUM(tl.initial_downvotes + tl.current_downvotes) as net_score
FROM methods m
LEFT JOIN tools_leaderboard tl ON m.id = tl.method_id
WHERE m.id = 2
GROUP BY m.id, m.name;

-- Commit the transaction
COMMIT;

-- Final verification query
SELECT 
    'Event Tracking Tools Enhancement Complete' as status,
    COUNT(DISTINCT t.id) as tools_in_event_tracking,
    SUM(tl.initial_upvotes) as total_initial_upvotes,
    SUM(tl.initial_downvotes) as total_initial_downvotes,
    SUM(tl.current_upvotes) as total_current_upvotes,
    SUM(tl.current_downvotes) as total_current_downvotes,
    SUM(tl.initial_upvotes + tl.current_upvotes) - SUM(tl.initial_downvotes + tl.current_downvotes) as total_net_score
FROM tools t
LEFT JOIN tools_leaderboard tl ON t.id = tl.tool_id AND tl.method_id = 2
WHERE t.name IN ('Mixpanel', 'FullStory', 'Amplitude', 'Google Analytics', 'GA4', 'Google Analytics 4', 'Pendo', 'PostHog', 'Adobe Analytics', 'Heap', 'UserPilot', 'LogRocket', 'Plerdy', 'Quantum Metric', 'Countly');
