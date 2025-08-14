-- Migration: Add three new case studies
-- Date: 2025-08-14

BEGIN;

-- Insert the three new case studies with improved, less marketing-focused descriptions
INSERT INTO public.cases (
    name, 
    slug, 
    release_date, 
    description, 
    url, 
    picture, 
    metadata, 
    initial_upvotes, 
    initial_downvotes, 
    current_upvotes, 
    current_downvotes,
    created_at,
    updated_at
) VALUES
(
    'Starbucks App Redesign',
    'starbucks_app_redesign',
    '2023-02-01',
    'Redesign of the Starbucks India mobile app addressing usability issues through user research. The study tackled confusing navigation, cluttered UI, and complex signup processes using design thinking methods, user interviews, competitive analysis, and testing to create a more intuitive coffee-focused experience.',
    'https://medium.com/design-bootcamp/ui-ux-case-study-the-starbucks-app-revamp-youve-all-been-waiting-for-f51ebc8c507b',
    '/images/Cases/starbucks_app_redesign.png',
    '{"methods":["user-interviews","usability-testing","surveys","concept-testing"]}',
    18,
    0,
    0,
    0,
    '2025-08-14 12:00:00.000000+00',
    '2025-08-14 12:00:00.000000+00'
),
(
    'Spotify Desktop Foundation',
    'spotify_desktop_foundation',
    '2021-04-01',
    'Platform unification project consolidating Spotify''s desktop and web experiences onto a shared foundation. The team used design systems, accessibility improvements, and testing to reduce duplicated work while supporting new audio formats and maintaining user familiarity across 45+ platforms.',
    'https://medium.com/spotify-design/designing-a-new-foundation-spotify-for-desktop-58305f16ce72',
    '/images/Cases/spotify_desktop_foundation.png',
    '{"methods":["usability-testing","accessibility-testing","ab-testing","user-feedback"]}',
    12,
    0,
    0,
    0,
    '2025-08-14 12:00:00.000000+00',
    '2025-08-14 12:00:00.000000+00'
),
(
    'Gusto Signup Boost',
    'gusto_signup_boost',
    '2023-06-01',
    'Redesign of Gusto''s lead capture process introducing password-free forms and personalized pathways. Through A/B testing, behavioral analysis, and user journey optimization, the project achieved 15% conversion growth and 25% increase in account creations while establishing new MQL metrics.',
    'https://www.jessicagoldmandesign.com/gusto',
    '/images/Cases/gusto_signup_boost.png',
    '{"methods":["ab-testing","funnels","user-data-intelligence","surveys"]}',
    25,
    0,
    0,
    0,
    '2025-08-14 12:00:00.000000+00',
    '2025-08-14 12:00:00.000000+00'
);

-- Verification query to show the new cases
SELECT 
    id,
    name,
    slug,
    release_date,
    LEFT(description, 100) || '...' as description_preview,
    metadata,
    initial_upvotes
FROM cases 
WHERE slug IN ('starbucks_app_redesign', 'spotify_desktop_foundation', 'gusto_signup_boost')
ORDER BY initial_upvotes DESC;

-- Show total count of cases
SELECT COUNT(*) as total_cases FROM cases;

COMMIT;
