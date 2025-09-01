-- Migration: Update tool descriptions, pros, and cons for batch 1 (tools 1-30)
-- Date: 2025-08-29
-- Description: Standardize descriptions to 100-200 characters with unique differentiators and functional pros/cons

-- AWS QuickSight
UPDATE tools SET 
  description = 'Cloud-native BI service with deep AWS integration and automatic scaling capabilities.',
  pro_text = 'Seamless AWS ecosystem integration with automatic scaling and pay-per-use pricing model.',
  con_text = 'Limited visualization options outside AWS stack. Requires AWS expertise for optimization.'
WHERE name = 'AWS QuickSight';

-- Useberry
UPDATE tools SET 
  description = 'User testing platform with integrated participant recruitment and prototype testing capabilities.',
  pro_text = 'Built-in participant recruitment saves time. Comprehensive testing suite for prototypes and live sites.',
  con_text = 'Higher costs due to participant recruitment fees. Limited customization for specific user demographics.'
WHERE name = 'Useberry';

-- Metabase
UPDATE tools SET 
  description = 'Open-source BI tool designed for non-technical users with self-service analytics capabilities.',
  pro_text = 'No licensing costs with intuitive drag-drop interface. Easy deployment and democratizes data access.',
  con_text = 'Limited enterprise features and advanced visualizations. Requires technical setup for complex queries.'
WHERE name = 'Metabase';

-- VWO
UPDATE tools SET 
  description = 'All-in-one experimentation platform combining A/B testing with behavioral analytics and heatmaps.',
  pro_text = 'Unified testing and analytics platform reduces tool fragmentation. Strong statistical significance testing.',
  con_text = 'Can be expensive for high-traffic sites. Learning curve for advanced segmentation features.'
WHERE name = 'VWO';

-- Lookback
UPDATE tools SET 
  description = 'Live user interview platform focused exclusively on real-time moderated research sessions.',
  pro_text = 'Specialized for live interviews with excellent screen sharing and recording quality.',
  con_text = 'Limited to moderated sessions only. Requires scheduling coordination and interviewer availability.'
WHERE name = 'Lookback';

-- Launch Darkly
UPDATE tools SET 
  description = 'Feature flag management platform with integrated A/B testing for development teams.',
  pro_text = 'Developer-focused with robust feature flag controls. Excellent for gradual rollouts and experimentation.',
  con_text = 'Primarily feature flag tool, not pure A/B testing. Complex setup for simple marketing experiments.'
WHERE name = 'Launch Darkly';

-- Smartlook
UPDATE tools SET 
  description = 'Session replay tool with native mobile app support and automatic event tracking.',
  pro_text = 'Strong mobile analytics with native app SDKs. Automatic event capture reduces implementation time.',
  con_text = 'Can be expensive for high-traffic applications. Occasional delays in data processing for large datasets.'
WHERE name = 'Smartlook';

-- Heap
UPDATE tools SET 
  description = 'Automatic event tracking platform that captures all user interactions without code changes.',
  pro_text = 'Zero implementation effort with retroactive analytics. Captures everything automatically for later analysis.',
  con_text = 'Data can become cluttered without tracking strategy. Pricing scales quickly with data volume growth.'
WHERE name = 'Heap';

-- GetFeedback
UPDATE tools SET 
  description = 'Salesforce-native feedback platform with CRM integration and customer journey mapping.',
  pro_text = 'Perfect Salesforce integration links feedback to customer records. Unified CRM and feedback workflow.',
  con_text = 'Only valuable within Salesforce ecosystem. Limited functionality outside CRM-driven organizations.'
WHERE name = 'GetFeedback';

-- Doorbell
UPDATE tools SET 
  description = 'Lightweight feedback widget with simple implementation for basic user feedback collection.',
  pro_text = 'Minimal setup time with developer-friendly integration. Low overhead for straightforward feedback needs.',
  con_text = 'Very basic analytics with no advanced segmentation. Not suitable for comprehensive feedback programs.'
WHERE name = 'Doorbell';

-- dbt
UPDATE tools SET 
  description = 'Data transformation tool enabling analytics engineering with version control and testing.',
  pro_text = 'Brings software engineering practices to analytics. Version control and testing ensure data reliability.',
  con_text = 'Steep learning curve for non-technical users. Requires command-line knowledge and separate scheduler.'
WHERE name = 'dbt';

-- Tableau
UPDATE tools SET 
  description = 'Industry-leading data visualization platform with drag-and-drop interface and advanced analytics.',
  pro_text = 'Most powerful visualization capabilities with intuitive interface. Industry standard for data exploration.',
  con_text = 'Very expensive licensing especially for enterprise. Significant training required for advanced features.'
WHERE name = 'Tableau';

-- Power BI
UPDATE tools SET 
  description = 'Microsoft-integrated BI platform with Office 365 connectivity and enterprise reporting.',
  pro_text = 'Deep Microsoft ecosystem integration with competitive pricing. Excellent for Office 365 organizations.',
  con_text = 'Limited advanced visualizations compared to Tableau. Can be complex for non-Microsoft environments.'
WHERE name = 'Power BI';

-- Typeform
UPDATE tools SET 
  description = 'Conversational survey platform with logic branching and engaging user experience design.',
  pro_text = 'Conversational interface improves response rates. Beautiful design with conditional logic capabilities.',
  con_text = 'Limited complex branching logic compared to enterprise tools. Expensive for high-volume usage.'
WHERE name = 'Typeform';

-- SurveyPlanet
UPDATE tools SET 
  description = 'User-friendly survey tool with generous free plan and visual logic branching capabilities.',
  pro_text = 'Strong free plan with unlimited responses. Intuitive branching logic and clean design interface.',
  con_text = 'Limited advanced features in free tier. Smaller brand with fewer third-party integrations.'
WHERE name = 'SurveyPlanet';

-- Userfeel
UPDATE tools SET 
  description = 'Pay-per-test usability testing platform with rapid turnaround and flexible pricing model.',
  pro_text = 'Flexible pay-as-you-go pricing perfect for sporadic testing. Quick turnaround on test results.',
  con_text = 'Costs can accumulate quickly for frequent testing. Limited participant pool demographic options.'
WHERE name = 'Userfeel';

-- Hotjar
UPDATE tools SET 
  description = 'Combined heatmap and session recording platform with easy setup and visual insights.',
  pro_text = 'Simple visual insights with easy implementation. User-friendly interface combines multiple analytics types.',
  con_text = 'Limited advanced analytics compared to specialized tools. Pricing increases significantly with usage.'
WHERE name = 'Hotjar';

-- Qualaroo
UPDATE tools SET 
  description = 'Behavioral targeting survey platform with contextual triggers and exit-intent technology.',
  pro_text = 'Strong behavioral targeting improves response quality. Contextual surveys based on user actions.',
  con_text = 'Outdated interface compared to competitors. Limited reporting and advanced analytics capabilities.'
WHERE name = 'Qualaroo';

-- LimeSurvey
UPDATE tools SET 
  description = 'Open-source survey platform with self-hosting options and complete customization control.',
  pro_text = 'Free with unlimited responses and complete data ownership. Extensive customization for technical teams.',
  con_text = 'Requires technical expertise for setup and maintenance. Outdated UI compared to SaaS alternatives.'
WHERE name = 'LimeSurvey';

-- Sentry
UPDATE tools SET 
  description = 'Developer-focused error tracking with session replay for debugging and performance monitoring.',
  pro_text = 'Excellent error correlation with user sessions. Strong developer tools and performance monitoring integration.',
  con_text = 'Limited user experience focus beyond technical issues. Requires developer setup and technical knowledge.'
WHERE name = 'Sentry';

-- Adobe Analytics
UPDATE tools SET 
  description = 'Enterprise-grade analytics platform with comprehensive digital journey tracking and attribution.',
  pro_text = 'Most comprehensive enterprise analytics with powerful segmentation. Advanced attribution modeling capabilities.',
  con_text = 'Very expensive with complex implementation requirements. Steep learning curve requiring technical expertise.'
WHERE name = 'Adobe Analytics';

-- Loop11
UPDATE tools SET 
  description = 'Remote usability testing platform with moderated and unmoderated testing capabilities.',
  pro_text = 'Flexible testing options with both moderated and unmoderated sessions. Comprehensive analytics dashboard.',
  con_text = 'Pricing can be expensive for frequent testing. Learning curve for advanced feature utilization.'
WHERE name = 'Loop11';

-- Userbrain
UPDATE tools SET 
  description = 'Subscription-based continuous usability testing with automated participant recruitment.',
  pro_text = 'Subscription model provides consistent feedback stream. Automated recruitment reduces coordination overhead.',
  con_text = 'Subscription model may not suit sporadic testing needs. Limited control over participant demographics.'
WHERE name = 'Userbrain';

-- Amplitude
UPDATE tools SET 
  description = 'Advanced product analytics platform with behavioral cohorts and user journey analysis.',
  pro_text = 'Best-in-class behavioral analytics with powerful cohort analysis. Excellent funnel and retention tracking.',
  con_text = 'Steep learning curve requiring developer implementation. Expensive for large data volumes and usage.'
WHERE name = 'Amplitude';

-- Zonka Feedback
UPDATE tools SET 
  description = 'Multi-channel feedback platform with NPS tracking and survey distribution capabilities.',
  pro_text = 'Multi-channel feedback collection with good integration options. Template-driven for quick deployment.',
  con_text = 'Interface feels dated compared to competitors. Limited advanced targeting and analytics features.'
WHERE name = 'Zonka Feedback';

-- Glassbox
UPDATE tools SET 
  description = 'Enterprise session replay platform with high security standards for regulated industries.',
  pro_text = 'Highest security and compliance standards for regulated industries. Enterprise-grade privacy features.',
  con_text = 'Very expensive with complex implementation requirements. Overkill for smaller organizations.'
WHERE name = 'Glassbox';

-- PostHog
UPDATE tools SET 
  description = 'Unified product platform combining analytics, session replay, and feature flags with open-source option.',
  pro_text = 'All-in-one product toolkit with open-source flexibility. Strong self-hosting option with full control.',
  con_text = 'Self-hosted version requires technical maintenance. Cloud version pricing scales quickly with usage.'
WHERE name = 'PostHog';

-- Microsoft Forms
UPDATE tools SET 
  description = 'Microsoft 365 integrated form builder with real-time collaboration and Office ecosystem connectivity.',
  pro_text = 'Seamless Microsoft ecosystem integration with easy team collaboration. Free for Office 365 users.',
  con_text = 'Limited advanced features compared to dedicated platforms. Restricted customization and branding options.'
WHERE name = 'Microsoft Forms';

-- Stellar
UPDATE tools SET 
  description = 'Simple A/B testing platform focused on quick setup and streamlined testing for small businesses.',
  pro_text = 'Simple setup with intuitive interface and minimal learning curve. Affordable pricing for small teams.',
  con_text = 'Limited advanced features and integrations. Smaller community with fewer resources and documentation.'
WHERE name = 'Stellar';

-- Lucky Orange
UPDATE tools SET 
  description = 'Real-time website optimization with live session viewing, heatmaps, and integrated chat support.',
  pro_text = 'Real-time session viewing with integrated live chat functionality. Simple setup and affordable pricing.',
  con_text = 'Basic analytics compared to enterprise solutions. Limited mobile app support and advanced filtering.'
WHERE name = 'Lucky Orange';

-- Verification query to check updates
SELECT name, description, pro_text, con_text 
FROM tools 
WHERE name IN (
  'AWS QuickSight', 'Useberry', 'Metabase', 'VWO', 'Lookback', 
  'Launch Darkly', 'Smartlook', 'Heap', 'GetFeedback', 'Doorbell',
  'dbt', 'Tableau', 'Power BI', 'Typeform', 'SurveyPlanet',
  'Userfeel', 'Hotjar', 'Qualaroo', 'LimeSurvey', 'Sentry',
  'Adobe Analytics', 'Loop11', 'Userbrain', 'Amplitude', 'Zonka Feedback',
  'Glassbox', 'PostHog', 'Microsoft Forms', 'Stellar', 'Lucky Orange'
)
ORDER BY name;
