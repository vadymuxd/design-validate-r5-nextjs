-- User Feedback Tools Backfill Migration
-- Date: July 16, 2025
-- Purpose: Add 10 User Feedback tools with sentiment analysis and leaderboard data
-- Based on sentiment analysis data provided by user (late 2023 - mid-2025)

-- Begin transaction
BEGIN;

-- Insert tools into the tools table (no method_id column - relationship managed via tools_leaderboard)
-- Note: Hotjar and Pendo already exist in database, so we'll add them to User Feedback method via leaderboard only
INSERT INTO tools (name, description, logo_url, website_url) VALUES
('Sprig', 'Triggers micro-surveys based on specific user actions within a product. Great for in-the-moment, contextual feedback with strong video questions.', '/tools-logos/sprig.png', 'https://sprig.com'),
('Qualtrics', 'An enterprise-grade platform for comprehensive experience management (XM) with extremely powerful survey logic and advanced statistical analysis.', '/tools-logos/qualtrics.png', 'https://www.qualtrics.com'),
('SurveyMonkey', 'A market-leading, user-friendly tool for creating and distributing surveys with a large library of templates and easy sharing capabilities.', '/tools-logos/surveymonkey.png', 'https://www.surveymonkey.com'),
('Typeform', 'Creates beautiful, conversational surveys that improve response rates with best-in-class design and user experience.', '/tools-logos/typeform.png', 'https://www.typeform.com'),
('Delighted', 'The simplest way to gather actionable feedback using NPS, CSAT, and other standardized survey methodologies with beautiful design.', '/tools-logos/delighted.png', 'https://delighted.com'),
('Medallia', 'An enterprise-grade platform for capturing and analyzing customer signals across every touchpoint with powerful text analytics.', '/tools-logos/medallia.png', 'https://www.medallia.com'),
('UserVoice', 'A dedicated platform for collecting, prioritizing, and managing product ideas from users with excellent feature request workflows.', '/tools-logos/uservoice.png', 'https://www.uservoice.com'),
('Dovetail', 'A research repository that helps analyze and organize qualitative feedback with excellent tools for unstructured feedback analysis.', '/tools-logos/dovetail.png', 'https://dovetailtool.com');

-- Insert leaderboard data for each tool (including existing Hotjar and Pendo)
-- Note: Using initial_upvotes/initial_downvotes for backfill data, current_* for new site votes
INSERT INTO tools_leaderboard (tool_id, method_id, initial_upvotes, initial_downvotes, current_upvotes, current_downvotes)
SELECT t.id, 9, 
  CASE t.name
    WHEN 'Hotjar' THEN 320
    WHEN 'Sprig' THEN 260
    WHEN 'Qualtrics' THEN 300
    WHEN 'SurveyMonkey' THEN 280
    WHEN 'Typeform' THEN 240
    WHEN 'Delighted' THEN 210
    WHEN 'Medallia' THEN 240
    WHEN 'UserVoice' THEN 220
    WHEN 'Pendo' THEN 200
    WHEN 'Dovetail' THEN 180
  END as initial_upvotes,
  CASE t.name
    WHEN 'Hotjar' THEN 70
    WHEN 'Sprig' THEN 50
    WHEN 'Qualtrics' THEN 100
    WHEN 'SurveyMonkey' THEN 90
    WHEN 'Typeform' THEN 60
    WHEN 'Delighted' THEN 40
    WHEN 'Medallia' THEN 80
    WHEN 'UserVoice' THEN 70
    WHEN 'Pendo' THEN 70
    WHEN 'Dovetail' THEN 100
  END as initial_downvotes,
  0 as current_upvotes,    -- Start with 0 for new site votes
  0 as current_downvotes   -- Start with 0 for new site votes
FROM tools t
WHERE t.name IN ('Hotjar', 'Sprig', 'Qualtrics', 'SurveyMonkey', 'Typeform', 'Delighted', 'Medallia', 'UserVoice', 'Pendo', 'Dovetail');

-- Insert pros and cons data based on sentiment analysis
INSERT INTO tool_pros_and_cons (tool_id, method_id, pro_text, con_text)
SELECT t.id, 9,
  CASE t.name
    WHEN 'Hotjar' THEN 'Combines visual behavior analytics with on-site feedback tools. Excellent for contextual feedback (widgets on specific elements), easy setup.'
    WHEN 'Sprig' THEN 'Triggers micro-surveys based on specific user actions within a product. Great for in-the-moment, contextual feedback; strong video questions.'
    WHEN 'Qualtrics' THEN 'An enterprise-grade platform for comprehensive experience management (XM). Extremely powerful survey logic, advanced statistical analysis, deep reporting.'
    WHEN 'SurveyMonkey' THEN 'A market-leading, user-friendly tool for creating and distributing surveys. Very easy to build and share surveys, large library of templates.'
    WHEN 'Typeform' THEN 'Creates beautiful, conversational surveys that improve response rates. Best-in-class for survey design and user experience, engaging for users.'
    WHEN 'Delighted' THEN 'The simplest way to gather actionable feedback using NPS, CSAT, and other standardized survey methodologies. Extremely easy to set up and run, beautiful survey design, focuses on key metrics.'
    WHEN 'Medallia' THEN 'An enterprise-grade platform for capturing and analyzing customer signals across every touchpoint. Omnichannel data collection, powerful text analytics, strong for large corporations.'
    WHEN 'UserVoice' THEN 'A dedicated platform for collecting, prioritizing, and managing product ideas from users. Excellent for feature request boards, clear prioritization workflows, public roadmaps.'
    WHEN 'Pendo' THEN 'Integrates feedback collection directly with product analytics and in-app guides. Can target surveys to specific user segments, drives action with guides.'
    WHEN 'Dovetail' THEN 'A research repository that helps analyze and organize qualitative feedback. Excellent for analyzing unstructured feedback from any source.'
  END as pro_text,
  CASE t.name
    WHEN 'Hotjar' THEN 'Survey logic and analytics are less powerful than dedicated survey tools.'
    WHEN 'Sprig' THEN 'Expensive, primarily focused on in-product surveys, not general-purpose.'
    WHEN 'Qualtrics' THEN 'Very expensive, steep learning curve, overkill for simple feedback.'
    WHEN 'SurveyMonkey' THEN 'Less focused on in-product feedback, advanced features require high-tier plans.'
    WHEN 'Typeform' THEN 'Less powerful for complex branching logic and deep data analysis.'
    WHEN 'Delighted' THEN 'Not a flexible or general-purpose survey tool, limited analytics.'
    WHEN 'Medallia' THEN 'Overkill for most companies, very high cost, complex implementation.'
    WHEN 'UserVoice' THEN 'Not a survey tool, focused on idea management, can be expensive.'
    WHEN 'Pendo' THEN 'Feedback tools are secondary to its analytics and guide features.'
    WHEN 'Dovetail' THEN 'It''s for analyzing feedback, not collecting it directly from users.'
  END as con_text
FROM tools t
WHERE t.name IN ('Hotjar', 'Sprig', 'Qualtrics', 'SurveyMonkey', 'Typeform', 'Delighted', 'Medallia', 'UserVoice', 'Pendo', 'Dovetail');

-- Verify the data was inserted correctly
SELECT 
    t.name as tool_name,
    t.description,
    tl.initial_upvotes,
    tl.initial_downvotes,
    tl.current_upvotes,
    tl.current_downvotes,
    (tl.initial_upvotes + tl.current_upvotes) as total_upvotes,
    (tl.initial_downvotes + tl.current_downvotes) as total_downvotes,
    ((tl.initial_upvotes + tl.current_upvotes) - (tl.initial_downvotes + tl.current_downvotes)) as net_sentiment_score,
    LEFT(tpc.pro_text, 50) as pros_preview,
    LEFT(tpc.con_text, 50) as cons_preview
FROM tools t
LEFT JOIN tools_leaderboard tl ON t.id = tl.tool_id AND tl.method_id = 9
LEFT JOIN tool_pros_and_cons tpc ON t.id = tpc.tool_id AND tpc.method_id = 9
WHERE t.name IN ('Hotjar', 'Sprig', 'Qualtrics', 'SurveyMonkey', 'Typeform', 'Delighted', 'Medallia', 'UserVoice', 'Pendo', 'Dovetail')
ORDER BY net_sentiment_score DESC;

-- Commit the transaction
COMMIT;

-- Final verification query
SELECT 
    'User Feedback Tools Backfill Complete' as status,
    COUNT(DISTINCT t.id) as tools_in_user_feedback,
    SUM(tl.initial_upvotes) as total_initial_upvotes,
    SUM(tl.initial_downvotes) as total_initial_downvotes,
    SUM(tl.current_upvotes) as total_current_upvotes,
    SUM(tl.current_downvotes) as total_current_downvotes,
    SUM(tl.initial_upvotes + tl.current_upvotes) as total_upvotes,
    SUM(tl.initial_downvotes + tl.current_downvotes) as total_downvotes,
    SUM(tl.initial_upvotes + tl.current_upvotes) - SUM(tl.initial_downvotes + tl.current_downvotes) as net_sentiment_score
FROM tools t
LEFT JOIN tools_leaderboard tl ON t.id = tl.tool_id AND tl.method_id = 9
WHERE t.name IN ('Hotjar', 'Sprig', 'Qualtrics', 'SurveyMonkey', 'Typeform', 'Delighted', 'Medallia', 'UserVoice', 'Pendo', 'Dovetail');
