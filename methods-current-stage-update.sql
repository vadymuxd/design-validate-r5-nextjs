-- Methods Update Script for Current State
-- This script completes the setup: adds missing columns, descriptions, and scoring function

-- Step 1: Add missing columns to methods table (safe if they already exist)
ALTER TABLE methods 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS current_upvotes INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS current_downvotes INTEGER DEFAULT 0;

-- Step 2: Update descriptions for all methods with real content
UPDATE methods SET description = 'Observing real users as they complete tasks with a product is the core of usability testing. In a typical session, a facilitator gives a participant specific actions to perform, allowing the team to identify pain points, confusing interfaces, and areas for improvement in the user flow. This direct observation is best used throughout the design process, from early prototypes to the final product, to ensure the experience is intuitive.' WHERE slug = 'usability-testing';

UPDATE methods SET description = 'Measuring specific user interactions, or "events," within a digital product is accomplished through event tracking. It works by implementing code snippets that log when a user performs a particular action, such as clicking a button or playing a video. This data provides insights into which features are being used and which are ignored, helping teams make data-informed decisions about feature development and prioritization.' WHERE slug = 'event-tracking';

UPDATE methods SET description = 'Comparing two versions of a webpage or app to determine which one performs better is known as A/B testing. In practice, traffic is split between version A and version B, and the performance of each is tracked against a specific goal, like conversion rate. This method is most effective for optimizing specific interface elements, such as headlines or button colors, to improve user engagement and achieve business objectives.' WHERE slug = 'ab-testing';

UPDATE methods SET description = 'The examination of quantitative and qualitative data to understand user behavior and identify opportunities for improvement is central to UX data analysis. This method synthesizes information from sources like analytics platforms, surveys, and interviews. By analyzing this data, teams can uncover patterns and pain points in the user journey, which is used to monitor product performance and validate design decisions.' WHERE slug = 'ux-data-analysis';

UPDATE methods SET description = 'A visual recording of a user''s interactions on a website or app, showing mouse movements, clicks, and scrolls, is provided by session replays. This method is used to gain a deep, contextual understanding of how individual users navigate a product and where they encounter issues. Watching these replays helps teams identify usability problems and bugs that might not be apparent from aggregated data alone.' WHERE slug = 'session-replays';

UPDATE methods SET description = 'Using color as a data visualization to show where users click, move their cursors, and scroll on a webpage is the principle behind heatmaps. "Hot" colors like red represent areas with the most interaction, while "cold" colors like blue show less popular spots. This method is used to understand user attention, helping to optimize page layouts and call-to-action placement by revealing the most engaging parts of an interface.' WHERE slug = 'heat-maps';

UPDATE methods SET description = 'Utilizing artificial intelligence and machine learning algorithms to analyze user data and predict usability issues is a method known as AI validation. These tools can identify potential points of friction by analyzing behavior patterns or simulate user interactions to test for problems at scale. It''s an emerging method used to quickly process large datasets and provide predictive insights, often complementing traditional research.' WHERE slug = 'ai-validation';

UPDATE methods SET description = 'Gathering self-reported data from a large number of users through a series of questions is accomplished with surveys. They can be deployed at various points in the user journey to collect feedback on satisfaction, ease of use, and overall experience. This method is effective for efficiently collecting broad quantitative and qualitative feedback to identify general trends and opinions.' WHERE slug = 'surveys';

UPDATE methods SET description = 'The various ways users can share their thoughts, opinions, and suggestions about a product are all forms of user feedback. This is often collected through dedicated forms, in-app pop-ups, or community forums. The primary use is to continuously gather qualitative insights directly from the user base, helping teams identify and prioritize bug fixes, feature requests, and improvements that address user needs.' WHERE slug = 'user-feedback';

UPDATE methods SET description = 'Evaluating user reactions to a proposed idea before any significant design or development work has begun is the purpose of concept testing. It involves presenting users with a low-fidelity representation of the concept, like a sketch or wireframe, and gathering their feedback. This process helps teams gauge interest and validate assumptions, saving resources on ideas that are unlikely to succeed.' WHERE slug = 'concept-testing';

UPDATE methods SET description = 'Having a one-on-one conversation with a user to gain a deep understanding of their needs, motivations, and behaviors is the focus of user interviews. By asking open-ended questions, researchers can explore a user''s experiences in their own words. This qualitative method is especially valuable during the discovery phase of a project to gather rich, contextual insights and ensure the team is solving the right problems.' WHERE slug = 'user-interviews';

UPDATE methods SET description = 'To understand how people group and categorize information, card sorting asks participants to organize topics into groups that make sense to them. In a session, users are given a set of cards with topics and are asked to sort them and often to label the groups they create. The results inform the design of an intuitive information architecture, ensuring a website or app''s structure aligns with users'' mental models.' WHERE slug = 'card-sorting';

UPDATE methods SET description = 'Evaluating a design''s effectiveness by asking a user where they would click first to accomplish a specific goal is the basis of first-click testing. This test measures how many users click the correct element first and how long it takes them to decide. It is used to assess the intuitiveness of navigation and layout, as a successful first click is a strong predictor of overall task success.' WHERE slug = 'first-click';

UPDATE methods SET description = 'To evaluate the findability of topics within a site''s information architecture without visual design cues, tree testing is used. Participants are given a simplified text-based version of a site''s menu structure (the "tree") and are asked to find specific information. Analyzing their success rates and the paths they take helps identify confusing labels and organizational issues before the UI is designed.' WHERE slug = 'tree-testing';

UPDATE methods SET description = 'Analyzing how users interact with online forms is the function of form analytics. It tracks metrics like the time spent on each field, which fields are often skipped, and where users drop off in the process. By identifying points of friction or confusing labels, this data helps teams optimize forms to increase completion rates and improve the user experience.' WHERE slug = 'form-analytics';

UPDATE methods SET description = 'Tracking the steps a user takes to complete a specific goal, such as making a purchase or signing up, is achieved by setting up funnels. By visualizing this user flow as a series of steps, teams can see where users are dropping off and abandoning the process. This method is used to identify bottlenecks in key user journeys, allowing for targeted improvements that optimize the conversion process.' WHERE slug = 'funnels';

-- Step 3: Create the database function for real-time net score calculation
CREATE OR REPLACE FUNCTION get_methods_with_scores()
RETURNS TABLE (
    id INTEGER,
    name TEXT,
    slug TEXT,
    description TEXT,
    collection_id INTEGER,
    net_score INTEGER,
    current_upvotes INTEGER,
    current_downvotes INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        m.id,
        m.name,
        m.slug,
        m.description,
        m.collection_id,
        COALESCE(
            (SELECT 
                SUM(COALESCE(tl.initial_upvotes, 0) + COALESCE(tl.current_upvotes, 0)) -
                SUM(COALESCE(tl.initial_downvotes, 0) + COALESCE(tl.current_downvotes, 0))
             FROM tools_leaderboard tl 
             WHERE tl.method_id = m.id), 0
        ) + COALESCE(m.current_upvotes, 0) - COALESCE(m.current_downvotes, 0) as net_score,
        COALESCE(m.current_upvotes, 0) as current_upvotes,
        COALESCE(m.current_downvotes, 0) as current_downvotes
    FROM methods m
    INNER JOIN collections c ON m.collection_id = c.id
    WHERE c.slug = 'tools'
    ORDER BY net_score DESC, m.id;
END;
$$ LANGUAGE plpgsql;

-- Step 4: Test the function to make sure it works
SELECT 
    id,
    name,
    slug,
    LEFT(description, 50) || '...' as description_preview,
    net_score,
    current_upvotes,
    current_downvotes
FROM get_methods_with_scores()
ORDER BY net_score DESC, id
LIMIT 5;

-- Step 5: Show summary
SELECT 
    'Methods updated successfully!' as status,
    COUNT(*) as total_methods,
    SUM(CASE WHEN description IS NOT NULL AND description != '' THEN 1 ELSE 0 END) as methods_with_descriptions,
    SUM(net_score) as total_net_score
FROM get_methods_with_scores(); 