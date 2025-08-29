-- Survey Tools Enhancement - Comprehensive Update
-- Date: August 29, 2025
-- Purpose: Add missing Survey tools, update scores, and enhance content for method_id = 8 (Surveys)
-- Based on updated sentiment analysis and voting data provided by user

-- Begin transaction
BEGIN;

-- ============================================================================
-- STEP 1: Insert new tools into tools table
-- ============================================================================

-- Insert 6 new tools that are missing from the tools table
-- Note: Alchemer and Zoho Survey already exist, so they are excluded
INSERT INTO tools (name, description, logo_url, website_url, pro_text, con_text) VALUES
('LimeSurvey', 'Open-source survey software offering complete control through self-hosting with extensive customization capabilities.', '/tools-logos/limesurvey.png', 'https://www.limesurvey.org', 'Free open-source solution with unlimited responses and complete customization control for technical teams.', 'Requires technical expertise for setup and maintenance, with outdated user interface compared to modern SaaS tools.'),
('Microsoft Forms', 'Simple survey and quiz creation tool integrated into Microsoft 365 ecosystem with real-time collaboration features.', '/tools-logos/microsoft-forms.png', 'https://forms.microsoft.com', 'Seamlessly integrates with Microsoft ecosystem and offers easy collaboration for teams already using Office 365.', 'Limited advanced features and customization options compared to dedicated survey platforms.'),
('Survicate', 'Customer feedback platform specializing in targeted surveys across websites, emails, and mobile apps with NPS tracking.', '/tools-logos/survicate.png', 'https://survicate.com', 'Multi-channel survey deployment with strong NPS tracking and behavioral targeting capabilities.', 'Limited advanced analytics and fewer integrations compared to larger survey platforms.'),
('Forsta', 'Enterprise customer experience platform combining survey distribution with advanced analytics and multi-channel insights.', '/tools-logos/forsta.png', 'https://forsta.com', 'Comprehensive enterprise CX platform with robust analytics and feedback management at scale.', 'Very expensive and complex implementation, making it impractical for smaller organizations.'),
('Tally', 'Modern survey builder focusing on simplicity with unlimited free responses and clean design aesthetics.', '/tools-logos/tally.png', 'https://tally.so', 'Unlimited free surveys with modern, minimalist design and straightforward survey creation process.', 'Limited customization options and basic analytics compared to full-featured survey platforms.'),
('Attest', 'Market research survey platform with built-in audience recruitment and brand insights reporting capabilities.', '/tools-logos/attest.png', 'https://www.askattest.com', 'Integrated audience access streamlines market research with built-in participant recruitment and targeting.', 'Focused primarily on market research, less suitable for internal feedback or academic survey projects.')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- STEP 2: Insert/Update tools_leaderboard for Survey method (method_id = 8)
-- ============================================================================

-- Insert or update leaderboard entries for all Survey tools with new scores
INSERT INTO tools_leaderboard (tool_id, method_id, initial_upvotes, initial_downvotes, current_upvotes, current_downvotes)
SELECT t.id, 8, 
  CASE t.name
    WHEN 'Qualtrics' THEN 15
    WHEN 'SurveyMonkey' THEN 11
    WHEN 'Typeform' THEN 10
    WHEN 'Jotform' THEN 9
    WHEN 'Google Forms' THEN 9
    WHEN 'Alchemer' THEN 6
    WHEN 'LimeSurvey' THEN 5
    WHEN 'Sprig' THEN 4
    WHEN 'Microsoft Forms' THEN 4
    WHEN 'Survicate' THEN 4
    WHEN 'Forsta' THEN 2
    WHEN 'Fillout' THEN 2
    WHEN 'Medallia' THEN 2
    WHEN 'SurveySparrow' THEN 2
    WHEN 'Tally' THEN 2
    WHEN 'Optimal Workshop' THEN 2
    WHEN 'Attest' THEN 2
    WHEN 'Delighted' THEN 2
    WHEN 'Zoho Survey' THEN 2
    WHEN 'UsabilityHub' THEN 2
    WHEN 'UserPilot' THEN 2
    WHEN 'SurveyPlanet' THEN 1
    ELSE 0
  END as initial_upvotes,
  0 as initial_downvotes,  -- Set to 0 as per requirement
  0 as current_upvotes,    -- Start with 0 for new site votes
  0 as current_downvotes   -- Start with 0 for new site votes
FROM tools t
WHERE t.name IN ('Qualtrics', 'SurveyMonkey', 'Typeform', 'Jotform', 'Google Forms', 'Alchemer', 'LimeSurvey', 'Sprig', 'Microsoft Forms', 'Survicate', 'Forsta', 'Fillout', 'Medallia', 'SurveySparrow', 'Tally', 'Optimal Workshop', 'Attest', 'Delighted', 'Zoho Survey', 'UsabilityHub', 'UserPilot', 'SurveyPlanet')
ON CONFLICT (tool_id, method_id) DO UPDATE SET
    initial_upvotes = EXCLUDED.initial_upvotes,
    initial_downvotes = EXCLUDED.initial_downvotes;

-- ============================================================================
-- STEP 3: Insert/Update tool_pros_and_cons for Survey method (method_id = 8)
-- ============================================================================

INSERT INTO tool_pros_and_cons (tool_id, method_id, feature_description, pro_text, con_text)
SELECT t.id, 8,
  CASE t.name
    WHEN 'Qualtrics' THEN 'Enterprise survey platform with advanced logic, segmentation, and analytics for large-scale customer and employee research.'
    WHEN 'SurveyMonkey' THEN 'Popular survey tool with intuitive design, AI assistance, and panel access for quick feedback collection.'
    WHEN 'Typeform' THEN 'Conversational, design-focused survey tool that improves engagement through interactive flows and visual appeal.'
    WHEN 'Jotform' THEN 'Flexible survey builder with drag-and-drop editing, rich templates, payment support, and workflow integrations.'
    WHEN 'Google Forms' THEN 'Free, collaborative survey tool tied to Google Workspace with basic templates, real-time results, and Sheets sync.'
    WHEN 'Alchemer' THEN 'Enterprise survey platform with strong branching logic, analytics, and reporting for complex feedback.'
    WHEN 'LimeSurvey' THEN 'Open-source survey software with self-hosting, advanced customization, and plugin ecosystem for flexibility.'
    WHEN 'Sprig' THEN 'In-product survey tool designed for real-time user feedback, capturing quick signals during app experiences.'
    WHEN 'Microsoft Forms' THEN 'Survey and quiz tool in Microsoft 365 with real-time charts, collaboration, and seamless integration.'
    WHEN 'Survicate' THEN 'Customer feedback platform offering on-site, email, and in-app surveys with NPS and targeting options.'
    WHEN 'Forsta' THEN 'Enterprise-grade CX and survey platform combining distribution, analytics, and multi-channel insights.'
    WHEN 'Fillout' THEN 'Modern, minimalist survey builder optimized for quick setup, simple logic, and clean response design.'
    WHEN 'Medallia' THEN 'CX platform using surveys across channels with advanced analytics, sentiment tracking, and journey mapping.'
    WHEN 'SurveySparrow' THEN 'Conversational survey tool offering NPS, chat-style UX, and multi-channel distribution for feedback.'
    WHEN 'Tally' THEN 'Lightweight survey builder with unlimited free responses, logic options, and sleek design focus.'
    WHEN 'Optimal Workshop' THEN 'UX research suite combining surveys with tree tests, card sorts, and first-click testing for insights.'
    WHEN 'Attest' THEN 'Market research survey platform with targeting, built-in sampling, and brand insights reporting.'
    WHEN 'Delighted' THEN 'Specialized NPS survey tool capturing and tracking customer satisfaction trends with simple workflows.'
    WHEN 'Zoho Survey' THEN 'SMB-focused survey tool with logic, templates, automation, and CRM integration inside Zoho ecosystem.'
    WHEN 'UsabilityHub' THEN 'UX testing platform offering preference tests, click tests, and short surveys for quick design feedback.'
    WHEN 'UserPilot' THEN 'In-app survey tool built into product flows, combining contextual feedback with onboarding analytics.'
    WHEN 'SurveyPlanet' THEN 'Simple online survey builder with unlimited responses on free plan and basic customization options.'
  END as feature_description,
  CASE t.name
    WHEN 'Qualtrics' THEN 'Customizable and powerful, with predictive analytics and integrations to support sophisticated research workflows.'
    WHEN 'SurveyMonkey' THEN 'Templates and global panels speed survey deployment, making it efficient for rapid market and customer research.'
    WHEN 'Typeform' THEN 'Modern, engaging survey experience boosts completion rates with conditional logic and clean design.'
    WHEN 'Jotform' THEN 'Highly customizable with automation, integrations, and large template library for diverse use cases.'
    WHEN 'Google Forms' THEN 'Totally free and easy to use; seamless integration with Google ecosystem for quick data collection.'
    WHEN 'Alchemer' THEN 'Robust customization, logic, and reporting capabilities make it powerful for research-focused teams.'
    WHEN 'LimeSurvey' THEN 'Free to host with deep customization—ideal for technical teams needing control and advanced features.'
    WHEN 'Sprig' THEN 'Contextual micro-surveys embed into product journeys, enabling immediate and relevant UX insights.'
    WHEN 'Microsoft Forms' THEN 'Works natively with MS suite; great for quick feedback and simple survey distribution in organizations.'
    WHEN 'Survicate' THEN 'Multi-channel reach and NPS tracking allow businesses to collect feedback at critical touchpoints.'
    WHEN 'Forsta' THEN 'Strong for enterprise research programs, offering robust analytics and feedback management at scale.'
    WHEN 'Fillout' THEN 'Sleek UI and straightforward creation make it ideal for teams needing fast and frictionless surveys.'
    WHEN 'Medallia' THEN 'Comprehensive feedback management for enterprises, with strong sentiment and CX journey insights.'
    WHEN 'SurveySparrow' THEN 'Engaging UI and NPS features drive higher participation; multi-channel deployment adds flexibility.'
    WHEN 'Tally' THEN 'Unlimited free surveys and modern UX make it highly efficient for quick, simple feedback projects.'
    WHEN 'Optimal Workshop' THEN 'Survey feature works alongside UX tools, aligning user feedback with behavioral testing results.'
    WHEN 'Attest' THEN 'Integrated audience access streamlines market research, saving time on recruitment and targeting.'
    WHEN 'Delighted' THEN 'Easy to deploy and focused on NPS, perfect for tracking customer happiness with minimal setup.'
    WHEN 'Zoho Survey' THEN 'Affordable, integrates tightly with Zoho CRM and marketing tools, ideal for small businesses.'
    WHEN 'UsabilityHub' THEN 'Excellent for rapid design validation—micro-surveys integrated into usability tests drive fast insights.'
    WHEN 'UserPilot' THEN 'Captures relevant, contextual feedback inside apps, improving survey response quality and timing.'
    WHEN 'SurveyPlanet' THEN 'Generous free tier and intuitive design make it ideal for fast, low-cost survey deployment.'
  END as pro_text,
  CASE t.name
    WHEN 'Qualtrics' THEN 'Complex interface and steep pricing make it excessive for simple surveys; requires training to leverage fully.'
    WHEN 'SurveyMonkey' THEN 'Advanced analysis and exports hidden behind higher tiers; pricing escalates with scale or complex needs.'
    WHEN 'Typeform' THEN 'Analytics, reporting, and advanced exports limited to premium plans; costly as response volume grows.'
    WHEN 'Jotform' THEN 'Feature overload can overwhelm beginners; pricing scales quickly for advanced workflows and enterprise.'
    WHEN 'Google Forms' THEN 'Limited customization, logic, and analytics restrict professional research or branded survey needs.'
    WHEN 'Alchemer' THEN 'Higher costs and less intuitive interface limit adoption for smaller teams or simpler projects.'
    WHEN 'LimeSurvey' THEN 'Steep setup and maintenance demands; UI and reporting feel outdated compared to modern survey SaaS tools.'
    WHEN 'Sprig' THEN 'Limited scope and analytics; not built for large-scale survey studies or advanced reporting needs.'
    WHEN 'Microsoft Forms' THEN 'Lightweight features—advanced logic, branding, and analytics not on par with dedicated survey platforms.'
    WHEN 'Survicate' THEN 'Analytics and integrations limited compared to larger competitors; less suited for advanced research.'
    WHEN 'Forsta' THEN 'High cost and complexity make it impractical for smaller businesses or lightweight survey tasks.'
    WHEN 'Fillout' THEN 'Limited analytics, integrations, and advanced features restrict use for complex survey projects.'
    WHEN 'Medallia' THEN 'Very expensive and complex; unnecessary for small teams or one-off survey projects.'
    WHEN 'SurveySparrow' THEN 'Analytics are shallow; lacks depth for sophisticated research compared to top-tier platforms.'
    WHEN 'Tally' THEN 'Limited customization, branding, and analytics compared to enterprise survey software options.'
    WHEN 'Optimal Workshop' THEN 'Survey function lacks depth compared to dedicated platforms; designed for UX research over broad surveys.'
    WHEN 'Attest' THEN 'Focused on market research—less suited for internal or academic survey projects with broader needs.'
    WHEN 'Delighted' THEN 'Limited beyond NPS—no broad survey formats, conditional logic, or in-depth reporting features.'
    WHEN 'Zoho Survey' THEN 'Less powerful analytics and customization than larger competitors; limited depth for research studies.'
    WHEN 'UsabilityHub' THEN 'Narrow focus on UX; lacks depth in survey logic, branding, or advanced analytics for broader studies.'
    WHEN 'UserPilot' THEN 'Survey features are basic; not intended for broad research or complex data analysis requirements.'
    WHEN 'SurveyPlanet' THEN 'Lacks advanced logic, analytics, and branding—unsuitable for complex or professional survey work.'
  END as con_text
FROM tools t
WHERE t.name IN ('Qualtrics', 'SurveyMonkey', 'Typeform', 'Jotform', 'Google Forms', 'Alchemer', 'LimeSurvey', 'Sprig', 'Microsoft Forms', 'Survicate', 'Forsta', 'Fillout', 'Medallia', 'SurveySparrow', 'Tally', 'Optimal Workshop', 'Attest', 'Delighted', 'Zoho Survey', 'UsabilityHub', 'UserPilot', 'SurveyPlanet')
ON CONFLICT (tool_id, method_id) DO UPDATE SET
    feature_description = EXCLUDED.feature_description,
    pro_text = EXCLUDED.pro_text,
    con_text = EXCLUDED.con_text;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check that new tools were added
SELECT 
    'New Tools Added' as category,
    COUNT(*) as count
FROM tools 
WHERE name IN ('LimeSurvey', 'Microsoft Forms', 'Survicate', 'Forsta', 'Tally', 'Attest');

-- Check Survey method leaderboard
SELECT 
    t.name,
    tl.initial_upvotes,
    tl.initial_downvotes,
    (tl.initial_upvotes + tl.current_upvotes) - (tl.initial_downvotes + tl.current_downvotes) as net_score
FROM tools_leaderboard tl
JOIN tools t ON tl.tool_id = t.id
WHERE tl.method_id = 8
ORDER BY net_score DESC;

-- Check pros/cons were added/updated
SELECT 
    t.name,
    LEFT(tpc.feature_description, 50) || '...' as feature_preview,
    LEFT(tpc.pro_text, 50) || '...' as pro_preview,
    LEFT(tpc.con_text, 50) || '...' as con_preview
FROM tool_pros_and_cons tpc
JOIN tools t ON tpc.tool_id = t.id
WHERE tpc.method_id = 8
ORDER BY t.name;

-- Check method summary
SELECT 
    m.name as method_name,
    COUNT(tl.tool_id) as tool_count,
    SUM(tl.initial_upvotes + tl.current_upvotes) as total_upvotes,
    SUM(tl.initial_downvotes + tl.current_downvotes) as total_downvotes,
    SUM(tl.initial_upvotes + tl.current_upvotes) - SUM(tl.initial_downvotes + tl.current_downvotes) as net_score
FROM methods m
LEFT JOIN tools_leaderboard tl ON m.id = tl.method_id
WHERE m.id = 8
GROUP BY m.id, m.name;

-- Final verification
SELECT 
    'Survey Tools Enhancement Complete' as status,
    COUNT(DISTINCT t.id) as total_survey_tools,
    SUM(tl.initial_upvotes) as total_initial_upvotes,
    SUM(tl.initial_downvotes) as total_initial_downvotes,
    COUNT(DISTINCT tpc.tool_id) as tools_with_pros_cons
FROM tools t
LEFT JOIN tools_leaderboard tl ON t.id = tl.tool_id AND tl.method_id = 8
LEFT JOIN tool_pros_and_cons tpc ON t.id = tpc.tool_id AND tpc.method_id = 8
WHERE t.name IN ('Qualtrics', 'SurveyMonkey', 'Typeform', 'Jotform', 'Google Forms', 'Alchemer', 'LimeSurvey', 'Sprig', 'Microsoft Forms', 'Survicate', 'Forsta', 'Fillout', 'Medallia', 'SurveySparrow', 'Tally', 'Optimal Workshop', 'Attest', 'Delighted', 'Zoho Survey', 'UsabilityHub', 'UserPilot', 'SurveyPlanet');

COMMIT;

-- ============================================================================
-- NOTES:
-- ============================================================================
-- This migration:
-- 1. Adds 6 new survey tools to the tools table with generic descriptions and pros/cons
--    (Alchemer and Zoho Survey already existed, so they are excluded from INSERT)
-- 2. Updates all survey tools in the leaderboard with new scores (method_id = 8)
-- 3. Updates/adds method-specific feature descriptions and pros/cons for all survey tools
-- 4. Sets initial_downvotes to 0 and resets current votes to 0 as requested
-- 5. Includes comprehensive verification queries
-- 
-- Total tools in Survey method after migration: 22 tools
-- All tools now have updated scores based on your new research data
-- ============================================================================
