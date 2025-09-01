-- ============================================================================
-- USER INTERVIEW TOOLS BACKFILL MIGRATION
-- Date: September 1, 2025
-- Purpose: Add missing User Interview tools and update initial scores 
--          for method_id = 10 (User Interviews)
-- ============================================================================

BEGIN;

-- ============================================================================
-- STEP 1: Ensure User Interviews method exists in methods table
-- ============================================================================

-- Insert User Interviews method if it doesn't exist
INSERT INTO methods (collection_id, name, slug, description, current_upvotes, current_downvotes, initial_score, metadata)
SELECT 
    1, -- Assuming collection_id = 1 for tools collection
    'User Interviews',
    'user-interviews',
    'Having a one-on-one conversation with a user to gain a deep understanding of their needs, motivations, and behaviors is the focus of user interviews. By asking open-ended questions, researchers can explore a user''s experiences in their own words. This qualitative method is especially valuable during the discovery phase of a project to gather rich, contextual insights and ensure the team is solving the right problems.',
    0,
    0,
    10, -- Initial score based on high importance of user interviews
    '{"stage": "discovery", "type": "qualitative"}'::jsonb
WHERE NOT EXISTS (
    SELECT 1 FROM methods WHERE slug = 'user-interviews'
);

-- ============================================================================
-- STEP 2: Add missing tools to the tools table
-- ============================================================================

-- Insert new tools that don't exist in the database yet
INSERT INTO tools (name, description, logo_url, website_url, pro_text, con_text) VALUES
('Respondent', 'Specialized participant recruitment platform connecting researchers with verified professionals and consumers for targeted user research studies.', '/tools-logos/respondent.png', 'https://www.respondent.io/', 'Excellent for finding niche, hard-to-reach audiences with rigorous participant vetting. Strong reputation for quality participants and reliable scheduling.', 'Only handles recruitment logistics, not actual research execution. Premium pricing for high-quality participants can be expensive for frequent studies.'),
('Ethnio', 'Research operations platform that intercepts real users within your product to recruit them for research studies with automated scheduling and incentives.', '/tools-logos/ethnio.png', 'https://ethn.io/', 'Best way to recruit actual product users at the moment of interaction. Streamlines the entire recruitment workflow with automated scheduling and payments.', 'Primary function is recruitment and logistics rather than conducting research. Success depends on sufficient website traffic for effective user interception.'),
('Dscout', 'Mobile-first research platform enabling asynchronous diary studies and missions where participants document their experiences over time.', '/tools-logos/dscout.png', 'https://dscout.com/', 'Captures authentic behavior in natural contexts without live session pressure. Excellent mobile app for participant engagement and rich multimedia responses.', 'Asynchronous nature limits real-time follow-up questions. Can be more expensive than traditional interview methods for deep qualitative insights.'),
('Wondering', 'AI-powered user research platform offering participant recruitment, study design assistance, and automated analysis for faster insights.', '/tools-logos/wondering.png', 'https://wondering.com/', 'AI assistance speeds up research design and analysis. Good balance of automation and human insight with streamlined participant recruitment.', 'Newer platform with smaller participant network. AI analysis may miss nuanced insights that require human interpretation.'),
('Dovetail', 'Collaborative research repository platform for storing, analyzing, and sharing qualitative research data with powerful tagging and insight synthesis tools.', '/tools-logos/dovetail.png', 'https://dovetailapp.com/', 'Excellent for organizing and analyzing interview data across multiple studies. Strong collaboration features and insight synthesis capabilities.', 'Focused on post-interview analysis rather than conducting interviews. Requires existing research data sources and can be expensive for analysis-only functionality.'),
('GreatQuestion', 'Research operations platform designed to streamline the entire user research workflow from participant management to study execution and analysis.', '/tools-logos/greatquestion.png', 'https://www.greatquestion.co/', 'Comprehensive research operations solution reducing administrative overhead. Good participant CRM and study management capabilities.', 'Focuses on research logistics rather than actual interview execution. May require additional tools for conducting the interviews themselves.')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- STEP 3: Update tools_leaderboard with initial scores for User Interview method
-- ============================================================================

-- Get the method_id for User Interviews
-- Insert/Update leaderboard data for all User Interview tools
INSERT INTO tools_leaderboard (tool_id, method_id, initial_upvotes, initial_downvotes, current_upvotes, current_downvotes)
SELECT t.id, m.id,
  CASE t.name
    -- Existing tools with their provided scores
    WHEN 'Lookback' THEN 10
    WHEN 'UserTesting' THEN 8
    WHEN 'User Testing' THEN 8  -- Handle potential name variation
    WHEN 'Maze' THEN 6
    WHEN 'UserZoom' THEN 6
    WHEN 'User Zoom' THEN 6  -- Handle potential name variation
    WHEN 'Lyssna' THEN 6
    WHEN 'UXTweak' THEN 4
    WHEN 'UX Tweak' THEN 4  -- Handle potential name variation
    WHEN 'Userfeel' THEN 4
    WHEN 'Respondent' THEN 4
    WHEN 'Ethnio' THEN 4
    WHEN 'Dovetail' THEN 3
    WHEN 'Dscout' THEN 3
    WHEN 'Loop11' THEN 4
    WHEN 'Hotjar' THEN 3
    WHEN 'Contentsquare' THEN 3
    WHEN 'Trymata' THEN 2
    WHEN 'GreatQuestion' THEN 2
    WHEN 'Wondering' THEN 2
    ELSE 0  -- Default for any other tools
  END, 0, 0, 0
FROM tools t 
CROSS JOIN methods m
WHERE t.name IN (
  'Lookback', 'UserTesting', 'User Testing', 'Maze', 'UserZoom', 'User Zoom', 'Lyssna', 
  'UXTweak', 'UX Tweak', 'Userfeel', 'Respondent', 'Ethnio', 'Dovetail', 'Dscout', 
  'Loop11', 'Hotjar', 'Contentsquare', 'Trymata', 'GreatQuestion', 'Wondering'
)
AND m.slug = 'user-interviews'
ON CONFLICT (tool_id, method_id) DO UPDATE SET
    initial_upvotes = EXCLUDED.initial_upvotes,
    initial_downvotes = EXCLUDED.initial_downvotes;

-- ============================================================================
-- STEP 4: Insert/Update tool_pros_and_cons for User Interview method
-- ============================================================================

INSERT INTO tool_pros_and_cons (tool_id, method_id, pro_text, con_text, feature_description)
SELECT t.id, m.id,
  CASE t.name
    WHEN 'Lookback' THEN 'Unparalleled for seeing real-time reactions and asking follow-up questions during a live interview session, providing deep, contextual qualitative data.'
    WHEN 'UserTesting' THEN 'Dramatically speeds up the recruitment process for interviews, allowing you to get feedback from specific demographics quickly without sourcing participants yourself.'
    WHEN 'User Testing' THEN 'Dramatically speeds up the recruitment process for interviews, allowing you to get feedback from specific demographics quickly without sourcing participants yourself.'
    WHEN 'Maze' THEN 'Quickly validates hypotheses at scale, ensuring your limited and valuable user interview time is spent exploring the most critical issues identified through data.'
    WHEN 'UserZoom' THEN 'Offers a robust, integrated solution for organizations that conduct interviews frequently, combining participant recruitment, moderation, and analysis in one place.'
    WHEN 'User Zoom' THEN 'Offers a robust, integrated solution for organizations that conduct interviews frequently, combining participant recruitment, moderation, and analysis in one place.'
    WHEN 'Lyssna' THEN 'Simplifies the logistics of finding and scheduling people for interviews, letting you focus more on crafting good questions and conducting the session itself.'
    WHEN 'UXTweak' THEN 'Allows you to ground your interview questions in observed behavior by first watching session replays, leading to more focused and insightful interviews.'
    WHEN 'UX Tweak' THEN 'Allows you to ground your interview questions in observed behavior by first watching session replays, leading to more focused and insightful interviews.'
    WHEN 'Userfeel' THEN 'A fast and cost-effective way to gather initial qualitative insights that help you build a focused script for more structured, two-way user interviews.'
    WHEN 'Respondent' THEN 'Excellent for finding niche, hard-to-reach audiences for interviews, ensuring your feedback comes from the right people.'
    WHEN 'Ethnio' THEN 'The best way to interview people who are actively using your product at that moment, providing highly relevant and contextual feedback.'
    WHEN 'Dovetail' THEN 'Transforms raw interview recordings into a searchable, collaborative database of insights, making the post-interview synthesis process much more efficient.'
    WHEN 'Dscout' THEN 'Captures authentic user behavior in their natural context without the pressure of a live interview, often revealing insights that wouldn''t surface otherwise.'
    WHEN 'Loop11' THEN 'Helps you prioritize what to ask during interviews by revealing where most users struggle, ensuring you don''t waste time on less critical issues.'
    WHEN 'Hotjar' THEN 'A powerful all-in-one solution that connects behavioral analytics (heatmaps, recordings) with direct user interview feedback, keeping the entire research process within one platform.'
    WHEN 'Contentsquare' THEN 'The key advantage is directly connecting its best-in-class quantitative analytics with qualitative interview data, allowing you to seamlessly move from insight to interview.'
    WHEN 'Trymata' THEN 'A simple and fast way to source initial talking points and hypotheses that can then be explored in greater depth during a moderated user interview.'
    WHEN 'GreatQuestion' THEN 'Consolidates all the tedious logistics of running interviews into one place, saving significant administrative time and effort.'
    WHEN 'Wondering' THEN 'AI assistance speeds up research design and analysis while maintaining quality participant recruitment for efficient interview workflows.'
    ELSE 'Powerful tool for conducting user interviews and gathering qualitative insights with proven industry effectiveness.'
  END,
  CASE t.name
    WHEN 'Lookback' THEN 'Requires significant time investment for scheduling and conducting live one-on-one interviews. The quality is highly dependent on the moderator''s skill.'
    WHEN 'UserTesting' THEN 'The use of professional testers ("panelists") may not always reflect the behavior of your actual, long-term users, potentially skewing interview insights.'
    WHEN 'User Testing' THEN 'The use of professional testers ("panelists") may not always reflect the behavior of your actual, long-term users, potentially skewing interview insights.'
    WHEN 'Maze' THEN 'Cannot replace interviews as it doesn''t capture the "why" behind user actions. It''s a preparatory tool, not a direct interview platform.'
    WHEN 'UserZoom' THEN 'Its complexity and extensive feature set can be overwhelming and cost-prohibitive for teams focused solely on occasional user interviews.'
    WHEN 'User Zoom' THEN 'Its complexity and extensive feature set can be overwhelming and cost-prohibitive for teams focused solely on occasional user interviews.'
    WHEN 'Lyssna' THEN 'Its core strength lies in a variety of testing methods; the dedicated user interview features may not be as advanced as specialized interview platforms.'
    WHEN 'UXTweak' THEN 'It is not a primary tool for conducting live interviews, but rather for gathering preliminary data and recruiting participants.'
    WHEN 'UX Tweak' THEN 'It is not a primary tool for conducting live interviews, but rather for gathering preliminary data and recruiting participants.'
    WHEN 'Userfeel' THEN 'Lacks the interactive, back-and-forth dialogue of a true user interview, so you can''t ask follow-up questions in the moment.'
    WHEN 'Respondent' THEN 'It only handles recruitment and payment. You must use separate tools for scheduling, conducting, and analyzing the actual interviews.'
    WHEN 'Ethnio' THEN 'Its primary function is recruitment and logistics, not conducting the interview itself. Success depends on having enough site traffic to get intercepts.'
    WHEN 'Dovetail' THEN 'It''s a post-interview analysis tool, not a platform for conducting interviews. It requires a time commitment to tag and organize data properly.'
    WHEN 'Dscout' THEN 'The asynchronous nature means you can''t ask spontaneous follow-up questions, making it less flexible than a live, conversational interview.'
    WHEN 'Loop11' THEN 'It does not offer any features for conducting moderated interviews; it is a tool for informing the interview script, not executing it.'
    WHEN 'Hotjar' THEN 'As an all-in-one tool, the dedicated interview features might not be as singularly focused or advanced as platforms that only specialize in research operations.'
    WHEN 'Contentsquare' THEN 'As an enterprise-level platform, the cost and complexity can be significant, making it less accessible for smaller teams or those who only conduct interviews occasionally.'
    WHEN 'Trymata' THEN 'You cannot interact with the user, so it''s impossible to probe deeper into their comments or clarify ambiguous feedback like in a real interview.'
    WHEN 'GreatQuestion' THEN 'Focuses on the operational "how" of interviews, not the "doing." You will still need a separate video conferencing tool to conduct the interview itself.'
    WHEN 'Wondering' THEN 'Newer platform with smaller participant network. AI analysis may miss nuanced insights that require human interpretation and follow-up.'
    ELSE 'May require technical setup and learning curve. Can be expensive for extensive use cases and may have limitations for specific interview scenarios.'
  END,
  CASE t.name
    WHEN 'Lookback' THEN 'A dedicated platform for conducting live, moderated user interviews by sharing a user''s screen, face, and voice in real-time as they navigate your app.'
    WHEN 'UserTesting' THEN 'Facilitates remote user interviews by connecting you with a large, diverse panel of testers for both moderated live conversations and unmoderated think-aloud sessions.'
    WHEN 'User Testing' THEN 'Facilitates remote user interviews by connecting you with a large, diverse panel of testers for both moderated live conversations and unmoderated think-aloud sessions.'
    WHEN 'Maze' THEN 'Supplements user interviews by running unmoderated tests to gather quantitative data on user paths, helping you formulate data-driven questions for your qualitative interviews.'
    WHEN 'UserZoom' THEN 'An enterprise-grade platform for conducting various forms of remote user interviews, from moderated deep dives to large-scale unmoderated feedback studies.'
    WHEN 'User Zoom' THEN 'An enterprise-grade platform for conducting various forms of remote user interviews, from moderated deep dives to large-scale unmoderated feedback studies.'
    WHEN 'Lyssna' THEN 'Supports user interviews by helping you recruit test participants from its panel and allowing you to schedule and conduct one-on-one interview sessions.'
    WHEN 'UXTweak' THEN 'Supports the user interview process with a participant recruiting tool and session recordings that help you identify user friction points to explore in interviews.'
    WHEN 'UX Tweak' THEN 'Supports the user interview process with a participant recruiting tool and session recordings that help you identify user friction points to explore in interviews.'
    WHEN 'Userfeel' THEN 'Provides quick, unmoderated video feedback where users speak their thoughts aloud, serving as a preliminary, one-way interview to identify key topics for deeper investigation.'
    WHEN 'Respondent' THEN 'A specialized platform focused exclusively on recruiting high-quality, verified professional and consumer participants for your user interviews.'
    WHEN 'Ethnio' THEN 'A research operations tool that intercepts actual users within your app or website to recruit them for user interviews, managing scheduling and incentives.'
    WHEN 'Dovetail' THEN 'A research repository designed to analyze user interview data. You can upload recordings, get transcriptions, and tag insights to find patterns across multiple interviews.'
    WHEN 'Dscout' THEN 'Facilitates remote, asynchronous user interviews through "diary missions," where participants record video and screen activity on their own time to answer your questions.'
    WHEN 'Loop11' THEN 'Gathers unmoderated usability feedback that can be used to generate data-driven topics and questions for your subsequent one-on-one user interviews.'
    WHEN 'Hotjar' THEN 'An integrated tool called Hotjar Engage that handles the entire user interview workflow: recruiting from a dedicated panel, scheduling, hosting the video interview, and processing payments.'
    WHEN 'Contentsquare' THEN 'An all-in-one user interview tool for recruiting, scheduling, conducting, and analyzing moderated remote user research sessions, fully integrated with its analytics suite.'
    WHEN 'Trymata' THEN 'Gathers think-aloud video feedback from users, acting as a one-way preliminary interview to gather initial reactions and usability issues.'
    WHEN 'GreatQuestion' THEN 'A dedicated research operations platform designed to streamline the entire user interview process, from recruiting and scheduling to incentives and a participant CRM.'
    WHEN 'Wondering' THEN 'AI-powered user research platform offering participant recruitment, study design assistance, and automated analysis for faster interview insights.'
    ELSE 'A comprehensive user interview platform designed to help teams gather qualitative insights through structured conversations with users.'
  END
FROM tools t 
CROSS JOIN methods m
WHERE t.name IN (
  'Lookback', 'UserTesting', 'User Testing', 'Maze', 'UserZoom', 'User Zoom', 'Lyssna', 
  'UXTweak', 'UX Tweak', 'Userfeel', 'Respondent', 'Ethnio', 'Dovetail', 'Dscout', 
  'Loop11', 'Hotjar', 'Contentsquare', 'Trymata', 'GreatQuestion', 'Wondering'
)
AND m.slug = 'user-interviews'
ON CONFLICT (tool_id, method_id) DO UPDATE SET
    pro_text = EXCLUDED.pro_text,
    con_text = EXCLUDED.con_text,
    feature_description = EXCLUDED.feature_description;

-- ============================================================================
-- STEP 4: Verification queries
-- ============================================================================

-- Verify tools were added/updated
SELECT 
    t.name as tool_name,
    t.description,
    t.logo_url,
    t.website_url
FROM tools t
WHERE t.name IN ('Respondent', 'Ethnio', 'Dscout', 'Wondering', 'Dovetail', 'GreatQuestion')
ORDER BY t.name;

-- Verify leaderboard entries for User Interview method
SELECT 
    t.name as tool_name,
    tl.initial_upvotes,
    tl.initial_downvotes,
    tl.current_upvotes,
    tl.current_downvotes
FROM tools_leaderboard tl
JOIN tools t ON t.id = tl.tool_id
WHERE tl.method_id = 10
ORDER BY tl.initial_upvotes DESC, t.name;

-- Verify pros and cons entries
SELECT 
    t.name as tool_name,
    LEFT(tpc.feature_description, 100) as feature_description_preview,
    LEFT(tpc.pro_text, 100) as pro_text_preview,
    LEFT(tpc.con_text, 100) as con_text_preview
FROM tool_pros_and_cons tpc
JOIN tools t ON t.id = tpc.tool_id
WHERE tpc.method_id = 10
ORDER BY t.name;

-- Count total tools for User Interview method
SELECT 
    'User Interview Tools Count' as metric,
    COUNT(*) as total_tools
FROM tools_leaderboard tl
WHERE tl.method_id = 10;

COMMIT;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- This migration adds 6 new User Interview tools and updates all tools
-- with proper initial scores, feature descriptions, and method-specific pros/cons
-- for the User Interview method (method_id = 10)
-- ============================================================================
