-- ============================================================================
-- CARD SORTING TOOLS BACKFILL MIGRATION
-- ============================================================================
-- This migration adds all Card Sorting tools to method_id = 17
-- 
-- Summary:
-- - 7 new tools to be created
-- - 10 existing tools to be linked to Card Sorting method  
-- - Total: 17 tools for Card Sorting
-- ============================================================================

BEGIN;

-- ============================================================================
-- STEP 1: Insert new tools that don't exist in the database yet
-- ============================================================================

-- Insert new Card Sorting tools
INSERT INTO tools (name, description, logo_url, website_url) VALUES
('Miro', 'Collaborative online whiteboard platform that can be customized for card sorting exercises with teams.', '/tools-logos/miro.png', 'https://miro.com/'),
('kardSort', 'Free and open-source card sorting tool designed for simple and straightforward information architecture research.', '/tools-logos/kardsort.png', 'https://kardsort.com/'),
('UXArmy', 'User research platform offering various testing methods including card sorting for both moderated and unmoderated studies.', '/tools-logos/uxarmy.png', 'https://www.uxarmy.com/'),
('UserBit', 'User research platform that helps organize and analyze research data with card sorting and collaboration features.', '/tools-logos/userbit.png', 'https://userbitapp.com/'),
('XSort', 'Free card sorting tool for Mac users designed for simple and straightforward information architecture research.', '/tools-logos/xsort.png', 'https://xsortapp.com/'),
('ClickUp', 'Project management platform that can be customized for card sorting exercises and collaborative research activities.', '/tools-logos/clickup.png', 'https://clickup.com/'),
('Figma', 'Collaborative design platform that can be used for card sorting exercises with design teams and stakeholders.', '/tools-logos/figma.png', 'https://www.figma.com/')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- STEP 2: Add tools to Card Sorting method leaderboard (method_id = 17)
-- ============================================================================

-- Insert/Update leaderboard data for all Card Sorting tools
INSERT INTO tools_leaderboard (tool_id, method_id, initial_upvotes, initial_downvotes, current_upvotes, current_downvotes)
SELECT t.id, 17, -- Card Sorting method_id
  CASE t.name
    -- Provided vote counts from user
    WHEN 'Optimal Workshop' THEN 8
    WHEN 'Maze' THEN 6
    WHEN 'UserZoom' THEN 6
    WHEN 'UXTweak' THEN 6
    WHEN 'Miro' THEN 6
    WHEN 'kardSort' THEN 5
    WHEN 'Lyssna' THEN 5
    WHEN 'UX Metrics' THEN 5
    WHEN 'UserTesting' THEN 4
    WHEN 'UXArmy' THEN 4
    WHEN 'Userlytics' THEN 3
    WHEN 'UserBit' THEN 3
    WHEN 'XSort' THEN 3
    WHEN 'ClickUp' THEN 2
    WHEN 'Figma' THEN 2
    WHEN 'Useberry' THEN 2
    WHEN 'Loop11' THEN 2
    ELSE 0
  END, 0, 0, 0 -- initial_upvotes, initial_downvotes, current_upvotes, current_downvotes
FROM tools t
WHERE t.name IN (
  'Optimal Workshop', 'Maze', 'UserZoom', 'UXTweak', 'Miro', 'kardSort', 'Lyssna',
  'UX Metrics', 'UserTesting', 'UXArmy', 'Userlytics', 'UserBit', 'XSort', 'ClickUp',
  'Figma', 'Useberry', 'Loop11'
)
ON CONFLICT (tool_id, method_id) DO UPDATE SET
    initial_upvotes = EXCLUDED.initial_upvotes,
    initial_downvotes = EXCLUDED.initial_downvotes;

-- ============================================================================
-- STEP 3: Add method-specific pros and cons for Card Sorting tools
-- ============================================================================

INSERT INTO tool_pros_and_cons (tool_id, method_id, pro_text, con_text, feature_description)
SELECT t.id, 17, -- Card Sorting method_id
  CASE t.name
    WHEN 'Optimal Workshop' THEN 'This tool provides powerful visualization tools for analysis, including 3D clusters and dendrograms. These help you easily identify patterns and build your information architecture.'
    WHEN 'Maze' THEN 'The key advantage is the seamless integration with popular design tools like Figma and Sketch. This allows for easy testing of prototypes.'
    WHEN 'UserZoom' THEN 'Its main advantage is the ability to combine card sorting with other research methods. This gives you a holistic view of the user experience.'
    WHEN 'UXTweak' THEN 'The platform offers a free plan with a generous set of features. This makes it a great option for those on a budget.'
    WHEN 'Miro' THEN 'The platform is highly flexible and can be customized to fit your specific needs. It''s also great for real-time collaboration.'
    WHEN 'kardSort' THEN 'The main advantage is that it''s completely free to use. This makes it a great option for students and those on a tight budget.'
    WHEN 'Lyssna' THEN 'The platform is very easy to use and you can get results quickly. It also has a large panel of participants that you can recruit from.'
    WHEN 'UX Metrics' THEN 'The platform provides detailed reports and analytics. This makes it easy to track your progress and see how your changes are impacting the user experience.'
    WHEN 'UserTesting' THEN 'The platform has a large panel of participants that you can recruit from. This makes it easy to get feedback from your target audience.'
    WHEN 'UXArmy' THEN 'The platform is very flexible and can be customized to fit your specific needs. It also has a large panel of participants that you can recruit from.'
    WHEN 'Userlytics' THEN 'The platform provides a range of advanced features that can help you to get deep insights from your research. It also has a large panel of participants that you can recruit from.'
    WHEN 'UserBit' THEN 'The platform is very easy to use and it helps you to keep your research data organized. It''s also great for collaborating with your team.'
    WHEN 'XSort' THEN 'The main advantage is that it''s completely free to use. This makes it a great option for students and those on a tight budget.'
    WHEN 'ClickUp' THEN 'The platform is highly flexible and can be customized to fit your specific needs. It''s also great for real-time collaboration.'
    WHEN 'Figma' THEN 'The platform is highly flexible and can be customized to fit your specific needs. It''s also great for real-time collaboration.'
    WHEN 'Useberry' THEN 'The platform has a large panel of participants that you can recruit from. This makes it easy to get feedback from your target audience.'
    WHEN 'Loop11' THEN 'The platform is very flexible and can be customized to fit your specific needs. It also has a large panel of participants that you can recruit from.'
    ELSE 'Supports card sorting functionality for information architecture research.'
  END,
  CASE t.name
    WHEN 'Optimal Workshop' THEN 'The platform can be expensive for smaller teams or individual researchers. This makes it less accessible for those on a tight budget.'
    WHEN 'Maze' THEN 'While great for quick insights, it may lack the in-depth analysis features of more specialized card sorting tools. This could be a limitation for complex research projects.'
    WHEN 'UserZoom' THEN 'The platform is complex and can be overwhelming for new users. The cost is also a significant barrier for smaller companies.'
    WHEN 'UXTweak' THEN 'The user interface can be clunky at times, and some of the more advanced features are only available on the paid plans.'
    WHEN 'Miro' THEN 'As it is not a dedicated card sorting tool, it lacks the advanced analysis features of other platforms. This means you''ll have to do more manual analysis.'
    WHEN 'kardSort' THEN 'The tool is very basic and lacks the advanced features of other platforms. It''s also not as user-friendly as some of the other options.'
    WHEN 'Lyssna' THEN 'The analysis features are not as advanced as some of the other platforms. This can make it difficult to get deep insights from your research.'
    WHEN 'UX Metrics' THEN 'The platform can be expensive, and it may not be suitable for smaller teams or individual researchers.'
    WHEN 'UserTesting' THEN 'The platform can be expensive, and it may not be suitable for smaller teams or individual researchers.'
    WHEN 'UXArmy' THEN 'The platform can be expensive, and it may not be a good fit for smaller teams or individual researchers.'
    WHEN 'Userlytics' THEN 'The platform can be expensive, and it may not be suitable for smaller teams or individual researchers.'
    WHEN 'UserBit' THEN 'The platform is not as powerful as some of the other options, and it may not be suitable for complex research projects.'
    WHEN 'XSort' THEN 'The tool is very basic and lacks the advanced features of other platforms. It''s also only available for Mac users.'
    WHEN 'ClickUp' THEN 'As it is not a dedicated card sorting tool, it lacks the advanced analysis features of other platforms. This means you''ll have to do more manual analysis.'
    WHEN 'Figma' THEN 'As it is not a dedicated card sorting tool, it lacks the advanced analysis features of other platforms. This means you''ll have to do more manual analysis.'
    WHEN 'Useberry' THEN 'The platform can be expensive, and it may not be suitable for smaller teams or individual researchers.'
    WHEN 'Loop11' THEN 'The platform can be expensive, and it may not be a good fit for smaller teams or individual researchers.'
    ELSE 'May require additional setup or customization for optimal card sorting workflows.'
  END,
  CASE t.name
    WHEN 'Optimal Workshop' THEN 'A comprehensive research platform, Optimal Workshop excels at card sorting with robust analysis features. It empowers researchers to gain deep insights into user mental models.'
    WHEN 'Maze' THEN 'Maze integrates card sorting into a rapid, remote testing platform. It''s designed for product and design teams to quickly gather user feedback and make data-informed decisions.'
    WHEN 'UserZoom' THEN 'UserZoom is an enterprise-level UX insights platform that offers a wide range of research methods, including card sorting. It is designed for large organizations.'
    WHEN 'UXTweak' THEN 'UXTweak is a versatile UX research platform that provides a full suite of tools, including card sorting. It''s designed to help you improve the user experience of your digital products.'
    WHEN 'Miro' THEN 'Miro is a collaborative online whiteboard that can be used for a variety of purposes, including card sorting. It''s great for remote teams.'
    WHEN 'kardSort' THEN 'kardSort is a free and open-source card sorting tool. It''s a great option for those who need a simple and straightforward tool for their research.'
    WHEN 'Lyssna' THEN 'Lyssna (formerly UsabilityHub) is a remote user research platform that offers a range of testing methods, including card sorting. It''s designed for quick and easy user feedback.'
    WHEN 'UX Metrics' THEN 'UX Metrics is a user research platform that helps you to measure and improve the user experience of your digital products. It offers a range of tools, including card sorting.'
    WHEN 'UserTesting' THEN 'UserTesting is a platform that allows you to get feedback from real users on your products and services. You can use it to conduct a variety of research methods, including card sorting.'
    WHEN 'UXArmy' THEN 'UXArmy is a user research platform that helps you to conduct a variety of research methods, including card sorting. It''s designed for both moderated and unmoderated testing.'
    WHEN 'Userlytics' THEN 'Userlytics is a user research platform that helps you to conduct a variety of research methods, including card sorting. It offers a range of features, including screen recording and eye-tracking.'
    WHEN 'UserBit' THEN 'UserBit is a user research platform that helps you to organize and analyze your research data. It offers a range of tools, including card sorting.'
    WHEN 'XSort' THEN 'XSort is a free card sorting tool for Mac. It''s a great option for those who need a simple and straightforward tool for their research.'
    WHEN 'ClickUp' THEN 'ClickUp is a project management tool that can be used for a variety of purposes, including card sorting. It''s great for teams who are already using the platform for other purposes.'
    WHEN 'Figma' THEN 'Figma is a collaborative design tool that can be used for a variety of purposes, including card sorting. It''s great for remote teams who are already using the platform for design work.'
    WHEN 'Useberry' THEN 'Useberry is a user testing platform that helps you to get feedback from real users on your products and services. You can use it to conduct a variety of research methods, including card sorting.'
    WHEN 'Loop11' THEN 'Loop11 is a user testing platform that helps you to conduct a variety of research methods, including card sorting. It''s designed for both moderated and unmoderated testing.'
    ELSE 'Provides card sorting capabilities for information architecture and user experience research.'
  END
FROM tools t
WHERE t.name IN (
  'Optimal Workshop', 'Maze', 'UserZoom', 'UXTweak', 'Miro', 'kardSort', 'Lyssna',
  'UX Metrics', 'UserTesting', 'UXArmy', 'Userlytics', 'UserBit', 'XSort', 'ClickUp',
  'Figma', 'Useberry', 'Loop11'
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
    'New Card Sorting Tools Added' as verification,
    t.name as tool_name,
    t.description,
    t.logo_url,
    t.website_url
FROM tools t
WHERE t.name IN ('Miro', 'kardSort', 'UXArmy', 'UserBit', 'XSort', 'ClickUp', 'Figma')
ORDER BY t.name;

-- Verify leaderboard entries for Card Sorting method
SELECT 
    'Card Sorting Tools Leaderboard' as verification,
    t.name as tool_name,
    tl.initial_upvotes,
    tl.initial_downvotes,
    tl.current_upvotes,
    tl.current_downvotes,
    (tl.initial_upvotes + tl.current_upvotes) - (tl.initial_downvotes + tl.current_downvotes) as net_score
FROM tools_leaderboard tl
JOIN tools t ON t.id = tl.tool_id
JOIN methods m ON m.id = tl.method_id
WHERE m.slug = 'card-sorting'
ORDER BY net_score DESC, t.name;

-- Verify pros and cons entries
SELECT 
    'Card Sorting Tool Pros and Cons' as verification,
    t.name as tool_name,
    LEFT(tpc.feature_description, 100) as feature_description_preview,
    LEFT(tpc.pro_text, 80) as pro_text_preview,
    LEFT(tpc.con_text, 80) as con_text_preview
FROM tool_pros_and_cons tpc
JOIN tools t ON t.id = tpc.tool_id
JOIN methods m ON m.id = tpc.method_id
WHERE m.slug = 'card-sorting'
ORDER BY t.name;

-- Count total tools for Card Sorting method
SELECT 
    'Card Sorting Tools Count' as summary,
    COUNT(*) as total_tools,
    COUNT(CASE WHEN tl.initial_upvotes > 0 THEN 1 END) as tools_with_votes
FROM tools_leaderboard tl
JOIN methods m ON m.id = tl.method_id
WHERE m.slug = 'card-sorting';

COMMIT;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- This migration adds 7 new Card Sorting tools and links all 17 tools to the
-- Card Sorting method (id=17) with their respective vote counts and detailed
-- method-specific pros, cons, and feature descriptions.
-- 
-- New tools added: Miro, kardSort, UXArmy, UserBit, XSort, ClickUp, Figma
-- Existing tools linked: Optimal Workshop, Maze, UserZoom, UXTweak, Lyssna, 
--                       UX Metrics, UserTesting, Userlytics, Useberry, Loop11
-- ============================================================================
