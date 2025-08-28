-- Stage 4: Usability Testing Tools Update
-- Based on web research from 11 sources with mention count scoring
-- Updates existing tools and adds new research-backed tools for Method ID 1 (Usability Testing)

-- ==================================================
-- PART 0: ADD FEATURE_DESCRIPTION COLUMN IF NOT EXISTS
-- ==================================================

-- Add feature_description column to tool_pros_and_cons table
ALTER TABLE tool_pros_and_cons 
ADD COLUMN IF NOT EXISTS feature_description TEXT;

-- ==================================================
-- PART 1: UPDATE EXISTING TOOLS WITH NEW SCORES
-- ==================================================

-- Update UserTesting (highest mentions: 11)
UPDATE tools_leaderboard 
SET initial_upvotes = 11, initial_downvotes = 0
WHERE tool_id = (SELECT id FROM tools WHERE name = 'UserTesting') 
AND method_id = 1;

-- Update Maze (10 mentions)
UPDATE tools_leaderboard 
SET initial_upvotes = 10, initial_downvotes = 0
WHERE tool_id = (SELECT id FROM tools WHERE name = 'Maze') 
AND method_id = 1;

-- Update UXTweak (9 mentions) 
UPDATE tools_leaderboard 
SET initial_upvotes = 9, initial_downvotes = 0
WHERE tool_id = (SELECT id FROM tools WHERE name = 'UXTweak') 
AND method_id = 1;

-- Update Optimal Workshop (8 mentions)
UPDATE tools_leaderboard 
SET initial_upvotes = 8, initial_downvotes = 0
WHERE tool_id = (SELECT id FROM tools WHERE name = 'Optimal Workshop') 
AND method_id = 1;

-- Update Userlytics (7 mentions)
UPDATE tools_leaderboard 
SET initial_upvotes = 7, initial_downvotes = 0
WHERE tool_id = (SELECT id FROM tools WHERE name = 'Userlytics') 
AND method_id = 1;

-- Update UserZoom (now Userzoom) (6 mentions)
UPDATE tools_leaderboard 
SET initial_upvotes = 6, initial_downvotes = 0
WHERE tool_id = (SELECT id FROM tools WHERE name = 'UserZoom') 
AND method_id = 1;

-- Update UsabilityHub (5 mentions)
UPDATE tools_leaderboard 
SET initial_upvotes = 5, initial_downvotes = 0
WHERE tool_id = (SELECT id FROM tools WHERE name = 'UsabilityHub') 
AND method_id = 1;

-- Update Userfeel (4 mentions)
UPDATE tools_leaderboard 
SET initial_upvotes = 4, initial_downvotes = 0
WHERE tool_id = (SELECT id FROM tools WHERE name = 'Userfeel') 
AND method_id = 1;

-- Update Userbrain (3 mentions)
UPDATE tools_leaderboard 
SET initial_upvotes = 3, initial_downvotes = 0
WHERE tool_id = (SELECT id FROM tools WHERE name = 'Userbrain') 
AND method_id = 1;

-- Update Lookback (2 mentions)
UPDATE tools_leaderboard 
SET initial_upvotes = 2, initial_downvotes = 0
WHERE tool_id = (SELECT id FROM tools WHERE name = 'Lookback') 
AND method_id = 1;

-- ==================================================
-- PART 2: ADD NEW TOOLS AND UPDATE LEADERBOARD FOR ALL 20 AGREED TOOLS
-- ==================================================

-- INSERT only the 6 missing tools from Stage 3 agreed list
INSERT INTO tools (name, website_url, logo_url) VALUES
('Loop11', 'https://www.loop11.com', '/tools-logos/loop11.png'),
('Useberry', 'https://www.useberry.com', '/tools-logos/useberry.png'),
('Trymata', 'https://www.trymata.com', '/tools-logos/trymata.png'),
('User Interviews', 'https://www.userinterviews.com', '/tools-logos/user-interviews.png'),
('UX Metrics', 'https://www.uxmetrics.com', '/tools-logos/ux-metrics.png'),
('PlaybookUX', 'https://www.playbookux.com', '/tools-logos/playbookux.png')
ON CONFLICT (name) DO NOTHING;

-- Add/Update leaderboard entries for all 20 agreed tools with correct mention scores
-- UserTesting (11 mentions) - existing tool
INSERT INTO tools_leaderboard (tool_id, method_id, initial_upvotes, initial_downvotes, current_upvotes, current_downvotes)
SELECT id, 1, 11, 0, 0, 0 FROM tools WHERE name = 'UserTesting'
ON CONFLICT (tool_id, method_id) DO UPDATE SET initial_upvotes = 11, initial_downvotes = 0;

-- Maze (10 mentions) - existing tool  
INSERT INTO tools_leaderboard (tool_id, method_id, initial_upvotes, initial_downvotes, current_upvotes, current_downvotes)
SELECT id, 1, 10, 0, 0, 0 FROM tools WHERE name = 'Maze'
ON CONFLICT (tool_id, method_id) DO UPDATE SET initial_upvotes = 10, initial_downvotes = 0;

-- UXTweak (9 mentions) - existing tool
INSERT INTO tools_leaderboard (tool_id, method_id, initial_upvotes, initial_downvotes, current_upvotes, current_downvotes)
SELECT id, 1, 9, 0, 0, 0 FROM tools WHERE name = 'UXTweak'
ON CONFLICT (tool_id, method_id) DO UPDATE SET initial_upvotes = 9, initial_downvotes = 0;

-- Lookback (8 mentions) - existing tool
INSERT INTO tools_leaderboard (tool_id, method_id, initial_upvotes, initial_downvotes, current_upvotes, current_downvotes)
SELECT id, 1, 8, 0, 0, 0 FROM tools WHERE name = 'Lookback'
ON CONFLICT (tool_id, method_id) DO UPDATE SET initial_upvotes = 8, initial_downvotes = 0;

-- Optimal Workshop (8 mentions) - existing tool
INSERT INTO tools_leaderboard (tool_id, method_id, initial_upvotes, initial_downvotes, current_upvotes, current_downvotes)
SELECT id, 1, 8, 0, 0, 0 FROM tools WHERE name = 'Optimal Workshop'
ON CONFLICT (tool_id, method_id) DO UPDATE SET initial_upvotes = 8, initial_downvotes = 0;

-- Hotjar (7 mentions) - existing tool
INSERT INTO tools_leaderboard (tool_id, method_id, initial_upvotes, initial_downvotes, current_upvotes, current_downvotes)
SELECT id, 1, 7, 0, 0, 0 FROM tools WHERE name = 'Hotjar'
ON CONFLICT (tool_id, method_id) DO UPDATE SET initial_upvotes = 7, initial_downvotes = 0;

-- Userlytics (7 mentions) - existing tool
INSERT INTO tools_leaderboard (tool_id, method_id, initial_upvotes, initial_downvotes, current_upvotes, current_downvotes)
SELECT id, 1, 7, 0, 0, 0 FROM tools WHERE name = 'Userlytics'
ON CONFLICT (tool_id, method_id) DO UPDATE SET initial_upvotes = 7, initial_downvotes = 0;

-- UsabilityHub (6 mentions) - existing tool
INSERT INTO tools_leaderboard (tool_id, method_id, initial_upvotes, initial_downvotes, current_upvotes, current_downvotes)
SELECT id, 1, 6, 0, 0, 0 FROM tools WHERE name = 'UsabilityHub'
ON CONFLICT (tool_id, method_id) DO UPDATE SET initial_upvotes = 6, initial_downvotes = 0;

-- Loop11 (6 mentions) - NEW tool
INSERT INTO tools_leaderboard (tool_id, method_id, initial_upvotes, initial_downvotes, current_upvotes, current_downvotes)
SELECT id, 1, 6, 0, 0, 0 FROM tools WHERE name = 'Loop11'
ON CONFLICT (tool_id, method_id) DO UPDATE SET initial_upvotes = 6, initial_downvotes = 0;

-- Crazy Egg (5 mentions) - existing tool
INSERT INTO tools_leaderboard (tool_id, method_id, initial_upvotes, initial_downvotes, current_upvotes, current_downvotes)
SELECT id, 1, 5, 0, 0, 0 FROM tools WHERE name = 'Crazy Egg'
ON CONFLICT (tool_id, method_id) DO UPDATE SET initial_upvotes = 5, initial_downvotes = 0;

-- Userfeel (4 mentions) - existing tool
INSERT INTO tools_leaderboard (tool_id, method_id, initial_upvotes, initial_downvotes, current_upvotes, current_downvotes)
SELECT id, 1, 4, 0, 0, 0 FROM tools WHERE name = 'Userfeel'
ON CONFLICT (tool_id, method_id) DO UPDATE SET initial_upvotes = 4, initial_downvotes = 0;

-- UserZoom (4 mentions) - existing tool
INSERT INTO tools_leaderboard (tool_id, method_id, initial_upvotes, initial_downvotes, current_upvotes, current_downvotes)
SELECT id, 1, 4, 0, 0, 0 FROM tools WHERE name = 'UserZoom'
ON CONFLICT (tool_id, method_id) DO UPDATE SET initial_upvotes = 4, initial_downvotes = 0;

-- Userbrain (4 mentions) - existing tool
INSERT INTO tools_leaderboard (tool_id, method_id, initial_upvotes, initial_downvotes, current_upvotes, current_downvotes)
SELECT id, 1, 4, 0, 0, 0 FROM tools WHERE name = 'Userbrain'
ON CONFLICT (tool_id, method_id) DO UPDATE SET initial_upvotes = 4, initial_downvotes = 0;

-- Useberry (3 mentions) - NEW tool
INSERT INTO tools_leaderboard (tool_id, method_id, initial_upvotes, initial_downvotes, current_upvotes, current_downvotes)
SELECT id, 1, 3, 0, 0, 0 FROM tools WHERE name = 'Useberry'
ON CONFLICT (tool_id, method_id) DO UPDATE SET initial_upvotes = 3, initial_downvotes = 0;

-- Trymata (3 mentions) - NEW tool
INSERT INTO tools_leaderboard (tool_id, method_id, initial_upvotes, initial_downvotes, current_upvotes, current_downvotes)
SELECT id, 1, 3, 0, 0, 0 FROM tools WHERE name = 'Trymata'
ON CONFLICT (tool_id, method_id) DO UPDATE SET initial_upvotes = 3, initial_downvotes = 0;

-- Contentsquare (2 mentions) - existing tool
INSERT INTO tools_leaderboard (tool_id, method_id, initial_upvotes, initial_downvotes, current_upvotes, current_downvotes)
SELECT id, 1, 2, 0, 0, 0 FROM tools WHERE name = 'Contentsquare'
ON CONFLICT (tool_id, method_id) DO UPDATE SET initial_upvotes = 2, initial_downvotes = 0;

-- User Interviews (2 mentions) - NEW tool
INSERT INTO tools_leaderboard (tool_id, method_id, initial_upvotes, initial_downvotes, current_upvotes, current_downvotes)
SELECT id, 1, 2, 0, 0, 0 FROM tools WHERE name = 'User Interviews'
ON CONFLICT (tool_id, method_id) DO UPDATE SET initial_upvotes = 2, initial_downvotes = 0;

-- Dovetail (2 mentions) - existing tool
INSERT INTO tools_leaderboard (tool_id, method_id, initial_upvotes, initial_downvotes, current_upvotes, current_downvotes)
SELECT id, 1, 2, 0, 0, 0 FROM tools WHERE name = 'Dovetail'
ON CONFLICT (tool_id, method_id) DO UPDATE SET initial_upvotes = 2, initial_downvotes = 0;

-- UX Metrics (2 mentions) - NEW tool
INSERT INTO tools_leaderboard (tool_id, method_id, initial_upvotes, initial_downvotes, current_upvotes, current_downvotes)
SELECT id, 1, 2, 0, 0, 0 FROM tools WHERE name = 'UX Metrics'
ON CONFLICT (tool_id, method_id) DO UPDATE SET initial_upvotes = 2, initial_downvotes = 0;

-- PlaybookUX (2 mentions) - NEW tool
INSERT INTO tools_leaderboard (tool_id, method_id, initial_upvotes, initial_downvotes, current_upvotes, current_downvotes)
SELECT id, 1, 2, 0, 0, 0 FROM tools WHERE name = 'PlaybookUX'
ON CONFLICT (tool_id, method_id) DO UPDATE SET initial_upvotes = 2, initial_downvotes = 0;

-- Typeform (1 mention) - existing tool (found in database but not in Stage 3 list)
INSERT INTO tools_leaderboard (tool_id, method_id, initial_upvotes, initial_downvotes, current_upvotes, current_downvotes)
SELECT id, 1, 1, 0, 0, 0 FROM tools WHERE name = 'Typeform'
ON CONFLICT (tool_id, method_id) DO UPDATE SET initial_upvotes = 1, initial_downvotes = 0;


-- ==================================================
-- PART 3: UPSERT EXACT STAGE 3 PROS/CONS AND FEATURE DESCRIPTIONS
-- ==================================================

-- UserTesting (11 mentions)
INSERT INTO tool_pros_and_cons (tool_id, method_id, feature_description, pro_text, con_text)
SELECT 
  id, 
  1,
  'A comprehensive platform that recruits participants and provides detailed video feedback from real users testing your prototype or live website.',
  'Large diverse panel of over 1 million participants. High-quality video feedback with insights into user thought processes. Professional recruitment and screening. Quick turnaround times.',
  'Expensive pricing, especially for frequent testing. Limited control over participant demographics. Can be time-consuming to review all video feedback.'

FROM tools WHERE name = 'UserTesting'
ON CONFLICT (tool_id, method_id) DO UPDATE SET
  feature_description = EXCLUDED.feature_description,
  pro_text = EXCLUDED.pro_text,
  con_text = EXCLUDED.con_text;


-- Maze (10 mentions)
INSERT INTO tool_pros_and_cons (tool_id, method_id, feature_description, pro_text, con_text)
SELECT 
  id, 
  1,
  'Seamlessly integrates with design tools like Figma to test prototypes with real users, providing quantitative metrics and heatmaps.',
  'Direct integration with Figma, Sketch, and other design tools. Quick prototype testing without development. Clear quantitative metrics and mission success rates. Easy-to-understand heatmaps.',
  'Limited to prototype testing, cannot test live websites. Requires design files in supported formats. Less detailed qualitative feedback compared to video-based tools.'

FROM tools WHERE name = 'Maze'
ON CONFLICT (tool_id, method_id) DO UPDATE SET
  feature_description = EXCLUDED.feature_description,
  pro_text = EXCLUDED.pro_text,
  con_text = EXCLUDED.con_text;


-- UXTweak (9 mentions)
INSERT INTO tool_pros_and_cons (tool_id, method_id, feature_description, pro_text, con_text)
SELECT 
  id, 
  1,
  'An all-in-one UX testing platform offering usability testing, card sorting, tree testing, and surveys with competitive pricing.',
  'Comprehensive suite of UX testing methods in one platform. Competitive pricing compared to specialized tools. Good recruiting options. Clean, intuitive interface.',
  'Smaller participant pool compared to established platforms. Less brand recognition. Some advanced features may be limited compared to specialized tools.'

FROM tools WHERE name = 'UXTweak'
ON CONFLICT (tool_id, method_id) DO UPDATE SET
  feature_description = EXCLUDED.feature_description,
  pro_text = EXCLUDED.pro_text,
  con_text = EXCLUDED.con_text;


-- Lookback (8 mentions)
INSERT INTO tool_pros_and_cons (tool_id, method_id, feature_description, pro_text, con_text)
SELECT 
  id, 
  1,
  'Specializes in live, moderated remote user research sessions with high-quality video and screen sharing capabilities.',
  'High-quality live moderated sessions. Excellent video and screen sharing technology. Real-time collaboration features. Good for in-depth qualitative research.',
  'Limited to moderated sessions only. Requires scheduling coordination. More expensive than unmoderated alternatives. Dependent on participant availability.'

FROM tools WHERE name = 'Lookback'
ON CONFLICT (tool_id, method_id) DO UPDATE SET
  feature_description = EXCLUDED.feature_description,
  pro_text = EXCLUDED.pro_text,
  con_text = EXCLUDED.con_text;


-- Optimal Workshop (8 mentions)
INSERT INTO tool_pros_and_cons (tool_id, method_id, feature_description, pro_text, con_text)
SELECT 
  id, 
  1,
  'Industry-leading platform for information architecture testing, including card sorting, tree testing, and first-click testing.',
  'Industry standard for IA testing. Specialized tools for card sorting and tree testing. Excellent data analysis and reporting. Strong academic and research backing.',
  'Focused primarily on IA testing, not general usability. Can be expensive for full feature access. Learning curve for advanced analysis features.'

FROM tools WHERE name = 'Optimal Workshop'
ON CONFLICT (tool_id, method_id) DO UPDATE SET
  feature_description = EXCLUDED.feature_description,
  pro_text = EXCLUDED.pro_text,
  con_text = EXCLUDED.con_text;


-- Hotjar (7 mentions)
INSERT INTO tool_pros_and_cons (tool_id, method_id, feature_description, pro_text, con_text)
SELECT 
  id, 
  1,
  'Combines heatmaps, session recordings, and user feedback tools to understand how users interact with your live website.',
  'Easy setup and implementation. Combines multiple research methods. Visual heatmaps and session recordings. User-friendly interface. Good free plan available.',
  'Limited advanced analytics compared to specialized tools. Can become expensive with high traffic. Session recordings may not capture all user context.'

FROM tools WHERE name = 'Hotjar'
ON CONFLICT (tool_id, method_id) DO UPDATE SET
  feature_description = EXCLUDED.feature_description,
  pro_text = EXCLUDED.pro_text,
  con_text = EXCLUDED.con_text;


-- Userlytics (7 mentions)
INSERT INTO tool_pros_and_cons (tool_id, method_id, feature_description, pro_text, con_text)
SELECT 
  id, 
  1,
  'Enterprise-focused platform offering comprehensive usability testing with flexible participant recruitment and advanced analytics.',
  'Enterprise-grade features and security. Flexible global participant recruitment. Advanced analytics and reporting. Custom branding options available.',
  'Higher pricing point. Can be complex for simple testing needs. May require more setup time compared to simpler alternatives.'

FROM tools WHERE name = 'Userlytics'
ON CONFLICT (tool_id, method_id) DO UPDATE SET
  feature_description = EXCLUDED.feature_description,
  pro_text = EXCLUDED.pro_text,
  con_text = EXCLUDED.con_text;


-- UsabilityHub (6 mentions)
INSERT INTO tool_pros_and_cons (tool_id, method_id, feature_description, pro_text, con_text)
SELECT 
  id, 
  1,
  'Quick and simple platform for unmoderated preference tests, first-click tests, and five-second tests with fast turnaround.',
  'Very fast results for simple tests. Affordable pricing. Easy to set up and run tests. Good for quick validation and preference testing.',
  'Limited to simple, unmoderated tests. No detailed user journey testing. Minimal qualitative feedback. Not suitable for complex usability studies.'

FROM tools WHERE name = 'UsabilityHub'
ON CONFLICT (tool_id, method_id) DO UPDATE SET
  feature_description = EXCLUDED.feature_description,
  pro_text = EXCLUDED.pro_text,
  con_text = EXCLUDED.con_text;


-- Loop11 (6 mentions)
INSERT INTO tool_pros_and_cons (tool_id, method_id, feature_description, pro_text, con_text)
SELECT 
  id, 
  1,
  'Comprehensive remote usability testing platform offering both moderated and unmoderated testing with detailed analytics.',
  'Both moderated and unmoderated testing options. Comprehensive analytics and reporting. Good participant recruitment tools. Competitive pricing.',
  'Smaller market presence than major competitors. Limited advanced features compared to enterprise platforms. Interface could be more modern.'

FROM tools WHERE name = 'Loop11'
ON CONFLICT (tool_id, method_id) DO UPDATE SET
  feature_description = EXCLUDED.feature_description,
  pro_text = EXCLUDED.pro_text,
  con_text = EXCLUDED.con_text;


-- Crazy Egg (5 mentions)
INSERT INTO tool_pros_and_cons (tool_id, method_id, feature_description, pro_text, con_text)
SELECT 
  id, 
  1,
  'Simple heatmap and A/B testing tool that shows where users click, scroll, and navigate on your website.',
  'Simple and affordable heatmap tool. Easy setup with minimal technical requirements. Good for basic website optimization. Visual click tracking.',
  'Limited advanced features. Basic analytics compared to comprehensive platforms. Primarily focused on heatmaps rather than detailed usability testing.'

FROM tools WHERE name = 'Crazy Egg'
ON CONFLICT (tool_id, method_id) DO UPDATE SET
  feature_description = EXCLUDED.feature_description,
  pro_text = EXCLUDED.pro_text,
  con_text = EXCLUDED.con_text;


-- Userfeel (4 mentions)
INSERT INTO tool_pros_and_cons (tool_id, method_id, feature_description, pro_text, con_text)
SELECT 
  id, 
  1,
  'Pay-per-test usability testing platform that provides video recordings of users completing tasks on your website or app.',
  'Pay-as-you-go pricing model. Quick turnaround times. Video recordings with audio commentary. No subscription required for occasional testing.',
  'Pay-per-test can become expensive for frequent testing. Limited participant screening options. Smaller participant pool than major platforms.'

FROM tools WHERE name = 'Userfeel'
ON CONFLICT (tool_id, method_id) DO UPDATE SET
  feature_description = EXCLUDED.feature_description,
  pro_text = EXCLUDED.pro_text,
  con_text = EXCLUDED.con_text;


-- UserZoom (4 mentions)
INSERT INTO tool_pros_and_cons (tool_id, method_id, feature_description, pro_text, con_text)
SELECT 
  id, 
  1,
  'Enterprise UX research platform combining quantitative analytics with qualitative testing capabilities for comprehensive insights.',
  'Enterprise-grade research capabilities. Combines quantitative and qualitative methods. Advanced analytics and reporting. Large global participant panel.',
  'Very expensive enterprise pricing. Complex setup and learning curve. May be overkill for small teams or simple testing needs.'

FROM tools WHERE name = 'UserZoom'
ON CONFLICT (tool_id, method_id) DO UPDATE SET
  feature_description = EXCLUDED.feature_description,
  pro_text = EXCLUDED.pro_text,
  con_text = EXCLUDED.con_text;


-- Userbrain (4 mentions)
INSERT INTO tool_pros_and_cons (tool_id, method_id, feature_description, pro_text, con_text)
SELECT 
  id, 
  1,
  'Subscription-based continuous usability testing that provides regular user feedback through automated test scheduling.',
  'Subscription model for continuous testing. Automated scheduling and regular feedback. Good for ongoing usability monitoring. Affordable monthly pricing.',
  'Subscription model may not suit sporadic testing needs. Limited participant demographics. Less detailed analysis compared to specialized tools.'

FROM tools WHERE name = 'Userbrain'
ON CONFLICT (tool_id, method_id) DO UPDATE SET
  feature_description = EXCLUDED.feature_description,
  pro_text = EXCLUDED.pro_text,
  con_text = EXCLUDED.con_text;


-- Useberry (3 mentions)
INSERT INTO tool_pros_and_cons (tool_id, method_id, feature_description, pro_text, con_text)
SELECT 
  id, 
  1,
  'User testing platform focused on prototype and website testing with integrated participant recruitment and detailed analytics.',
  'Good balance of features and pricing. Prototype and live site testing. Integrated participant recruitment. Clear analytics dashboard.',
  'Smaller market presence. Limited advanced features compared to enterprise tools. Newer platform with evolving feature set.'

FROM tools WHERE name = 'Useberry'
ON CONFLICT (tool_id, method_id) DO UPDATE SET
  feature_description = EXCLUDED.feature_description,
  pro_text = EXCLUDED.pro_text,
  con_text = EXCLUDED.con_text;


-- Trymata (3 mentions)
INSERT INTO tool_pros_and_cons (tool_id, method_id, feature_description, pro_text, con_text)
SELECT 
  id, 
  1,
  'Modern usability testing platform offering both moderated and unmoderated testing with AI-powered insights and analysis.',
  'Modern interface and user experience. AI-powered insights and analysis. Both moderated and unmoderated options. Competitive pricing.',
  'Newer platform with smaller user base. AI features may not always be accurate. Limited long-term track record compared to established tools.'

FROM tools WHERE name = 'Trymata'
ON CONFLICT (tool_id, method_id) DO UPDATE SET
  feature_description = EXCLUDED.feature_description,
  pro_text = EXCLUDED.pro_text,
  con_text = EXCLUDED.con_text;


-- Contentsquare (2 mentions)
INSERT INTO tool_pros_and_cons (tool_id, method_id, feature_description, pro_text, con_text)
SELECT 
  id, 
  1,
  'Enterprise digital experience analytics platform that provides comprehensive user behavior analysis at scale.',
  'Enterprise-scale analytics capabilities. Comprehensive user behavior tracking. Advanced AI-powered insights. Strong privacy and compliance features.',
  'Very expensive enterprise pricing. Complex implementation and setup. Requires significant technical resources. Overkill for small organizations.'

FROM tools WHERE name = 'Contentsquare'
ON CONFLICT (tool_id, method_id) DO UPDATE SET
  feature_description = EXCLUDED.feature_description,
  pro_text = EXCLUDED.pro_text,
  con_text = EXCLUDED.con_text;


-- User Interviews (2 mentions)
INSERT INTO tool_pros_and_cons (tool_id, method_id, feature_description, pro_text, con_text)
SELECT 
  id, 
  1,
  'Participant recruitment platform that helps researchers find and schedule qualified participants for user research studies.',
  'Large pool of pre-screened participants. Flexible scheduling and recruitment. Good for various research methodologies. Transparent participant profiles.',
  'Primarily a recruitment tool, not a testing platform. Requires separate tools for conducting actual tests. Can be expensive for frequent recruitment.'

FROM tools WHERE name = 'User Interviews'
ON CONFLICT (tool_id, method_id) DO UPDATE SET
  feature_description = EXCLUDED.feature_description,
  pro_text = EXCLUDED.pro_text,
  con_text = EXCLUDED.con_text;


-- Dovetail (2 mentions)
INSERT INTO tool_pros_and_cons (tool_id, method_id, feature_description, pro_text, con_text)
SELECT 
  id, 
  1,
  'Research repository and analysis platform for organizing, analyzing, and sharing qualitative user research data and insights.',
  'Excellent for organizing qualitative research data. Powerful analysis and tagging features. Great for team collaboration. Good for insight management.',
  'Focused on analysis rather than data collection. Requires existing research data. Can be expensive for small teams. Learning curve for advanced features.'

FROM tools WHERE name = 'Dovetail'
ON CONFLICT (tool_id, method_id) DO UPDATE SET
  feature_description = EXCLUDED.feature_description,
  pro_text = EXCLUDED.pro_text,
  con_text = EXCLUDED.con_text;


-- UX Metrics (2 mentions)
INSERT INTO tool_pros_and_cons (tool_id, method_id, feature_description, pro_text, con_text)
SELECT 
  id, 
  1,
  'Specialized platform for measuring and analyzing UX metrics and KPIs with standardized usability testing protocols.',
  'Specialized in UX metrics and KPIs. Standardized testing protocols. Good for benchmarking and comparative analysis. Focus on quantitative measurement.',
  'Limited qualitative insights. Smaller platform with fewer features. May require integration with other tools for comprehensive testing.'

FROM tools WHERE name = 'UX Metrics'
ON CONFLICT (tool_id, method_id) DO UPDATE SET
  feature_description = EXCLUDED.feature_description,
  pro_text = EXCLUDED.pro_text,
  con_text = EXCLUDED.con_text;


-- PlaybookUX (2 mentions)
INSERT INTO tool_pros_and_cons (tool_id, method_id, feature_description, pro_text, con_text)
SELECT 
  id, 
  1,
  'Self-service user research platform offering various testing methods including usability testing, surveys, and interviews.',
  'Multiple research methods in one platform. Self-service approach for quick testing. Good for agile teams. Integrated participant recruitment.',
  'Newer platform with smaller user base. Limited advanced features compared to specialized tools. May lack depth in specific testing areas.'

FROM tools WHERE name = 'PlaybookUX'
ON CONFLICT (tool_id, method_id) DO UPDATE SET
  feature_description = EXCLUDED.feature_description,
  pro_text = EXCLUDED.pro_text,
  con_text = EXCLUDED.con_text;


-- ==================================================
-- VERIFICATION QUERIES
-- ==================================================

-- Verify tool count for Usability Testing (Method ID 1)
-- SELECT COUNT(*) as total_tools FROM tools_leaderboard WHERE method_id = 1;

-- Verify top 10 tools by score for Usability Testing
-- SELECT t.name, tl.initial_upvotes, (tl.initial_upvotes + tl.current_upvotes - tl.initial_downvotes - tl.current_downvotes) as net_score
-- FROM tools t
-- JOIN tools_leaderboard tl ON t.id = tl.tool_id
-- WHERE tl.method_id = 1
-- ORDER BY net_score DESC
-- LIMIT 10;

-- Verify pros and cons exist for all tools
-- SELECT t.name, 
--        CASE WHEN tpc.pro_text IS NOT NULL THEN 'Has Pro' ELSE 'Missing Pro' END as pro_status
--        CASE WHEN tpc.con_text IS NOT NULL THEN 'Has Con' ELSE 'Missing Con' END as con_status
-- FROM tools t
-- JOIN tools_leaderboard tl ON t.id = tl.tool_id
-- LEFT JOIN tool_pros_and_cons tpc ON t.id = tpc.tool_id AND tpc.method_id = 1
-- WHERE tl.method_id = 1
-- ORDER BY t.name;
