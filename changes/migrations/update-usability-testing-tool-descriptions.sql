-- Migration: Update tool_pros_and_cons table with usability testing specific descriptions and pros/cons
-- Date: 2025-08-28
-- Description: Replace generic tool descriptions with usability testing focused content

BEGIN;

-- Update UserTesting (d603b37b-7c8a-4013-9410-07736edd8a04)
UPDATE tool_pros_and_cons 
SET 
    feature_description = 'Industry-leading platform for conducting comprehensive usability studies with real users through video-based feedback and task completion analysis.',
    pro_text = 'Massive participant network with diverse demographics, excellent video quality for capturing user reactions, robust task-based testing framework, AI-powered insight analysis for faster results, professional moderated testing capabilities.',
    con_text = 'Premium pricing can be prohibitive for smaller teams, participant screening process can be slow, some generic feedback from panel users, complex interface may overwhelm new researchers.'
WHERE tool_id = 'd603b37b-7c8a-4013-9410-07736edd8a04' AND method_id = 1;

-- Update Maze (b98e9e55-91d0-4e42-b7e6-2ca3645d513c)
UPDATE tool_pros_and_cons 
SET 
    feature_description = 'Rapid prototype testing platform that excels at unmoderated usability testing with seamless design tool integration and automated user flow analysis.',
    pro_text = 'Seamless Figma and design tool integration, fast setup for prototype testing, excellent heatmaps and user path tracking, automated analytics reduce manual analysis time, great for iterative design testing.',
    con_text = 'Limited to prototype and early-stage testing, less effective for complex task scenarios, participant quality can vary, reporting lacks depth for nuanced usability insights.'
WHERE tool_id = 'b98e9e55-91d0-4e42-b7e6-2ca3645d513c' AND method_id = 1;

-- Update UXtweak (6062bde4-95db-44fe-aebc-6da9373697d4)
UPDATE tool_pros_and_cons 
SET 
    feature_description = 'All-in-one usability testing platform offering comprehensive testing methods from card sorting to session recordings with strong participant recruitment capabilities.',
    pro_text = 'Complete testing toolkit in one platform, excellent global participant panel, strong session recording and heatmap features, good value for comprehensive testing needs, supports both moderated and unmoderated testing.',
    con_text = 'Interface can feel overwhelming for beginners, participant recruitment costs add up quickly, some advanced features have learning curve, reporting customization is limited.'
WHERE tool_id = '6062bde4-95db-44fe-aebc-6da9373697d4' AND method_id = 1;

-- Update Lookback (0c65979c-e231-4fd7-ad54-2ccc25e00f19)
UPDATE tool_pros_and_cons 
SET 
    feature_description = 'Specialized platform for live moderated usability testing with excellent real-time observation and collaboration features for team-based research.',
    pro_text = 'Excellent for live moderated sessions, superior real-time collaboration features, high-quality video and audio recording, good for stakeholder involvement, strong note-taking and annotation tools.',
    con_text = 'Technical reliability issues reported by users, primarily focused on moderated testing limits flexibility, requires more coordination for scheduling, higher learning curve for facilitators.'
WHERE tool_id = '0c65979c-e231-4fd7-ad54-2ccc25e00f19' AND method_id = 1;

-- Update Optimal Workshop (6d1f9458-48fe-4944-b6d3-612d770c949c)
UPDATE tool_pros_and_cons 
SET 
    feature_description = 'Specialized platform focusing on information architecture testing with strong card sorting and tree testing capabilities for navigation and structure validation.',
    pro_text = 'Industry-leading card sorting and tree testing tools, excellent for IA and navigation testing, clear statistical reporting for structure decisions, good for early-stage architecture validation.',
    con_text = 'Limited scope beyond IA testing, not suitable for comprehensive usability studies, lacks session recording capabilities, expensive for basic usability testing needs.'
WHERE tool_id = '6d1f9458-48fe-4944-b6d3-612d770c949c' AND method_id = 1;

-- Update Hotjar (1f4f0b9b-5cc8-482d-902c-80c73a11c1cc)
UPDATE tool_pros_and_cons 
SET 
    feature_description = 'Behavioral analytics platform that captures real user interactions through heatmaps and session recordings to identify usability friction points on live websites.',
    pro_text = 'Easy implementation with just a code snippet, continuous passive data collection, excellent heatmaps reveal click patterns, session recordings show real user struggles, affordable for ongoing monitoring.',
    con_text = 'Limited to observational data without user feedback, no task-based testing capabilities, privacy concerns with session recording, data can be overwhelming without clear research questions.'
WHERE tool_id = '1f4f0b9b-5cc8-482d-902c-80c73a11c1cc' AND method_id = 1;

-- Update Userlytics (e146ceeb-433c-4135-9bba-95fb62644ea9)
UPDATE tool_pros_and_cons 
SET 
    feature_description = 'Global remote usability testing platform with strong multilingual capabilities and comprehensive testing options for international user research.',
    pro_text = 'Excellent global participant network, strong multilingual testing support, good video quality for remote sessions, flexible testing scenarios, comprehensive demographic targeting.',
    con_text = 'Can be expensive for frequent testing, participant quality varies by region, interface complexity for new users, longer turnaround times for specialized demographics.'
WHERE tool_id = 'e146ceeb-433c-4135-9bba-95fb62644ea9' AND method_id = 1;

-- Update UsabilityHub (834ed992-831f-415f-b086-0bfce69409cb)
UPDATE tool_pros_and_cons 
SET 
    feature_description = 'Quick feedback platform specializing in rapid usability tests like first-click testing, preference tests, and five-second tests for fast iteration cycles.',
    pro_text = 'Extremely fast test setup and results, great for quick design validation, affordable pricing for rapid testing, simple interface for non-researchers, good for A/B testing design elements.',
    con_text = 'Limited to simple test types, not suitable for complex task scenarios, shallow insights compared to comprehensive testing, participant panel quality can be inconsistent.'
WHERE tool_id = '834ed992-831f-415f-b086-0bfce69409cb' AND method_id = 1;

-- Update Loop11 (3152b63d-9578-4bdd-82d8-b39aab6177a8)
UPDATE tool_pros_and_cons 
SET 
    feature_description = 'Task-based usability testing platform focusing on quantitative metrics and user journey analysis with strong clickstream tracking capabilities.',
    pro_text = 'Strong quantitative analytics and metrics, excellent clickstream and user path analysis, good for benchmarking usability performance, reliable participant recruitment, clear statistical reporting.',
    con_text = 'Less focus on qualitative insights, limited video feedback capabilities, interface feels dated compared to competitors, participant panel smaller than major platforms.'
WHERE tool_id = '3152b63d-9578-4bdd-82d8-b39aab6177a8' AND method_id = 1;

-- Update Crazy Egg (72ef6015-5308-4a47-8cd1-e50c24a356de)
UPDATE tool_pros_and_cons 
SET 
    feature_description = 'Visual analytics platform using heatmaps and click tracking to identify usability issues and user interaction patterns on live websites.',
    pro_text = 'Simple setup and immediate data collection, clear visual heatmaps highlight problem areas, affordable for continuous monitoring, good for identifying obvious usability issues, easy-to-understand reports.',
    con_text = 'Limited to behavioral observation without user context, no task-based testing framework, lacks qualitative feedback mechanisms, basic analytics compared to dedicated usability platforms.'
WHERE tool_id = '72ef6015-5308-4a47-8cd1-e50c24a356de' AND method_id = 1;

-- Update Userfeel (1f17b17f-15b0-47f4-beda-8b032dd5d03a)
UPDATE tool_pros_and_cons 
SET 
    feature_description = 'Affordable remote usability testing service offering multilingual testing capabilities with focus on providing genuine user feedback through video recordings.',
    pro_text = 'Competitive pricing with pay-per-test model, good multilingual support, decent video quality, flexible testing scenarios, no subscription commitment required.',
    con_text = 'Smaller participant pool than major competitors, basic reporting and analytics features, limited advanced testing options, participant screening less rigorous.'
WHERE tool_id = '1f17b17f-15b0-47f4-beda-8b032dd5d03a' AND method_id = 1;

-- Update UserZoom (60719df6-5c1f-4811-8a6f-cc7a8f6e29b1)
UPDATE tool_pros_and_cons 
SET 
    feature_description = 'Enterprise-grade research platform offering comprehensive usability testing capabilities with advanced analytics and large-scale participant management.',
    pro_text = 'Enterprise-level features and scalability, comprehensive testing methodologies, advanced analytics and reporting, large participant network, good for complex research needs.',
    con_text = 'Very expensive and complex for smaller teams, steep learning curve, overkill for simple usability testing, requires significant setup time.'
WHERE tool_id = '60719df6-5c1f-4811-8a6f-cc7a8f6e29b1' AND method_id = 1;

-- Update Userbrain (37478d6f-4bb3-41b4-8a05-991c57d0ee86)
UPDATE tool_pros_and_cons 
SET 
    feature_description = 'Streamlined usability testing platform focused on providing regular, consistent user feedback through simple test scenarios and quick turnaround times.',
    pro_text = 'Simple and straightforward testing process, consistent weekly testing options, affordable pricing model, quick setup and results, good for ongoing usability monitoring.',
    con_text = 'Limited testing flexibility and customization, basic participant demographics, simple reporting lacks depth, not suitable for complex research scenarios.'
WHERE tool_id = '37478d6f-4bb3-41b4-8a05-991c57d0ee86' AND method_id = 1;

-- Update Useberry (04d18d00-6117-4a36-9f09-01e361a0821e)
UPDATE tool_pros_and_cons 
SET 
    feature_description = 'Prototype-focused usability testing platform designed for early-stage design validation with emphasis on user journey mapping and task completion analysis.',
    pro_text = 'Excellent for prototype testing phases, good user journey visualization, clean interface for setup, decent analytics for early-stage insights, affordable for prototype validation.',
    con_text = 'Limited to prototype testing scenarios, smaller participant network, basic reporting compared to full platforms, not suitable for live website testing.'
WHERE tool_id = '04d18d00-6117-4a36-9f09-01e361a0821e' AND method_id = 1;

-- Update Trymata (b77e6c17-a423-4645-8364-ed930e09adaf)
UPDATE tool_pros_and_cons 
SET 
    feature_description = 'Modern usability testing platform combining screen recordings with advanced analytics to provide comprehensive insights into user behavior and task completion.',
    pro_text = 'Good balance of features and pricing, decent analytics and reporting, flexible testing scenarios, screen recording quality, reasonable participant recruitment options.',
    con_text = 'Smaller market presence and user base, limited advanced features compared to leaders, participant pool not as extensive, newer platform with evolving features.'
WHERE tool_id = 'b77e6c17-a423-4645-8364-ed930e09adaf' AND method_id = 1;

-- Update Contentsquare (78bd73fd-a2cb-42a5-af30-2895e7932dbb)
UPDATE tool_pros_and_cons 
SET 
    feature_description = 'Enterprise behavioral analytics platform providing deep insights into user interactions through advanced AI-powered analysis of user journeys and friction points.',
    pro_text = 'Advanced AI-powered analytics for large-scale insights, comprehensive user journey mapping, excellent for enterprise-level behavioral analysis, deep integration capabilities.',
    con_text = 'Very expensive and complex implementation, overkill for standard usability testing, requires technical expertise to fully utilize, limited traditional usability testing features.'
WHERE tool_id = '78bd73fd-a2cb-42a5-af30-2895e7932dbb' AND method_id = 1;

-- Update User Interviews (99377dcf-5e4a-47b3-9714-30b600431127)
UPDATE tool_pros_and_cons 
SET 
    feature_description = 'Participant recruitment and research management platform that facilitates finding and scheduling participants for usability testing studies.',
    pro_text = 'Excellent participant recruitment capabilities, good screening and scheduling tools, streamlines research participant management, integrates well with other testing platforms.',
    con_text = 'Focuses primarily on recruitment not testing, requires separate testing platform, additional cost on top of testing tools, limited to participant management functions.'
WHERE tool_id = '99377dcf-5e4a-47b3-9714-30b600431127' AND method_id = 1;

-- Update Dovetail (c1c044fc-7ab9-45aa-9da4-e0f30d7a775b)
UPDATE tool_pros_and_cons 
SET 
    feature_description = 'Research repository and analysis platform that helps organize and analyze qualitative usability testing data through tagging and insight synthesis.',
    pro_text = 'Excellent for organizing and analyzing qualitative research data, powerful tagging and insight synthesis features, good for team collaboration on research findings.',
    con_text = 'Focused on analysis rather than data collection, requires existing usability testing data sources, expensive for analysis-only functionality, not a complete testing solution.'
WHERE tool_id = 'c1c044fc-7ab9-45aa-9da4-e0f30d7a775b' AND method_id = 1;

-- Update UX Metrics (ccbc1a34-aff9-45ea-92ee-54fc69541578)
UPDATE tool_pros_and_cons 
SET 
    feature_description = 'Specialized platform for information architecture validation through card sorting and tree testing with focus on quantitative metrics and statistical analysis.',
    pro_text = 'Specialized for IA testing with strong statistical analysis, affordable pricing for card sorting and tree testing, simple interface for specific testing needs.',
    con_text = 'Very limited scope beyond IA testing, not suitable for comprehensive usability research, lacks modern features compared to full platforms, minimal participant recruitment options.'
WHERE tool_id = 'ccbc1a34-aff9-45ea-92ee-54fc69541578' AND method_id = 1;

-- Update PlaybookUX (b7c869ab-d161-41b6-9ef7-c26d630b18f9)
UPDATE tool_pros_and_cons 
SET 
    feature_description = 'User research platform combining usability testing capabilities with participant management and research workflow automation for streamlined testing processes.',
    pro_text = 'Good workflow automation for research teams, decent participant management features, reasonable pricing for small teams, combines multiple research functions.',
    con_text = 'Smaller participant network, limited advanced testing features, less established platform with fewer integrations, basic analytics compared to specialized platforms.'
WHERE tool_id = 'b7c869ab-d161-41b6-9ef7-c26d630b18f9' AND method_id = 1;

COMMIT;
