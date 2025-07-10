-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  message TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  device_id TEXT,
  device_type TEXT,
  country TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  email_sent BOOLEAN DEFAULT FALSE,
  email_sent_at TIMESTAMP WITH TIME ZONE
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_contact_messages_email_sent ON contact_messages(email_sent);
CREATE INDEX IF NOT EXISTS idx_contact_messages_device_id ON contact_messages(device_id);
CREATE INDEX IF NOT EXISTS idx_contact_messages_country ON contact_messages(country);

-- Add RLS (Row Level Security) policies if needed
-- ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Grant permissions (adjust based on your Supabase setup)
-- GRANT ALL ON contact_messages TO authenticated;
-- GRANT ALL ON contact_messages TO anon; 