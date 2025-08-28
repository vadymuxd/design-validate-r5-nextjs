-- ============================================================================
-- MIGRATION: Create "All in" View for Tools Page (CORRECTED VERSION)
-- Date: August 28, 2025
-- Purpose: Add universal pro/con text to tools table and create "All in" 
--          infrastructure WITHOUT pre-aggregating scores (calculated dynamically)
-- PREREQUISITE: Run fix-methods-id-column.sql first!
-- ============================================================================

BEGIN;

-- ============================================================================
-- STEP 1: Add universal pro_text and con_text columns to tools table
-- ============================================================================

ALTER TABLE tools 
ADD COLUMN IF NOT EXISTS pro_text TEXT,
ADD COLUMN IF NOT EXISTS con_text TEXT;

-- ============================================================================
-- STEP 2: Populate universal pro/con text based on sentiment analysis
-- Note: These are general summaries across all methods for each tool
-- ============================================================================

UPDATE tools SET 
pro_text = CASE name
  -- A/B Testing Tools
  WHEN 'AB Tasty' THEN 'Unified platform combining experimentation, personalization, and feature management. Strong visual editor and targeting capabilities.'
  WHEN 'Convert' THEN 'Fast, privacy-focused testing tool with extensive integrations. Strong security and GDPR compliance features.'
  WHEN 'Crazy Egg' THEN 'Simple, affordable heatmap tool with basic A/B testing. Easy setup and user-friendly interface.'
  WHEN 'Google Optimize' THEN 'Free A/B testing tool with native Google Analytics integration. Easy to use and widely adopted.'
  WHEN 'Kameleoon' THEN 'Fast, reliable platform with strong personalization and AI features. Excellent performance and targeting.'
  WHEN 'Launch Darkly' THEN 'Feature management platform with integrated A/B testing. Excellent for developer teams and feature flags.'
  WHEN 'Omniconvert' THEN 'All-in-one CRO platform including surveys and personalization. Comprehensive conversion optimization suite.'
  WHEN 'Optimizely' THEN 'Enterprise-grade platform for robust server-side experimentation. Industry leader with advanced features.'
  WHEN 'SiteSpect' THEN 'Powerful server-side solution avoiding JavaScript tags. Excellent for high-traffic enterprise sites.'
  WHEN 'VWO' THEN 'All-in-one platform combining testing with behavioral analytics. Good balance of features and usability.'
  
  -- Analytics Tools  
  WHEN 'Adobe Analytics' THEN 'Most comprehensive enterprise-grade analytics for digital journey. Powerful segmentation and reporting capabilities.'
  WHEN 'Amplitude' THEN 'Best-in-class behavioral analytics and user journey tracking. Powerful cohort analysis and retention reports.'
  WHEN 'Google Analytics 4' THEN 'Free, universal platform with deep Google advertising integration. Massive feature set and widespread adoption.'
  WHEN 'Heap' THEN 'Automatically captures every user interaction without code changes. Retroactive analytics and easy setup.'
  WHEN 'Indicative' THEN 'Analyzes user behavior by connecting directly to data warehouse. Strong for custom data architecture.'
  WHEN 'Mixpanel' THEN 'Most powerful dedicated tools for deep product analytics. Excellent funnel and retention analysis.'
  WHEN 'Pendo' THEN 'Integrates analytics with in-app guides and polls. Good for product teams wanting action-oriented insights.'
  WHEN 'PostHog' THEN 'Unifies product analytics, session replay, and feature flags. Strong open-source option with self-hosting.'
  
  -- Session Replay Tools
  WHEN 'Contentsquare' THEN 'Enterprise platform analyzing user interactions at aggregate level. Strong for large-scale behavioral insights.'
  WHEN 'FullStory' THEN 'Combines qualitative session replay with quantitative analytics. Excellent search and analysis capabilities.'
  WHEN 'Glassbox' THEN 'Highly secure and compliant platform for regulated industries. Strong enterprise security and privacy features.'
  WHEN 'Hotjar' THEN 'Simple visual insights combining heatmaps and recordings. Easy setup and user-friendly interface.'
  WHEN 'LogRocket' THEN 'Connects user behavior to technical performance and errors. Excellent for debugging and technical insights.'
  WHEN 'Microsoft Clarity' THEN 'Completely free session replay tool with no traffic limits. Easy setup and good performance.'
  WHEN 'Mouseflow' THEN 'Strong integration between session replays and conversion funnels. Good balance of features and price.'
  WHEN 'Quantum Metric' THEN 'Automatically surfaces and quantifies user friction. Advanced AI for identifying problem areas.'
  WHEN 'Smartlook' THEN 'Robust session replay for websites and native mobile apps. Strong mobile analytics capabilities.'
  
  -- BI/Visualization Tools
  WHEN 'AWS QuickSight' THEN 'Cloud-native BI service integrated with AWS stack. Good for organizations already using AWS.'
  WHEN 'Domo' THEN 'Cloud-native platform combining data integration, BI, and apps. Strong for executive dashboards.'
  WHEN 'Looker' THEN 'Robust, governed data modeling layer (LookML) for consistency. Strong for data teams and governance.'
  WHEN 'Metabase' THEN 'Easy-to-use, open-source BI tool accessible to everyone. Great for democratizing data access.'
  WHEN 'Power BI' THEN 'Market-leading tool deeply integrated with Microsoft ecosystem. Excellent value and enterprise features.'
  WHEN 'Qlik Sense' THEN 'Associative engine for exploring data from all angles. Powerful self-service analytics capabilities.'
  WHEN 'Redash' THEN 'Open-source tool for querying data sources and visualizing results. Good for technical teams.'
  WHEN 'Sisense' THEN 'Flexible platform for embedding analytics into other products. Strong for custom analytics applications.'
  WHEN 'Tableau' THEN 'Most powerful and intuitive interface for interactive visualization. Industry standard for data visualization.'
  WHEN 'ThoughtSpot' THEN 'Search-based analytics allowing natural language questions. Revolutionary approach to data exploration.'
  
  -- Survey/Feedback Tools
  WHEN 'Alchemer' THEN 'Flexible and secure platform for market research and CX. Strong security and enterprise features.'
  WHEN 'BlockSurvey' THEN 'Privacy-focused survey tool with blockchain encryption. Unmatched for anonymous feedback collection.'
  WHEN 'Delighted' THEN 'Simplest way to gather NPS, CSAT, and standardized feedback. Beautiful design and easy setup.'
  WHEN 'Dovetail' THEN 'Research repository for analyzing qualitative feedback. Excellent for organizing unstructured feedback.'
  WHEN 'Fillout' THEN 'Modern form builder integrating with Notion & Airtable. Powerful conditional logic and integrations.'
  WHEN 'Google Forms' THEN 'Completely free and simple tool in Google Workspace. Universal access and easy collaboration.'
  WHEN 'Jotform' THEN 'Extremely versatile form builder with vast template library. Huge number of features and integrations.'
  WHEN 'Medallia' THEN 'Enterprise platform for customer signals across touchpoints. Powerful text analytics and omnichannel.'
  WHEN 'Qualtrics' THEN 'Enterprise-grade experience management platform. Extremely powerful survey logic and statistical analysis.'
  WHEN 'Sprig' THEN 'Triggers micro-surveys based on specific user actions. Great for contextual, in-the-moment feedback.'
  WHEN 'SurveyMonkey' THEN 'Market-leading, user-friendly survey creation tool. Large template library and easy sharing.'
  WHEN 'SurveyPlanet' THEN 'User-friendly survey tool with strong free plan. Good visual logic branching and design.'
  WHEN 'SurveySparrow' THEN 'Creates engaging, chat-like surveys improving response rates. Conversational interface and design.'
  WHEN 'Typeform' THEN 'Beautiful, conversational surveys improving response rates. Best-in-class survey design and UX.'
  WHEN 'UserVoice' THEN 'Dedicated platform for collecting and managing product ideas. Excellent feature request workflows.'
  WHEN 'Zoho Survey' THEN 'Solid survey tool within Zoho business ecosystem. Great value and seamless integrations.'
  
  -- Usability Testing Tools
  WHEN 'Lookback' THEN 'Focuses exclusively on real-time, moderated user interviews. Excellent for live research sessions.'
  WHEN 'Maze' THEN 'Rapid, unmoderated prototype testing integrated into Figma. Seamless design-to-testing workflow.'
  WHEN 'Optimal Workshop' THEN 'Industry standard for information architecture testing. Specialized tools for IA and navigation.'
  WHEN 'UsabilityHub' THEN 'Fastest tool for simple, unmoderated preference tests. Quick and affordable for basic testing.'
  WHEN 'Userbrain' THEN 'Simple, subscription-based continuous automated testing. Consistent feedback stream and affordable.'
  WHEN 'Userfeel' THEN 'Pay-as-you-go model perfect for quick usability tests. Flexible pricing and rapid turnaround.'
  WHEN 'Userlytics' THEN 'Enterprise-ready platform with flexible global panel. Advanced testing features and comprehensive reporting.'
  WHEN 'UserTesting' THEN 'Unparalleled access to large, diverse participant panel. Industry leader for video feedback.'
  WHEN 'UserZoom' THEN 'Enterprise platform combining quantitative analytics with qualitative feedback. Comprehensive research suite.'
  WHEN 'UXTweak' THEN 'Broad suite of testing tools at great value. Comprehensive features for all types of UX testing.'
  
  ELSE 'Powerful tool for user research and design validation with proven track record in the industry.'
END,
con_text = CASE name
  -- A/B Testing Tools
  WHEN 'AB Tasty' THEN 'Can be expensive for smaller organizations. Learning curve for advanced personalization features.'
  WHEN 'Convert' THEN 'Less popular than major competitors. Smaller community and fewer third-party integrations.'
  WHEN 'Crazy Egg' THEN 'Limited advanced testing capabilities. Basic analytics compared to dedicated platforms.'
  WHEN 'Google Optimize' THEN 'Being discontinued by Google. Limited advanced features compared to paid alternatives.'
  WHEN 'Kameleoon' THEN 'Can be expensive for large implementations. Less market share than industry leaders.'
  WHEN 'Launch Darkly' THEN 'Primarily focused on feature flags rather than pure A/B testing. Can be complex for simple use cases.'
  WHEN 'Omniconvert' THEN 'Less well-known brand with smaller user community. Can be overwhelming with many features.'
  WHEN 'Optimizely' THEN 'Very expensive, especially for enterprise features. Can be overkill for simple testing needs.'
  WHEN 'SiteSpect' THEN 'Requires technical implementation and server-side setup. Less flexible for quick testing.'
  WHEN 'VWO' THEN 'Some users report occasional performance issues. Learning curve for advanced features.'
  
  -- Analytics Tools
  WHEN 'Adobe Analytics' THEN 'Very expensive and complex to implement. Steep learning curve and requires technical expertise.'
  WHEN 'Amplitude' THEN 'Steep learning curve and requires developer setup. Can be expensive for large data volumes.'
  WHEN 'Google Analytics 4' THEN 'Complex interface with privacy concerns. Requires technical knowledge for advanced features.'
  WHEN 'Heap' THEN 'Data can become messy without clear tracking plan. Can be expensive as data volume grows.'
  WHEN 'Indicative' THEN 'Requires significant technical setup and data engineering. Less user-friendly than competitors.'
  WHEN 'Mixpanel' THEN 'Expensive for large datasets and can require technical implementation. Learning curve for complex analysis.'
  WHEN 'Pendo' THEN 'Analytics features are secondary to guides. Can be expensive and complex for pure analytics needs.'
  WHEN 'PostHog' THEN 'Self-hosted version requires technical maintenance. Cloud version can become expensive at scale.'
  
  -- Session Replay Tools
  WHEN 'Contentsquare' THEN 'Very expensive and complex for smaller organizations. Requires significant implementation effort.'
  WHEN 'FullStory' THEN 'Very expensive and can impact website performance. Privacy concerns with comprehensive data capture.'
  WHEN 'Glassbox' THEN 'Expensive and complex implementation. Overkill for smaller organizations.'
  WHEN 'Hotjar' THEN 'Limited advanced analytics compared to dedicated tools. Can become expensive as usage grows.'
  WHEN 'LogRocket' THEN 'Can be expensive and may impact site performance. Requires technical setup for optimal use.'
  WHEN 'Microsoft Clarity' THEN 'Limited advanced features and customization options. Data processing delays for large sites.'
  WHEN 'Mouseflow' THEN 'Less advanced features than premium competitors. Limited integrations with other tools.'
  WHEN 'Quantum Metric' THEN 'Very expensive and complex for smaller organizations. Requires significant technical implementation.'
  WHEN 'Smartlook' THEN 'Can be expensive for high-traffic sites. Some users report occasional data processing delays.'
  
  -- BI/Visualization Tools  
  WHEN 'AWS QuickSight' THEN 'Limited advanced visualization capabilities. Requires AWS ecosystem knowledge.'
  WHEN 'Domo' THEN 'Very expensive, especially for smaller organizations. Can be complex to set up and maintain.'
  WHEN 'Looker' THEN 'Requires LookML knowledge and technical expertise. Can be expensive for large implementations.'
  WHEN 'Metabase' THEN 'Limited advanced features compared to enterprise solutions. Requires technical setup for complex use cases.'
  WHEN 'Power BI' THEN 'Can be complex for non-Microsoft users. Some limitations in advanced visualizations.'
  WHEN 'Qlik Sense' THEN 'Learning curve for associative model. Can be expensive for large deployments.'
  WHEN 'Redash' THEN 'Requires technical knowledge for setup and queries. Limited advanced visualization options.'
  WHEN 'Sisense' THEN 'Can be expensive and requires significant implementation effort. Learning curve for complex features.'
  WHEN 'Tableau' THEN 'Very expensive, especially for enterprise use. Can be complex and requires training.'
  WHEN 'ThoughtSpot' THEN 'Expensive and requires significant data preparation. Learning curve for natural language queries.'
  
  -- Survey/Feedback Tools
  WHEN 'Alchemer' THEN 'Can be expensive for advanced features. Learning curve for complex survey logic.'
  WHEN 'BlockSurvey' THEN 'Limited advanced survey features. Smaller user base and fewer integrations.'
  WHEN 'Delighted' THEN 'Not a flexible general-purpose survey tool. Limited analytics and customization options.'
  WHEN 'Dovetail' THEN 'For analyzing feedback, not collecting it directly. Requires existing data sources.'
  WHEN 'Fillout' THEN 'Newer tool with smaller community. Some advanced features may be missing.'
  WHEN 'Google Forms' THEN 'Limited advanced features and branding options. Basic analytics and survey logic.'
  WHEN 'Jotform' THEN 'Can become expensive with advanced features. Interface can be overwhelming for simple needs.'
  WHEN 'Medallia' THEN 'Overkill for most companies with very high cost. Complex implementation and maintenance.'
  WHEN 'Qualtrics' THEN 'Very expensive with steep learning curve. Overkill for simple feedback collection.'
  WHEN 'Sprig' THEN 'Expensive and primarily focused on in-product surveys. Limited for general survey needs.'
  WHEN 'SurveyMonkey' THEN 'Advanced features require high-tier plans. Less focused on in-product feedback.'
  WHEN 'SurveyPlanet' THEN 'Limited advanced features in free plan. Smaller brand with fewer integrations.'
  WHEN 'SurveySparrow' THEN 'Can be expensive for large-scale surveys. Limited advanced analytics features.'
  WHEN 'Typeform' THEN 'Less powerful for complex branching logic. Can be expensive for high-volume usage.'
  WHEN 'UserVoice' THEN 'Not a general survey tool, focused on idea management. Can be expensive for full features.'
  WHEN 'Zoho Survey' THEN 'Limited advanced features compared to specialized tools. Requires Zoho ecosystem knowledge.'
  
  -- Usability Testing Tools
  WHEN 'Lookback' THEN 'Limited to moderated sessions only. Requires scheduling and coordination for each test.'
  WHEN 'Maze' THEN 'Limited to prototype testing, not live sites. Requires Figma or other design tool integration.'
  WHEN 'Optimal Workshop' THEN 'Specialized for IA testing, not general usability. Can be expensive for full feature access.'
  WHEN 'UsabilityHub' THEN 'Limited to simple preference tests. No moderated testing or detailed user journeys.'
  WHEN 'Userbrain' THEN 'Subscription model may not suit sporadic testing needs. Limited participant demographics.'
  WHEN 'Userfeel' THEN 'Pay-per-test can become expensive for frequent testing. Limited participant pool options.'
  WHEN 'Userlytics' THEN 'Can be expensive for large-scale testing programs. Learning curve for advanced features.'
  WHEN 'UserTesting' THEN 'Very expensive, especially for frequent testing. Limited customization of participant criteria.'
  WHEN 'UserZoom' THEN 'Very expensive enterprise-focused platform. Complex setup and learning curve.'
  WHEN 'UXTweak' THEN 'Newer platform with smaller user community. Some advanced features may be limited.'
  
  ELSE 'May require technical setup, learning curve, and can be expensive for extensive use cases.'
END;

-- ============================================================================
-- STEP 3: Create virtual "all-in" method entry (using method_id = 0)
-- ============================================================================

-- Insert the "All in" method with manual ID = 0
INSERT INTO methods (id, collection_id, name, slug, description, current_upvotes, current_downvotes, initial_score, metadata)
VALUES (0, 1, 'All in', 'all-in', 'Aggregated view of all tools across all methods', 0, 0, 0, '{"view_type":"aggregated","description":"Shows all tools ranked by total net score across all methods"}')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  metadata = EXCLUDED.metadata;

-- ============================================================================
-- STEP 4: Create empty "all-in" leaderboard entries for all tools
-- These will only store DIRECT votes for the "All in" view, NOT aggregated scores
-- ============================================================================

-- Create "all-in" leaderboard entries for all existing tools (using method_id = 0)
-- These start with 0 votes and will only track direct votes on "All in" view
INSERT INTO tools_leaderboard (tool_id, method_id, initial_upvotes, initial_downvotes, current_upvotes, current_downvotes)
SELECT DISTINCT t.id, 0, 0, 0, 0, 0
FROM tools t
WHERE NOT EXISTS (
  SELECT 1 FROM tools_leaderboard tl 
  WHERE tl.tool_id = t.id AND tl.method_id = 0
);

-- ============================================================================
-- STEP 5: Create pros/cons entries for "all-in" view using universal text
-- ============================================================================

-- Insert universal pros/cons for all tools in the "all-in" view (using method_id = 0)
INSERT INTO tool_pros_and_cons (tool_id, method_id, pro_text, con_text)
SELECT t.id, 0, t.pro_text, t.con_text
FROM tools t
WHERE t.pro_text IS NOT NULL 
  AND t.con_text IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM tool_pros_and_cons tpc 
    WHERE tpc.tool_id = t.id AND tpc.method_id = 0
  );

-- ============================================================================
-- VERIFICATION QUERIES - Run these to verify the migration was successful
-- ============================================================================

-- Check that universal pro/con text was added to tools
SELECT 
    name,
    CASE WHEN pro_text IS NOT NULL THEN 'YES' ELSE 'NO' END as has_pro_text,
    CASE WHEN con_text IS NOT NULL THEN 'YES' ELSE 'NO' END as has_con_text,
    LEFT(pro_text, 50) as pro_preview,
    LEFT(con_text, 50) as con_preview
FROM tools 
ORDER BY name
LIMIT 5;

-- Check that "All in" method was created
SELECT id, name, slug, description FROM methods WHERE id = 0;

-- Check that "all-in" leaderboard entries were created (should all be 0)
SELECT 
    COUNT(*) as total_all_in_entries,
    SUM(initial_upvotes + initial_downvotes + current_upvotes + current_downvotes) as total_votes_should_be_zero
FROM tools_leaderboard 
WHERE method_id = 0;

-- Check pros/cons entries for "all-in" view
SELECT COUNT(*) as universal_pros_cons_entries
FROM tool_pros_and_cons 
WHERE method_id = 0;

-- Show summary statistics
SELECT 
    'Tools with universal pro/con text' as metric,
    COUNT(*) as count
FROM tools 
WHERE pro_text IS NOT NULL AND con_text IS NOT NULL
UNION ALL
SELECT 
    'All-in leaderboard entries' as metric,
    COUNT(*) as count
FROM tools_leaderboard 
WHERE method_id = 0
UNION ALL
SELECT 
    'All-in pros/cons entries' as metric,
    COUNT(*) as count
FROM tool_pros_and_cons 
WHERE method_id = 0;

COMMIT;

-- ============================================================================
-- NOTES FOR IMPLEMENTATION:
-- ============================================================================
-- 1. "All in" scores are calculated DYNAMICALLY in the API, not stored in DB
-- 2. tools_leaderboard entries with method_id = 0 only track DIRECT "All in" votes
-- 3. Total "All in" score = sum of all method scores + direct "All in" votes
-- 4. This maintains consistent lexicon: current_* = direct votes, initial_* = backfilled
-- 5. Voting on "All in" view creates votes with method_id = 0
-- 6. Universal pro/con text is stored in tools table for all methods to use
-- 7. API calculates: sum(method scores) + direct_all_in_votes = total_all_in_score
-- 8. This prevents the "double voting" issue where one vote creates multiple votes
-- ============================================================================
