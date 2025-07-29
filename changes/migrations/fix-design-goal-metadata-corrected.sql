-- This script corrects the 'design_goal' metadata for all metrics
-- based on refined definitions for Design Objectives

-- Step 1: Clear all existing 'design_goal' metadata to ensure a clean slate
UPDATE metrics SET metadata = metadata - 'design_goal';

-- Step 2: Assign 'design_goal' metadata based on corrected categories

-- DISCOVERABILITY: How users find features and information (7 metrics)
UPDATE metrics SET metadata = jsonb_set(metadata, '{design_goal}', '["discoverability"]')
WHERE slug IN (
  'time-to-first-action',
  'feature-adoption-rate',
  'feature-discovery-rate',
  'completion-rate-onboarding',
  'success-rate-search',
  'success-rate-first-click',
  'wcag-level'
);

-- DESIRABILITY: The product's appeal and user trust (9 metrics)
UPDATE metrics SET metadata = jsonb_set(metadata, '{design_goal}', '["desirability"]')
WHERE slug IN (
  'aesthetic-appeal',
  'brand-perception',
  'first-impression',
  'trust',
  'net-promoter-score',
  'customer-satisfaction-score',
  'user-satisfaction',
  'system-usability-scale',
  'usability-metric-for-user-experience'
);

-- USABILITY: The ease and efficiency of the user interface (19 metrics + 4 shared)
UPDATE metrics SET metadata = jsonb_set(metadata, '{design_goal}', '["usability"]')
WHERE slug IN (
  'time-to-load',
  'time-to-onboard',
  'time-to-first-success',
  'time-on-task',
  'confusion-rate',
  'error-rate',
  'error-recovery-rate',
  'success-rate-task',
  'success-rate-first-click',
  'confidence',
  'customer-effort-score',
  'perceived-task-difficulty',
  'accessibility-compliance-score',
  'heuristic-evaluation-score',
  'learnability',
  'navigation-efficiency-score',
  'path-efficiency-score',
  'single-usability-metric',
  'workflow-efficiency-score'
);

-- ENGAGEMENT: The depth and frequency of user interaction (11 metrics + 4 shared)
UPDATE metrics SET metadata = jsonb_set(metadata, '{design_goal}', '["engagement"]')
WHERE slug IN (
  'time-to-value',
  'time-on-page',
  'time-per-session',
  'click-through-rate',
  'feature-usage',
  'interaction-depth',
  'user-engagement-score',
  'net-promoter-score',
  'active-user-rate',
  'return-visit-rate',
  'retention-rate'
);

-- Step 3: Handle multi-category metrics (metrics that belong to multiple design goals)

-- Time to First Action: Both Discoverability and Usability
UPDATE metrics
SET metadata = jsonb_set(metadata, '{design_goal}', '["discoverability", "usability"]')
WHERE slug = 'time-to-first-action';

-- Success Rate - First Click: Both Discoverability and Usability  
UPDATE metrics
SET metadata = jsonb_set(metadata, '{design_goal}', '["discoverability", "usability"]')
WHERE slug = 'success-rate-first-click';

-- Net Promoter Score (NPS): Both Desirability and Engagement
UPDATE metrics
SET metadata = jsonb_set(metadata, '{design_goal}', '["desirability", "engagement"]')
WHERE slug = 'net-promoter-score';

-- Time on Page: Both Usability and Engagement
UPDATE metrics
SET metadata = jsonb_set(metadata, '{design_goal}', '["usability", "engagement"]')
WHERE slug = 'time-on-page';

-- WCAG Level: Both Discoverability and Usability
UPDATE metrics
SET metadata = jsonb_set(metadata, '{design_goal}', '["discoverability", "usability"]')
WHERE slug = 'wcag-level';

-- Sessions: Both Usability and Engagement
UPDATE metrics
SET metadata = jsonb_set(metadata, '{design_goal}', '["usability", "engagement"]')
WHERE slug = 'sessions';

-- Users: Both Usability and Engagement
UPDATE metrics
SET metadata = jsonb_set(metadata, '{design_goal}', '["usability", "engagement"]')
WHERE slug = 'users';

-- Clicks: Both Usability and Engagement
UPDATE metrics
SET metadata = jsonb_set(metadata, '{design_goal}', '["usability", "engagement"]')
WHERE slug = 'clicks';

-- Page Views: Both Usability and Engagement
UPDATE metrics
SET metadata = jsonb_set(metadata, '{design_goal}', '["usability", "engagement"]')
WHERE slug = 'page-views';
