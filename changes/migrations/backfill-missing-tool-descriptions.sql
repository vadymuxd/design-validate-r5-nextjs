-- Backfill missing tool descriptions
-- Generated on: 2025-01-20

-- Update Useberry description
UPDATE tools 
SET description = 'Codeless prototype testing platform with seamless design tool integrations for rapid design validation and user journey analysis' 
WHERE name = 'Useberry';

-- Update Loop11 description  
UPDATE tools 
SET description = 'Australian-born usability testing platform specializing in quantitative data collection, AI-powered insights, and comprehensive A/B testing capabilities'
WHERE name = 'Loop11';

-- Update User Interviews description
UPDATE tools 
SET description = 'Participant recruitment marketplace with 2.4M+ user panel and Research Hub CRM for managing usability test participants and incentives'
WHERE name = 'User Interviews';

-- Update Trymata description
UPDATE tools 
SET description = 'Comprehensive user analytics platform combining usability testing, customer journey analysis, and AI-powered insights for product optimization'
WHERE name = 'Trymata';

-- Update PlaybookUX description
UPDATE tools 
SET description = 'Video-first user research platform designed for one-to-one interviews, moderated testing, and collaborative insight analysis'
WHERE name = 'PlaybookUX';

-- Update UX Metrics description
UPDATE tools 
SET description = 'Specialized information architecture validation platform focused exclusively on card sorting and tree testing for early-stage website design'
WHERE name = 'UX Metrics';

-- ==================================================
-- VERIFICATION QUERIES
-- ==================================================

-- Verify all tools now have descriptions
-- SELECT name, description FROM tools WHERE description IS NULL OR description = '';

-- Count tools with and without descriptions
-- SELECT 
--   COUNT(*) as total_tools,
--   SUM(CASE WHEN description IS NOT NULL AND description != '' THEN 1 ELSE 0 END) as with_descriptions,
--   SUM(CASE WHEN description IS NULL OR description = '' THEN 1 ELSE 0 END) as missing_descriptions
-- FROM tools;

-- Show the updated tools
-- SELECT name, description 
-- FROM tools 
-- WHERE name IN ('Useberry', 'Loop11', 'User Interviews', 'Trymata', 'PlaybookUX', 'UX Metrics');
