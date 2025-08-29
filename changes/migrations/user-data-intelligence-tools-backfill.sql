-- ============================================================================
-- USER DATA INTELLIGENCE TOOLS BACKFILL MIGRATION
-- Date: August 29, 2025
-- Purpose: Add missing User Data Intelligence tools and update initial scores 
--          for method_id = 4 (User Data Intelligence)
-- ============================================================================

BEGIN;

-- ============================================================================
-- STEP 1: Add missing tools to the tools table
-- ============================================================================

-- First, handle Zoho specifically (may already exist)
INSERT INTO tools (name, description, logo_url, website_url, pro_text, con_text) VALUES
('Zoho', 'A comprehensive business software suite offering CRM, analytics, project management, email marketing, and over 45 integrated applications for complete business automation.', '/tools-logos/zoho.png', 'https://www.zoho.com/', 'Complete business ecosystem with seamless integration between all applications. Affordable pricing across the entire suite and excellent value for small to medium businesses seeking unified solutions.', 'Individual applications may lack depth compared to specialized tools. Can become complex to manage across multiple Zoho products and requires commitment to the entire ecosystem for maximum benefit.')
ON CONFLICT (name) DO UPDATE SET
    description = EXCLUDED.description,
    logo_url = EXCLUDED.logo_url,
    website_url = EXCLUDED.website_url,
    pro_text = EXCLUDED.pro_text,
    con_text = EXCLUDED.con_text;

-- Insert other new tools
INSERT INTO tools (name, description, logo_url, website_url, pro_text, con_text) VALUES

('Domo', 'A cloud-native business intelligence platform that combines data integration, visualization, and collaboration in a unified solution for data-driven decision making.', '/tools-logos/domo.png', 'https://www.domo.com/', 'Cloud-native platform with excellent data integration capabilities. Strong executive dashboards and real-time collaboration features for organizational data culture.', 'Very expensive, especially for smaller organizations. Can be complex to set up and maintain with steep learning curve for advanced features.'),

('dbt', 'A data transformation tool that enables analytics engineers to transform data in the warehouse using software engineering best practices like version control and testing.', '/tools-logos/dbt.png', 'https://www.getdbt.com/', 'Empowers analysts to own the analytics engineering workflow. Promotes collaboration, version control, and testing to ensure data quality and reliability.', 'Steep learning curve for non-technical users. Requires command-line knowledge and lacks built-in scheduler for real-time data processing needs.'),

('SAP Analytics Cloud', 'An enterprise-grade analytics platform that combines business intelligence, augmented analytics, and enterprise planning in a single cloud solution.', '/tools-logos/sap-analytics.png', 'https://www.sap.com/products/cloud-analytics.html', 'Comprehensive enterprise solution with AI-powered insights and predictive analytics. Strong integration with SAP ecosystem and robust planning capabilities.', 'Very expensive with steep learning curve. Complex implementation requires specialized expertise and dedicated resources for management and maintenance.'),

('Google Data Studio', 'A free business intelligence tool that transforms data into informative, easy-to-read, customizable, and shareable dashboards and reports.', '/tools-logos/google-data-studio.png', 'https://datastudio.google.com/', 'Completely free with seamless Google ecosystem integration. Easy to share and collaborate with real-time updates and familiar Google interface.', 'Limited customization options and can be slow with large datasets. Not suitable for complex data modeling or enterprise-level governance requirements.'),

('Holistics', 'A self-service business intelligence platform that treats analytics as code with Git version control for building governable and reusable data definitions.', '/tools-logos/holistics.png', 'https://www.holistics.io/', 'Analytics-as-code approach with full semantic layer and Git version control. Highly governable and maintainable for scalable data culture building.', 'Requires developer involvement for setup and has smaller community. Technical approach may not suit non-technical business users seeking simple visualization.'),

('Adverity', 'An automated data platform specifically designed for marketing analytics that integrates data from multiple sources into unified reporting and insights.', '/tools-logos/adverity.png', 'https://www.adverity.com/', 'Specialized for marketing analytics with excellent data integration capabilities. AI-powered data quality monitoring and automated transformation features.', 'Primarily focused on marketing use cases, limiting general business intelligence applications. Complex transformation scripts with steep learning curve for beginners.'),

('GoodData', 'A cloud-based analytics platform that connects to data warehouses for real-time querying with semantic modeling and embedded analytics capabilities.', '/tools-logos/gooddata.png', 'https://www.gooddata.com/', 'Advanced data modeling with API-first architecture for deep integrations. Scalable for large data volumes with white-labeling options for embedded analytics.', 'May require frequent updates and has limited visual customization options. Can be complex to implement and manage for organizations without technical expertise.')

ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- STEP 2: Clean up any existing conflicting data for Zoho
-- ============================================================================

-- Remove any existing Zoho entries for method_id = 4 to avoid conflicts
DELETE FROM tool_pros_and_cons 
WHERE tool_id IN (SELECT id FROM tools WHERE name = 'Zoho') 
AND method_id = 4;

DELETE FROM tools_leaderboard 
WHERE tool_id IN (SELECT id FROM tools WHERE name = 'Zoho') 
AND method_id = 4;

-- ============================================================================
-- STEP 3: Update tools_leaderboard with initial scores for User Data Intelligence method
-- ============================================================================

-- First, let's get the method_id for User Data Intelligence
-- Based on the migration files, this should be method_id = 4

-- Insert/Update leaderboard data for all User Data Intelligence tools
INSERT INTO tools_leaderboard (tool_id, method_id, initial_upvotes, initial_downvotes, current_upvotes, current_downvotes)
SELECT t.id, 4,
  CASE t.name
    WHEN 'Tableau' THEN 12
    WHEN 'Power BI' THEN 11
    WHEN 'Looker' THEN 7
    WHEN 'Zoho' THEN 5
    WHEN 'Qlik Sense' THEN 5
    WHEN 'Sisense' THEN 4
    WHEN 'Domo' THEN 5
    WHEN 'Metabase' THEN 3
    WHEN 'dbt' THEN 3
    WHEN 'SAP Analytics Cloud' THEN 3
    WHEN 'Google Data Studio' THEN 2
    WHEN 'AWS QuickSight' THEN 2
    WHEN 'Holistics' THEN 2
    WHEN 'Redash' THEN 2
    WHEN 'Adverity' THEN 2
    WHEN 'GoodData' THEN 2
    ELSE 0
  END as initial_upvotes,
  0 as initial_downvotes,  -- Set to 0 as specified
  0 as current_upvotes,    -- Start with 0 for new site votes
  0 as current_downvotes   -- Start with 0 for new site votes
FROM tools t
WHERE t.name IN ('Tableau', 'Power BI', 'Looker', 'Zoho', 'Qlik Sense', 'Sisense', 'Domo', 'Metabase', 'dbt', 'SAP Analytics Cloud', 'Google Data Studio', 'AWS QuickSight', 'Holistics', 'Redash', 'Adverity', 'GoodData')
ON CONFLICT (tool_id, method_id) DO UPDATE SET
    initial_upvotes = EXCLUDED.initial_upvotes,
    initial_downvotes = EXCLUDED.initial_downvotes;

-- ============================================================================
-- STEP 4: Insert/Update tool_pros_and_cons for User Data Intelligence method
-- ============================================================================

INSERT INTO tool_pros_and_cons (tool_id, method_id, pro_text, con_text, feature_description)
SELECT t.id, 4,
  CASE t.name
    WHEN 'Tableau' THEN 'Strong community support and a vast library of visualizations. Its advanced data exploration capabilities allow for a deep dive into customer behavior and trends, making it a powerful tool for analysis.'
    WHEN 'Power BI' THEN 'Seamless integration with Microsoft products and a user-friendly interface with drag-and-drop functionality. It''s also a cost-effective solution with a large library of learning resources for new users.'
    WHEN 'Looker' THEN 'Strong data modeling with Git integration and reusable definitions. It allows users to explore data without writing SQL through its user-friendly interface, promoting self-service analytics.'
    WHEN 'Zoho' THEN 'Affordable for both small and large businesses, with a drag-and-drop interface and robust collaboration tools. The AI assistant is a key competitive advantage for quick insights.'
    WHEN 'Qlik Sense' THEN 'Its associative data model offers flexible data exploration, and it has automated insights powered by AI tools. Strong on-premise support and in-memory processing are also key advantages.'
    WHEN 'Sisense' THEN 'Great for white-label dashboards and OEM use cases. It goes beyond traditional BI by allowing analytics to be infused everywhere, providing insights in the context of the user''s workflow.'
    WHEN 'Domo' THEN 'User-centric design with a drag-and-drop interface, built-in data visualizations, and seamless data integration. Great for embedded analytics and creating a centralized data culture.'
    WHEN 'Metabase' THEN 'Easy to set up and use with a clean UI, making it great for self-service analytics and getting quick answers to data questions. Its open-source nature also makes it a cost-effective choice.'
    WHEN 'dbt' THEN 'Empowers data analysts to own the entire analytics engineering workflow, promoting collaboration, version control, and testing to ensure data quality and reliability for user data intelligence.'
    WHEN 'SAP Analytics Cloud' THEN 'AI-powered suggestions for organizing data and creating plans based on AI predictions. It offers powerful predictive analytics and customizable dashboards for a deep dive into user data.'
    WHEN 'Google Data Studio' THEN 'No cost, easy to share, and offers real-time updates. Seamlessly connects with Google products like Google Analytics, Google Sheets, and BigQuery, making it a great choice for Google-centric teams.'
    WHEN 'AWS QuickSight' THEN 'Simple and convenient to use, pay-per-session pricing model is cost-effective for teams with a fluctuating number of users. It integrates well with the AWS ecosystem, making it a natural choice for AWS users.'
    WHEN 'Holistics' THEN 'Dashboard-as-code, custom charts, a full semantic layer, and reusable logic, making it highly governable and maintainable. It empowers data teams to build a scalable and reliable data culture.'
    WHEN 'Redash' THEN 'SQL-first, making it great for fast prototyping and for teams with strong SQL skills. The ability to share queries enhances collaboration and knowledge sharing among team members.'
    WHEN 'Adverity' THEN 'User-friendly interface, custom reporting capabilities, and high-quality customer service. AI-powered data quality monitoring and advanced data transformation features are key advantages.'
    WHEN 'GoodData' THEN 'Advanced data modeling features, scalable for large data volumes, and offers white-labeling options for embedded analytics. Its API-first approach allows for deep integration with other applications.'
    ELSE 'Powerful capabilities for user data analysis and visualization.'
  END as pro_text,
  CASE t.name
    WHEN 'Tableau' THEN 'Steep learning curve for beginners and can be expensive. Performance may be slow when working with large datasets in the browser, and it requires data preparation before analysis can begin.'
    WHEN 'Power BI' THEN 'Performance can be an issue with large datasets. The user experience can be clunky, and it''s harder to manage at a large scale, with less robust data governance compared to other enterprise tools.'
    WHEN 'Looker' THEN 'Expensive and has a steep learning curve, requiring SQL fluency for advanced use cases and customization. This can be a barrier for teams without dedicated data analysts or engineers.'
    WHEN 'Zoho' THEN 'Advanced capabilities may be limiting for larger organizations with complex data needs. Some features require premium plans and it has limited advanced analytics capabilities compared to other tools.'
    WHEN 'Qlik Sense' THEN 'Steep learning curve for new users, a smaller number of pre-built connectors, and a complex admin interface can make it challenging to set up and manage without dedicated IT support.'
    WHEN 'Sisense' THEN 'High cost, a steep learning curve, and long implementation times. Embedded analytics lacks deep customization, and users report performance issues and bugs that can impact the user experience.'
    WHEN 'Domo' THEN 'Can be priced higher than other tools that focus solely on data visualization, which might be a barrier for smaller companies or teams with limited budgets.'
    WHEN 'Metabase' THEN 'Limited in its modeling capabilities and has basic chart options, which might not be sufficient for complex user data analysis. It may not be suitable for large-scale enterprise deployments.'
    WHEN 'dbt' THEN 'Steep learning curve for those unfamiliar with command-line interfaces and Jinja templating. Lacks a built-in scheduler and visual modeling tools, and is not ideal for real-time data processing.'
    WHEN 'SAP Analytics Cloud' THEN 'Higher learning curve than other visual reporting platforms and can be expensive. Its complexity may require specialized training and dedicated resources to manage and maintain effectively.'
    WHEN 'Google Data Studio' THEN 'Limited customization options and can be sluggish with large datasets. It may not be suitable for complex data modeling or enterprise-level governance and security requirements.'
    WHEN 'AWS QuickSight' THEN 'Limited customization options for visuals and dashboards. Lacks some advanced analytics features and integration with non-AWS data sources can be clunky and require extra effort to set up.'
    WHEN 'Holistics' THEN 'Requires developer involvement for set up and has a smaller community compared to other BI tools, which can make it harder to find support and resources.'
    WHEN 'Redash' THEN 'The user interface is less intuitive and performance can degrade with large datasets. It has limited visualization options and requires SQL knowledge, which is a barrier for non-technical users.'
    WHEN 'Adverity' THEN 'Steep learning curve for beginners and complicated transformation scripts. Primarily focused on marketing use cases, so it may not be suitable for general-purpose business intelligence.'
    WHEN 'GoodData' THEN 'May need frequent updates and has limited customization for visuals. This can be a drawback for teams that require a high degree of control over the look and feel of their dashboards and reports.'
    ELSE 'May require technical expertise and can be expensive for extensive use cases.'
  END as con_text,
  CASE t.name
    WHEN 'Tableau' THEN 'Connects to various data sources to create interactive and shareable dashboards, offering a wide range of complex data visualizations and geospatial mapping for in-depth user data intelligence.'
    WHEN 'Power BI' THEN 'Microsoft''s BI tool for transforming raw data into meaningful insights through interactive dashboards and reports, especially powerful within the Microsoft ecosystem for user data intelligence.'
    WHEN 'Looker' THEN 'A self-service BI platform with a powerful semantic modeling layer (LookML) that allows for creating consistent and reusable data definitions for deep user data analysis and exploration.'
    WHEN 'Zoho' THEN 'A user-friendly BI tool with an AI assistant (Zia) that allows users to ask questions in natural language, making user data intelligence accessible to a wider audience of business users.'
    WHEN 'Qlik Sense' THEN 'Utilizes an associative engine for data exploration, allowing users to uncover hidden insights in their user data by exploring relationships between data points that might be missed in other tools.'
    WHEN 'Sisense' THEN 'An enterprise-grade analytics platform that allows for embedding analytics everywhere, from customer-facing applications to internal workflows, for a comprehensive user data intelligence experience.'
    WHEN 'Domo' THEN 'A cloud-based, low-code data platform that combines analytics, data sharing, and embedded analytics in one place, with a focus on user-friendly and interactive visualizations for user data.'
    WHEN 'Metabase' THEN 'An open-source SQL BI tool that allows users to ask questions in natural language, making it easy for non-technical users to get insights from their user data without needing to write code.'
    WHEN 'dbt' THEN 'A data transformation tool that enables data analysts and engineers to transform, test, and document data in the cloud data warehouse, applying software engineering best practices to analytics code.'
    WHEN 'SAP Analytics Cloud' THEN 'An all-in-one cloud platform that combines BI, augmented analytics, predictive analytics, and enterprise planning in a single solution for comprehensive user data intelligence and decision-making.'
    WHEN 'Google Data Studio' THEN 'A free and easy-to-use tool for creating and sharing interactive dashboards and reports that connect to various data sources, especially those within the Google ecosystem, for user data insights.'
    WHEN 'AWS QuickSight' THEN 'A cloud-powered BI service that makes it easy to deliver insights to everyone in your organization, with a pay-per-session pricing model that is cost-effective for teams of all sizes.'
    WHEN 'Holistics' THEN 'A self-service BI platform that treats BI as code, with a code-based semantic layer and Git version control for building reusable and governable metric definitions for user data analysis.'
    WHEN 'Redash' THEN 'An open-source SQL-based BI tool designed for data analysts to query data sources and visualize the results in dashboards, with a focus on collaboration and sharing of queries and insights.'
    WHEN 'Adverity' THEN 'An end-to-end marketing analytics platform that automates data integration from various sources into a single source of truth for marketing user data intelligence and performance measurement.'
    WHEN 'GoodData' THEN 'A cloud-based, API-first analytics platform that connects to cloud data warehouses for real-time querying, with a semantic data model and AI-powered insights for user data exploration.'
    ELSE 'Provides comprehensive capabilities for user data intelligence and business analytics.'
  END as feature_description
FROM tools t
WHERE t.name IN ('Tableau', 'Power BI', 'Looker', 'Zoho Analytics', 'Qlik Sense', 'Sisense', 'Domo', 'Metabase', 'dbt', 'SAP Analytics Cloud', 'Google Data Studio', 'AWS QuickSight', 'Holistics', 'Redash', 'Adverity', 'GoodData')
ON CONFLICT (tool_id, method_id) DO UPDATE SET
    pro_text = EXCLUDED.pro_text,
    con_text = EXCLUDED.con_text,
    feature_description = EXCLUDED.feature_description;

-- ============================================================================
-- STEP 5: Verification queries
-- ============================================================================

-- First, verify the method_id for User Data Intelligence
SELECT id, name, slug FROM methods WHERE slug = 'user-data-intelligence' OR name = 'User Data Intelligence';

-- Verify tools were added/updated
SELECT 
    t.name as tool_name,
    t.description,
    t.logo_url,
    t.website_url
FROM tools t
WHERE t.name IN ('Zoho', 'Domo', 'dbt', 'SAP Analytics Cloud', 'Google Data Studio', 'Holistics', 'Adverity', 'GoodData')
ORDER BY t.name;

-- Specifically verify Zoho data
SELECT 
    t.name,
    t.description,
    t.pro_text,
    t.con_text,
    tpc.feature_description,
    tpc.pro_text as method_specific_pros,
    tpc.con_text as method_specific_cons,
    tl.initial_upvotes
FROM tools t
LEFT JOIN tool_pros_and_cons tpc ON t.id = tpc.tool_id AND tpc.method_id = 4
LEFT JOIN tools_leaderboard tl ON t.id = tl.tool_id AND tl.method_id = 4
WHERE t.name = 'Zoho';

-- Verify leaderboard data
SELECT 
    t.name as tool_name,
    tl.initial_upvotes,
    tl.initial_downvotes,
    tl.current_upvotes,
    tl.current_downvotes,
    (tl.initial_upvotes + tl.current_upvotes) as total_upvotes,
    (tl.initial_downvotes + tl.current_downvotes) as total_downvotes,
    ((tl.initial_upvotes + tl.current_upvotes) - (tl.initial_downvotes + tl.current_downvotes)) as net_score
FROM tools t
JOIN tools_leaderboard tl ON t.id = tl.tool_id AND tl.method_id = 4
WHERE t.name IN ('Tableau', 'Power BI', 'Looker', 'Zoho', 'Qlik Sense', 'Sisense', 'Domo', 'Metabase', 'dbt', 'SAP Analytics Cloud', 'Google Data Studio', 'AWS QuickSight', 'Holistics', 'Redash', 'Adverity', 'GoodData')
ORDER BY net_score DESC;

-- Verify pros/cons data
SELECT 
    t.name as tool_name,
    LEFT(tpc.feature_description, 100) || '...' as feature_preview,
    LEFT(tpc.pro_text, 100) || '...' as pros_preview,
    LEFT(tpc.con_text, 100) || '...' as cons_preview
FROM tools t
JOIN tool_pros_and_cons tpc ON t.id = tpc.tool_id AND tpc.method_id = 4
WHERE t.name IN ('Tableau', 'Power BI', 'Looker', 'Zoho', 'Qlik Sense', 'Sisense', 'Domo', 'Metabase', 'dbt', 'SAP Analytics Cloud', 'Google Data Studio', 'AWS QuickSight', 'Holistics', 'Redash', 'Adverity', 'GoodData')
ORDER BY t.name;

-- Final summary
SELECT 
    'User Data Intelligence Tools Backfill Complete' as status,
    COUNT(DISTINCT t.id) as total_tools,
    SUM(tl.initial_upvotes) as total_initial_upvotes,
    SUM(tl.initial_downvotes) as total_initial_downvotes,
    AVG(tl.initial_upvotes) as avg_initial_score
FROM tools t
JOIN tools_leaderboard tl ON t.id = tl.tool_id AND tl.method_id = 4
WHERE t.name IN ('Tableau', 'Power BI', 'Looker', 'Zoho', 'Qlik Sense', 'Sisense', 'Domo', 'Metabase', 'dbt', 'SAP Analytics Cloud', 'Google Data Studio', 'AWS QuickSight', 'Holistics', 'Redash', 'Adverity', 'GoodData');

COMMIT;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- This migration adds 8 new User Data Intelligence tools and updates all 16 tools
-- with proper initial scores, feature descriptions, and method-specific pros/cons
-- for the User Data Intelligence method (method_id = 4)
-- ============================================================================
