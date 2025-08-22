-- Survey Tools Backfill Migration
-- Date: August 22, 2025
-- Purpose: Add 14 Survey tools with sentiment analysis and leaderboard data for method_id = 8 (Surveys)
-- Based on sentiment analysis data provided by user (late 2023 - mid-2025)

-- Begin transaction
BEGIN;

-- Insert 8 new tools into the tools table (6 already exist: Qualtrics, SurveyMonkey, Typeform, Sprig, Delighted, Medallia)
-- Note: Using ON CONFLICT to handle potential duplicates safely
INSERT INTO tools (name, description, logo_url, website_url) VALUES
('Jotform', 'An extremely versatile form builder with a vast template library and powerful integrations. Huge number of templates, advanced features like conditional logic, PDF generation.', '/tools-logos/jotform.png', 'https://www.jotform.com'),
('SurveySparrow', 'Creates engaging, chat-like surveys that improve the user experience. Conversational interface is highly engaging, good for mobile surveys.', '/tools-logos/surveysparrow.png', 'https://www.surveysparrow.com'),
('Fillout', 'A modern form and survey builder that integrates deeply with other tools like Notion & Airtable. Powerful integrations, generous free plan, AI-powered survey generation.', '/tools-logos/fillout.png', 'https://www.fillout.com'),
('Alchemer', 'A flexible and secure platform for collecting feedback for market research and CX. Strong security and compliance features, good for complex research projects.', '/tools-logos/alchemer.png', 'https://www.alchemer.com'),
('BlockSurvey', 'A privacy-focused survey tool that leverages blockchain for end-to-end encryption. Unmatched for anonymous and secure feedback, strong focus on data privacy.', '/tools-logos/blocksurvey.png', 'https://www.blocksurvey.io'),
('SurveyPlanet', 'A user-friendly survey tool with a strong free plan and good visual logic branching. Great free offering, unlimited questions & responses, intuitive branching logic.', '/tools-logos/surveyplanet.png', 'https://www.surveyplanet.com'),
('Zoho Survey', 'A solid survey tool that is part of the broader Zoho business ecosystem. Great value, integrates seamlessly with other Zoho products (CRM, etc.).', '/tools-logos/zoho-survey.png', 'https://www.zoho.com/survey'),
('Google Forms', 'A completely free and simple tool that is part of the Google Workspace ecosystem. Free for everyone, integrates with Google Sheets, very easy to use.', '/tools-logos/google-forms.png', 'https://forms.google.com')
ON CONFLICT (name) DO NOTHING;

-- Insert leaderboard data for all 14 survey tools (6 existing + 8 new)
-- Note: Using initial_upvotes/initial_downvotes for backfill data, current_* for new site votes
INSERT INTO tools_leaderboard (tool_id, method_id, initial_upvotes, initial_downvotes, current_upvotes, current_downvotes)
SELECT t.id, 8, 
  CASE t.name
    WHEN 'Qualtrics' THEN 300
    WHEN 'SurveyMonkey' THEN 290
    WHEN 'Typeform' THEN 250
    WHEN 'Jotform' THEN 260
    WHEN 'SurveySparrow' THEN 220
    WHEN 'Sprig' THEN 230
    WHEN 'Fillout' THEN 190
    WHEN 'Delighted' THEN 200
    WHEN 'Medallia' THEN 230
    WHEN 'Alchemer' THEN 160
    WHEN 'BlockSurvey' THEN 130
    WHEN 'SurveyPlanet' THEN 150
    WHEN 'Zoho Survey' THEN 160
    WHEN 'Google Forms' THEN 200
  END as initial_upvotes,
  CASE t.name
    WHEN 'Qualtrics' THEN 90
    WHEN 'SurveyMonkey' THEN 80
    WHEN 'Typeform' THEN 50
    WHEN 'Jotform' THEN 70
    WHEN 'SurveySparrow' THEN 50
    WHEN 'Sprig' THEN 60
    WHEN 'Fillout' THEN 30
    WHEN 'Delighted' THEN 50
    WHEN 'Medallia' THEN 80
    WHEN 'Alchemer' THEN 50
    WHEN 'BlockSurvey' THEN 20
    WHEN 'SurveyPlanet' THEN 50
    WHEN 'Zoho Survey' THEN 60
    WHEN 'Google Forms' THEN 110
  END as initial_downvotes,
  0 as current_upvotes,    -- Start with 0 for new site votes
  0 as current_downvotes   -- Start with 0 for new site votes
FROM tools t
WHERE t.name IN ('Qualtrics', 'SurveyMonkey', 'Typeform', 'Jotform', 'SurveySparrow', 'Sprig', 'Fillout', 'Delighted', 'Medallia', 'Alchemer', 'BlockSurvey', 'SurveyPlanet', 'Zoho Survey', 'Google Forms')
ON CONFLICT (tool_id, method_id) DO UPDATE SET
    initial_upvotes = EXCLUDED.initial_upvotes,
    initial_downvotes = EXCLUDED.initial_downvotes;

-- Insert pros and cons data based on sentiment analysis
INSERT INTO tool_pros_and_cons (tool_id, method_id, pro_text, con_text)
SELECT t.id, 8,
  CASE t.name
    WHEN 'Qualtrics' THEN 'An enterprise-grade platform with the most powerful and flexible survey logic available. Unmatched for complex surveys, advanced branching, and deep statistical analysis.'
    WHEN 'SurveyMonkey' THEN 'The market-leading, user-friendly tool for creating and distributing general-purpose surveys. Extremely easy to use, huge library of templates, strong brand recognition.'
    WHEN 'Typeform' THEN 'Creates beautiful, conversational surveys that feel more like an interaction than a form. Best-in-class for survey design and user experience, boosts response rates.'
    WHEN 'Jotform' THEN 'An extremely versatile form builder with a vast template library and powerful integrations. Huge number of templates, advanced features like conditional logic, PDF generation.'
    WHEN 'SurveySparrow' THEN 'Creates engaging, chat-like surveys that improve the user experience. Conversational interface is highly engaging, good for mobile surveys.'
    WHEN 'Sprig' THEN 'Triggers targeted, contextual micro-surveys based on user actions inside a product. Excellent for in-the-moment feedback, video questions, AI analysis.'
    WHEN 'Fillout' THEN 'A modern form and survey builder that integrates deeply with other tools like Notion & Airtable. Powerful integrations, generous free plan, AI-powered survey generation.'
    WHEN 'Delighted' THEN 'The simplest way to gather actionable feedback using NPS, CSAT, and other standardized survey methodologies. Extremely easy to set up and run, beautiful survey design, focuses on key metrics.'
    WHEN 'Medallia' THEN 'An enterprise-grade platform for capturing and analyzing customer signals across every touchpoint. Omnichannel data collection, powerful text analytics, strong for large corporations.'
    WHEN 'Alchemer' THEN 'A flexible and secure platform for collecting feedback for market research and CX. Strong security and compliance features, good for complex research projects.'
    WHEN 'BlockSurvey' THEN 'A privacy-focused survey tool that leverages blockchain for end-to-end encryption. Unmatched for anonymous and secure feedback, strong focus on data privacy.'
    WHEN 'SurveyPlanet' THEN 'A user-friendly survey tool with a strong free plan and good visual logic branching. Great free offering, unlimited questions & responses, intuitive branching logic.'
    WHEN 'Zoho Survey' THEN 'A solid survey tool that is part of the broader Zoho business ecosystem. Great value, integrates seamlessly with other Zoho products (CRM, etc.).'
    WHEN 'Google Forms' THEN 'A completely free and simple tool that is part of the Google Workspace ecosystem. Free for everyone, integrates with Google Sheets, very easy to use.'
  END as pro_text,
  CASE t.name
    WHEN 'Qualtrics' THEN 'Very expensive, steep learning curve, overkill for simple surveys.'
    WHEN 'SurveyMonkey' THEN 'Advanced features are locked behind expensive plans, less visually appealing.'
    WHEN 'Typeform' THEN 'Less powerful for complex data analysis and branching logic.'
    WHEN 'Jotform' THEN 'Can feel more like a form builder than a dedicated survey/research tool.'
    WHEN 'SurveySparrow' THEN 'Analytics and reporting are not as robust as enterprise competitors.'
    WHEN 'Sprig' THEN 'Not a general-purpose survey tool, focused entirely on in-product use.'
    WHEN 'Fillout' THEN 'Newer in the market, lacks the extensive template library of SurveyMonkey.'
    WHEN 'Delighted' THEN 'Not a flexible or general-purpose survey tool, limited analytics.'
    WHEN 'Medallia' THEN 'Overkill for most companies, very high cost, complex implementation.'
    WHEN 'Alchemer' THEN 'Can be expensive, UI is less modern than some competitors.'
    WHEN 'BlockSurvey' THEN 'Niche focus on privacy, less feature-rich than mainstream tools.'
    WHEN 'SurveyPlanet' THEN 'Lacks advanced analytics and enterprise-level features.'
    WHEN 'Zoho Survey' THEN 'Less powerful as a standalone tool compared to market leaders.'
    WHEN 'Google Forms' THEN 'Very basic features, limited design customization, looks unprofessional.'
  END as con_text
FROM tools t
WHERE t.name IN ('Qualtrics', 'SurveyMonkey', 'Typeform', 'Jotform', 'SurveySparrow', 'Sprig', 'Fillout', 'Delighted', 'Medallia', 'Alchemer', 'BlockSurvey', 'SurveyPlanet', 'Zoho Survey', 'Google Forms')
ON CONFLICT (tool_id, method_id) DO UPDATE SET
    pro_text = EXCLUDED.pro_text,
    con_text = EXCLUDED.con_text;

-- Verify the data was inserted correctly
SELECT 
    t.name as tool_name,
    t.description,
    tl.initial_upvotes,
    tl.initial_downvotes,
    tl.current_upvotes,
    tl.current_downvotes,
    (tl.initial_upvotes + tl.current_upvotes) as total_upvotes,
    (tl.initial_downvotes + tl.current_downvotes) as total_downvotes,
    ((tl.initial_upvotes + tl.current_upvotes) - (tl.initial_downvotes + tl.current_downvotes)) as net_sentiment_score,
    LEFT(tpc.pro_text, 50) as pros_preview,
    LEFT(tpc.con_text, 50) as cons_preview
FROM tools t
LEFT JOIN tools_leaderboard tl ON t.id = tl.tool_id AND tl.method_id = 8
LEFT JOIN tool_pros_and_cons tpc ON t.id = tpc.tool_id AND tpc.method_id = 8
WHERE t.name IN ('Qualtrics', 'SurveyMonkey', 'Typeform', 'Jotform', 'SurveySparrow', 'Sprig', 'Fillout', 'Delighted', 'Medallia', 'Alchemer', 'BlockSurvey', 'SurveyPlanet', 'Zoho Survey', 'Google Forms')
ORDER BY net_sentiment_score DESC;

-- Commit the transaction
COMMIT;

-- Final verification query
SELECT 
    'Survey Tools Backfill Complete' as status,
    COUNT(DISTINCT t.id) as tools_in_surveys,
    SUM(tl.initial_upvotes) as total_initial_upvotes,
    SUM(tl.initial_downvotes) as total_initial_downvotes,
    SUM(tl.current_upvotes) as total_current_upvotes,
    SUM(tl.current_downvotes) as total_current_downvotes,
    SUM(tl.initial_upvotes + tl.current_upvotes) as total_upvotes,
    SUM(tl.initial_downvotes + tl.current_downvotes) as total_downvotes,
    SUM(tl.initial_upvotes + tl.current_upvotes) - SUM(tl.initial_downvotes + tl.current_downvotes) as net_sentiment_score
FROM tools t
LEFT JOIN tools_leaderboard tl ON t.id = tl.tool_id AND tl.method_id = 8
WHERE t.name IN ('Qualtrics', 'SurveyMonkey', 'Typeform', 'Jotform', 'SurveySparrow', 'Sprig', 'Fillout', 'Delighted', 'Medallia', 'Alchemer', 'BlockSurvey', 'SurveyPlanet', 'Zoho Survey', 'Google Forms');
