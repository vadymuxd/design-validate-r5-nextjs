-- Backfill Event Tracking tools into the tools table
-- Run this script to add the 10 Event Tracking tools to your database

-- Insert Event Tracking tools with initial and current vote counts
INSERT INTO tools (name, pill, initial_upvotes, initial_downvotes, current_upvotes_total, current_downvotes_total) 
VALUES 
  ('Mixpanel', 'event tracking', 320, 80, 320, 80),
  ('Heap', 'event tracking', 250, 70, 250, 70),
  ('FullStory', 'event tracking', 280, 70, 280, 70),
  ('Pendo', 'event tracking', 190, 70, 190, 70),
  ('Amplitude', 'event tracking', 310, 90, 310, 90),
  ('Hotjar', 'event tracking', 310, 60, 310, 60),
  ('PostHog', 'event tracking', 290, 30, 290, 30),
  ('LogRocket', 'event tracking', 180, 50, 180, 50),
  ('Google Analytics 4', 'event tracking', 280, 150, 280, 150),
  ('Indicative', 'event tracking', 130, 30, 130, 30);

-- Verify the insertion
SELECT 
  id,
  name, 
  pill, 
  initial_upvotes,
  initial_downvotes,
  current_upvotes_total, 
  current_downvotes_total,
  (current_upvotes_total - current_downvotes_total) as net_score
FROM tools 
WHERE pill = 'event tracking' 
ORDER BY (current_upvotes_total - current_downvotes_total) DESC; 