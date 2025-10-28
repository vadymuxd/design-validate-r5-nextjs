-- Content Analytics Tables
-- SQL script to create tables for tracking component interactions and content analytics

-- 1. Events table - to track what component was selected and when
CREATE TABLE events (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    url text NOT NULL,
    component text NOT NULL CHECK (component IN ('CollectionCard', 'TitleNavigation', 'TopNav')),
    value text NOT NULL CHECK (value IN ('methods', 'metrics', 'tools', 'frameworks', 'cases'))
);

-- 2. Content Analytics table - to see aggregated view of content interest
CREATE TABLE content_analytics (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    content text NOT NULL UNIQUE CHECK (content IN ('methods', 'metrics', 'tools', 'frameworks', 'cases')),
    initial_score integer NOT NULL DEFAULT 0,
    current_score integer NOT NULL DEFAULT 0
);

-- Initialize content_analytics with default data
INSERT INTO content_analytics (content, initial_score, current_score) VALUES
('methods', 0, 0),
('metrics', 0, 0),
('tools', 0, 0),
('frameworks', 0, 0),
('cases', 0, 0);

-- Add indexes for better query performance
CREATE INDEX idx_events_created_at ON events(created_at);
CREATE INDEX idx_events_component ON events(component);
CREATE INDEX idx_events_value ON events(value);
CREATE INDEX idx_events_url ON events(url);
CREATE INDEX idx_content_analytics_content ON content_analytics(content);

-- Add RLS (Row Level Security) policies if needed
-- ALTER TABLE events ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE content_analytics ENABLE ROW LEVEL SECURITY;

-- Grant permissions (adjust based on your Supabase setup)
-- GRANT ALL ON TABLE events TO anon, authenticated;
-- GRANT ALL ON TABLE content_analytics TO anon, authenticated;