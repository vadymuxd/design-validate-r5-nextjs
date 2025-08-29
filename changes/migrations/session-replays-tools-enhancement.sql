-- Session Replays Tools Enhancement Migration
-- Created: 2025-08-29
-- Purpose: Enhance Session Replays tools with new tools, updated descriptions, pros/cons, and scores
-- Method ID: 5 (Session Replays)

-- ============================================================================
-- STEP 1: Insert new Session Replays tools into tools table
-- ============================================================================

INSERT INTO tools (name, description, website_url, logo_url, pro_text, con_text) VALUES
('UXCam', 'Mobile app analytics platform providing session replays, heatmaps, and user journey insights for native mobile applications.', 'https://uxcam.com/', '/tools-logos/uxcam.png', 'Specialized mobile app analytics with gesture-level tracking, strong free tier for startups, automatic crash detection, and detailed user journey mapping.', 'Limited to mobile apps only, requires SDK integration effort, fewer web features, and smaller community compared to web-focused tools.'),
('Datadog', 'Full-stack observability platform offering session replays alongside application performance monitoring and infrastructure analytics.', 'https://www.datadoghq.com/', '/tools-logos/datadog.png', 'Comprehensive monitoring ecosystem, powerful alerting and integrations, excellent for DevOps teams, and correlates user sessions with backend performance.', 'Very expensive for small teams, complex setup and learning curve, overkill for simple session replay needs, and primarily focused on technical monitoring.'),
('Sentry', 'Error tracking platform with session replay capabilities focused on debugging and performance monitoring for developers.', 'https://sentry.io/', '/tools-logos/sentry.png', 'Excellent error correlation with replays, developer-friendly interface, strong open-source foundation, and good performance monitoring integration.', 'Limited user experience focus, fewer behavioral analytics features, requires technical setup, and not designed for product management use cases.'),
('Lucky Orange', 'Website optimization tool providing real-time session replays, dynamic heatmaps, and visitor chat functionality.', 'https://www.luckyorange.com/', '/tools-logos/lucky-orange.png', 'Real-time session viewing, integrated live chat support, simple setup process, and affordable pricing for small businesses.', 'Basic analytics compared to enterprise tools, limited mobile app support, fewer advanced filtering options, and smaller feature set for large organizations.'),
('Dynatrace', 'Enterprise application intelligence platform with session replay capabilities integrated into full-stack observability.', 'https://www.dynatrace.com/', '/tools-logos/dynatrace.png', 'Enterprise-grade monitoring with AI-powered insights, excellent performance correlation, comprehensive user journey tracking, and strong security features.', 'Very expensive enterprise pricing, complex implementation requirements, steep learning curve, and overkill for teams needing only session replay functionality.')
ON CONFLICT (name) DO UPDATE SET
    description = EXCLUDED.description,
    website_url = EXCLUDED.website_url,
    logo_url = EXCLUDED.logo_url,
    pro_text = EXCLUDED.pro_text,
    con_text = EXCLUDED.con_text;

-- ============================================================================
-- STEP 2: Update tools_leaderboard for all Session Replays tools with new scores
-- ============================================================================

-- Insert or update leaderboard entries for all Session Replays tools
INSERT INTO tools_leaderboard (tool_id, method_id, initial_upvotes, initial_downvotes, current_upvotes, current_downvotes)
SELECT t.id, 5,
  CASE t.name
    WHEN 'FullStory' THEN 12
    WHEN 'Hotjar' THEN 9
    WHEN 'Microsoft Clarity' THEN 8
    WHEN 'LogRocket' THEN 6
    WHEN 'Amplitude' THEN 6
    WHEN 'Glassbox' THEN 4
    WHEN 'Pendo' THEN 3
    WHEN 'UXCam' THEN 4
    WHEN 'Mouseflow' THEN 5
    WHEN 'MouseFlow' THEN 5  -- Handle both naming variations
    WHEN 'Smartlook' THEN 4
    WHEN 'Plerdy' THEN 3
    WHEN 'Mixpanel' THEN 2
    WHEN 'Datadog' THEN 2
    WHEN 'Zoho' THEN 3
    WHEN 'Quantum Metric' THEN 2
    WHEN 'Sentry' THEN 3
    WHEN 'Contentsquare' THEN 2
    WHEN 'Lucky Orange' THEN 3
    WHEN 'PostHog' THEN 2
    WHEN 'Dynatrace' THEN 3
    WHEN 'Statsig' THEN 2
    WHEN 'UserPilot' THEN 2
    WHEN 'Heap' THEN 2
    WHEN 'UXTweak' THEN 2
    WHEN 'Crazy Egg' THEN 2
    WHEN 'CrazyEgg' THEN 2  -- Handle both naming variations
    WHEN 'VWO' THEN 2
    ELSE 0
  END as initial_upvotes,
  0 as initial_downvotes,  -- Set to 0 as per requirement
  0 as current_upvotes,    -- Start with 0 for new site votes
  0 as current_downvotes   -- Start with 0 for new site votes
FROM tools t
WHERE t.name IN ('FullStory', 'Hotjar', 'Microsoft Clarity', 'LogRocket', 'Amplitude', 'Glassbox', 'Pendo', 'UXCam', 'Mouseflow', 'MouseFlow', 'Smartlook', 'Plerdy', 'Mixpanel', 'Datadog', 'Zoho', 'Quantum Metric', 'Sentry', 'Contentsquare', 'Lucky Orange', 'PostHog', 'Dynatrace', 'Statsig', 'UserPilot', 'Heap', 'UXTweak', 'Crazy Egg', 'CrazyEgg', 'VWO')
ON CONFLICT (tool_id, method_id) DO UPDATE SET
    initial_upvotes = EXCLUDED.initial_upvotes,
    initial_downvotes = EXCLUDED.initial_downvotes;

-- ============================================================================
-- STEP 3: Insert/Update tool_pros_and_cons for Session Replays method
-- ============================================================================

INSERT INTO tool_pros_and_cons (tool_id, method_id, feature_description, pro_text, con_text)
SELECT t.id, 5,
  CASE t.name
    WHEN 'FullStory' THEN 'Pixel-perfect replays of user sessions with AI to detect rage clicks, dead zones, and friction points, while masking sensitive data for privacy.'
    WHEN 'Hotjar' THEN 'Lightweight tool capturing replays, heatmaps, scroll depth, and surveys in a single script, providing teams fast visibility into user behaviors.'
    WHEN 'Microsoft Clarity' THEN 'Unlimited free replays with heatmaps highlight clicks, scrolls, and rage actions, giving straightforward visualization of user interactions.'
    WHEN 'LogRocket' THEN 'Captures detailed session replays combined with console logs, network traces, and Redux states, ideal for debugging technical user issues.'
    WHEN 'Amplitude' THEN 'Blends session replays into product analytics, connecting behavioral data with actual playback to support experimentation and feature analysis.'
    WHEN 'Glassbox' THEN 'Enterprise solution that records web and mobile replays at scale, surfacing customer journey pain points to improve engagement.'
    WHEN 'Pendo' THEN 'Pairs replays with product analytics, in-app guides, and surveys, letting teams filter by behavior signals such as feature engagement.'
    WHEN 'UXCam' THEN 'Mobile-first replay tool recording gestures, taps, and swipes, along with heatmaps and analytics tailored for app UX studies.'
    WHEN 'Mouseflow' THEN 'Session replays scored automatically with friction detection highlight pain points; includes heatmaps, funnels, and advanced filters.'
    WHEN 'MouseFlow' THEN 'Session replays scored automatically with friction detection highlight pain points; includes heatmaps, funnels, and advanced filters.'
    WHEN 'Smartlook' THEN 'Provides cross-platform replays, heatmaps, and event tracking for both web and mobile, connecting visual insights to analytics.'
    WHEN 'Plerdy' THEN 'Replay sessions tied to conversion features such as click tracking, event analysis, and SEO-focused behavior monitoring.'
    WHEN 'Mixpanel' THEN 'Adds DOM-based replays within its analytics stack, letting teams visualize how specific events connect to observed behavior.'
    WHEN 'Datadog' THEN 'Integrates replays into APM to show user interactions tied to errors, heatmaps, and network performance across apps.'
    WHEN 'Zoho' THEN 'Session replay capabilities integrated within broader business suite, providing basic user behavior insights with CRM and analytics tools.'
    WHEN 'Quantum Metric' THEN 'Session replays linked with funnel analytics, real-time monitoring, and friction detection to optimize digital conversions.'
    WHEN 'Sentry' THEN 'Replay feature within error monitoring shows DOM, network, and console state at the precise moment a crash occurs.'
    WHEN 'Contentsquare' THEN 'Enterprise-level replays paired with journey analytics map user flows across web and mobile experiences for optimization.'
    WHEN 'Lucky Orange' THEN 'Offers live replays, dynamic heatmaps, and visitor chat to let teams watch user behavior in real time as issues occur.'
    WHEN 'PostHog' THEN 'Open-source analytics platform offering session replay with generous free tier and self-hosting flexibility.'
    WHEN 'Dynatrace' THEN 'Combines session replays with full-stack observability, tracing user journeys with AI-driven root cause analysis.'
    WHEN 'Statsig' THEN 'Provides replays tied to experimentation, feature flags, and data pipelines with warehouse-level data control.'
    WHEN 'UserPilot' THEN 'Session replays integrated with product analytics, in-app guidance, and surveys to support UX feedback cycles.'
    WHEN 'Heap' THEN 'Captures every interaction automatically and pairs with replays for analyzing customer journeys without tagging.'
    WHEN 'UXTweak' THEN 'Offers replay alongside usability testing, surveys, and tree tests, supporting full-cycle UX research.'
    WHEN 'Crazy Egg' THEN 'Provides replays with scroll maps, click maps, and visual reports to help marketers understand engagement.'
    WHEN 'CrazyEgg' THEN 'Provides replays with scroll maps, click maps, and visual reports to help marketers understand engagement.'
    WHEN 'VWO' THEN 'Replay integrated into its optimization platform with A/B testing, funnels, and heatmaps for CRO teams.'
    ELSE 'Advanced session replay capabilities for comprehensive user behavior analysis and product optimization.'
  END as feature_description,
  CASE t.name
    WHEN 'FullStory' THEN 'AI-powered detection of frustration signals, anomaly spotting, and strong privacy controls make FullStory ideal for surfacing hidden UX issues.'
    WHEN 'Hotjar' THEN 'All-in-one with heatmaps, surveys, and usability insights; simple setup allows small teams to test ideas quickly without heavy technical support.'
    WHEN 'Microsoft Clarity' THEN 'Totally free with no caps on recordings; delivers clear heatmaps and session playback that make it accessible for startups and small budgets.'
    WHEN 'LogRocket' THEN 'Links front-end replays with error monitoring, logs, and performance data, enabling developers to quickly reproduce and fix hidden issues.'
    WHEN 'Amplitude' THEN 'Powerful when tied to product metrics—lets teams watch replays directly linked to user adoption and experimentation results.'
    WHEN 'Glassbox' THEN 'Provides journey-wide analytics with replays across platforms, helping enterprises detect issues impacting conversion and loyalty.'
    WHEN 'Pendo' THEN 'Combines replays with feedback collection and onboarding flows, helping product managers iterate quickly with customer insights.'
    WHEN 'UXCam' THEN 'Strong mobile analytics with gesture tracking and heatmaps; even free plan offers sufficient recordings for testing mobile products.'
    WHEN 'Mouseflow' THEN 'Unique friction scoring saves researchers time by surfacing problematic sessions without manually watching hundreds of recordings.'
    WHEN 'MouseFlow' THEN 'Unique friction scoring saves researchers time by surfacing problematic sessions without manually watching hundreds of recordings.'
    WHEN 'Smartlook' THEN 'Affordable and simple solution with unified replays, funnels, and heatmaps across platforms to capture consistent UX data.'
    WHEN 'Plerdy' THEN 'Replay combined with CRO and SEO insights allows small businesses to optimize performance and engagement effectively.'
    WHEN 'Mixpanel' THEN 'Deep product analytics combined with replays lets teams validate feature adoption and understand UX in measurable context.'
    WHEN 'Datadog' THEN 'Combines replays with monitoring, logging, and error tracking, giving DevOps and SRE teams full visibility into UX failures.'
    WHEN 'Zoho' THEN 'Integrated business ecosystem with affordable pricing, seamless data flow between replay insights and CRM/business operations.'
    WHEN 'Quantum Metric' THEN 'Real-time detection of friction and funnel drop-offs makes Quantum Metric powerful for conversion-focused enterprises.'
    WHEN 'Sentry' THEN 'Perfectly suited for developers, allowing direct replay of sessions tied to errors and full debugging context.'
    WHEN 'Contentsquare' THEN 'Rich analytics with replay gives global enterprises strong tools for uncovering revenue-impacting UX issues at scale.'
    WHEN 'Lucky Orange' THEN 'Real-time view and integrated chat allow immediate troubleshooting and direct engagement with frustrated visitors.'
    WHEN 'PostHog' THEN 'Free 5k monthly recordings and self-hosting make it ideal for privacy-sensitive teams that want control.'
    WHEN 'Dynatrace' THEN 'Great for enterprises linking backend monitoring with UX replays, identifying performance bottlenecks quickly.'
    WHEN 'Statsig' THEN 'Replay fully integrated into experimentation framework lets teams validate features directly against UX evidence.'
    WHEN 'UserPilot' THEN 'Reduces tech stack complexity by combining replays, onboarding, analytics, and surveys into one cost-effective suite.'
    WHEN 'Heap' THEN 'Event auto-capture makes setup effortless; ties seamlessly into funnels with replay context to show why.'
    WHEN 'UXTweak' THEN 'Great for research workflows—replay integrated with task-based usability and survey insights in one tool.'
    WHEN 'Crazy Egg' THEN 'Easy setup with strong heatmaps; combining visual reports with replays helps surface high-level UX issues fast.'
    WHEN 'CrazyEgg' THEN 'Easy setup with strong heatmaps; combining visual reports with replays helps surface high-level UX issues fast.'
    WHEN 'VWO' THEN 'Pairs experimentation with replay, making it easier to validate test outcomes and optimize conversions quickly.'
    ELSE 'Powerful session replay capabilities with good integration options and user-friendly interface.'
  END as pro_text,
  CASE t.name
    WHEN 'FullStory' THEN 'Steep pricing tiers for enterprise usage and occasional AI misclassifications force researchers to review recordings manually for subtle behavior.'
    WHEN 'Hotjar' THEN 'Daily session limit on free tier and need for paid upgrades for advanced filters or large-scale use makes scaling difficult for big projects.'
    WHEN 'Microsoft Clarity' THEN 'Lacks advanced AI features, granular filters, and detailed analytics dashboards, limiting researchers who need depth beyond basic recordings.'
    WHEN 'LogRocket' THEN 'Complex interface and steep learning curve with pricing that rises quickly; best suited for dev teams, not simple UX replay requirements.'
    WHEN 'Amplitude' THEN 'No free replay tier and implementation complexity make it difficult for smaller teams seeking quick, low-cost replay-focused insights.'
    WHEN 'Glassbox' THEN 'High-cost enterprise pricing with limited transparency and scarce third-party reviews make adoption harder for smaller research teams.'
    WHEN 'Pendo' THEN 'Replay is less advanced than dedicated tools, and limited developer debugging features may frustrate technical or engineering teams.'
    WHEN 'UXCam' THEN 'Primarily focused on apps; requires technical integration effort and provides little value for teams prioritizing web over mobile.'
    WHEN 'Mouseflow' THEN 'Free plans have limits, and friction scoring may misinterpret complex behaviors, forcing manual replay checks for nuanced issues.'
    WHEN 'MouseFlow' THEN 'Free plans have limits, and friction scoring may misinterpret complex behaviors, forcing manual replay checks for nuanced issues.'
    WHEN 'Smartlook' THEN 'Less established compared to leaders; lacks advanced automation and filtering, limiting scalability for large enterprises.'
    WHEN 'Plerdy' THEN 'Less sophisticated analytics and limited market adoption mean weaker community support and fewer enterprise-level case studies.'
    WHEN 'Mixpanel' THEN 'DOM-based replays lack fidelity compared to video-style playback, and session replay is secondary in the overall Mixpanel suite.'
    WHEN 'Datadog' THEN 'Focused on technical monitoring rather than UX; costly for teams needing only replays without broader observability tools.'
    WHEN 'Zoho' THEN 'Session replay functionality is basic compared to specialized tools, limited advanced analytics, and requires adoption of broader Zoho ecosystem.'
    WHEN 'Quantum Metric' THEN 'High enterprise cost and limited public adoption data make it harder to evaluate effectiveness for smaller organizations.'
    WHEN 'Sentry' THEN 'Not designed for UX researchers; lacks heatmaps, funnels, and behavioral analytics that other replay-focused tools provide.'
    WHEN 'Contentsquare' THEN 'Pricing and access tailored to large clients; limited transparency and smaller community reduce accessibility for mid-tier teams.'
    WHEN 'Lucky Orange' THEN 'Better suited for small websites; lacks deep analytics and automation, limiting insights for large-scale enterprise usage.'
    WHEN 'PostHog' THEN 'Requires technical setup and maintenance; community support less comprehensive than commercial vendor support.'
    WHEN 'Dynatrace' THEN 'Enterprise-focused with high complexity and cost; unnecessary overhead for teams focused only on replay analytics.'
    WHEN 'Statsig' THEN 'Complex for replay-only use cases; designed for data-heavy experimentation, making simple adoption difficult.'
    WHEN 'UserPilot' THEN 'Replay capabilities are basic compared to leaders; web-only support limits usability for teams needing mobile insights.'
    WHEN 'Heap' THEN 'Replay visualization not as robust as competitors; advanced analysis requires expensive higher-tier plans.'
    WHEN 'UXTweak' THEN 'Replay is less advanced; lacks AI prioritization and automation compared to specialized replay platforms.'
    WHEN 'Crazy Egg' THEN 'Limited segmentation and filtering; not suited for complex products needing deeper technical session analysis.'
    WHEN 'CrazyEgg' THEN 'Limited segmentation and filtering; not suited for complex products needing deeper technical session analysis.'
    WHEN 'VWO' THEN 'Replay feature is secondary; higher price and complexity make it overkill for teams seeking lightweight replay.'
    ELSE 'May require technical setup, learning curve, and can be expensive for extensive use cases.'
  END as con_text
FROM tools t
WHERE t.name IN ('FullStory', 'Hotjar', 'Microsoft Clarity', 'LogRocket', 'Amplitude', 'Glassbox', 'Pendo', 'UXCam', 'Mouseflow', 'MouseFlow', 'Smartlook', 'Plerdy', 'Mixpanel', 'Datadog', 'Zoho', 'Quantum Metric', 'Sentry', 'Contentsquare', 'Lucky Orange', 'PostHog', 'Dynatrace', 'Statsig', 'UserPilot', 'Heap', 'UXTweak', 'Crazy Egg', 'CrazyEgg', 'VWO')
ON CONFLICT (tool_id, method_id) DO UPDATE SET
    feature_description = EXCLUDED.feature_description,
    pro_text = EXCLUDED.pro_text,
    con_text = EXCLUDED.con_text;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check that new tools were added to tools table
SELECT 
    name,
    LEFT(description, 60) || '...' as description_preview,
    website_url,
    LEFT(pro_text, 50) || '...' as pro_preview,
    LEFT(con_text, 50) || '...' as con_preview
FROM tools t
WHERE t.name IN ('UXCam', 'Datadog', 'Sentry', 'Lucky Orange', 'Dynatrace');

-- Check leaderboard entries for Session Replays method
SELECT 
    t.name,
    tl.method_id,
    tl.initial_upvotes,
    tl.initial_downvotes,
    tl.current_upvotes,
    tl.current_downvotes,
    (tl.initial_upvotes + tl.current_upvotes - tl.initial_downvotes - tl.current_downvotes) as net_score
FROM tools t
JOIN tools_leaderboard tl ON t.id = tl.tool_id AND tl.method_id = 5
ORDER BY (tl.initial_upvotes + tl.current_upvotes - tl.initial_downvotes - tl.current_downvotes) DESC;

-- Check pros/cons entries for Session Replays method
SELECT 
    t.name,
    LEFT(tpc.feature_description, 80) || '...' as feature_desc_preview,
    LEFT(tpc.pro_text, 60) || '...' as pro_preview,
    LEFT(tpc.con_text, 60) || '...' as con_preview
FROM tools t
JOIN tool_pros_and_cons tpc ON t.id = tpc.tool_id AND tpc.method_id = 5
ORDER BY t.name;

-- Summary statistics
SELECT 
    'Session Replays Tools' as metric,
    COUNT(*) as total_tools
FROM tools t
JOIN tools_leaderboard tl ON t.id = tl.tool_id AND tl.method_id = 5;
