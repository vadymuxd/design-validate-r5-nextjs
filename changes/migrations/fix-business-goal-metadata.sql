-- 1. Correcting 'Satisfaction' Metrics
-- Add 'satisfaction' to CSAT
UPDATE metrics
SET metadata = jsonb_set(metadata, '{business_goal}', metadata->'business_goal' || '["satisfaction"]'::jsonb)
WHERE slug = 'customer-satisfaction-score';

-- Add 'satisfaction' to System Usability Scale (SUS)
UPDATE metrics
SET metadata = jsonb_set(metadata, '{business_goal}', '["satisfaction"]'::jsonb)
WHERE slug = 'system-usability-scale';

-- Add 'satisfaction' to Usability Metric for User Experience (UMUX)
UPDATE metrics
SET metadata = jsonb_set(metadata, '{business_goal}', '["satisfaction"]'::jsonb)
WHERE slug = 'usability-metric-for-user-experience';

-- 2. Cleaning up general metrics from specific categories
-- Remove 'satisfaction' from Sessions
UPDATE metrics
SET metadata = jsonb_set(metadata, '{business_goal}', (SELECT jsonb_agg(elem) FROM jsonb_array_elements_text(metadata->'business_goal') AS elem WHERE elem <> 'satisfaction'))
WHERE slug = 'sessions';

-- Remove 'satisfaction' from Users
UPDATE metrics
SET metadata = jsonb_set(metadata, '{business_goal}', (SELECT jsonb_agg(elem) FROM jsonb_array_elements_text(metadata->'business_goal') AS elem WHERE elem <> 'satisfaction'))
WHERE slug = 'users';

-- Remove 'satisfaction' from Clicks
UPDATE metrics
SET metadata = jsonb_set(metadata, '{business_goal}', (SELECT jsonb_agg(elem) FROM jsonb_array_elements_text(metadata->'business_goal') AS elem WHERE elem <> 'satisfaction'))
WHERE slug = 'clicks';

-- Remove 'satisfaction' from Page Views
UPDATE metrics
SET metadata = jsonb_set(metadata, '{business_goal}', (SELECT jsonb_agg(elem) FROM jsonb_array_elements_text(metadata->'business_goal') AS elem WHERE elem <> 'satisfaction'))
WHERE slug = 'page-views';

-- Remove 'retention' from Time on Page
UPDATE metrics
SET metadata = jsonb_set(metadata, '{business_goal}', (SELECT jsonb_agg(elem) FROM jsonb_array_elements_text(metadata->'business_goal') AS elem WHERE elem <> 'retention'))
WHERE slug = 'time-on-page';

-- Remove 'retention' from Clicks
UPDATE metrics
SET metadata = jsonb_set(metadata, '{business_goal}', (SELECT jsonb_agg(elem) FROM jsonb_array_elements_text(metadata->'business_goal') AS elem WHERE elem <> 'retention'))
WHERE slug = 'clicks';

-- Remove 'retention' from Page Views
UPDATE metrics
SET metadata = jsonb_set(metadata, '{business_goal}', (SELECT jsonb_agg(elem) FROM jsonb_array_elements_text(metadata->'business_goal') AS elem WHERE elem <> 'retention'))
WHERE slug = 'page-views';

-- Remove 'revenue' from Users
UPDATE metrics
SET metadata = jsonb_set(metadata, '{business_goal}', (SELECT jsonb_agg(elem) FROM jsonb_array_elements_text(metadata->'business_goal') AS elem WHERE elem <> 'revenue'))
WHERE slug = 'users';

-- Remove 'revenue' from Sessions
UPDATE metrics
SET metadata = jsonb_set(metadata, '{business_goal}', (SELECT jsonb_agg(elem) FROM jsonb_array_elements_text(metadata->'business_goal') AS elem WHERE elem <> 'revenue'))
WHERE slug = 'sessions';

-- Remove 'referral' from Users
UPDATE metrics
SET metadata = jsonb_set(metadata, '{business_goal}', (SELECT jsonb_agg(elem) FROM jsonb_array_elements_text(metadata->'business_goal') AS elem WHERE elem <> 'referral'))
WHERE slug = 'users';

-- Remove 'referral' from Sessions
UPDATE metrics
SET metadata = jsonb_set(metadata, '{business_goal}', (SELECT jsonb_agg(elem) FROM jsonb_array_elements_text(metadata->'business_goal') AS elem WHERE elem <> 'referral'))
WHERE slug = 'sessions';
