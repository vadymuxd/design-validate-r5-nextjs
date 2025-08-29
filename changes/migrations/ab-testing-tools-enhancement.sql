-- A/B Testing Tools Enhancement Migration
-- Date: August 29, 2025
-- Purpose: Enhance A/B Testing tools with new tools, updated descriptions, pros/cons, and scores
-- Method ID: 3 (A/B Testing)

-- Begin transaction
BEGIN;

-- ============================================================================
-- STEP 1: Insert missing tools into the tools table
-- ============================================================================

INSERT INTO tools (name, description, logo_url, website_url, pro_text, con_text) VALUES
('GrowthBook', 'Open-source A/B testing and feature flagging platform designed for developers and data teams with unlimited experiments and flexible SDK integration.', '/tools-logos/growthbook.png', 'https://www.growthbook.io/', 'Open-source with unlimited experiments, flexible SDK integration, retroactive metric analysis, strong developer focus, and cost-effective for growing teams.', 'Requires technical setup and maintenance, limited visual editing capabilities, smaller ecosystem, and less suitable for non-technical marketing teams.'),
('Stellar', 'Emerging A/B testing platform focused on simplicity and quick setup for small businesses with streamlined user interface and basic split testing capabilities.', '/tools-logos/gostellar.png', 'https://gostellar.app/', 'Simple setup process with intuitive interface, accessible for small businesses, quick test deployment, affordable pricing, and minimal learning curve.', 'Limited advanced features and integrations, smaller user community, fewer resources for troubleshooting, and basic analytics compared to established platforms.'),
('Unbounce', 'Landing page builder platform with integrated A/B testing and Smart Traffic optimization for conversion-focused marketing campaigns.', '/tools-logos/unbounce.png', 'https://unbounce.com/', 'Drag-and-drop landing page builder, Smart Traffic auto-optimization, conversion-focused templates, integrated A/B testing, and strong marketing campaign support.', 'Limited to landing page testing rather than full website optimization, higher costs for comprehensive site-wide testing, and focused primarily on marketing pages.')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- STEP 2: Update tools_leaderboard for all A/B Testing tools with new scores
-- ============================================================================

-- Insert or update leaderboard entries for all A/B Testing tools
INSERT INTO tools_leaderboard (tool_id, method_id, initial_upvotes, initial_downvotes, current_upvotes, current_downvotes)
SELECT t.id, 3,
  CASE t.name
    WHEN 'VWO' THEN 13
    WHEN 'Optimizely' THEN 12
    WHEN 'Statsig' THEN 5
    WHEN 'PostHog' THEN 4
    WHEN 'Google Optimize' THEN 4
    WHEN 'Convert' THEN 5
    WHEN 'Crazy Egg' THEN 5
    WHEN 'AB Tasty' THEN 5
    WHEN 'Launch Darkly' THEN 3
    WHEN 'GrowthBook' THEN 3
    WHEN 'Kameleoon' THEN 3
    WHEN 'Stellar' THEN 2
    WHEN 'Unbounce' THEN 2
    WHEN 'Omniconvert' THEN 2
    ELSE 0
  END as initial_upvotes,
  0 as initial_downvotes,  -- Set to 0 as per requirement
  0 as current_upvotes,    -- Start with 0 for new site votes
  0 as current_downvotes   -- Start with 0 for new site votes
FROM tools t
WHERE t.name IN ('VWO', 'Optimizely', 'Statsig', 'PostHog', 'Google Optimize', 'Convert', 'Crazy Egg', 'AB Tasty', 'Launch Darkly', 'GrowthBook', 'Kameleoon', 'Stellar', 'Unbounce', 'Omniconvert')
ON CONFLICT (tool_id, method_id) DO UPDATE SET
    initial_upvotes = EXCLUDED.initial_upvotes,
    initial_downvotes = EXCLUDED.initial_downvotes;

-- ============================================================================
-- STEP 3: Insert/Update tool_pros_and_cons for A/B Testing method
-- ============================================================================

INSERT INTO tool_pros_and_cons (tool_id, method_id, feature_description, pro_text, con_text)
SELECT t.id, 3,
  CASE t.name
    WHEN 'VWO' THEN 'VWO combines A/B testing with behavioral insights through heatmaps and session recordings, offering a comprehensive CRO suite with visual editor and SmartStats engine for rapid experimentation without developer dependency'
    WHEN 'Optimizely' THEN 'Enterprise-grade experimentation platform with AI-powered insights and Stats Accelerator for faster results, supporting both client-side and server-side testing with advanced audience segmentation'
    WHEN 'Statsig' THEN 'Feature flagging platform with real-time experimentation capabilities, offering controlled rollouts and backend testing for product teams focused on infrastructure-level A/B testing'
    WHEN 'PostHog' THEN 'Open-source A/B testing platform combining experimentation with session replays and funnel analysis, offering 1 million events monthly free with multivariate testing and behavioral targeting'
    WHEN 'Google Optimize' THEN 'Free A/B testing tool with native Google Analytics integration, offering basic split testing capabilities with easy setup for website optimization experiments'
    WHEN 'Convert' THEN 'Privacy-focused A/B testing platform with GDPR compliance and lightweight script, offering comprehensive experimentation suite with advanced audience targeting using 40+ filter parameters'
    WHEN 'Crazy Egg' THEN 'Website optimization tool combining basic A/B testing with comprehensive heatmaps and session recordings, offering visual behavioral analysis alongside simple split testing capabilities'
    WHEN 'AB Tasty' THEN 'Unified platform for experimentation, personalization, and feature management with visual editor and advanced targeting capabilities for comprehensive conversion optimization'
    WHEN 'Launch Darkly' THEN 'Feature management platform enabling A/B testing through feature flags for backend experimentation, allowing development teams to test infrastructure changes and gradual feature rollouts safely'
    WHEN 'GrowthBook' THEN 'Open-source A/B testing platform with unlimited experiments and flexible SDK integration, offering multivariate testing with retroactive metric addition for developer-focused experimentation'
    WHEN 'Kameleoon' THEN 'AI-driven enterprise experimentation platform with predictive targeting and machine learning algorithms, offering full-stack testing with GDPR compliance for regulated industries'
    WHEN 'Stellar' THEN 'Emerging A/B testing platform focused on simplicity and quick setup for small businesses, offering basic split testing capabilities with streamlined user interface'
    WHEN 'Unbounce' THEN 'Landing page builder with integrated A/B testing and Smart Traffic feature, automatically directing visitors to best-performing variations with real-time conversion optimization'
    WHEN 'Omniconvert' THEN 'Conversion optimization platform combining A/B testing with advanced segmentation using 40+ parameters, offering surveys and behavioral targeting for qualitative insights alongside quantitative testing'
  END as feature_description,
  CASE t.name
    WHEN 'VWO' THEN 'User-friendly interface with no-code visual editor makes testing accessible to marketers, while integrated heatmaps and behavioral analytics provide deeper insights into why variations perform better'
    WHEN 'Optimizely' THEN 'AI-driven optimization with feature flags enables controlled rollouts and real-time personalization, perfect for large-scale enterprises with complex testing requirements'
    WHEN 'Statsig' THEN 'Provides safe feature deployment with instant rollback capabilities and real-time analytics, ideal for engineering teams running backend experiments without affecting user experience'
    WHEN 'PostHog' THEN 'Comprehensive product analytics with session replays and feature flags in one tool, plus generous free tier makes it perfect for product teams wanting integrated user behavior insights'
    WHEN 'Google Optimize' THEN 'Completely free with seamless Google Analytics integration, easy setup for basic testing needs, and familiar interface for Google ecosystem users'
    WHEN 'Convert' THEN 'Excellent privacy compliance with minimal performance impact through lightweight script, plus unlimited testing capabilities with advanced targeting options for precise segmentation'
    WHEN 'Crazy Egg' THEN 'Visual editor enables quick test setup without coding while integrated heatmaps and session recordings provide unique behavioral insights to understand user interaction patterns'
    WHEN 'AB Tasty' THEN 'Advanced AI-powered personalization with robust compliance features makes it excellent for healthcare and finance sectors requiring sophisticated targeting and security'
    WHEN 'Launch Darkly' THEN 'Seamless feature flag management with real-time toggling enables safe deployments and A/B testing without code changes, perfect for dev teams managing release pipelines'
    WHEN 'GrowthBook' THEN 'Unlimited free experiments with ability to add metrics after test completion, plus flexible integration with existing analytics makes it powerful for teams wanting full control'
    WHEN 'Kameleoon' THEN 'Advanced AI-powered personalization with robust compliance features makes it excellent for healthcare and finance sectors requiring sophisticated targeting and security'
    WHEN 'Stellar' THEN 'Simple setup process with intuitive interface makes it accessible for small businesses and startups needing basic A/B testing without complex features or high costs'
    WHEN 'Unbounce' THEN 'Smart Traffic feature automatically optimizes visitor distribution to winning variations while drag-and-drop landing page builder enables quick test creation for conversion-focused campaigns'
    WHEN 'Omniconvert' THEN 'Sophisticated segmentation with 40+ parameters enables precise audience targeting while integrated surveys provide qualitative feedback to understand visitor behavior motivations'
  END as pro_text,
  CASE t.name
    WHEN 'VWO' THEN 'Customer support response times can be inconsistent and limited historical data storage affects long-term trend analysis for continuous optimization strategies'
    WHEN 'Optimizely' THEN 'Prohibitively high pricing starting around $63,700 annually with steep learning curve makes it inaccessible for small to mid-sized businesses seeking simple A/B tests'
    WHEN 'Statsig' THEN 'Limited visual editing capabilities for marketers and requires technical expertise for setup, making it less accessible for non-technical teams running content-based tests'
    WHEN 'PostHog' THEN 'More suited for product/dev teams rather than marketers, with setup requiring technical skills and interface feeling complex for simple content optimization tests'
    WHEN 'Google Optimize' THEN 'Being discontinued by Google in September 2023, with limited advanced features compared to dedicated A/B testing platforms and basic statistical analysis'
    WHEN 'Convert' THEN 'Visual editor less intuitive than competitors with steep learning curve, while limited behavioral analytics require integration with external tools for deeper insights'
    WHEN 'Crazy Egg' THEN 'A/B testing functionality is limited and only available in Plus plans ($99+), making it unsuitable for complex experiments or businesses requiring dedicated testing features'
    WHEN 'AB Tasty' THEN 'Can be expensive for smaller organizations with learning curve for advanced personalization features, while complexity may require dedicated resources for management'
    WHEN 'Launch Darkly' THEN 'Not designed for visual content testing or marketers, with interface becoming overwhelming when managing multiple flags across different environments and teams'
    WHEN 'GrowthBook' THEN 'Requires technical knowledge for setup and lacks visual editing capabilities, making it unsuitable for marketing teams needing quick content optimization without developer support'
    WHEN 'Kameleoon' THEN 'Very steep learning curve with high costs starting around $25,000 annually, while test preview functionality can be tricky for teams without extensive technical resources'
    WHEN 'Stellar' THEN 'Limited advanced features and integrations compared to established platforms, with smaller user community providing fewer resources for troubleshooting and best practices'
    WHEN 'Unbounce' THEN 'Limited to landing page testing rather than full website optimization, with higher costs for businesses needing comprehensive site-wide A/B testing capabilities across multiple pages'
    WHEN 'Omniconvert' THEN 'Starting at $273 monthly makes it expensive for small businesses, while complexity of features may require dedicated resources for setup and management of advanced experiments'
  END as con_text
FROM tools t
WHERE t.name IN ('VWO', 'Optimizely', 'Statsig', 'PostHog', 'Google Optimize', 'Convert', 'Crazy Egg', 'AB Tasty', 'Launch Darkly', 'GrowthBook', 'Kameleoon', 'Stellar', 'Unbounce', 'Omniconvert')
ON CONFLICT (tool_id, method_id) DO UPDATE SET
    feature_description = EXCLUDED.feature_description,
    pro_text = EXCLUDED.pro_text,
    con_text = EXCLUDED.con_text;

-- ============================================================================
-- STEP 4: Verification queries
-- ============================================================================

-- Verify tools were added
SELECT 
    'New tools added to tools table:' as status,
    COUNT(*) as count
FROM tools 
WHERE name IN ('GrowthBook', 'Stellar', 'Unbounce');

-- Verify leaderboard entries
SELECT 
    'A/B Testing leaderboard entries:' as status,
    COUNT(*) as count
FROM tools_leaderboard tl
JOIN tools t ON tl.tool_id = t.id
WHERE tl.method_id = 3
    AND t.name IN ('VWO', 'Optimizely', 'Statsig', 'PostHog', 'Google Optimize', 'Convert', 'Crazy Egg', 'AB Tasty', 'Launch Darkly', 'GrowthBook', 'Kameleoon', 'Stellar', 'Unbounce', 'Omniconvert');

-- Verify pros and cons entries
SELECT 
    'A/B Testing pros/cons entries:' as status,
    COUNT(*) as count
FROM tool_pros_and_cons tpc
JOIN tools t ON tpc.tool_id = t.id
WHERE tpc.method_id = 3
    AND t.name IN ('VWO', 'Optimizely', 'Statsig', 'PostHog', 'Google Optimize', 'Convert', 'Crazy Egg', 'AB Tasty', 'Launch Darkly', 'GrowthBook', 'Kameleoon', 'Stellar', 'Unbounce', 'Omniconvert');

-- Show sample of updated data
SELECT 
    t.name,
    tl.initial_upvotes,
    LEFT(tpc.feature_description, 100) as feature_description_preview
FROM tools t
JOIN tools_leaderboard tl ON t.id = tl.tool_id AND tl.method_id = 3
JOIN tool_pros_and_cons tpc ON t.id = tpc.tool_id AND tpc.method_id = 3
WHERE t.name IN ('VWO', 'Optimizely', 'GrowthBook', 'Stellar', 'Unbounce')
ORDER BY tl.initial_upvotes DESC;

COMMIT;

-- ============================================================================
-- SUMMARY:
-- ============================================================================
-- This migration:
-- 1. Adds 3 new tools to the tools table (GrowthBook, Stellar, Unbounce)
-- 2. Updates/inserts 14 tools in tools_leaderboard for A/B Testing (method_id = 3)
-- 3. Updates/inserts 14 tools in tool_pros_and_cons for A/B Testing (method_id = 3)
-- 4. Sets initial votes according to provided data
-- 5. Includes verification queries to confirm successful migration
-- ============================================================================
