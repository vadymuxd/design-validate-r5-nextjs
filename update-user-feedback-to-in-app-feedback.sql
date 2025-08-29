-- Update User Feedback to In-App Feedback
-- This migration updates method_id 9 from generic "User Feedback" to specific "In-App Feedback"
-- to better distinguish from traditional survey methods

-- Update the method name and description
UPDATE methods 
SET 
  name = 'In-App Feedback',
  description = 'Collecting real-time feedback directly within a product interface through embedded widgets, pop-ups, and contextual forms. Unlike email surveys, in-app feedback captures user sentiment at the moment of interaction, providing immediate insights about specific features or experiences. This method is ideal for gathering targeted feedback about particular workflows, new features, or identifying pain points during actual product usage.'
WHERE id = 9 AND name = 'User Feedback';

-- Verify the update
SELECT id, name, slug, description 
FROM methods 
WHERE id = 9;
