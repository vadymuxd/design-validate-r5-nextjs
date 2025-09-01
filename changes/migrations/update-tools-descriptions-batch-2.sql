-- Migration: Update tool descriptions, pros, and cons for batch 2 (tools 31-60)
-- Date: 2025-08-29
-- Description: Standardize descriptions to 100-200 characters with unique differentiators and functional pros/cons

-- Pendo
UPDATE tools SET 
  description = 'Product analytics platform with integrated in-app guides and user onboarding capabilities.',
  pro_text = 'Combines analytics with actionable in-app guidance. Strong user onboarding and feature adoption tools.',
  con_text = 'Analytics features are secondary to guides. Expensive and complex for pure analytics needs.'
WHERE name = 'Pendo';

-- Instabug
UPDATE tools SET 
  description = 'Mobile app bug reporting with rich technical context and crash log integration.',
  pro_text = 'Excellent technical context for developers. Rich bug reports with screenshots and console logs.',
  con_text = 'Focused primarily on technical issues. Limited for general user sentiment or strategic feedback.'
WHERE name = 'Instabug';

-- Mixpanel
UPDATE tools SET 
  description = 'Advanced product analytics with powerful funnel analysis and retention tracking capabilities.',
  pro_text = 'Most powerful dedicated product analytics tools. Excellent funnel and retention analysis capabilities.',
  con_text = 'Expensive for large datasets requiring technical implementation. Learning curve for complex analysis.'
WHERE name = 'Mixpanel';

-- Fillout
UPDATE tools SET 
  description = 'Modern form builder with deep integrations to Notion, Airtable, and workflow automation tools.',
  pro_text = 'Powerful integrations with modern productivity tools. AI-powered survey generation and conditional logic.',
  con_text = 'Newer tool with smaller community support. Some advanced features may be missing or limited.'
WHERE name = 'Fillout';

-- AB Tasty
UPDATE tools SET 
  description = 'Unified experimentation platform combining A/B testing, personalization, and feature management.',
  pro_text = 'Comprehensive experimentation suite with strong visual editor. Advanced targeting and personalization features.',
  con_text = 'Can be expensive for smaller organizations. Learning curve for advanced personalization capabilities.'
WHERE name = 'AB Tasty';

-- Delighted
UPDATE tools SET 
  description = 'Specialized NPS and CSAT feedback platform with beautiful design and automated workflows.',
  pro_text = 'Simplest way to gather standardized feedback metrics. Beautiful design with easy setup and automation.',
  con_text = 'Not flexible for general-purpose surveys. Limited analytics and customization beyond standard metrics.'
WHERE name = 'Delighted';

-- Google Forms
UPDATE tools SET 
  description = 'Free form builder integrated with Google Workspace offering basic survey functionality.',
  pro_text = 'Completely free with Google Workspace integration. Universal access and easy team collaboration.',
  con_text = 'Limited advanced features and branding options. Basic analytics and survey logic capabilities.'
WHERE name = 'Google Forms';

-- Tally
UPDATE tools SET 
  description = 'Modern survey builder with unlimited free responses and clean minimalist design aesthetic.',
  pro_text = 'Unlimited free surveys with modern design. Straightforward survey creation with clean interface.',
  con_text = 'Limited customization options and basic analytics. Fewer features compared to full-featured platforms.'
WHERE name = 'Tally';

-- UXCam
UPDATE tools SET 
  description = 'Mobile app analytics with gesture-level tracking and session replay for native applications.',
  pro_text = 'Specialized mobile analytics with gesture tracking. Strong free tier and automatic crash detection.',
  con_text = 'Limited to mobile apps only requiring SDK integration. Fewer web features and smaller community.'
WHERE name = 'UXCam';

-- UXTweak
UPDATE tools SET 
  description = 'Comprehensive UX testing suite including usability testing and information architecture tools.',
  pro_text = 'Broad suite of UX testing tools at competitive pricing. Comprehensive features for all testing types.',
  con_text = 'Newer platform with smaller user community. Some advanced features may be limited or developing.'
WHERE name = 'UXTweak';

-- UserZoom
UPDATE tools SET 
  description = 'Enterprise UX research platform combining quantitative analytics with qualitative feedback tools.',
  pro_text = 'Enterprise-grade research platform with comprehensive features. Deep quantitative and qualitative analysis.',
  con_text = 'Very expensive enterprise-focused platform. Complex setup requiring significant learning curve.'
WHERE name = 'UserZoom';

-- Sisense
UPDATE tools SET 
  description = 'Flexible BI platform designed for embedding analytics directly into custom applications.',
  pro_text = 'Strong embedding capabilities for custom applications. Flexible platform for white-label analytics solutions.',
  con_text = 'Expensive with significant implementation effort required. Learning curve for complex embedded features.'
WHERE name = 'Sisense';

-- Userback
UPDATE tools SET 
  description = 'Visual feedback platform capturing annotated screenshots and detailed reports from web applications.',
  pro_text = 'Excellent visual feedback with annotation tools. Streamlines developer workflows reducing communication gaps.',
  con_text = 'Primarily focused on visual issues and bugs. Less suitable for strategic or sentiment-based feedback.'
WHERE name = 'Userback';

-- Optimal Workshop
UPDATE tools SET 
  description = 'Information architecture testing platform with specialized tools for navigation and IA research.',
  pro_text = 'Industry standard for IA testing with specialized tools. Expert-level navigation and structure analysis.',
  con_text = 'Specialized for IA testing, not general usability. Can be expensive for full feature access.'
WHERE name = 'Optimal Workshop';

-- Canny
UPDATE tools SET 
  description = 'Feature request management platform with public voting boards and roadmap transparency.',
  pro_text = 'Excellent for feature request management and roadmap transparency. Strong community-building features.',
  con_text = 'Limited to feature requests and voting systems. Not suitable for broader user experience feedback.'
WHERE name = 'Canny';

-- Datadog
UPDATE tools SET 
  description = 'Full-stack observability platform with session replay integrated into performance monitoring.',
  pro_text = 'Comprehensive monitoring ecosystem with performance correlation. Excellent for DevOps teams and alerting.',
  con_text = 'Very expensive for small teams with complex setup. Overkill for simple session replay needs.'
WHERE name = 'Datadog';

-- Qlik Sense
UPDATE tools SET 
  description = 'Associative analytics engine allowing users to explore data relationships from multiple angles.',
  pro_text = 'Unique associative engine for data exploration. Powerful self-service analytics with relationship discovery.',
  con_text = 'Learning curve for associative model understanding. Can be expensive for large enterprise deployments.'
WHERE name = 'Qlik Sense';

-- Redash
UPDATE tools SET 
  description = 'Open-source data visualization tool for querying multiple data sources and creating dashboards.',
  pro_text = 'Open-source with support for multiple data sources. Good for technical teams with SQL knowledge.',
  con_text = 'Requires technical knowledge for setup and queries. Limited advanced visualization options available.'
WHERE name = 'Redash';

-- Convert
UPDATE tools SET 
  description = 'Privacy-focused A/B testing platform with GDPR compliance and extensive integration options.',
  pro_text = 'Strong privacy and GDPR compliance features. Fast testing tool with extensive third-party integrations.',
  con_text = 'Less popular than major competitors with smaller community. Fewer resources and case studies.'
WHERE name = 'Convert';

-- Crazy Egg
UPDATE tools SET 
  description = 'Simple heatmap tool with basic A/B testing functionality and easy setup process.',
  pro_text = 'Simple affordable heatmap tool with easy setup. User-friendly interface and basic testing capabilities.',
  con_text = 'Limited advanced testing capabilities compared to dedicated platforms. Basic analytics and reporting.'
WHERE name = 'Crazy Egg';

-- Jotform
UPDATE tools SET 
  description = 'Versatile form builder with extensive template library and advanced automation capabilities.',
  pro_text = 'Huge template library with advanced features like conditional logic. PDF generation and payment integration.',
  con_text = 'Can become expensive with advanced features enabled. Interface can be overwhelming for simple needs.'
WHERE name = 'Jotform';

-- Contentsquare
UPDATE tools SET 
  description = 'Enterprise behavioral analytics platform analyzing user interactions at aggregate scale.',
  pro_text = 'Enterprise platform for large-scale behavioral insights. Strong aggregate analysis and zone-based analytics.',
  con_text = 'Very expensive and complex for smaller organizations. Requires significant implementation effort and expertise.'
WHERE name = 'Contentsquare';

-- Zoho
UPDATE tools SET 
  description = 'Comprehensive business software suite with integrated CRM, analytics, and 45+ applications.',
  pro_text = 'Complete business ecosystem with seamless integration. Affordable pricing across entire suite for SMBs.',
  con_text = 'Individual applications lack depth compared to specialists. Complex to manage across multiple products.'
WHERE name = 'Zoho';

-- UsabilityHub
UPDATE tools SET 
  description = 'Fast unmoderated testing platform for preference tests and first-click analysis.',
  pro_text = 'Fastest tool for simple preference and first-click tests. Quick and affordable for basic testing needs.',
  con_text = 'Limited to simple preference tests only. No moderated testing or detailed user journey analysis.'
WHERE name = 'UsabilityHub';

-- Sprig
UPDATE tools SET 
  description = 'In-product micro-survey platform with behavioral triggers and video question capabilities.',
  pro_text = 'Contextual micro-surveys triggered by user actions. Great for in-the-moment feedback with video questions.',
  con_text = 'Expensive and primarily focused on in-product surveys. Limited for general survey and feedback needs.'
WHERE name = 'Sprig';

-- SurveyMonkey
UPDATE tools SET 
  description = 'Market-leading survey platform with extensive template library and distribution capabilities.',
  pro_text = 'Market-leading survey tool with large template library. Easy sharing and comprehensive distribution options.',
  con_text = 'Advanced features require high-tier plans. Less focused on in-product and contextual feedback.'
WHERE name = 'SurveyMonkey';

-- Quantum Metric
UPDATE tools SET 
  description = 'AI-powered session replay platform that automatically identifies and quantifies user friction.',
  pro_text = 'Advanced AI automatically surfaces user friction points. Quantifies problems and prioritizes fixes.',
  con_text = 'Very expensive and complex for smaller organizations. Requires significant technical implementation effort.'
WHERE name = 'Quantum Metric';

-- SAP Analytics Cloud
UPDATE tools SET 
  description = 'Enterprise analytics platform combining BI, augmented analytics, and planning in cloud solution.',
  pro_text = 'Comprehensive enterprise solution with AI-powered insights. Strong SAP ecosystem integration and planning.',
  con_text = 'Very expensive with steep learning curve. Complex implementation requiring specialized expertise.'
WHERE name = 'SAP Analytics Cloud';

-- Kameleoon
UPDATE tools SET 
  description = 'Fast A/B testing platform with strong personalization features and AI-powered optimization.',
  pro_text = 'Fast reliable platform with strong personalization and AI features. Excellent performance and targeting.',
  con_text = 'Can be expensive for large implementations. Less market share than established industry leaders.'
WHERE name = 'Kameleoon';

-- Google Analytics 4
UPDATE tools SET 
  description = 'Free universal analytics platform with deep Google advertising integration and machine learning.',
  pro_text = 'Free with massive feature set and Google advertising integration. Widespread adoption and documentation.',
  con_text = 'Complex interface with privacy concerns. Requires technical knowledge for advanced feature utilization.'
WHERE name = 'Google Analytics 4';

-- Verification query to check updates
SELECT name, description, pro_text, con_text 
FROM tools 
WHERE name IN (
  'Pendo', 'Instabug', 'Mixpanel', 'Fillout', 'AB Tasty',
  'Delighted', 'Google Forms', 'Tally', 'UXCam', 'UXTweak',
  'UserZoom', 'Sisense', 'Userback', 'Optimal Workshop', 'Canny',
  'Datadog', 'Qlik Sense', 'Redash', 'Convert', 'Crazy Egg',
  'Jotform', 'Contentsquare', 'Zoho', 'UsabilityHub', 'Sprig',
  'SurveyMonkey', 'Quantum Metric', 'SAP Analytics Cloud', 'Kameleoon', 'Google Analytics 4'
)
ORDER BY name;
