-- Migration: Create cases table and backfill initial data

CREATE TABLE IF NOT EXISTS public.cases (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    release_date DATE, -- ISO format: YYYY-MM-DD
    description TEXT,
    url TEXT,
    picture TEXT,
    metadata JSONB DEFAULT '{}', -- stores method associations and other case metadata
    initial_upvotes INTEGER DEFAULT 0,
    initial_downvotes INTEGER DEFAULT 0,
    current_upvotes INTEGER DEFAULT 0,
    current_downvotes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Backfill data
INSERT INTO public.cases (name, slug, release_date, description, url, picture, metadata, initial_upvotes, initial_downvotes, current_upvotes, current_downvotes)
VALUES
('Netflix Personal Artworks', 'netflix_artworks', '2017-12-01', 'The case study from Netflix''s Tech Blog details how the company addressed the challenge of improving user engagement by personalising content artwork for each user. The study shows use of a machine learning, which tests and selects the most effective images based on a member''s viewing history.', 'https://netflixtechblog.com/artwork-personalization-c589f074ad76', '/images/Cases/netflix_artworks.png', '{"methods": ["ab-testing", "user-data-intelligence"]}', 23, 0, 0, 0),

('Miro Onboarding', 'miro_onboarding', '2023-08-01', 'How Miro scaled its onboarding process through iterative, data-driven improvements. Initially reliant on broad redesigns, the team shifted to continuous micro-experiments, using user segmentation (e.g., Creators vs Joiners), tailored templates, and social prompts to boost engagement.', 'https://www.growthunhinged.com/p/the-evolution-of-miros-user-onboarding', '/images/Cases/miro_onboarding.png', '{"methods": ["ab-testing", "funnels", "usability-testing"]}', 21, 0, 0, 0),

('Google AI Sparkle', 'google_sparkle', '2024-12-01', 'Google researchers explored how users interpret the "AI Sparkle" icon across different contexts. Using large-scale surveys with over 2,000 participants across eight countries, they tested variations of the icon—standalone, combined with other UI elements, and in real interface settings.', 'https://design.google/library/ai-sparkle-icon-research-pozos-schmidt', '/images/Cases/google_sparkle.png', '{"methods": ["surveys"]}', 15, 0, 0, 0),

('Uber Pickup Experience', 'uber_pickup', '2016-11-01', 'Redesign of Uber''s pickup experience to reduce friction between riders and drivers. Through global field studies, usability benchmarking, prototype testing in live markets, and feedback via surveys and interviews.', 'https://simonpan.com/work/uber/?ref=pafolios', '/images/Cases/uber_pickup.png', '{"methods": ["field-studies", "concept-testing"]}', 9, 0, 0, 0),

('N26 Transactions', 'n26_transactions', '2020-12-01', 'Redesign of N26''s transaction screens to improve clarity and trust. Validation included usability testing, card-sorting and user interviews. Insights from user feedback, support tickets, and competitor analysis shaped features like merchant logos, status indicators, geolocation, and clearer decline messages.', 'https://simonpan.com/work/uber/?ref=pafolios', '/images/Cases/n26_transactions.png', '{"methods": ["user-interviews", "card-sorting", "user-data-intelligence"]}', 6, 0, 0, 0),

('Linkedin Home & Sharing', 'linkedin_sharing', '2021-07-01', 'Redesign of LinkedIn''s home and sharing experience to be simpler, more accessible, and inclusive. It tackles usability challenges and strives to better support diverse users by improving interface clarity, accessibility features, and overall ease of use.', 'https://simonpan.com/work/uber/?ref=pafolios', '/images/Cases/linkedin_sharing.png', '{"methods": ["user-interviews", "card-sorting", "user-data-intelligence"]}', 6, 0, 0, 0);

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_cases_slug ON public.cases(slug);

-- Create index on release_date for sorting
CREATE INDEX IF NOT EXISTS idx_cases_release_date ON public.cases(release_date);

-- Create GIN index on metadata for faster JSON queries (method filtering)
CREATE INDEX IF NOT EXISTS idx_cases_metadata_gin ON public.cases USING GIN (metadata);
