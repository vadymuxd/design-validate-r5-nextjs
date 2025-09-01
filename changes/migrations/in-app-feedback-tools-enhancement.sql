-- In-App Feedback Tools Enhancement
-- This migration adds new tools and updates scores for method_id = 9 (In-App Feedback)
-- Date: 2025-08-29

-- STEP 1: Insert only truly missing tools into tools table
INSERT INTO tools (id, name, description, logo_url, website_url, pro_text, con_text) VALUES

-- Qualaroo
(gen_random_uuid(), 'Qualaroo', 'Triggers contextual surveys based on user behavior and website interactions.', '/tools-logos/qualaroo.png', 'https://qualaroo.com/', 'Strong behavioral targeting capabilities. Contextual surveys improve response quality and relevance.', 'Outdated interface compared to modern alternatives. Limited reporting and analytics features.'),

-- Mopinion
(gen_random_uuid(), 'Mopinion', 'Collects customer insights through customizable feedback forms and automated reporting workflows.', '/tools-logos/mopinion.png', 'https://mopinion.com/', 'Comprehensive feedback suite with workflow integrations. Strong customization and reporting features.', 'Can feel complex for simple use cases. Requires onboarding time for effective implementation.'),

-- Refiner
(gen_random_uuid(), 'Refiner', 'Specializes in micro-surveys, NPS tracking, and user segmentation for SaaS companies.', '/tools-logos/refiner.png', 'https://refiner.io/', 'Strong targeting and personalization features. Good for SaaS-specific feedback collection needs.', 'Dashboard interface could be more intuitive. Customization options may be limited for complex workflows.'),

-- Instabug
(gen_random_uuid(), 'Instabug', 'Collects mobile app bug reports, crash logs, and user feedback with rich technical context.', '/tools-logos/instabug.png', 'https://instabug.com/', 'Excellent technical context for developers. Rich bug reporting with screenshots and console logs.', 'Focused primarily on technical issues. Limited for general user sentiment or strategic feedback.'),

-- Canny
(gen_random_uuid(), 'Canny', 'Manages product feedback and feature requests through public boards and voting systems.', '/tools-logos/canny.png', 'https://canny.io/', 'Great for feature request management and roadmap transparency. Strong community-building features.', 'Limited to feature requests and voting. Not suitable for broader user experience feedback.'),

-- Zonka Feedback
(gen_random_uuid(), 'Zonka Feedback', 'Provides survey tools and NPS tracking across web, mobile, and offline channels.', '/tools-logos/zonka-feedback.png', 'https://www.zonkafeedback.com/', 'Multi-channel feedback collection with good integration options. Template-driven approach for quick setup.', 'Interface feels less modern than competitors. Limited advanced targeting and analytics features.'),

-- Qwary
(gen_random_uuid(), 'Qwary', 'Enables quick deployment of surveys and feedback widgets with minimal setup requirements.', '/tools-logos/qwary.png', 'https://qwary.com/', 'Very quick setup and deployment. Simple interface ideal for fast-moving teams seeking basic insights.', 'Limited analytics and reporting depth. Fewer advanced features compared to enterprise solutions.'),

-- Userback
(gen_random_uuid(), 'Userback', 'Captures visual feedback through annotated screenshots and detailed reports from web applications.', '/tools-logos/userback.png', 'https://userback.com/', 'Excellent visual feedback with annotations. Streamlines developer workflows and reduces communication gaps.', 'Primarily focused on visual issues and bugs. Less suitable for strategic or sentiment-based feedback.'),

-- GetFeedback
(gen_random_uuid(), 'GetFeedback', 'Integrates survey tools and feedback analytics natively with Salesforce CRM data.', '/tools-logos/getfeedback.png', 'https://www.getfeedback.com/', 'Perfect Salesforce integration for CRM-driven teams. Connects feedback directly to customer records.', 'Too Salesforce-specific for non-CRM teams. Limited flexibility outside of Salesforce ecosystem.'),

-- Doorbell
(gen_random_uuid(), 'Doorbell', 'Embeds simple feedback widgets into web applications for collecting user feedback.', '/tools-logos/doorbell.png', 'https://doorbell.io/', 'Lightweight and developer-friendly. Quick implementation with minimal overhead for simple feedback needs.', 'Very basic feature set with limited analytics. Not suitable for comprehensive feedback programs.'),

-- Usersnap
(gen_random_uuid(), 'Usersnap', 'Captures annotated screenshots and screen recordings for detailed issue reporting and feedback.', '/tools-logos/usersnap.png', 'https://usersnap.com/', 'Excellent visual context with screenshots and recordings. Great for reducing developer back-and-forth.', 'Best suited for QA and bug reporting. Limited tools for broader strategic product feedback.');

-- STEP 2: Update tools_leaderboard with initial scores for In-App Feedback method (method_id = 9)
-- Using existing tool IDs from the database and adding new tools

-- Insert/Update leaderboard entries for all In-App Feedback tools
WITH tool_scores AS (
    SELECT name, initial_upvotes FROM (VALUES
        ('Pendo', 11),
        ('Sprig', 8),
        ('Hotjar', 7),
        ('UserVoice', 6),
        ('Survicate', 6),
        ('UserPilot', 5),
        ('Typeform', 5),
        ('Qualaroo', 4),
        ('Qualtrics', 4),
        ('Mopinion', 4),
        ('Refiner', 4),
        ('SurveyMonkey', 3),
        ('Alchemer', 3),
        ('Instabug', 3),
        ('Canny', 3),
        ('Zonka Feedback', 3),
        ('Qwary', 2),
        ('SurveySparrow', 2),
        ('Userback', 2),
        ('UXTweak', 2),
        ('GetFeedback', 2),
        ('Doorbell', 2),
        ('Usersnap', 2),
        ('Delighted', 2)
    ) AS scores(name, initial_upvotes)
)
INSERT INTO tools_leaderboard (tool_id, method_id, initial_upvotes, initial_downvotes, current_upvotes, current_downvotes)
SELECT 
    t.id as tool_id,
    9 as method_id,
    ts.initial_upvotes,
    0 as initial_downvotes,
    0 as current_upvotes,
    0 as current_downvotes
FROM tools t
JOIN tool_scores ts ON t.name = ts.name
ON CONFLICT (tool_id, method_id) DO UPDATE SET
    initial_upvotes = EXCLUDED.initial_upvotes,
    initial_downvotes = 0;

-- STEP 3: Insert/Update tool_pros_and_cons for In-App Feedback method (method_id = 9)
WITH tool_details AS (
    SELECT name, feature_description, pro_text, con_text FROM (VALUES
        ('Pendo', 'Combines in-app surveys, analytics, and segmentation to capture contextual feedback during real user actions.', 'Links feedback with behavior data for richer insights, reducing tool sprawl and helping teams align product decisions.', 'Complex setup and high costs can overwhelm teams who only need simple in-app surveys or lightweight feedback collection.'),
        ('Sprig', 'Offers in-app surveys, session replays, and AI insights to capture feedback directly in context of real usage.', 'Provides contextual, visual, and AI-driven insights that speed product validation and help prioritize changes effectively.', 'Requires setup time and careful interpretation of data, which can slow agile teams looking for fast, lightweight feedback.'),
        ('Hotjar', 'Delivers heatmaps, recordings, and pop-up surveys that capture direct in-app feedback and user behavior together.', 'Combines visual usage data with survey responses, making it easy to see what users do and why they feel that way.', 'Advanced targeting is limited; surveys can feel generic and miss nuance compared to more specialized feedback tools.'),
        ('UserVoice', 'Provides in-app boards and voting systems to capture user ideas and feature requests within product context.', 'Strong for prioritization with voting and public roadmaps, enabling transparency in product planning and communication.', 'Less useful for quick pulse checks or sentiment surveys; best suited for feature request tracking rather than UX feedback.'),
        ('Survicate', 'Lightweight pop-up and widget surveys that let teams collect contextual in-app feedback with real-time targeting.', 'Quick to set up, integrates smoothly with CRMs and analytics platforms, and provides actionable survey templates.', 'Customization options and advanced survey design are limited, making it less flexible for complex product workflows.'),
        ('UserPilot', 'Combines in-app surveys with onboarding flows and checklists to gather feedback during product discovery.', 'Feedback tied to onboarding ensures input comes when users explore new features, improving relevance and accuracy.', 'Heavy all-in-one focus; teams seeking feedback only may find added guidance features unnecessary or distracting.'),
        ('Typeform', 'Conversational, form-like surveys can be embedded in apps to capture detailed user insights in context.', 'Polished, engaging design encourages higher completion rates and works well for longer or more complex surveys.', 'Not purpose-built for in-app use; embeds can disrupt experience and feel heavier than native feedback solutions.'),
        ('Qualaroo', 'Uses contextual "Nudge" surveys to capture feedback triggered by specific in-app behaviors or segments.', 'Strong behavioral targeting ensures feedback is relevant, improving quality of insights and survey response rates.', 'Outdated UI and limited reporting make it less appealing compared to newer, more visually refined platforms.'),
        ('Qualtrics', 'Enterprise-grade in-app feedback with advanced survey logic, analytics, and deep customization options.', 'Highly flexible and integrates broadly across enterprise systems, ideal for large-scale research and analysis.', 'Complexity and high cost make it overkill for smaller or fast-moving teams who only need lightweight in-app input.'),
        ('Mopinion', 'All-in-one feedback suite with customizable in-app forms, tagging, and automated reporting workflows.', 'Feedback integrates directly into team workflows, with flexible form design and advanced customization options.', 'Can feel complex and requires onboarding time; not as intuitive for smaller teams focused on quick survey launches.'),
        ('Refiner', 'Enables customizable micro-surveys triggered at specific moments for timely in-app user feedback.', 'Targeting and personalization improve feedback quality, helping capture insights exactly when they matter most.', 'Dashboards are less intuitive, and customization limits may appear when scaling to more complex team workflows.'),
        ('SurveyMonkey', 'Embeds simple surveys into apps to gather structured input from users directly inside the experience.', 'Easy setup with broad template support, making it fast to capture feedback without deep technical knowledge.', 'Not designed for native in-app usage, so surveys can feel external or disconnected from the product flow.'),
        ('Alchemer', 'Advanced survey logic and branching support enable more complex in-app feedback collection scenarios.', 'Customizable surveys with strong logic allow nuanced research and tailored user experience measurement.', 'Complex setup and heavy integrations make it slower to implement for lean product or growth-focused teams.'),
        ('Instabug', 'Captures in-app bug reports with annotated screenshots, console logs, and user-generated feedback.', 'Provides developers with rich technical context, speeding debugging and improving product stability quickly.', 'Feedback is heavily skewed to technical issues; less suited for general sentiment or feature discovery insights.'),
        ('Canny', 'In-app boards and upvote features let users suggest and prioritize product improvements collaboratively.', 'Great for aligning roadmaps with user demand, creating transparency and user trust through public feedback.', 'Focused narrowly on feature requests, lacking breadth for general UX or real-time user sentiment gathering.'),
        ('Zonka Feedback', 'Provides in-app surveys using NPS, CSAT, and emoji scales, with integrations to external platforms.', 'Template-driven with flexible integrations, making it effective for structured satisfaction measurements.', 'Less modern interface and weaker advanced targeting options compared to more polished competitors.'),
        ('Qwary', 'Lightweight tool for fast deployment of in-app surveys to collect feedback with minimal disruption.', 'Quick setup and easy-to-use design make it ideal for fast-moving teams seeking simple, contextual insights.', 'Analytics and reporting are limited, offering less depth and context for advanced feedback requirements.'),
        ('SurveySparrow', 'Conversational-style in-app surveys with automation features for recurring user feedback cycles.', 'Chat-like interface feels engaging and increases completion rates compared to traditional survey formats.', 'Analytics and context are weaker than dedicated product feedback tools, limiting deeper behavioral insights.'),
        ('Userback', 'Visual in-app feedback with annotations, screenshots, and reporting tailored to design or dev teams.', 'Provides highly actionable, visual reports that speed developer workflows and reduce communication gaps.', 'Oriented toward bug/design issues, not broader sentiment or strategic feature-level user research.'),
        ('UXTweak', 'Merges in-app surveys with usability testing, heatmaps, and journey tracking for research depth.', 'Comprehensive platform combining UX research with feedback, enriching insight into user experiences.', 'Setup complexity and broad scope can overwhelm teams only seeking lightweight in-app survey collection.'),
        ('GetFeedback', 'In-app survey tool with tight Salesforce integration for real-time customer experience insights.', 'Perfect for teams in Salesforce ecosystems, connecting app feedback to wider CX and CRM workflows easily.', 'Too Salesforce-centric; flexibility is limited if teams don''t rely heavily on that specific ecosystem.'),
        ('Doorbell', 'Developer-friendly SDK allows embedding of quick feedback forms directly inside product flows.', 'Lightweight and fast to implement, making it ideal for smaller teams that need minimal overhead setup.', 'Basic feature set with limited analytics; unsuitable for teams requiring deeper contextual user insights.'),
        ('Usersnap', 'Collects in-app feedback with annotated screenshots and recordings to give visual context to issues.', 'Great for reducing dev/design back-and-forth by pairing visual evidence directly with user commentary.', 'Best for QA and bug reporting; lacks tools for broader strategic product feedback or user sentiment tracking.'),
        ('Delighted', 'Provides quick in-app microsurveys focused on NPS, CSAT, and CES for tracking user sentiment.', 'Very easy to deploy, with clean reporting that makes monitoring key satisfaction metrics simple and clear.', 'Limited customization options and narrow survey types restrict usefulness for deeper research needs.')
    ) AS details(name, feature_description, pro_text, con_text)
)
INSERT INTO tool_pros_and_cons (tool_id, method_id, feature_description, pro_text, con_text)
SELECT 
    t.id as tool_id,
    9 as method_id,
    td.feature_description,
    td.pro_text,
    td.con_text
FROM tools t
JOIN tool_details td ON t.name = td.name
ON CONFLICT (tool_id, method_id) DO UPDATE SET
    feature_description = EXCLUDED.feature_description,
    pro_text = EXCLUDED.pro_text,
    con_text = EXCLUDED.con_text;

-- STEP 4: Verification queries
SELECT 'New tools added' as step, count(*) as count FROM tools WHERE name IN ('Qualaroo', 'Mopinion', 'Refiner', 'Instabug', 'Canny', 'Zonka Feedback', 'Qwary', 'Userback', 'GetFeedback', 'Doorbell', 'Usersnap');

SELECT 'Leaderboard entries for method 9' as step, count(*) as count FROM tools_leaderboard WHERE method_id = 9;

SELECT 'Pros/cons entries for method 9' as step, count(*) as count FROM tool_pros_and_cons WHERE method_id = 9;
