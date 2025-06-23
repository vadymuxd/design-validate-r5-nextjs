-- ============================================================================
-- STEP 1: Insert new categories
-- ============================================================================
INSERT INTO categories (name, slug, collection_id) VALUES
('UX Data Analysis', 'ux-data-analysis', 1),
('Session Replays', 'session-replays', 1)
ON CONFLICT (collection_id, name) DO NOTHING;


-- ============================================================================
-- STEP 2: Insert all UX Data Analysis tools into the tools table
-- ============================================================================
INSERT INTO tools (name, description, website_url, logo_url) VALUES
('Tableau', 'Offers the most powerful and intuitive interface for interactive data visualization.', 'https://www.tableau.com/', '/tools-logos/tableau.png'),
('Looker', 'Provides a robust, governed data modeling layer (LookML) for data consistency.', 'https://www.looker.com/', '/tools-logos/looker.png'),
('Metabase', 'An easy-to-use, open-source BI tool that makes data accessible to everyone.', 'https://www.metabase.com/', '/tools-logos/metabase.png'),
('Power BI', 'A market-leading tool deeply integrated into the Microsoft ecosystem.', 'https://powerbi.microsoft.com/', '/tools-logos/power-bi.png'),
('ThoughtSpot', 'A search-based analytics platform allowing users to ask questions in natural language.', 'https://www.thoughtspot.com/', '/tools-logos/thoughtspot.png'),
('Domo', 'A cloud-native platform that combines data integration, BI, and apps in one place.', 'https://www.domo.com/', '/tools-logos/domo.png'),
('AWS QuickSight', 'A cloud-native BI service fully integrated with the Amazon Web Services stack.', 'https://aws.amazon.com/quicksight/', '/tools-logos/aws-quicksight.png'),
('Qlik Sense', 'An associative engine that allows users to explore data from all angles.', 'https://www.qlik.com/us/products/qlik-sense', '/tools-logos/qlik-sense.png'),
('Sisense', 'A flexible platform focused on embedding analytics directly into other products.', 'https://www.sisense.com/', '/tools-logos/sisense.png'),
('Redash', 'An open-source tool for querying data sources and visualizing results.', 'https://redash.io/', '/tools-logos/redash.png')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- STEP 3: Add all UX Data Analysis tools to the leaderboard
-- ============================================================================
INSERT INTO tool_category_leaderboard (tool_id, category_id, initial_upvotes, initial_downvotes, current_upvotes, current_downvotes)
SELECT
    t.id,
    (SELECT id FROM categories WHERE slug = 'ux-data-analysis'),
    CASE t.name
        WHEN 'Tableau' THEN 330
        WHEN 'Looker' THEN 300
        WHEN 'Metabase' THEN 220
        WHEN 'Power BI' THEN 310
        WHEN 'ThoughtSpot' THEN 180
        WHEN 'Domo' THEN 200
        WHEN 'AWS QuickSight' THEN 170
        WHEN 'Qlik Sense' THEN 190
        WHEN 'Sisense' THEN 150
        WHEN 'Redash' THEN 130
    END as initial_upvotes,
    CASE t.name
        WHEN 'Tableau' THEN 70
        WHEN 'Looker' THEN 90
        WHEN 'Metabase' THEN 40
        WHEN 'Power BI' THEN 140
        WHEN 'ThoughtSpot' THEN 40
        WHEN 'Domo' THEN 80
        WHEN 'AWS QuickSight' THEN 60
        WHEN 'Qlik Sense' THEN 90
        WHEN 'Sisense' THEN 60
        WHEN 'Redash' THEN 50
    END as initial_downvotes,
    0, 0
FROM tools t
WHERE t.name IN (
    'Tableau', 'Looker', 'Metabase', 'Power BI', 'ThoughtSpot',
    'Domo', 'AWS QuickSight', 'Qlik Sense', 'Sisense', 'Redash'
)
ON CONFLICT (tool_id, category_id) DO UPDATE SET
    initial_upvotes = EXCLUDED.initial_upvotes,
    initial_downvotes = EXCLUDED.initial_downvotes;

-- ============================================================================
-- STEP 4: Add pros/cons for all UX Data Analysis tools
-- ============================================================================
INSERT INTO tool_pros_and_cons (tool_id, category_id, pro_text, con_text)
SELECT
    t.id,
    (SELECT id FROM categories WHERE slug = 'ux-data-analysis'),
    CASE t.name
        WHEN 'Tableau' THEN 'Best-in-class for visual exploration, beautiful dashboards, easy for non-analysts.'
        WHEN 'Looker' THEN 'Reliable and consistent data, powerful "Explores" for self-service analysis.'
        WHEN 'Metabase' THEN 'Extremely simple for non-technical users to ask questions, fast setup.'
        WHEN 'Power BI' THEN 'Integrates seamlessly with Excel/Azure, powerful for data manipulation (DAX).'
        WHEN 'ThoughtSpot' THEN 'Empowers non-analysts to self-serve via search, great for ad-hoc questions.'
        WHEN 'Domo' THEN 'Strong on data integration and connectors, good for end-to-end solutions.'
        WHEN 'AWS QuickSight' THEN 'Pay-per-session pricing is cost-effective, great integration with AWS data.'
        WHEN 'Qlik Sense' THEN 'Powerful data association model reveals hidden insights.'
        WHEN 'Sisense' THEN 'Excellent for building white-labeled, customer-facing dashboards.'
        WHEN 'Redash' THEN 'Great for SQL-savvy users who want to build and share queries quickly.'
    END as pro_text,
    CASE t.name
        WHEN 'Tableau' THEN 'Very expensive, can be slow with live queries on large datasets.'
        WHEN 'Looker' THEN 'Requires significant initial setup by a data team, less flexible for quick viz.'
        WHEN 'Metabase' THEN 'Lacks advanced visualization and data modeling features of enterprise tools.'
        WHEN 'Power BI' THEN 'Less intuitive for pure data visualization than Tableau, desktop-focused.'
        WHEN 'ThoughtSpot' THEN 'Very expensive, requires a well-structured underlying data source.'
        WHEN 'Domo' THEN 'Can be complex to manage, visualizations are less flexible than Tableau.'
        WHEN 'AWS QuickSight' THEN 'Visualizations and dashboarding features are more basic than competitors.'
        WHEN 'Qlik Sense' THEN 'Can have a steep learning curve, interface feels less modern.'
        WHEN 'Sisense' THEN 'Core BI capabilities are less powerful than dedicated market leaders.'
        WHEN 'Redash' THEN 'Requires SQL knowledge, very limited features for non-technical users.'
    END as con_text
FROM tools t
WHERE t.name IN (
    'Tableau', 'Looker', 'Metabase', 'Power BI', 'ThoughtSpot',
    'Domo', 'AWS QuickSight', 'Qlik Sense', 'Sisense', 'Redash'
);

-- ============================================================================
-- STEP 5: Insert all Session Replays tools into the tools table
-- ============================================================================
INSERT INTO tools (name, description, website_url, logo_url) VALUES
('FullStory', 'Automatically captures and indexes every user session for retroactive analysis.', 'https://www.fullstory.com/', '/tools-logos/fullstory.png'),
('Microsoft Clarity', 'A powerful and completely free session replay tool with no traffic limits.', 'https://clarity.microsoft.com/', '/tools-logos/microsoft-clarity.png'),
('Hotjar', 'Combines session recordings with heatmaps and user feedback in one simple platform.', 'https://www.hotjar.com/', '/tools-logos/hotjar.png'),
('LogRocket', 'Connects session replays directly with technical logs for faster bug fixing.', 'https://logrocket.com/', '/tools-logos/logrocket.png'),
('Smartlook', 'Provides robust session replay capabilities for both websites and native mobile apps.', 'https://www.smartlook.com/', '/tools-logos/smartlook.png'),
('Quantum Metric', 'Automatically surfaces and quantifies user friction in session replays.', 'https://www.quantummetric.com/', '/tools-logos/quantum-metric.png'),
('Mouseflow', 'Offers strong integration between session replays and conversion funnel analysis.', 'https://mouseflow.com/', '/tools-logos/mouseflow.png'),
('Contentsquare', 'An enterprise platform that analyzes user interactions on an aggregate level.', 'https://contentsquare.com/', '/tools-logos/contentsquare.png'),
('Glassbox', 'A highly secure and compliant platform for regulated industries.', 'https://www.glassbox.com/', '/tools-logos/glassbox.png'),
('PostHog', 'An open-source platform that includes session replay along with other analytics tools.', 'https://posthog.com/', '/tools-logos/posthog.png')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- STEP 6: Add all Session Replays tools to the leaderboard
-- ============================================================================
INSERT INTO tool_category_leaderboard (tool_id, category_id, initial_upvotes, initial_downvotes, current_upvotes, current_downvotes)
SELECT
    t.id,
    (SELECT id FROM categories WHERE slug = 'session-replays'),
    CASE t.name
        WHEN 'FullStory' THEN 320
        WHEN 'Microsoft Clarity' THEN 340
        WHEN 'Hotjar' THEN 300
        WHEN 'LogRocket' THEN 250
        WHEN 'Smartlook' THEN 200
        WHEN 'Quantum Metric' THEN 180
        WHEN 'Mouseflow' THEN 170
        WHEN 'Contentsquare' THEN 160
        WHEN 'Glassbox' THEN 140
        WHEN 'PostHog' THEN 150
    END as initial_upvotes,
    CASE t.name
        WHEN 'FullStory' THEN 60
        WHEN 'Microsoft Clarity' THEN 80
        WHEN 'Hotjar' THEN 70
        WHEN 'LogRocket' THEN 50
        WHEN 'Smartlook' THEN 50
        WHEN 'Quantum Metric' THEN 40
        WHEN 'Mouseflow' THEN 60
        WHEN 'Contentsquare' THEN 60
        WHEN 'Glassbox' THEN 50
        WHEN 'PostHog' THEN 70
    END as initial_downvotes,
    0, 0
FROM tools t
WHERE t.name IN (
    'FullStory', 'Microsoft Clarity', 'Hotjar', 'LogRocket', 'Smartlook',
    'Quantum Metric', 'Mouseflow', 'Contentsquare', 'Glassbox', 'PostHog'
)
ON CONFLICT (tool_id, category_id) DO UPDATE SET
    initial_upvotes = EXCLUDED.initial_upvotes,
    initial_downvotes = EXCLUDED.initial_downvotes;

-- ============================================================================
-- STEP 7: Add pros/cons for all Session Replays tools
-- ============================================================================
INSERT INTO tool_pros_and_cons (tool_id, category_id, pro_text, con_text)
SELECT
    t.id,
    (SELECT id FROM categories WHERE slug = 'session-replays'),
    CASE t.name
        WHEN 'FullStory' THEN 'Pixel-perfect recording, powerful search/segmentation, dev-friendly tools.'
        WHEN 'Microsoft Clarity' THEN '100% free, easy setup, no performance impact, integrates with GA4.'
        WHEN 'Hotjar' THEN 'Very easy to use, connects replays to heatmaps and surveys.'
        WHEN 'LogRocket' THEN 'Excellent for developers, shows console logs and network requests.'
        WHEN 'Smartlook' THEN 'Strong mobile app replay, good event tracking integration.'
        WHEN 'Quantum Metric' THEN 'AI-driven anomaly detection, connects replays to business impact.'
        WHEN 'Mouseflow' THEN 'Great for identifying friction in multi-step funnels, good form analytics.'
        WHEN 'Contentsquare' THEN 'Powerful zone-based heatmaps, good for high-level trend analysis.'
        WHEN 'Glassbox' THEN 'Strong data security and compliance, detailed data capture.'
        WHEN 'PostHog' THEN 'Open-source and self-hostable, good integration with its own tool suite.'
    END as pro_text,
    CASE t.name
        WHEN 'FullStory' THEN 'Very expensive, can have a steep learning curve to master.'
        WHEN 'Microsoft Clarity' THEN 'Lacks advanced filtering, no user feedback tools included.'
        WHEN 'Hotjar' THEN 'Basic filtering options, can get expensive with high traffic.'
        WHEN 'LogRocket' THEN 'Less focused on UX/product analysis, more on technical debugging.'
        WHEN 'Smartlook' THEN 'UI can feel less polished than top competitors.'
        WHEN 'Quantum Metric' THEN 'Enterprise-focused and very expensive, complex to set up.'
        WHEN 'Mouseflow' THEN 'UI feels somewhat dated, less powerful search than FullStory.'
        WHEN 'Contentsquare' THEN 'Session replay is less of a core focus than its heatmap features.'
        WHEN 'Glassbox' THEN 'Very expensive, complex to use, overkill for most teams.'
        WHEN 'PostHog' THEN 'Session replay is a secondary feature, not as powerful as dedicated tools.'
    END as con_text
FROM tools t
WHERE t.name IN (
    'FullStory', 'Microsoft Clarity', 'Hotjar', 'LogRocket', 'Smartlook',
    'Quantum Metric', 'Mouseflow', 'Contentsquare', 'Glassbox', 'PostHog'
);

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- Check leaderboard for UX Data Analysis category
SELECT
    t.name,
    tcl.initial_upvotes,
    tcl.initial_downvotes,
    (tcl.initial_upvotes - tcl.initial_downvotes) as sentiment_score
FROM tool_category_leaderboard tcl
JOIN tools t ON tcl.tool_id = t.id
WHERE tcl.category_id = (SELECT id FROM categories WHERE slug = 'ux-data-analysis')
ORDER BY (tcl.initial_upvotes - tcl.initial_downvotes) DESC;

-- Check leaderboard for Session Replays category
SELECT
    t.name,
    tcl.initial_upvotes,
    tcl.initial_downvotes,
    (tcl.initial_upvotes - tcl.initial_downvotes) as sentiment_score
FROM tool_category_leaderboard tcl
JOIN tools t ON tcl.tool_id = t.id
WHERE tcl.category_id = (SELECT id FROM categories WHERE slug = 'session-replays')
ORDER BY (tcl.initial_upvotes - tcl.initial_downvotes) DESC; 